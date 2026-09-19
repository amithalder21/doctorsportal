import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.warn("Redis URL is not configured properly in REDIS_URL.");
}
const redis = new Redis(redisUrl || '');

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or OTP.' }, { status: 400 });
    }

    // Verify OTP from Redis
    const storedOtp = await redis.get(`admin_otp_${email.toLowerCase()}`);

    if (!storedOtp || storedOtp !== otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 400 });
    }

    // OTP is valid. Delete it from Redis so it can't be reused.
    await redis.del(`admin_otp_${email.toLowerCase()}`);

    // Set secure HTTP-only cookie using next/headers
    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    };
    
    cookieStore.set('admin_session', 'authenticated', cookieOptions);
    cookieStore.set('admin_role', user.role, cookieOptions);
    cookieStore.set('admin_id', user.id, cookieOptions);

    return NextResponse.json({ success: true, message: 'Authenticated successfully.' });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
