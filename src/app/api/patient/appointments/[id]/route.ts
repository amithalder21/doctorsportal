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
    const { status } = await request.json();

    // Patients can ONLY cancel
    if (status !== 'CANCELLED') {
      return new NextResponse('Forbidden: Patients can only cancel appointments', { status: 403 });
    }

    // Verify ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment || appointment.userId !== userId) {
      return new NextResponse('Not found or unauthorized', { status: 404 });
    }

    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
        return new NextResponse('Cannot cancel a completed or already cancelled appointment', { status: 400 });
    }

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
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
