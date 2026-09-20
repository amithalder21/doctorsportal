"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminNav({ role, name }: { role: string | null, name?: string }) {
  const pathname = usePathname();
  
  // Don't show nav on the login page
  if (pathname === '/admin/login') return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="bg-salute-primary text-white p-2.5 rounded-xl group-hover:bg-salute-secondary transition-all shadow-md group-hover:-translate-y-0.5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-salute-primary font-heading leading-none">Ankit Gaur Clinic</span>
                <span className="text-[10px] uppercase tracking-widest text-salute-secondary font-bold mt-1">Admin Portal</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/admin" 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/admin' ? 'bg-salute-primary/10 text-salute-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-salute-dark'}`}
              >
                Dashboard
              </Link>
              
              <Link 
                href="/admin/schedule" 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/admin/schedule' ? 'bg-salute-primary/10 text-salute-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-salute-dark'}`}
              >
                Schedule & Leaves
              </Link>
              
              {role === 'SUPERADMIN' && (
                <Link 
                  href="/admin/users" 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/admin/users' ? 'bg-salute-primary/10 text-salute-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-salute-dark'}`}
                >
                  User Management
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {name && (
              <span className="text-sm font-bold text-gray-700 hidden sm:inline-block">
                Welcome, {name.startsWith('Dr.') ? name : name.split(' ')[0]}
              </span>
            )}
            <span className="bg-salute-secondary/10 text-salute-secondary border border-salute-secondary/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              {role || 'Unknown'}
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
