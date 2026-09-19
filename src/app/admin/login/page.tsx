"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
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
      const res = await fetch('/api/admin/otp/send', {
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
      const res = await fetch('/api/admin/otp/verify', {
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
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-salute-light flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[30px] shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-salute-primary font-heading mb-2">Admin Panel</h1>
          <p className="text-gray-500">Secure access to your appointments</p>
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
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-salute-primary focus:border-transparent outline-none transition-all"
                placeholder="doctor@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="w-full py-4 bg-salute-primary hover:bg-salute-dark disabled:opacity-70 text-white rounded-xl font-bold transition-all shadow-lg text-sm uppercase tracking-wider"
            >
              {status.type === 'loading' ? 'Sending...' : 'Send Secure OTP'}
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
              className="w-full py-4 bg-salute-primary hover:bg-salute-dark disabled:opacity-70 text-white rounded-xl font-bold transition-all shadow-lg text-sm uppercase tracking-wider"
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
  );
}
