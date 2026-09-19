export default function About() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="about">
      {/* Decorative background element */}
      <div className="absolute top-1/2 -right-64 w-96 h-96 bg-salute-accent rounded-full opacity-50 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -inset-6 bg-salute-primary opacity-5 rounded-tl-[100px] rounded-br-[100px] z-0"></div>
            <div className="relative z-10 bg-salute-light aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl flex flex-col items-center justify-center text-gray-400 border-8 border-white">
              <svg className="w-20 h-20 mb-4 text-salute-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-heading font-bold text-salute-dark">[Doctor Profile Image]</span>
            </div>
            {/* Small floating card */}
            <div className="absolute -bottom-10 -right-10 bg-salute-primary text-white p-8 rounded-tr-[50px] rounded-bl-[50px] shadow-2xl z-20 hidden md:block">
              <h5 className="font-heading text-4xl font-bold mb-1">5k+</h5>
              <p className="text-sm font-bold tracking-wider opacity-80 uppercase">Happy Patients</p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-8">
            <div>
              <h4 className="text-salute-secondary font-bold tracking-wider text-sm uppercase mb-3">About The Doctor</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-salute-dark leading-tight font-heading">
                Dedicated to Your <br className="hidden md:block"/> Health & Well-being
              </h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-salute-secondary pl-6 italic">
              With over 15 years of experience in Obstetrics and Gynecology, I am committed to providing comprehensive, compassionate, and personalized care for women at every stage of life.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              My philosophy centers around listening to my patients, understanding their unique concerns, and working together to develop the most effective treatment plans. Whether you are navigating pregnancy, dealing with complex gynecological issues, or seeking routine care, you are in expert hands.
            </p>
            
            <div className="pt-4">
              <button className="px-8 py-4 bg-salute-dark hover:bg-salute-primary text-white rounded font-bold transition-all shadow-lg text-sm uppercase tracking-wide">
                Read Full Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
