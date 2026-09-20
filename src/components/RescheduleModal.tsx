"use client";

import { useState, useEffect } from 'react';
import { TIME_SLOTS } from '@/lib/constants';

interface RescheduleModalProps {
  appointmentId: string;
  doctorId: string;
  endpointUrl: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RescheduleModal({ appointmentId, doctorId, endpointUrl, onClose, onSuccess }: RescheduleModalProps) {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isHoliday, setIsHoliday] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date) return;

    const fetchBookedSlots = async () => {
      setIsLoadingSlots(true);
      setError('');
      try {
        const res = await fetch(`/api/appointments/slots?date=${date}&doctorId=${doctorId}`);
        const data = await res.json();
        if (res.ok) {
          setBookedSlots(data.bookedSlots || []);
          setIsHoliday(data.isHoliday || false);
        } else {
          setError(data.error || 'Failed to fetch slots');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch available slots.');
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [date, doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      setError('Please select both a date and a time slot.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(endpointUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESCHEDULE', date, time: timeSlot })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to reschedule appointment');
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-salute-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-salute-dark font-heading">Reschedule Appointment</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">New Date</label>
              <input 
                type="date" 
                required
                value={date} 
                onChange={(e) => {
                  setDate(e.target.value);
                  setTimeSlot('');
                }} 
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Available Times</label>
              
              {!date ? (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm font-medium">
                  Please select a date first.
                </div>
              ) : isLoadingSlots ? (
                <div className="p-4 text-center text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Checking availability...
                </div>
              ) : isHoliday ? (
                <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-center text-red-500 text-sm font-bold">
                  Doctor is unavailable on this date.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <label key={time} className={isBooked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                        <input 
                          type="radio" 
                          name="timeSlot" 
                          value={time} 
                          checked={timeSlot === time} 
                          onChange={() => !isBooked && setTimeSlot(time)} 
                          className="peer sr-only" 
                          required 
                          disabled={isBooked}
                        />
                        <div className={`text-center px-2 py-2.5 rounded-lg border text-xs font-bold transition-all
                          ${isBooked 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 line-through' 
                            : 'border-gray-200 text-gray-600 peer-checked:bg-salute-secondary peer-checked:text-white peer-checked:border-salute-secondary hover:border-salute-secondary'
                          }`}
                        >
                          {time}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !date || !timeSlot || isHoliday}
            className="px-5 py-2.5 rounded-xl font-bold bg-salute-primary hover:bg-[#1a3294] text-white transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
