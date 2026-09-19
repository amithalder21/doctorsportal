import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import AdminActions from '@/components/AdminActions';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value || null;

  const appointments = await prisma.appointment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-salute-dark font-heading">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Manage your appointment requests
            </p>
          </div>
          <div className="text-sm font-bold text-salute-primary bg-salute-accent px-4 py-2 rounded-lg">
            {appointments.length} Total Requests
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Patient Name</th>
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Contact Details</th>
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Requested Slot</th>
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Message & Records</th>
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-salute-dark">{apt.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(apt.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="p-5 space-y-2">
                        <a href={`tel:${apt.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 text-sm font-medium text-salute-primary hover:text-[#ff7575] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          {apt.phone}
                        </a>
                        <a href={`mailto:${apt.email}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff7575] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          {apt.email}
                        </a>
                      </td>
                      <td className="p-5">
                        <div className="inline-flex flex-col bg-salute-accent/50 rounded-lg px-3 py-2 border border-salute-accent">
                          <span className="text-sm font-bold text-salute-primary">{new Date(apt.date).toLocaleDateString()}</span>
                          <span className="text-xs text-salute-primary/80 font-medium">{apt.time}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-sm text-gray-600 max-w-xs truncate mb-2" title={apt.message || ''}>
                          {apt.message || <span className="text-gray-300 italic">No message</span>}
                        </p>
                        {apt.documentUrl && (
                          <a href={`/api/admin/record?url=${encodeURIComponent(apt.documentUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-salute-secondary hover:text-[#ff7575] bg-salute-secondary/10 px-2 py-1 rounded">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            View Record
                          </a>
                        )}
                      </td>
                      <td className="p-5">
                        <AdminActions 
                          id={apt.id} 
                          initialStatus={apt.status} 
                          userRole={role} 
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
