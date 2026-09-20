"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-salute-light overflow-hidden">
      {/* Abstract Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.5, 0.4] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-2/3 h-full bg-salute-accent rounded-bl-[100px] z-0"
      ></motion.div>
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, 20, 0], opacity: [0.2, 0.3, 0.2] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-salute-secondary rounded-full mix-blend-multiply filter blur-3xl z-0"
      ></motion.div>
      
      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl"
        >
          <div className="inline-block px-4 py-2 bg-salute-accent text-salute-primary font-bold tracking-wider text-sm rounded-full uppercase mb-2">
            Premier Clinical Care
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-salute-dark leading-tight font-heading">
            Empowering <br />
            <span className="text-salute-primary">Women&apos;s Health</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
            Providing compassionate, state-of-the-art gynecological and obstetric care tailored to your unique needs. Experience the highest standard of clinical excellence with Dr. Ankit Gaur.
          </p>
          <div className="pt-6 flex flex-wrap gap-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#services" 
              className="inline-block px-8 py-4 bg-salute-secondary hover:bg-[#ff7575] text-white rounded font-bold shadow-[0_10px_20px_-10px_rgba(255,141,141,0.5)] text-sm uppercase tracking-wide text-center"
            >
              Explore Services
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block relative h-[650px] w-full"
        >
          {/* Decorative frame */}
          <div className="absolute inset-0 bg-salute-primary rounded-tr-[100px] rounded-bl-[100px] translate-x-4 translate-y-4 opacity-10"></div>
          
          <div className="absolute inset-0 bg-white rounded-tr-[100px] rounded-bl-[100px] shadow-2xl overflow-hidden flex items-end justify-center border-4 border-white">
             <Image 
               src="/doctor_hero.jpg" 
               alt="Dr. Ankit Gaur" 
               fill 
               className="object-cover object-top"
               priority
             />
          </div>
          
          {/* Floating badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring' }}
            className="absolute bottom-12 -left-12 bg-white p-6 rounded-xl shadow-xl border-l-4 border-salute-secondary flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-salute-accent flex items-center justify-center text-salute-primary font-bold text-xl">
              15+
            </div>
            <div>
              <p className="font-bold text-salute-dark font-heading">Years of</p>
              <p className="text-sm text-gray-500">Experience</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
