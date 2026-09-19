"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold shadow-sm transition-all ${
          currentPage <= 1
            ? 'pointer-events-none opacity-50 bg-gray-50 text-gray-400'
            : 'bg-white text-salute-primary hover:bg-salute-accent hover:border-salute-secondary'
        }`}
        aria-disabled={currentPage <= 1}
      >
        Previous
      </Link>
      
      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold shadow-sm transition-all ${
          currentPage >= totalPages
            ? 'pointer-events-none opacity-50 bg-gray-50 text-gray-400'
            : 'bg-white text-salute-primary hover:bg-salute-accent hover:border-salute-secondary'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        Next
      </Link>
    </div>
  );
}
