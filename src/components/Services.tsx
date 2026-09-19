"use client";

import { motion } from 'framer-motion';

const services = [
  {
    title: 'Obstetrics Care',
    description: 'Comprehensive care throughout your pregnancy journey, from preconception counseling to postpartum support.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
    )
  },
  {
    title: 'General Gynecology',
    description: 'Routine check-ups, preventive screenings, and management of various gynecological conditions.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
    )
  },
  {
    title: 'IVF & Infertility',
    description: 'Advanced fertility treatments and compassionate support to help you build your family.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
    )
  },
  {
    title: 'Minimally Invasive Surgery',
    description: 'State-of-the-art surgical options for faster recovery and minimal discomfort.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
    )
  },
  {
    title: 'PCOD/PCOS Management',
    description: 'Holistic approaches to manage symptoms and improve your quality of life.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    )
  },
  {
    title: 'High-Risk Pregnancy',
    description: 'Specialized monitoring and care for complex pregnancies to ensure the best outcomes.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    )
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Services() {
  return (
    <section className="py-24 bg-salute-accent/30 relative" id="services">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h4 className="text-salute-primary font-bold tracking-wider uppercase text-sm mb-3">Our Services</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-salute-dark mt-2 mb-6 font-heading">Comprehensive Care</h2>
          <p className="text-gray-600 text-lg">
            We offer a wide range of specialized services tailored to meet the unique healthcare needs of women at every stage of life.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-tr-[40px] rounded-bl-[40px] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(19,37,115,0.15)] transition-all duration-300 border border-salute-accent group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-salute-light rounded-bl-[100px] z-0 transition-all duration-300 group-hover:bg-salute-accent"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-salute-primary text-white flex items-center justify-center rounded-tl-2xl rounded-br-2xl mb-8 group-hover:-translate-y-2 transition-transform duration-300 shadow-md">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-salute-dark mb-4 font-heading">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-20 text-center">
          {/* Button removed to reduce clutter */}
        </div>
      </div>
    </section>
  );
}
