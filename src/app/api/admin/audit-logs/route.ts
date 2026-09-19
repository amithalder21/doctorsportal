import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Reusable function to verify admin access
async function verifyAdminAccess() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  const adminId = cookieStore.get('admin_id')?.value;
  
  if (!role || !adminId) {
    return { authorized: false, role: null, adminId: null };
  }
  return { authorized: true, role, adminId };
}

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess();
  if (!auth.authorized || auth.role !== 'SUPERADMIN') {
    return new NextResponse('Unauthorized: Only Super Admins can view audit logs', { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    
    // Default to today if no date provided
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    if (dateParam) {
      startDate = new Date(dateParam);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    }

    // 1. Get total PAID appointments for this exact date
    const paidLogsCount = await prisma.auditLog.count({
      where: {
        action: 'PAYMENT_MARKED_PAID',
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    // 2. Fetch the actual audit logs with admin details
    const logs = await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        admin: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      totalPaidCollected: paidLogsCount,
      logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
