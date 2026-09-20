import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';

// Initialize Prisma
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting to prevent appointment spam
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    // 2 requests per hour (3600 seconds)
    const rateLimit = await checkRateLimit(`appointment_${ip}`, 2, 3600);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many appointment requests. Please wait an hour before trying again.' },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Body
    const body = await req.json();
    const { name, phone, email, date, time, message, website, documentUrl, doctorId } = body;

    // Spam Trap / Honeypot
    if (website) {
      // Return a fake success response to bot
      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (!name || !phone || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Strict Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    const cleanedPhone = phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json({ error: 'Invalid Indian phone number.' }, { status: 400 });
    }

    // 3. Check for double booking (Server-side validation)
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: doctorId || null,
        time: time,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELLED'
        }
      }
    });

    if (existingAppointment) {
      return NextResponse.json({ error: 'This time slot is already booked. Please choose another time.' }, { status: 409 });
    }

    // 3.5 Check if doctor is on holiday / blocked
    if (doctorId) {
      const blockedSlotsRecords = await prisma.blockedSlot.findMany({
        where: {
          doctorId: doctorId,
          date: { lte: endOfDay },
          endDate: { gte: startOfDay }
        }
      });

      const { TIME_SLOTS } = await import('@/lib/constants');
      let isBlocked = false;

      for (const slot of blockedSlotsRecords) {
        if (!slot.time || !slot.endTime) {
          isBlocked = true;
          break;
        }

        const queryDayStart = startOfDay.getTime();
        const slotStartDay = new Date(slot.date).getTime();
        const slotEndDay = new Date(slot.endDate).getTime();

        if (queryDayStart > slotStartDay && queryDayStart < slotEndDay) {
          isBlocked = true;
          break;
        }

        const startIndex = TIME_SLOTS.indexOf(slot.time);
        const endIndex = TIME_SLOTS.indexOf(slot.endTime);
        const targetIndex = TIME_SLOTS.indexOf(time);

        if (slotStartDay === slotEndDay) {
          if (targetIndex >= startIndex && targetIndex <= endIndex) isBlocked = true;
        } else if (queryDayStart === slotStartDay) {
          if (targetIndex >= startIndex) isBlocked = true;
        } else if (queryDayStart === slotEndDay) {
          if (targetIndex <= endIndex) isBlocked = true;
        }
        
        if (isBlocked) break;
      }

      if (isBlocked) {
        return NextResponse.json({ error: 'The selected doctor is not available at this date and time.' }, { status: 409 });
      }
    }

// Helper to generate the patient ID
async function generatePatientId(prisma: PrismaClient) {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `UIQ-${yy}-${mm}-`;

  const latestPatient = await prisma.user.findFirst({
    where: {
      id: {
        startsWith: prefix
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  let nextSequence = 1;
  if (latestPatient) {
    const lastSeqStr = latestPatient.id.split('-').pop(); 
    if (lastSeqStr && !isNaN(Number(lastSeqStr))) {
      nextSequence = parseInt(lastSeqStr, 10) + 1;
    }
  }

  return `${prefix}${String(nextSequence).padStart(4, '0')}`;
}

    // 4. Auto-Create Patient Profile or Link Existing
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      let retries = 3;
      while (retries > 0) {
        try {
          const newPatientId = await generatePatientId(prisma);
          user = await prisma.user.create({
            data: {
              id: newPatientId,
              email,
              role: 'PATIENT'
            }
          });
          break;
        } catch (error: any) {
          if (error.code === 'P2002') {
            if (error.meta?.target?.includes('email')) {
               const existing = await prisma.user.findUnique({ where: { email } });
               if (existing) {
                 user = existing;
                 break;
               }
            }
            if (error.meta?.target?.includes('id')) {
               retries--;
               if (retries === 0) throw error;
            }
          } else {
            throw error;
          }
        }
      }
    }
    
    // Safety check just in case retry loop failed silently
    if (!user) throw new Error("Failed to resolve patient profile");

    // 5. Generate custom Appointment ID
    const randomHex = crypto.randomBytes(3).toString('hex'); // 6 hex characters
    const appointmentId = `${user.id}-${randomHex}`;

    // 6. Save to PostgreSQL Database using Prisma
    const appointment = await prisma.appointment.create({
      data: {
        id: appointmentId,
        name,
        phone,
        email,
        date: new Date(date),
        time,
        message: message || null,
        documentUrl: documentUrl || null,
        userId: user.id,
        doctorId: doctorId || null
      },
    });

    // 7. Send "Request Received" email
    try {
      const { sendEmail } = await import('@/lib/email');
      const { getAppointmentReceivedEmail } = await import('@/lib/email-templates');
      
      const htmlContent = getAppointmentReceivedEmail(
        name, 
        new Date(date).toLocaleDateString(), 
        time,
        appointmentId
      );

      await sendEmail({
        to: email,
        subject: 'Appointment Request Received - Ankit Gaur Clinic',
        html: htmlContent,
      });
    } catch (emailError) {
      console.error('Failed to send received email:', emailError);
      // We don't fail the appointment creation if email fails
    }

    // 8. Return Success Response
    return NextResponse.json(
      { success: true, data: appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
