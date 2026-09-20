"use client";

import { motion } from 'framer-motion';
import AdminActions from '@/components/AdminActions';
import AdminPayment from '@/components/AdminPayment';
import AdminDateFilter from './AdminDateFilter';
import AdminReconciliation from '@/components/AdminReconciliation';
import Pagination from '@/components/Pagination';

export default function AdminDashboardClient({ 
  appointments, 
  totalAppointments, 
  role, 
  paramsDate,
  currentPage,
  totalPages
}: any) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="p-6 md:p-12 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-salute-dark font-heading">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Manage your clinic's appointments and requests
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <AdminDateFilter />
            <div className="flex flex-col text-right bg-white p-3 rounded-xl border border-gray-100 shadow-sm min-w-[140px]">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Requests</span>
              <span className="text-2xl font-bold text-salute-primary font-heading leading-none">
                {totalAppointments}
              </span>
            </div>
          </div>
        </motion.div>

        {role === 'SUPERADMIN' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <AdminReconciliation selectedDate={paramsDate || ''} />
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Notes & Records</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-100"
              >
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No appointments found.</p>
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt: any) => (
                    <motion.tr 
                      variants={rowVariants}
                      key={apt.id} 
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <p className="font-bold text-salute-dark text-base">{apt.name}</p>
                          
                          {apt.id.startsWith('UIQ-') ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded w-max border border-gray-100">
                                <span className="font-semibold text-gray-400 mr-1">PID:</span>
                                {apt.userId}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded w-max">
                              #{apt.id.slice(-6)}
                            </span>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{new Date(apt.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 space-y-2.5">
                        <a href={`tel:${apt.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm font-medium text-salute-primary hover:text-salute-secondary transition-colors w-max">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-salute-primary flex items-center justify-center group-hover:bg-salute-secondary/10 group-hover:text-salute-secondary transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          </div>
                          {apt.phone}
                        </a>
                        <a href={`mailto:${apt.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-salute-secondary transition-colors w-max">
                          <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-salute-secondary/10 group-hover:text-salute-secondary transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          </div>
                          {apt.email}
                        </a>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex flex-col bg-salute-light rounded-xl px-4 py-2.5 border border-salute-primary/10">
                          <span className="text-sm font-bold text-salute-primary">{new Date(apt.date).toLocaleDateString()}</span>
                          <span className="text-xs text-salute-primary/80 font-bold tracking-wide mt-0.5">{apt.time}</span>
                        </div>
                        {apt.doctor && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-salute-secondary"></div>
                            {apt.doctor.name?.startsWith('Dr.') ? apt.doctor.name : `Dr. ${apt.doctor.name}`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {role === 'RECEPTION' ? (
                          <div className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs text-gray-400 border border-gray-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Hidden
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 max-w-[200px] truncate mb-2" title={apt.message || ''}>
                              {apt.message || <span className="text-gray-300 italic">No notes provided</span>}
                            </p>
                            {apt.documentUrl && (
                              <div className="flex flex-wrap gap-2">
                                {apt.documentUrl.split(',').map((url: string, idx: number) => (
                                  <a key={idx} href={`/api/admin/record?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-salute-secondary hover:text-white bg-salute-secondary/10 hover:bg-salute-secondary px-2 py-1 rounded transition-colors border border-salute-secondary/20 hover:border-salute-secondary">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                    Doc {idx + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <AdminPayment 
                          id={apt.id} 
                          initialPaymentStatus={apt.paymentStatus} 
                          initialTransactionId={apt.transactionId} 
                          userRole={role} 
                        />
                      </td>
                      <td className="px-6 py-5">
                        <AdminActions 
                          id={apt.id} 
                          initialStatus={apt.status} 
                          userRole={role} 
                          appointmentDate={apt.date}
                        />
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="border-t border-gray-100 p-4 bg-gray-50/50">
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
