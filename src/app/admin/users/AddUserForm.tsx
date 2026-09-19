"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, name: fullName })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to add user');

      setMessage('User added successfully!');
      setEmail('');
      setFirstName('');
      setLastName('');
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

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-xs">First Name (Optional)</label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-salute-primary outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Dr. Ankit"
              autoComplete="off"
              data-lpignore="true"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-xs">Last Name (Optional)</label>
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-salute-primary outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Gaur"
              autoComplete="off"
              data-lpignore="true"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-xs">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-salute-primary outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="user@example.com"
            autoComplete="off"
            data-lpignore="true"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-xs">Role</label>
          <div className="relative">
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 appearance-none border border-gray-200 rounded-xl focus:ring-2 focus:ring-salute-primary outline-none transition-all bg-gray-50 focus:bg-white cursor-pointer font-medium text-gray-700"
            >
              <option value="SUPERADMIN">Super Admin (Owner)</option>
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTION">Reception</option>
              <option value="PATIENT">Patient</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3.5 bg-salute-primary hover:bg-salute-dark text-white rounded-xl font-bold transition-all disabled:opacity-50 mt-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider text-sm"
        >
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </div>
    </form>
  );
}
