import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.warn("Redis is not configured properly. Missing URL or Token.");
}

const redis = new Redis({
  url: url || 'https://upstash.io',
  token: token || 'dummy_token',
});

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
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    };
    
    cookieStore.set('admin_session', 'authenticated', cookieOptions);
    cookieStore.set('admin_role', user.role, cookieOptions);

    return NextResponse.json({ success: true, message: 'Authenticated successfully.' });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
