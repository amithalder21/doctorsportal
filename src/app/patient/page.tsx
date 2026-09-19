import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
        }
      }
    }
  });

  if (!user || user.role !== 'PATIENT') {
    redirect('/patient/login');
  }

  const { appointments } = user;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-salute-light flex flex-col">
      {/* Header */}
      <nav className="bg-salute-primary text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-heading font-bold text-xl tracking-wide flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              DoctorPortal
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium opacity-80">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-salute-dark font-heading">My Appointments</h1>
              <p className="text-gray-500 mt-1">View your medical history and upcoming visits</p>
            </div>
            <Link href="/#contact" className="bg-salute-secondary hover:bg-[#ff7575] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1">
              Book New Appointment
            </Link>
          </div>

          <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">
            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Appointments Found</h3>
                <p className="text-gray-500">You haven't booked any appointments yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:bg-gray-50/50 transition-colors">
                    <div className="flex-shrink-0 w-24 h-24 bg-salute-light rounded-2xl flex flex-col items-center justify-center border border-salute-primary/10">
                      <span className="text-sm font-bold text-salute-primary uppercase tracking-widest">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-3xl font-bold text-salute-dark font-heading">
                        {new Date(apt.date).getDate()}
                      </span>
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-salute-dark">{apt.time}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600">
                        <strong>Patient Name:</strong> {apt.name}
                      </p>
                      
                      {apt.message && (
                        <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {apt.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 md:text-right">
                      {apt.documentUrl && (
                        <a 
                          href={apt.documentUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-salute-primary hover:text-salute-dark font-bold text-sm bg-salute-primary/10 px-4 py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                          </svg>
                          View Records
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
