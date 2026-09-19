import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

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
    const rateLimitKey = `ratelimit_patient_otp_${ip}`;
    const requests = await redis.incr(rateLimitKey);
    
    // Set expiration to 15 minutes (900 seconds)
    if (requests === 1) {
      await redis.expire(rateLimitKey, 900);
    }

    if (requests > 5) {
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
      return NextResponse.json({ error: 'We could not find any records associated with this email.' }, { status: 403 });
    }

    if (user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Staff members must use the Admin portal to log in.' }, { status: 403 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with a 5-minute expiration
    await redis.set(`patient_otp_${email.toLowerCase()}`, otp, 'EX', 300);

    // Send the email via Nodemailer
    await sendEmail({
      to: user.email,
      subject: 'Your Patient Portal Login OTP',
      html: `<p>Your one-time password to log into the Patient Portal is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
