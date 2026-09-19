"use client";

import { useState, useEffect } from 'react';

export default function ScheduleManager({ role, adminId }: { role: string | null, adminId: string | null }) {
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<{id: string, name: string | null, email: string}[]>([]);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    doctorId: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const fetchBlockedSlots = async () => {
    try {
      const res = await fetch('/api/admin/schedule');
      const data = await res.json();
      if (data.blockedSlots) {
        setBlockedSlots(data.blockedSlots);
      }
    } catch (error) {
      console.error('Error fetching blocked slots:', error);
    }
  };

  const fetchDoctors = async () => {
    if (role === 'SUPERADMIN' || role === 'RECEPTION') {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.doctors) setDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }
  };

  useEffect(() => {
    fetchBlockedSlots();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    
    try {
      const payload = { ...formData };
      if (role === 'DOCTOR') {
        payload.doctorId = adminId || '';
      }
      
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add block');
      }
      
      setStatus({ type: 'success', message: 'Successfully added to schedule.' });
      setFormData({ date: '', time: '', reason: '', doctorId: '' });
      fetchBlockedSlots();
      
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this block?')) return;
    
    try {
      const res = await fetch(`/api/admin/schedule/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchBlockedSlots();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete block');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Internal Server Error');
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Left Col: Form */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h2 className="text-xl font-bold text-salute-dark font-heading mb-6">Add New Block</h2>
          
          {status && (
            <div className={`p-3 rounded-lg text-sm font-medium mb-4 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {(role === 'SUPERADMIN' || role === 'RECEPTION') && (
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Doctor</label>
                <select 
                  required
                  value={formData.doctorId} 
                  onChange={e => setFormData({...formData, doctorId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-salute-dark focus:ring-2 focus:ring-salute-secondary outline-none transition-all"
                >
                  <option value="" disabled>Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name || doc.email}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Date</label>
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-salute-dark focus:ring-2 focus:ring-salute-secondary outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Time Slot (Optional)</label>
              <select 
                value={formData.time} 
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-salute-dark focus:ring-2 focus:ring-salute-secondary outline-none transition-all"
              >
                <option value="">Full Day (Holiday)</option>
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Leave as "Full Day" to block the entire date.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Reason (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Surgery, Vacation, Lunch"
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-salute-dark focus:ring-2 focus:ring-salute-secondary outline-none transition-all"
              />
            </div>
            
            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full py-4 mt-2 bg-salute-secondary hover:bg-[#ff7575] disabled:bg-[#ff7575]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_10px_20px_-10px_rgba(255,141,141,0.5)] uppercase tracking-wider text-sm"
            >
              {isLoading ? 'Adding...' : 'Block Time'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Col: List */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-salute-dark font-heading">Current Blocks</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  {(role === 'SUPERADMIN' || role === 'RECEPTION') && (
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                  )}
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blockedSlots.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'DOCTOR' ? 3 : 4} className="p-8 text-center text-gray-400">
                      No schedule blocks found.
                    </td>
                  </tr>
                ) : (
                  blockedSlots.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-salute-dark">
                          {new Date(block.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-bold text-salute-secondary mt-0.5">
                          {block.time || 'FULL DAY HOLIDAY'}
                        </div>
                      </td>
                      {(role === 'SUPERADMIN' || role === 'RECEPTION') && (
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-700">
                            Dr. {block.doctor?.name || block.doctor?.email?.split('@')[0]}
                          </span>
                        </td>
                      )}
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {block.reason || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(block.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"
                          title="Remove Block"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
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
