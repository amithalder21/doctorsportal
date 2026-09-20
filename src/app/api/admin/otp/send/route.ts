import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

import { checkRateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.warn("Redis URL is not configured properly in REDIS_URL.");
}
const redis = new Redis(redisUrl || '');

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting to prevent OTP spam (Noisy Neighbor protection)
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    // 5 attempts per 15 minutes (900 seconds)
    const rateLimit = await checkRateLimit(`admin_otp_${ip}`, 5, 900);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Query the database for the user
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized email address. Not found in database.' }, { status: 403 });
    }

    if (user.role === 'PATIENT') {
      return NextResponse.json({ error: 'Patients do not have access to the Admin Dashboard.' }, { status: 403 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with a 5-minute expiration
    await redis.set(`admin_otp_${email.toLowerCase()}`, otp, 'EX', 300);

    // Send the email via Nodemailer/Brevo
    const { getOtpEmail } = await import('@/lib/email-templates');
    await sendEmail({
      to: user.email,
      subject: 'Your Admin Login OTP',
      html: getOtpEmail(otp, 'Admin'),
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
