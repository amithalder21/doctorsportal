"use client";

import { useState, useRef, useEffect } from 'react';
import { upload } from '@vercel/blob/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TIME_SLOTS } from '@/lib/constants';

export default function Contact({ onBookingComplete }: { onBookingComplete?: () => void }) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState<{id: string, name: string | null, email: string}[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isHoliday, setIsHoliday] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
    website: '' // honeypot field for spam prevention
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (data.doctors) setDoctors(data.doctors);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!date || !doctorId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookedSlots([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsHoliday(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastRefreshed(null);
      return;
    }

    const fetchBookedSlots = async (isBackgroundPoll = false) => {
      if (!isBackgroundPoll) setIsLoadingSlots(true);
      try {
        const res = await fetch(`/api/appointments/slots?date=${date}&doctorId=${doctorId}`);
        const data = await res.json();
        if (res.ok) {
          setBookedSlots(prevSlots => {
            // Check if the currently selected time slot was just booked by someone else
            if (timeSlot && (data.isHoliday || data.bookedSlots?.includes(timeSlot))) {
              // Only alert if it wasn't already booked in our state
              if (!prevSlots.includes(timeSlot)) {
                setStatus({ type: 'error', message: `The time slot at ${timeSlot} was just booked by someone else. Please choose another time.` });
                setTimeSlot('');
              }
            }
            return data.bookedSlots || [];
          });
          setIsHoliday(data.isHoliday || false);
          setLastRefreshed(new Date());
        }
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
      } finally {
        if (!isBackgroundPoll) setIsLoadingSlots(false);
      }
    };

    // Fetch immediately
    fetchBookedSlots(false);

    // Then poll every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookedSlots(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [date, doctorId, timeSlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam trap: If a bot fills out the hidden honeypot field, silently reject
    if (formData.website) {
      setStatus({ type: 'success', message: 'Appointment request submitted successfully! We will contact you soon.' });
      setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '', website: '' });
      return;
    }

    // Strict validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    const cleanedPhone = formData.phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit Indian phone number.' });
      return;
    }

    if (!doctorId) {
      setStatus({ type: 'error', message: 'Please select a doctor.' });
      return;
    }

    if (!timeSlot) {
      setStatus({ type: 'error', message: 'Please select an available time.' });
      return;
    }
    
    setStatus({ type: 'loading' });
    
    try {
      let documentUrl = null;

      // Handle File Upload if a file is selected
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        const files = Array.from(fileInputRef.current.files);
        const uploadedUrls = [];
        
        for (const file of files) {
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
          // Upload the file to Vercel Blob
          const blob = await upload(sanitizedName, file, {
            access: 'private',
            handleUploadUrl: '/api/upload',
          });
          uploadedUrls.push(blob.url);
        }
        
        documentUrl = uploadedUrls.join(',');
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, name: fullName, date, time: timeSlot, documentUrl, doctorId }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setStatus({ type: 'success', message: 'Appointment request submitted successfully! We will contact you soon.' });
      setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '', website: '' });
      setDate('');
      setTimeSlot('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setStatus({ type: 'error', message: errorMessage });
    }
  };

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3 space-y-8"
          >
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
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-2/3"
          >
            <form onSubmit={handleSubmit} className="bg-salute-primary p-10 md:p-14 rounded-[40px] shadow-2xl relative overflow-hidden">
              {/* Decorative circle in form */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-salute-accent rounded-full opacity-10"></div>
              
              <h3 className="text-3xl font-bold text-white mb-8 font-heading relative z-10">Book an Appointment</h3>
              
              {/* Honeypot field for spam prevention */}
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              
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
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="Doe" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" placeholder="+91 00000 00000" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Preferred Date</label>
                  <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm" style={{colorScheme: 'dark'}} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Select Doctor</label>
                  <select required value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all backdrop-blur-sm [&>option]:text-salute-dark">
                    <option value="" disabled>Choose a Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name || `Dr. ${doc.email.split('@')[0]}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Available Times</label>
                {lastRefreshed && !isLoadingSlots && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-white/60 font-medium">Live</span>
                  </div>
                )}
              </div>
              <div className="space-y-3 mb-6 relative z-10">
                {(!date || !doctorId) ? (
                  <div className="p-4 rounded-xl border border-dashed border-white/30 text-center text-white/70 text-sm font-medium">
                    Please select a doctor and date first to view available slots.
                  </div>
                ) : isLoadingSlots ? (
                  <div className="p-4 rounded-xl border border-white/20 bg-white/5 text-center text-white/70 text-sm font-medium flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Checking availability...
                  </div>
                ) : isHoliday ? (
                  <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-center flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-red-200 font-bold">Doctor is unavailable on this date.</p>
                    <p className="text-red-200/70 text-sm">Please select a different date for your appointment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIME_SLOTS.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <label key={time} className={isBooked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                          <input 
                            type="radio" 
                            name="timeSlot" 
                            value={time} 
                            checked={timeSlot === time} 
                            onChange={() => !isBooked && setTimeSlot(time)} 
                            className="peer sr-only" 
                            required 
                            disabled={isBooked}
                          />
                          <div className={`text-center px-2 py-3 rounded-xl border text-sm font-bold transition-all
                            ${isBooked 
                              ? 'border-red-500/30 bg-red-500/10 text-red-200 line-through' 
                              : 'border-white/20 text-white/80 peer-checked:bg-salute-secondary peer-checked:text-white peer-checked:border-salute-secondary hover:bg-white/20 hover:text-white'
                            }`}
                          >
                            {time}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mb-6 relative z-10">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Medical Records (Optional)</label>
                <div className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white/80 focus-within:ring-2 focus-within:ring-salute-secondary focus-within:border-transparent transition-all backdrop-blur-sm relative hover:bg-white/15">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".pdf,image/png,image/jpeg"
                    multiple
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-salute-secondary file:text-white hover:file:bg-[#ff7575] file:transition-all cursor-pointer outline-none"
                  />
                  <p className="text-xs text-white/50 mt-2">Upload previous prescriptions, lab results, or referral letters (PDF, PNG, JPG)</p>
                </div>
              </div>

              <div className="space-y-2 mb-10 relative z-10">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wide">Message (Optional)</label>
                <textarea rows={4} name="message" value={formData.message} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-salute-secondary focus:border-transparent outline-none transition-all resize-none backdrop-blur-sm" placeholder="How can we help you?"></textarea>
              </div>
              
              <button disabled={status.type === 'loading' || isHoliday} type="submit" className="w-full py-5 bg-salute-secondary hover:bg-[#ff7575] disabled:bg-[#ff7575]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-[0_10px_20px_-10px_rgba(255,141,141,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(255,141,141,0.6)] hover:-translate-y-1 relative z-10 text-sm uppercase tracking-wider">
                {status.type === 'loading' ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
