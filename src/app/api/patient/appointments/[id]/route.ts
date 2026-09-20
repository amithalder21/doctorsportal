import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('patient_session')?.value;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const { status, action, date, time } = await request.json();

    // Verify ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment || appointment.userId !== userId) {
      return new NextResponse('Not found or unauthorized', { status: 404 });
    }

    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
        return new NextResponse('Cannot modify a completed or cancelled appointment', { status: 400 });
    }

    // Construct precise appointment time (IST) for 2-hour check
    const aptDate = new Date(appointment.date);
    const [timePart, modifier] = appointment.time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    aptDate.setUTCHours(hours - 5, minutes - 30, 0, 0); // Convert IST to UTC

    const now = new Date();
    const diffMs = aptDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours >= 0 && diffHours < 2) {
      return new NextResponse('Cannot modify: Appointment is less than 2 hours away. Please contact the clinic directly.', { status: 400 });
    }

    if (action === 'RESCHEDULE') {
      if (!date || !time) {
        return new NextResponse('Missing new date or time for rescheduling', { status: 400 });
      }

      const newDate = new Date(date);
      newDate.setUTCHours(0, 0, 0, 0);

      // Check slot availability
      const existing = await prisma.appointment.findFirst({
        where: { date: newDate, time, status: { not: 'CANCELLED' } }
      });
      const blocked = await prisma.blockedSlot.findFirst({
        where: { date: newDate, time }
      });

      if (existing || blocked) {
        return new NextResponse('This slot is no longer available.', { status: 409 });
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: { date: newDate, time, status: 'PENDING' }
      });

      const { getAppointmentRescheduledEmail } = await import('@/lib/email-templates');
      try {
        await sendEmail({
          to: updated.email,
          subject: 'Appointment Rescheduled - Pending Confirmation',
          html: getAppointmentRescheduledEmail(updated.name, new Date(updated.date).toLocaleDateString(), updated.time),
        });
      } catch (e) {
        console.error('Email error:', e);
      }
      return NextResponse.json(updated);
    }

    if (status === 'CANCELLED') {
      const updated = await prisma.appointment.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      // Send cancellation email
      try {
        await sendEmail({
          to: updated.email,
          subject: 'Your Appointment has been Cancelled',
          html: `<p>Hello ${updated.name},</p><p>You have successfully cancelled your appointment for <strong>${new Date(updated.date).toLocaleDateString()}</strong> at <strong>${updated.time}</strong>.</p><p>If you need to rebook, please visit our website.</p>`,
        });
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
      }

      return NextResponse.json(updated);
    }

    return new NextResponse('Forbidden: Invalid action', { status: 403 });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
