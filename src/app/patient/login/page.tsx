"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PatientLogin() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ type: 'loading' });

    try {
      const res = await fetch('/api/patient/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setStatus({ type: 'success', message: 'If the email is registered, an OTP has been sent.' });
      setStep('otp');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setStatus({ type: 'loading' });

    try {
      const res = await fetch('/api/patient/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setStatus({ type: 'success', message: 'Authenticated successfully! Redirecting...' });
      
      // Redirect to dashboard
      router.push('/patient');
      router.refresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-salute-light flex flex-col">
      {/* Simple Header */}
      <nav className="bg-salute-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-3 group text-white">
            <div className="bg-white text-salute-primary p-2 rounded-xl group-hover:bg-salute-secondary group-hover:text-white transition-all shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xl font-heading leading-none">Dr. Ankit Gaur</span>
              <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Patient Portal</span>
            </div>
          </Link>
          <Link href="/#contact" className="text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
            Book Appointment
          </Link>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[30px] shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-salute-primary font-heading mb-2">Patient Portal</h1>
            <p className="text-gray-500">Secure access to your medical history</p>
          </div>

          {status.type === 'error' && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              {status.message}
            </div>
          )}
          
          {status.type === 'success' && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-600 text-sm border border-green-100">
              {status.message}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-salute-primary focus:border-transparent outline-none transition-all"
                  placeholder="patient@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full py-4 bg-salute-secondary hover:bg-[#ff7575] disabled:opacity-70 text-white rounded-xl font-bold transition-all shadow-lg text-sm uppercase tracking-wider"
              >
                {status.type === 'loading' ? 'Sending...' : 'Send Secure Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-salute-primary focus:border-transparent outline-none transition-all text-center tracking-[0.5em] text-2xl font-bold"
                  placeholder="------"
                />
                <p className="text-xs text-gray-400 text-center mt-2">Check your email for the code.</p>
              </div>
              <button
                type="submit"
                disabled={status.type === 'loading' || otp.length !== 6}
                className="w-full py-4 bg-salute-secondary hover:bg-[#ff7575] disabled:opacity-70 text-white rounded-xl font-bold transition-all shadow-lg text-sm uppercase tracking-wider"
              >
                {status.type === 'loading' ? 'Verifying...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setStatus({ type: 'idle' }); setOtp(''); }}
                className="w-full text-sm text-gray-500 hover:text-salute-primary transition-colors mt-4"
              >
                &larr; Back to Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
