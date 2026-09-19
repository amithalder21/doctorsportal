import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
