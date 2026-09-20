import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DocumentUploadButton from './DocumentUploadButton';
import PatientCancelButton from './PatientCancelButton';
import LogoutButton from '@/components/LogoutButton';
import PatientDashboardClient from './PatientDashboardClient';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export default async function PatientDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('patient_session')?.value;

  if (!userId) {
    redirect('/patient/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      appointments: {
        orderBy: {
          date: 'desc'
        },
        take: 50,
        include: {
          doctor: true
        }
      }
    }
  });

  if (!user || user.role !== 'PATIENT') {
    redirect('/patient/login');
  }

  const { appointments } = user;

  const latestApt = appointments[0];
  const patientName = latestApt?.name || 'Patient';
  const patientPhone = latestApt?.phone || '';

  return (
    <PatientDashboardClient 
      user={user} 
      patientName={patientName} 
      patientPhone={patientPhone} 
    />
  );
}
