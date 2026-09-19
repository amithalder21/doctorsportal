import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-salute-light p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-salute-dark font-heading">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your appointment requests</p>
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
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Message</th>
                  <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Submitted On</th>
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
                      </td>
                      <td className="p-5 space-y-1">
                        <p className="text-sm text-gray-600 font-medium">{apt.phone}</p>
                        <p className="text-sm text-gray-400">{apt.email}</p>
                      </td>
                      <td className="p-5">
                        <div className="inline-flex flex-col bg-salute-accent/50 rounded-lg px-3 py-2 border border-salute-accent">
                          <span className="text-sm font-bold text-salute-primary">{new Date(apt.date).toLocaleDateString()}</span>
                          <span className="text-xs text-salute-primary/80 font-medium">{apt.time}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={apt.message || ''}>
                          {apt.message || <span className="text-gray-300 italic">No message</span>}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm text-gray-400">{new Date(apt.createdAt).toLocaleString()}</p>
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
