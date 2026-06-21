"use client";
import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TestimonialsSection4({ content }: { content: any }) {
  // Duplicate the items so we can have a seamless infinite scroll loop
  const marqueeItems = [...content.testimonials.items, ...content.testimonials.items];

  return (
    <section className="w-full py-[80px] overflow-hidden bg-gradient-to-b from-[#fdf2f8] to-white relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-pink-light)] to-transparent opacity-50"></div>
      
      <div className="max-w-[1140px] mx-auto flex flex-col items-center gap-[20px] px-[10px] mb-[40px]">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[32px] font-bold leading-[32px] text-center"
        >
          {content.testimonials.title} <span className="gold-text">{content.testimonials.titleHighlight}</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[21px] text-gray-500 font-light"
        >
          {content.testimonials.subtitle}
        </motion.p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex flex-col gap-[30px] px-[10px] md:px-0">
        
        {/* Row 1: Scrolling Right to Left */}
        <div className="flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_100px,_black_calc(100%-100px),transparent_100%)]">
          <motion.div
            className="flex gap-[24px] min-w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // Adjust speed here
            }}
          >
            {marqueeItems.map((t, idx) => (
              <div 
                key={`row1-${idx}`} 
                className="w-[350px] bg-white p-[30px] rounded-[20px] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-[15px] hover:shadow-[0_8px_30px_-5px_rgba(236,72,153,0.15)] transition-shadow cursor-default"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[15px] bg-[var(--brand-pink-light)] text-[var(--brand)] px-[12px] py-[4px] rounded-full font-bold">
                    {t.grade} - {t.subject}
                  </div>
                  <Quote className="w-8 h-8 text-gray-200 fill-gray-100" />
                </div>
                <p className="text-[17px] font-medium leading-[28px] text-gray-700 italic mt-[10px]">
                  &quot;{t.text}&quot;
                </p>
                <div className="mt-auto pt-[20px] border-t border-gray-50 flex items-center gap-[15px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-tr from-[var(--brand)] to-[var(--brand-pink)] flex items-center justify-center text-white font-bold text-[17px]">
                    {t.name.charAt(0)}
                  </div>
                  <div className="font-bold text-[17px] text-[#262626]">{t.name}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
