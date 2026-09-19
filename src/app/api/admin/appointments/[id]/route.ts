import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { del } from '@vercel/blob';

const prisma = new PrismaClient();

// Reusable function to verify admin access
async function verifyAdminAccess() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  
  if (!role) {
    return { authorized: false, role: null };
  }
  return { authorized: true, role };
}

// PATCH: Update appointment status (SUPERADMIN or ADMIN)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminAccess();
  if (!auth.authorized) return new NextResponse('Unauthorized', { status: 401 });

  // READER role cannot change status
  if (auth.role === 'READER') {
    return new NextResponse('Forbidden: Readers cannot modify records', { status: 403 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();
    
    if (!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status }
    });

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
