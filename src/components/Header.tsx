import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-salute-primary font-heading">Dr. Swati Sinha</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-gray-600 hover:text-salute-secondary font-medium transition-colors">About</Link>
          <Link href="#services" className="text-gray-600 hover:text-salute-secondary font-medium transition-colors">Services</Link>
          <Link href="#contact" className="text-gray-600 hover:text-salute-secondary font-medium transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center">
          <a href="#contact" className="hidden md:inline-flex px-6 py-2.5 bg-salute-secondary text-white font-bold rounded-xl hover:bg-[#ff7575] transition-all shadow-md hover:-translate-y-0.5">
            Book Appointment
          </a>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-salute-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
