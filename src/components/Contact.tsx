"use client";

import { useState } from 'react';

export default function Contact() {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeSlot) {
      setStatus({ type: 'error', message: 'Please select an available time.' });
      return;
    }
    
    setStatus({ type: 'loading' });
    
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date, time: timeSlot }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setStatus({ type: 'success', message: 'Appointment request submitted successfully! We will contact you soon.' });
      setFormData({ name: '', phone: '', email: '', message: '' });
      setDate('');
      setTimeSlot('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h4 className="text-salute-secondary font-bold tracking-wider uppercase text-sm mb-3">Contact Us</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-salute-dark mt-2 mb-6 font-heading">Get In Touch</h2>
              <p className="text-gray-600 text-lg">We are here to answer any questions you may have and help you schedule your appointment.</p>
            </div>
            
            <div className="space-y-8 pt-4">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-salute-light rounded-tl-xl rounded-br-xl flex items-center justify-center text-salute-primary flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h5 className="font-bold text-salute-dark text-xl font-heading mb-1">Location</h5>
                  <p className="text-gray-600 leading-relaxed">123 Healthcare Ave, Medical District<br/>New Delhi, India 110001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-salute-light rounded-tl-xl rounded-br-xl flex items-center justify-center text-salute-primary flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h5 className="font-bold text-salute-dark text-xl font-heading mb-1">Phone</h5>
                  <p className="text-gray-600 leading-relaxed">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-salute-light rounded-tl-xl rounded-br-xl flex items-center justify-center text-salute-primary flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h5 className="font-bold text-salute-dark text-xl font-heading mb-1">Hours</h5>
                  <p className="text-gray-600 leading-relaxed">Mon-Sat: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-salute-primary p-10 md:p-14 rounded-[40px] shadow-2xl relative overflow-hidden">
              {/* Decorative circle in form */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-salute-accent rounded-full opacity-10"></div>
              
              <h3 className="text-3xl font-bold text-white mb-8 font-heading relative z-10">Book an Appointment</h3>
              
              {status.type === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-100 relative z-10">
                  {status.message}
                </div>
              )}
              {status.type === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 relative z-10">
                  {status.message}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="+91 00000 00000" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Preferred Date</label>
                  <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" style={{colorScheme: 'dark'}} />
                </div>
              </div>

              <div className="space-y-3 mb-6 relative z-10">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Available Times</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <label key={time} className="cursor-pointer">
                      <input type="radio" name="timeSlot" value={time} checked={timeSlot === time} onChange={() => setTimeSlot(time)} className="peer sr-only" required />
                      <div className="text-center px-2 py-3 rounded-xl border border-white/20 text-white/80 peer-checked:bg-salute-secondary peer-checked:text-white peer-checked:border-salute-secondary hover:bg-white/10 transition-all text-sm font-bold">
                        {time}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 mb-10 relative z-10">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Message (Optional)</label>
                <textarea rows={4} name="message" value={formData.message} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all resize-none backdrop-blur-sm" placeholder="How can we help you?"></textarea>
              </div>
              
              <button disabled={status.type === 'loading'} type="submit" className="w-full py-5 bg-salute-secondary hover:bg-[#ff7575] disabled:bg-[#ff7575]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_10px_20px_-10px_rgba(255,141,141,0.5)] hover:-translate-y-1 relative z-10 text-sm uppercase tracking-wider">
                {status.type === 'loading' ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
