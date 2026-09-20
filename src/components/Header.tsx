"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-salute-primary text-white p-2 rounded-xl group-hover:bg-salute-secondary transition-colors shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-salute-primary font-heading tracking-tight">Dr. Priya Sharma</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-gray-600 hover:text-salute-secondary font-medium transition-colors">Our Clinic</Link>
          <Link href="#services" className="text-gray-600 hover:text-salute-secondary font-medium transition-colors">Clinic Services</Link>
          <a href="#contact" className="text-salute-primary font-bold hover:text-salute-secondary transition-colors">Book Appointment</a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Link href="/patient/login" className="hidden md:inline-flex px-6 py-2.5 bg-salute-secondary text-white font-bold rounded-xl hover:bg-[#ff7575] transition-all shadow-md hover:-translate-y-0.5">
            Patient Portal
          </Link>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-salute-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
