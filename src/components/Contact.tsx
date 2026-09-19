export default function Contact() {
  return (
    <section className="py-24 bg-white" id="contact">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h4 className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Contact Us</h4>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Get In Touch</h2>
              <p className="text-gray-600">We are here to answer any questions you may have and help you schedule your appointment.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                  📍
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-lg">Location</h5>
                  <p className="text-gray-600 mt-1">123 Healthcare Ave, Medical District<br/>New Delhi, India 110001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                  📞
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-lg">Phone</h5>
                  <p className="text-gray-600 mt-1">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                  🕒
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-lg">Hours</h5>
                  <p className="text-gray-600 mt-1">Mon-Sat: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3">
            <form className="bg-gray-50 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Book an Appointment</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="+91 00000 00000" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Preferred Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>
              
              <button type="submit" className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
