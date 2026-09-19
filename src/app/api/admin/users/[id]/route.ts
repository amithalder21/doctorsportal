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

// PATCH: Update user role
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return auth.error;

  try {
    const { id } = await params;
    const { role } = await request.json();

    if (!['SUPERADMIN', 'DOCTOR', 'RECEPTION', 'PATIENT'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE: Remove user
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return auth.error;

  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
