"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to add user');

      setMessage('User added successfully!');
      setEmail('');
      setRole('PATIENT');
      router.refresh();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-salute-dark mb-6">Add New User</h3>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-salute-secondary outline-none"
            placeholder="user@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-salute-secondary outline-none bg-white"
          >
            <option value="SUPERADMIN">Super Admin (Owner)</option>
            <option value="DOCTOR">Doctor</option>
            <option value="RECEPTION">Reception</option>
            <option value="PATIENT">Patient</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-2 bg-salute-primary hover:bg-[#ff7575] text-white rounded-lg font-bold transition-colors disabled:opacity-50 mt-4"
        >
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </div>
    </form>
  );
}
