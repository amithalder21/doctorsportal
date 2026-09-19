import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('admin_role')?.value;
    const adminId = cookieStore.get('admin_id')?.value;

    if (!role || !adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const doctorIdParam = searchParams.get('doctorId');

    const targetDoctorId = role === 'DOCTOR' ? adminId : doctorIdParam;

    const whereClause: any = {};
    if (targetDoctorId) {
      whereClause.doctorId = targetDoctorId;
    }

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: whereClause,
      include: {
        doctor: { select: { name: true, email: true } }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ blockedSlots });
  } catch (error) {
    console.error('Schedule GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('admin_role')?.value;
    const adminId = cookieStore.get('admin_id')?.value;

    if (!role || !adminId || (role !== 'DOCTOR' && role !== 'SUPERADMIN' && role !== 'RECEPTION')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, time, reason, doctorId } = await req.json();

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const targetDoctorId = role === 'DOCTOR' ? adminId : doctorId;
    
    if (!targetDoctorId) {
        return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const blockedSlot = await prisma.blockedSlot.create({
      data: {
        date: new Date(date),
        time: time || null,
        reason: reason || null,
        doctorId: targetDoctorId
      }
    });

    return NextResponse.json({ success: true, blockedSlot });
  } catch (error: any) {
    console.error('Schedule POST Error:', error);
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'This time slot or day is already marked as unavailable.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
