"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserActions({ userId, currentRole }: { userId: string, currentRole: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    } catch (err) {
      alert('Failed to delete user');
      setIsDeleting(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (!res.ok) throw new Error('Failed to update');
      router.refresh();
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="relative group">
        <select 
          disabled={isUpdating}
          value={currentRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="appearance-none text-xs font-bold px-3 py-1.5 pr-8 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 outline-none focus:ring-2 focus:ring-salute-primary transition-all disabled:opacity-50 cursor-pointer w-[120px]"
        >
          <option value="SUPERADMIN">SUPERADMIN</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="RECEPTION">RECEPTION</option>
          <option value="PATIENT">PATIENT</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
        title="Delete User"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
