import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('admin_role')?.value;
    const adminId = cookieStore.get('admin_id')?.value;

    if (!role || !adminId || (role !== 'DOCTOR' && role !== 'SUPERADMIN' && role !== 'RECEPTION')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const blockedSlot = await prisma.blockedSlot.findUnique({
      where: { id }
    });

    if (!blockedSlot) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (role === 'DOCTOR' && blockedSlot.doctorId !== adminId) {
       return NextResponse.json({ error: 'Unauthorized to delete this schedule' }, { status: 403 });
    }

    await prisma.blockedSlot.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
