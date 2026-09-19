const services = [
  {
    title: 'Obstetrics Care',
    description: 'Comprehensive care throughout your pregnancy journey, from preconception counseling to postpartum support.',
    icon: '👶'
  },
  {
    title: 'General Gynecology',
    description: 'Routine check-ups, preventive screenings, and management of various gynecological conditions.',
    icon: '🌸'
  },
  {
    title: 'IVF & Infertility',
    description: 'Advanced fertility treatments and compassionate support to help you build your family.',
    icon: '✨'
  },
  {
    title: 'Minimally Invasive Surgery',
    description: 'State-of-the-art surgical options for faster recovery and minimal discomfort.',
    icon: '🔬'
  },
  {
    title: 'PCOD/PCOS Management',
    description: 'Holistic approaches to manage symptoms and improve your quality of life.',
    icon: '⚕️'
  },
  {
    title: 'High-Risk Pregnancy',
    description: 'Specialized monitoring and care for complex pregnancies to ensure the best outcomes.',
    icon: '❤️'
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-gray-50" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h4 className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Our Services</h4>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Comprehensive Care</h2>
          <p className="text-gray-600">
            We offer a wide range of specialized services tailored to meet the unique healthcare needs of women at every stage of life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 bg-purple-50 text-2xl flex items-center justify-center rounded-xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
