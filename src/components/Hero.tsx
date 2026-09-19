

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 bg-purple-900/10 z-0"></div>
      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Expert Care for <br />
            <span className="text-purple-700">Women & Children</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg">
            Providing compassionate, state-of-the-art healthcare tailored to your unique needs. Experience the highest standard of medical excellence.
          </p>
          <div className="pt-4 flex gap-4">
            <button className="px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Book Appointment
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-purple-700 border-2 border-purple-100 rounded-full font-semibold transition-all shadow-sm">
              Our Services
            </button>
          </div>
        </div>
        <div className="hidden md:block relative h-[600px] w-full">
          <div className="absolute inset-0 bg-purple-100 rounded-[3rem] rotate-3 scale-95 opacity-50"></div>
          {/* Using a placeholder for now - you can replace with actual doctor image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-blue-50 rounded-[3rem] shadow-2xl overflow-hidden flex items-end justify-center">
             <div className="w-full h-full bg-purple-200/50 flex items-center justify-center text-purple-500 font-medium">
               [Doctor Image Placeholder]
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
