"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RescheduleModal from '@/components/RescheduleModal';

interface AdminActionsProps {
  id: string;
  initialStatus: string;
  userRole: string | null;
  appointmentDate: string; // ISO string
  doctorId: string;
}

export default function AdminActions({ id, initialStatus, userRole, appointmentDate, doctorId }: AdminActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isTerminalState = initialStatus === 'COMPLETED' || initialStatus === 'CANCELLED';
  
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0);
  const aptDate = new Date(appointmentDate);
  const isFutureAppointment = aptDate.getTime() > todayUTC.getTime();
  
  // SUPERADMIN has full rights. DOCTOR and RECEPTION can only edit non-terminal states
  const canEdit = userRole === 'SUPERADMIN' || (['DOCTOR', 'RECEPTION'].includes(userRole || '') && !isTerminalState);
  
  // Only SUPERADMIN can permanently delete records
  const canDelete = userRole === 'SUPERADMIN';

  const handleStatusChange = async (newStatus: string) => {
    if (!canEdit) return;
    setIsUpdating(true);
    setStatus(newStatus);
    
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to update status');
      }
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to update status.');
      setStatus(initialStatus); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    if (!confirm('Are you sure you want to permanently delete this request?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to delete record.');
      setIsDeleting(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {canEdit ? (
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none appearance-none cursor-pointer ${statusColors[status] || 'bg-white text-gray-800'} ${isUpdating ? 'opacity-50' : ''}`}
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            {userRole !== 'RECEPTION' && (!isFutureAppointment || status === 'COMPLETED') && (
              <option value="COMPLETED">COMPLETED</option>
            )}
            <option value="CANCELLED">CANCELLED</option>
          </select>
        ) : (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${statusColors[status] || 'bg-white text-gray-800'}`}>
            {status}
          </span>
        )}

        {canEdit && !isTerminalState && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Reschedule Appointment"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </button>
        )}

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Request"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {isModalOpen && (
        <RescheduleModal 
          appointmentId={id}
          doctorId={doctorId}
          endpointUrl={`/api/admin/appointments/${id}`}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
