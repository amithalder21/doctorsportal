"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date') || '';

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/admin?date=${val}`);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="dateFilter" className="text-sm font-bold text-gray-600">
        Filter by Date:
      </label>
      <input
        type="date"
        id="dateFilter"
        value={dateParam}
        onChange={handleDateChange}
        className="px-3 py-2 border rounded-lg text-sm text-salute-dark outline-none focus:border-salute-secondary shadow-sm"
      />
      {dateParam && (
        <button
          onClick={() => router.push('/admin')}
          className="text-xs font-bold text-gray-400 hover:text-[#ff7575] transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
