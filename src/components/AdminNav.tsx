"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav({ role }: { role: string | null }) {
  const pathname = usePathname();
  
  // Don't show nav on the login page
  if (pathname === '/admin/login') return null;

  return (
    <nav className="bg-salute-primary text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-heading font-bold text-xl tracking-wide flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              DoctorPortal
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                Dashboard
              </Link>
              
              {role === 'SUPERADMIN' && (
                <Link 
                  href="/admin/users" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/admin/users' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  User Management
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              {role || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
