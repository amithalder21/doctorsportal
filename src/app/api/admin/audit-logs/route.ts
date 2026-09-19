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
    
    // Parse the date as IST (UTC+5:30) to ensure actions performed at night 
    // locally don't roll over to the previous day in UTC.
    let startDate: Date;
    let endDate: Date;

    if (dateParam) {
      // User selected a date (e.g. '2026-09-20')
      startDate = new Date(`${dateParam}T00:00:00+05:30`);
    } else {
      // Default to today in IST
      // Get current UTC time
      const now = new Date();
      // Convert to IST string (YYYY-MM-DD)
      const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
      const istDateString = now.toLocaleDateString('en-CA', options); // en-CA gives YYYY-MM-DD
      
      startDate = new Date(`${istDateString}T00:00:00+05:30`);
    }

    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

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
