"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RescheduleModal from '@/components/RescheduleModal';

export default function PatientRescheduleButton({ appointmentId, doctorId, status }: { appointmentId: string, doctorId: string, status: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status !== 'PENDING' && status !== 'CONFIRMED') {
    return null;
  }

  const handleSuccess = () => {
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-4 md:mt-0 px-4 py-2 text-sm font-bold text-salute-secondary bg-salute-secondary/10 hover:bg-salute-secondary/20 rounded-xl transition-colors inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Reschedule
      </button>

      {isModalOpen && (
        <RescheduleModal 
          appointmentId={appointmentId}
          doctorId={doctorId}
          endpointUrl={`/api/patient/appointments/${appointmentId}`}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
