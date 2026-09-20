import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import AdminActions from '@/components/AdminActions';
import AdminPayment from '@/components/AdminPayment';
import AdminDateFilter from './AdminDateFilter';

import AdminReconciliation from '@/components/AdminReconciliation';
import Pagination from '@/components/Pagination';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ date?: string, page?: string }> }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value || null;
  const adminId = cookieStore.get('admin_id')?.value || null;
  const params = await searchParams;
  
  const currentPage = Number(params.page) || 1;
  const take = 20;
  const skip = (currentPage - 1) * take;

  const whereClause: any = {};
  
  // If the logged-in user is a DOCTOR, only show their appointments
  if (role === 'DOCTOR' && adminId) {
    whereClause.doctorId = adminId;
  }
  
  if (params.date) {
    const startOfDay = new Date(params.date);
    const endOfDay = new Date(params.date);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    whereClause.date = {
      gte: startOfDay,
      lt: endOfDay
    };
  }

  const totalAppointments = await prisma.appointment.count({
    where: whereClause,
  });

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    orderBy: {
      date: 'asc',
    },
    include: {
      doctor: true,
    },
    take,
    skip,
  });

  const totalPages = Math.ceil(totalAppointments / take);

  return (
    <AdminDashboardClient 
      appointments={appointments} 
      totalAppointments={totalAppointments} 
      role={role} 
      paramsDate={params.date}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
