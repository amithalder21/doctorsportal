import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Awaiting params for Next.js 15+
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('patient_session')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documentUrls } = body;

    if (!documentUrls || !Array.isArray(documentUrls) || documentUrls.length === 0) {
      return NextResponse.json({ error: 'No documents provided' }, { status: 400 });
    }

    // Verify appointment belongs to user
    const appointment = await prisma.appointment.findUnique({
      where: { id, userId }
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Append URLs
    const existingUrls = appointment.documentUrl ? appointment.documentUrl.split(',') : [];
    const newUrls = [...existingUrls, ...documentUrls].filter(Boolean).join(',');

    await prisma.appointment.update({
      where: { id },
      data: { documentUrl: newUrls }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Document append error:', error);
    return NextResponse.json({ error: error.message || 'Failed to append documents' }, { status: 500 });
  }
}
