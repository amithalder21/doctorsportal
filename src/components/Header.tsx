"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
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
          <button 
            className="md:hidden p-2 text-salute-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 space-y-4">
              <Link href="#about" className="text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Our Clinic</Link>
              <Link href="#services" className="text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Clinic Services</Link>
              <a href="#contact" className="text-salute-primary font-bold py-2" onClick={() => setIsMobileMenuOpen(false)}>Book Appointment</a>
              <Link href="/patient/login" className="w-full text-center px-6 py-3 bg-salute-secondary text-white font-bold rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                Patient Portal
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
