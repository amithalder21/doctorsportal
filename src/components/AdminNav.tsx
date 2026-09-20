"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function AdminNav({ role, name }: { role: string | null, name?: string }) {
  const pathname = usePathname();
  
  // Don't show nav on the login page
  if (pathname === '/admin/login') return null;

  return (
    <nav className="bg-salute-primary text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="bg-white text-salute-primary p-2.5 rounded-xl group-hover:bg-salute-secondary group-hover:text-white transition-all shadow-md group-hover:-translate-y-0.5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white font-heading leading-none">Ankit Gaur Clinic</span>
                <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Admin Portal</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/admin" 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/admin' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                Dashboard
              </Link>
              
              <Link 
                href="/admin/schedule" 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/admin/schedule' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                Schedule & Leaves
              </Link>
              
              {role === 'SUPERADMIN' && (
                <Link 
                  href="/admin/users" 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/admin/users' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  User Management
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {name && (
              <span className="text-sm font-bold text-white hidden sm:inline-block">
                Welcome, {name.startsWith('Dr.') ? name : name.split(' ')[0]}
              </span>
            )}
            <span className="bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              {role || 'Unknown'}
            </span>
            <LogoutButton className="bg-white/10 hover:bg-[#ff7575] text-white border border-white/10 hover:border-transparent" />
          </div>
        </div>
      </div>
    </nav>
  );
}
