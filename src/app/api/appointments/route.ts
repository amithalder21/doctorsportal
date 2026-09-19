import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Initialize Prisma
const prisma = new PrismaClient();

// Connect to Redis using the REDIS_URL environment variable
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.warn("Redis URL is not configured properly in REDIS_URL.");
}
const redis = new Redis(redisUrl || '');

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting using ioredis directly
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimitKey = `ratelimit_appointment_${ip}`;
    
    // Increment the number of requests for this IP
    const requests = await redis.incr(rateLimitKey);
    
    // If it's the first request, set the expiration to 1 hour (3600 seconds)
    if (requests === 1) {
      await redis.expire(rateLimitKey, 3600);
    }

    if (requests > 3) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
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
