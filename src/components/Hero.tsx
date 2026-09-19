export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-salute-light overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-salute-accent rounded-bl-[100px] z-0 opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-salute-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
        <div className="space-y-8 max-w-2xl">
          <div className="inline-block px-4 py-2 bg-salute-accent text-salute-primary font-bold tracking-wider text-sm rounded-full uppercase mb-2">
            Professional Medical Care
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-salute-dark leading-tight font-heading">
            Expert Care for <br />
            <span className="text-salute-primary">Women & Children</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
            Providing compassionate, state-of-the-art healthcare tailored to your unique needs. Experience the highest standard of medical excellence with Dr. Swati Sinha.
          </p>
          <div className="pt-6 flex flex-wrap gap-4">
            <a href="#contact" className="inline-block px-8 py-4 bg-salute-secondary hover:bg-[#ff7575] text-white rounded font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm uppercase tracking-wide text-center">
              Book Appointment
            </a>
          </div>
        </div>
        
        <div className="hidden md:block relative h-[650px] w-full">
          {/* Decorative frame */}
          <div className="absolute inset-0 bg-salute-primary rounded-tr-[100px] rounded-bl-[100px] translate-x-4 translate-y-4 opacity-10"></div>
          
          <div className="absolute inset-0 bg-white rounded-tr-[100px] rounded-bl-[100px] shadow-2xl overflow-hidden flex items-end justify-center border-4 border-white">
             {/* Replace with actual image later */}
             <div className="w-full h-full bg-salute-accent/50 flex flex-col items-center justify-center text-salute-primary/60 p-12 text-center">
               <svg className="w-24 h-24 mb-4 text-salute-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
               </svg>
               <span className="font-heading text-xl font-bold text-salute-dark mb-2">[Doctor Image Placeholder]</span>
               <span className="text-sm">Replace this section with a high-quality photo of the doctor</span>
             </div>
          </div>
          
          {/* Floating badge */}
          <div className="absolute bottom-12 -left-12 bg-white p-6 rounded-xl shadow-xl border-l-4 border-salute-secondary flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-12 h-12 rounded-full bg-salute-accent flex items-center justify-center text-salute-primary font-bold text-xl">
              15+
            </div>
            <div>
              <p className="font-bold text-salute-dark font-heading">Years of</p>
              <p className="text-sm text-gray-500">Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
