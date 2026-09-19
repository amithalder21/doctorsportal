import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  
  if (role !== 'SUPERADMIN') {
    return { authorized: false, error: new NextResponse('Forbidden: Super Admin access required', { status: 403 }) };
  }
  return { authorized: true };
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return auth.error;

  try {
    const { email, role, name } = await request.json();

    if (!email || !role) {
      return new NextResponse('Missing email or role', { status: 400 });
    }

    if (!['SUPERADMIN', 'DOCTOR', 'RECEPTION', 'PATIENT'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new NextResponse('User with this email already exists', { status: 400 });
    }

    const user = await prisma.user.create({
      data: { email, role, name: name || null }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
