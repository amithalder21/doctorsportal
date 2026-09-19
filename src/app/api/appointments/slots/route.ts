import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    const doctorIdParam = searchParams.get('doctorId');

    if (!dateParam || !doctorIdParam) {
      return new NextResponse('Missing date or doctorId parameter', { status: 400 });
    }

    // Parse the date to start and end of day in UTC to catch all appointments for that date
    const startOfDay = new Date(dateParam);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(dateParam);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Find all appointments on this date that are not CANCELLED for this doctor
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorIdParam,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        time: true
      }
    });

    // Extract just the time strings
    const bookedSlots = appointments.map(apt => apt.time);

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
