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

    // Fetch BlockedSlots for this doctor that overlap with this date
    const blockedSlotsRecords = await prisma.blockedSlot.findMany({
      where: {
        doctorId: doctorIdParam,
        date: { lte: endOfDay },
        endDate: { gte: startOfDay }
      }
    });

    const { TIME_SLOTS } = await import('@/lib/constants');
    let isHoliday = false;
    let specificBlockedTimes = new Set<string>();

    for (const slot of blockedSlotsRecords) {
      if (!slot.time || !slot.endTime) {
        isHoliday = true;
        break;
      }

      const queryDayStart = startOfDay.getTime();
      const slotStartDay = new Date(slot.date).getTime();
      const slotEndDay = new Date(slot.endDate).getTime();

      if (queryDayStart > slotStartDay && queryDayStart < slotEndDay) {
        // We are completely enveloped by a multi-day event
        isHoliday = true;
        break;
      }

      const startIndex = TIME_SLOTS.indexOf(slot.time);
      const endIndex = TIME_SLOTS.indexOf(slot.endTime);

      if (slotStartDay === slotEndDay) {
        // Single day event
        TIME_SLOTS.slice(startIndex, endIndex + 1).forEach(t => specificBlockedTimes.add(t));
      } else if (queryDayStart === slotStartDay) {
        // First day of multi-day event
        TIME_SLOTS.slice(startIndex).forEach(t => specificBlockedTimes.add(t));
      } else if (queryDayStart === slotEndDay) {
        // Last day of multi-day event
        TIME_SLOTS.slice(0, endIndex + 1).forEach(t => specificBlockedTimes.add(t));
      }
    }

    if (isHoliday) {
      return NextResponse.json({ bookedSlots: [], isHoliday: true });
    }

    // Extract just the time strings for booked appointments
    const bookedSlots = appointments.map(apt => apt.time);

    // Merge specific blocked time slots
    const allUnavailableSlots = Array.from(new Set([...bookedSlots, ...specificBlockedTimes]));

    return NextResponse.json({ bookedSlots: allUnavailableSlots, isHoliday: false });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
