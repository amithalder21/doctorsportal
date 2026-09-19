import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Prisma
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

// Create a new ratelimiter, that allows 3 requests per 1 hour
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    // Get IP address from headers, fallback to a default string if missing
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_appointment_${ip}`
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    // 2. Parse and Validate Request Body
    const body = await req.json();
    const { name, phone, email, date, time, message, website } = body;

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

    // 3. Save to PostgreSQL Database using Prisma
    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email,
        date: new Date(date),
        time,
        message: message || null,
      },
    });

    // 4. Return Success Response
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
