import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { del } from '@vercel/blob';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

// Reusable function to verify admin access
async function verifyAdminAccess() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  
  const adminId = cookieStore.get('admin_id')?.value;
  
  if (!role || !adminId) {
    return { authorized: false, role: null, adminId: null };
  }

  // Verify the admin actually exists in the DB (prevents 500 errors if manually deleted)
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, role: true }
  });

  if (!admin) {
    return { authorized: false, role: null, adminId: null };
  }

  return { authorized: true, role: admin.role, adminId };
}

// PATCH: Update appointment status (SUPERADMIN or ADMIN)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAccess();
  if (!auth.authorized) return new NextResponse('Unauthorized', { status: 401 });

  // PATIENT role cannot change status
  if (auth.role === 'PATIENT') {
    return new NextResponse('Forbidden: Patients cannot modify records', { status: 403 });
  }

  try {
    const { id } = await params;
    const { status, paymentStatus, transactionId } = await request.json();
    
    const existingAppt = await prisma.appointment.findUnique({ where: { id } });
    if (!existingAppt) return new NextResponse('Appointment not found', { status: 404 });

    // We can update either status, or payment info, or both
    const updateData: any = {};
    
    if (status) {
      if (!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return new NextResponse('Invalid status', { status: 400 });
      }

      if (status === 'COMPLETED') {
        const todayUTC = new Date();
        todayUTC.setUTCHours(0, 0, 0, 0);
        const aptDate = new Date(existingAppt.date);
        
        if (aptDate.getTime() > todayUTC.getTime()) {
           return new NextResponse('Cannot mark future appointments as COMPLETED', { status: 400 });
        }
      }

      if (status === 'CANCELLED' && auth.role !== 'SUPERADMIN') {
        // Construct precise appointment time (IST)
        const aptDate = new Date(existingAppt.date);
        const [timePart, modifier] = existingAppt.time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        // Appointments are inherently in IST for this clinic context
        // Set the hours and minutes in local time (which Vercel handles as UTC, so we subtract IST offset to be exact, or just use UTC representation safely since server is UTC).
        // Actually, simple and robust way: Create UTC date and assume the 10:00 AM meant IST.
        aptDate.setUTCHours(hours - 5, minutes - 30, 0, 0); // Convert IST (UTC+5:30) to UTC precisely

        const now = new Date();
        const diffMs = aptDate.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours >= 0 && diffHours < 2) {
          return new NextResponse('Cannot cancel: Appointment is less than 2 hours away.', { status: 400 });
        }
      }

      updateData.status = status;
    }

    if (paymentStatus) {
      if (!['UNPAID', 'PAID'].includes(paymentStatus)) {
        return new NextResponse('Invalid payment status', { status: 400 });
      }
      updateData.paymentStatus = paymentStatus;
    }
    
    if (transactionId !== undefined) {
      updateData.transactionId = transactionId;
    }

    if (Object.keys(updateData).length === 0) {
       return new NextResponse('No fields to update', { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData
    });

    // Create Audit Logs for the changes
    if (auth.adminId) {
      if (status && status !== existingAppt.status) {
        await prisma.auditLog.create({
          data: {
            adminId: auth.adminId,
            action: `STATUS_CHANGED_${status}`,
            targetId: id,
            details: `Status changed from ${existingAppt.status} to ${status}`,
          }
        });
      }
      if (paymentStatus && paymentStatus !== existingAppt.paymentStatus) {
        await prisma.auditLog.create({
          data: {
            adminId: auth.adminId,
            action: `PAYMENT_MARKED_${paymentStatus}`,
            targetId: id,
            details: transactionId ? `Transaction ID: ${transactionId}` : 'Manual status update',
          }
        });
      }
    }

    // Send email notifications
    if (status || paymentStatus) {
      const { 
        getAppointmentConfirmedEmail, 
        getAppointmentCancelledEmail,
        getAppointmentCompletedEmail,
        getPaymentReceiptEmail
      } = await import('@/lib/email-templates');

      const dateStr = new Date(updated.date).toLocaleDateString();

      // Send status change email
      if (status && status !== existingAppt.status) {
        let subject = '';
        let htmlContent = '';

        if (status === 'CONFIRMED') {
          subject = 'Your Appointment is Confirmed';
          htmlContent = getAppointmentConfirmedEmail(updated.name, dateStr, updated.time);
        } else if (status === 'CANCELLED') {
          subject = 'Your Appointment has been Cancelled';
          htmlContent = getAppointmentCancelledEmail(updated.name, dateStr, updated.time);
        } else if (status === 'COMPLETED') {
          subject = 'Thank You for Visiting Ankit Gaur Clinic';
          htmlContent = getAppointmentCompletedEmail(updated.name, dateStr);
        }

        if (subject && htmlContent) {
          try {
            await sendEmail({
              to: updated.email,
              subject,
              html: htmlContent,
            });
          } catch (emailError) {
            console.error('Failed to send status email:', emailError);
          }
        }
      }

      // Send payment receipt email
      if (paymentStatus === 'PAID' && existingAppt.paymentStatus !== 'PAID') {
        try {
          await sendEmail({
            to: updated.email,
            subject: 'Payment Receipt - Ankit Gaur Clinic',
            html: getPaymentReceiptEmail(updated.name, dateStr, updated.id),
          });
        } catch (emailError) {
          console.error('Failed to send payment receipt email:', emailError);
        }
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE: Delete appointment (SUPERADMIN ONLY)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAccess();
  if (!auth.authorized) return new NextResponse('Unauthorized', { status: 401 });

  // Only SUPERADMIN can delete
  if (auth.role !== 'SUPERADMIN') {
    return new NextResponse('Forbidden: Only Super Admins can delete records', { status: 403 });
  }

  try {
    const { id } = await params;
    
    // Check if the appointment has a documentUrl in Vercel Blob
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    // Delete the document from Blob storage if it exists
    if (appointment.documentUrl) {
      try {
        await del(appointment.documentUrl, {
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
      } catch (blobError) {
        console.error('Failed to delete blob:', blobError);
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete from database
    await prisma.appointment.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
