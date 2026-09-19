import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// Initialize Redis from the REDIS_URL provided by Upstash
const rawRedisUrl = process.env.REDIS_URL || '';
const redisUrlMatch = rawRedisUrl.match(/redis:\/\/[^:]+:([^@]+)@([^:]+):/);
const redisToken = redisUrlMatch ? redisUrlMatch[1] : '';
const redisHost = redisUrlMatch ? redisUrlMatch[2] : '';
const redisRestUrl = redisHost ? `https://${redisHost.replace('db.redis.io', 'upstash.io')}` : '';

const redis = new Redis({
  url: redisRestUrl || 'https://upstash.io',
  token: redisToken || 'dummy_token',
});

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
    
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized admin email address.' }, { status: 403 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with a 5-minute expiration
    await redis.set(`admin_otp_${email.toLowerCase()}`, otp, { ex: 300 });

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Doctor Portal <onboarding@resend.dev>',
      to: adminEmail,
      subject: 'Your Admin Login OTP',
      html: `<p>Your one-time password to log into the Admin Dashboard is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
    });

    if (error) {
      console.error('Resend API Error:', error);
      // Return the specific Resend error so the user can see it on the frontend
      return NextResponse.json({ error: `Resend Error: ${error.message}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully.', data });
  } catch (error) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
