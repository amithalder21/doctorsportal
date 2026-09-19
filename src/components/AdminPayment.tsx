"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminPaymentProps {
  id: string;
  initialPaymentStatus: string;
  initialTransactionId: string | null;
  userRole: string | null;
}

export default function AdminPayment({ id, initialPaymentStatus, initialTransactionId, userRole }: AdminPaymentProps) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [transactionId, setTransactionId] = useState(initialTransactionId || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // All admin roles can edit payment status
  const canEdit = ['SUPERADMIN', 'DOCTOR', 'RECEPTION'].includes(userRole || '');

  const handleUpdate = async (newStatus?: string) => {
    if (!canEdit) return;
    setIsUpdating(true);
    
    const statusToUpdate = newStatus || paymentStatus;
    if (newStatus) setPaymentStatus(newStatus);
    
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentStatus: statusToUpdate, 
          transactionId: statusToUpdate === 'PAID' ? transactionId : null 
        })
      });
      
      if (!res.ok) throw new Error('Failed to update payment status');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to update payment details.');
      setPaymentStatus(initialPaymentStatus);
      setTransactionId(initialTransactionId || '');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-[140px]">
      {canEdit ? (
        <>
          <select
            value={paymentStatus}
            onChange={(e) => handleUpdate(e.target.value)}
            disabled={isUpdating}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${
              paymentStatus === 'PAID' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            } ${isUpdating ? 'opacity-50' : ''}`}
          >
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
          </select>
          
          {paymentStatus === 'PAID' && (
            <input
              type="text"
              placeholder="Ref / Trans ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              onBlur={() => handleUpdate()}
              disabled={isUpdating}
              className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-salute-secondary transition-colors"
            />
          )}
        </>
      ) : (
        <>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border inline-block text-center ${
            paymentStatus === 'PAID' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {paymentStatus}
          </span>
          {paymentStatus === 'PAID' && transactionId && (
            <span className="text-xs text-gray-500 truncate max-w-[120px]" title={transactionId}>
              ID: {transactionId}
            </span>
          )}
        </>
      )}
    </div>
  );
}
