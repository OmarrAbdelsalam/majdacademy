"use client";
import React from "react";
import { motion } from "framer-motion";

export default function GradesSection4({ content }: { content: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  const grades = [
    'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 
    'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'
  ];

  return (
    <section className="w-full py-[40px] px-[10px] bg-[#fdfafb]">
      <div className="max-w-[1140px] mx-auto flex flex-col items-center gap-[20px]">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[32px] font-bold leading-[32px] text-center text-[#0A0A0A]"
        >
          {content.interests.heading} <span className="gold-text">{content.interests.headingHighlight}</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[25px] font-light leading-[35px] text-center text-[#555] max-w-[800px]"
        >
          {content.packages.subtitle}
        </motion.p>

        {/* Phase / Age Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-[20px] mt-[20px]"
        >
          {content.interests.cards.map((card: any, idx: number) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.2)" }}
              className="bg-white p-[20px] rounded-[15px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-[15px] transition-shadow text-center relative overflow-hidden group"
            >
              {/* Micro-interaction Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[var(--brand-pink-light)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              <div className="w-[60px] h-[60px] rounded-full bg-[var(--brand-pink-light)] text-[var(--brand)] flex items-center justify-center text-[21px] font-bold shadow-inner">
                {card.age.replace(/[^0-9-]/g, '')}
              </div>
              <h3 className="text-[21px] font-bold leading-[21px] text-[#262626]">{card.title}</h3>
              <p className="text-[15px] font-light leading-[24px] text-gray-500">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Grades 1 to 12 List mimicking Hamad Academy */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] mt-[30px]"
        >
          {grades.map((grade, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white py-[15px] px-[10px] rounded-[10px] shadow-sm text-center border border-gray-100 hover:border-[var(--brand)] cursor-pointer relative overflow-hidden group"
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-white/0 via-[rgba(236,72,153,0.1)] to-white/0 skew-x-12"></div>
              
              <span className="text-[17px] font-medium text-[#444] group-hover:text-[var(--brand)] transition-colors relative z-10">
                الصف {grade}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
