"use client";
import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export default function FAQSection4({ content }: { content: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } }
  };

  return (
    <section className="w-full py-[60px] px-[10px]">
      <motion.div 
        className="max-w-[800px] mx-auto flex flex-col gap-[20px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-[20px]">
          <div className="inline-flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[var(--brand-pink-light)] text-[var(--brand)] mb-[15px]">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-[32px] font-bold leading-[32px]">
            {content.faq.title}
          </h2>
          <p className="text-[17px] text-gray-500 mt-[10px]">{content.faq.subtitle}</p>
        </motion.div>

        {content.faq.items.map((faq: any, idx: number) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ scale: 1.01, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
            className="border border-gray-200 bg-white rounded-[15px] p-[25px] transition-all"
          >
            <h3 className="text-[21px] font-bold mb-[12px] text-[#262626]">{faq.question}</h3>
            <p className="text-[17px] font-light leading-[28px] text-gray-600">{faq.answer}</p>
          </motion.div>
        ))}

        <motion.div variants={itemVariants} className="text-center mt-[20px]">
          <a href="#contact" className="inline-block px-[24px] py-[10px] text-[17px] font-medium text-[var(--brand)] bg-[var(--brand-pink-light)] bg-opacity-20 rounded-[24px] hover:bg-opacity-40 transition-colors">
            {content.faq.ctaText}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
