"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentUploadButton from './DocumentUploadButton';
import PatientCancelButton from './PatientCancelButton';
import LogoutButton from '@/components/LogoutButton';

export default function PatientDashboardClient({ user, patientName, patientPhone }: any) {
  const { appointments } = user;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-salute-primary text-white p-2.5 rounded-xl group-hover:bg-salute-secondary transition-all shadow-md group-hover:-translate-y-0.5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-salute-primary font-heading leading-none">Priya Sharma Clinic</span>
                <span className="text-[10px] uppercase tracking-widest text-salute-secondary font-bold mt-1">Patient Portal</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-gray-600">Active Session</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="flex-grow p-6 md:p-12 relative overflow-hidden">
        {/* Abstract background blobs for aesthetics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-salute-accent opacity-30 rounded-full mix-blend-multiply filter blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-salute-secondary opacity-10 rounded-full mix-blend-multiply filter blur-3xl z-0 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Patient Profile Card - Premium Gradient */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-salute-primary to-blue-900 rounded-[30px] shadow-2xl p-8 md:p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white overflow-hidden relative"
          >
            {/* Decorative background overlay */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 w-full relative z-10">
              <div className="w-20 h-20 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-3xl font-heading border border-white/30 shadow-inner">
                {patientName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold font-heading">{patientName}</h2>
                  {user.id.startsWith('UIQ-') && (
                    <span className="text-xs font-mono bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold border border-white/10">
                      ID: {user.id}
                    </span>
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm text-white/80 font-medium">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-salute-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {user.email}
                  </span>
                  {patientPhone && (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-salute-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                      {patientPhone}
                    </span>
                  )}
                </div>
              </div>
              <Link href="/#contact" className="w-full md:w-auto bg-salute-secondary hover:bg-[#ff7575] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 text-center whitespace-nowrap">
                Book Appointment
              </Link>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-salute-dark font-heading">My Appointments</h1>
              <p className="text-gray-500 mt-1 font-medium">Your medical history and upcoming visits</p>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {appointments.length === 0 ? (
              <motion.div variants={itemVariants} className="bg-white rounded-[30px] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-salute-primary to-salute-secondary"></div>
                <div className="w-32 h-32 bg-salute-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-salute-accent/30 rounded-full animate-ping opacity-20"></div>
                  <svg className="w-16 h-16 text-salute-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-salute-dark mb-4 font-heading">Your Health Journey Starts Here</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">It looks like you don't have any upcoming or past appointments. Schedule a visit to meet with Dr. Priya Sharma.</p>
                <Link href="/#contact" className="inline-flex bg-salute-primary hover:bg-salute-secondary text-white px-10 py-4 rounded-xl font-bold shadow-xl transition-all hover:-translate-y-1 text-lg">
                  Book Your First Visit
                </Link>
              </motion.div>
            ) : (
              appointments.map((apt: any) => (
                <motion.div 
                  key={apt.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(19,37,115,0.08)] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-salute-light rounded-bl-[100px] z-0 opacity-50 group-hover:bg-salute-accent transition-colors pointer-events-none"></div>

                  <div className="flex-shrink-0 w-28 h-28 bg-white shadow-sm rounded-[20px] flex flex-col items-center justify-center border border-gray-100 relative z-10 group-hover:border-salute-secondary/30 transition-colors">
                    <span className="text-sm font-bold text-salute-secondary uppercase tracking-widest mb-1">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-4xl font-bold text-salute-dark font-heading leading-none">
                      {new Date(apt.date).getDate()}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">
                      {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                  
                  <div className="flex-grow space-y-3 relative z-10 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-salute-dark font-heading">{apt.time}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        apt.paymentStatus === 'PAID' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        {apt.paymentStatus}
                      </span>
                      {apt.id.startsWith('UIQ-') && (
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                          Ref: {apt.id}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <strong className="text-gray-900">Patient:</strong> {apt.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <strong className="text-gray-900">Doctor:</strong> {apt.doctor?.name?.startsWith('Dr.') ? apt.doctor.name : `Dr. ${apt.doctor?.name || 'Unassigned'}`}
                      </p>
                    </div>
                    
                    {apt.message && (
                      <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
                        <strong className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Reason for visit</strong>
                        {apt.message}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-3 relative z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <DocumentUploadButton appointmentId={apt.id} />
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-end gap-3 w-full md:w-auto">
                      <PatientCancelButton appointmentId={apt.id} status={apt.status} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
