export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Dr. Jane Doe</h3>
          <p className="text-gray-400">
            Providing expert, compassionate care for women and children in a state-of-the-art facility.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
            <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
            <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Book Appointment</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
              <span className="sr-only">Facebook</span>
              f
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
              <span className="sr-only">Twitter</span>
              t
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
              <span className="sr-only">Instagram</span>
              ig
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Dr. Jane Doe. All rights reserved.</p>
      </div>
    </footer>
  );
}
