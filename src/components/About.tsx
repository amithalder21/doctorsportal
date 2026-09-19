"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="about">
      {/* Decorative background element */}
      <div className="absolute top-1/2 -right-64 w-96 h-96 bg-salute-accent rounded-full opacity-50 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="absolute -inset-6 bg-salute-primary opacity-5 rounded-tl-[100px] rounded-br-[100px] z-0"></div>
            <div className="relative z-10 bg-salute-light aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl flex flex-col items-center justify-center text-gray-400 border-8 border-white">
              <Image 
                src="/doctor_about.jpg"
                alt="Dr. Ankit Gaur in Clinic"
                fill
                className="object-cover"
              />
            </div>
            {/* Small floating card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-10 -right-10 bg-salute-primary text-white p-8 rounded-tr-[50px] rounded-bl-[50px] shadow-2xl z-20 hidden md:block"
            >
              <h5 className="font-heading text-4xl font-bold mb-1">5k+</h5>
              <p className="text-sm font-bold tracking-wider opacity-80 uppercase">Happy Patients</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 space-y-8"
          >
            <div>
              <h4 className="text-salute-secondary font-bold tracking-wider text-sm uppercase mb-3">About Our Clinic</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-salute-dark leading-tight font-heading">
                Dedicated to Your <br className="hidden md:block"/> Health & Well-being
              </h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-salute-secondary pl-6 italic">
              With over 15 years of extensive clinical experience in Obstetrics and Gynecology, I am deeply committed to providing comprehensive, compassionate, and highly personalized care for women at every stage of life.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              My practice is built on a foundation of trust, open communication, and evidence-based medicine. Whether you are navigating pregnancy, dealing with complex gynecological issues, or seeking routine preventive care, my goal is to ensure you feel heard, supported, and confident in your treatment plan.
            </p>
            
            <div className="pt-4">
              {/* Button removed to reduce clutter */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
