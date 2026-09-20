"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientCancelButton({ appointmentId, status }: { appointmentId: string, status: string }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  if (status !== 'PENDING' && status !== 'CONFIRMED') {
    return null;
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/patient/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to cancel appointment');
      }

      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to cancel appointment. Please try again or contact the clinic.');
      setIsCancelling(false);
    }
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={isCancelling}
      className="w-full sm:w-auto justify-center px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
    </button>
  );
}
