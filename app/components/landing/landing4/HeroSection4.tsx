"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection4({ content }: { content: any }) {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 50, damping: 20 }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <section className="w-full pt-[60px] pb-[40px] px-[10px] overflow-hidden">
      <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center gap-[20px]">
        
        {/* Right side (Text) - flex: 1 */}
        <motion.div 
          className="flex-1 flex flex-col gap-[20px] p-[10px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1 variants={itemVariants} className="text-[32px] md:text-[40px] font-bold leading-tight text-[#0A0A0A]">
            {content.hero.line1} <br />
            <span className="gold-text">{content.hero.line2}</span>
          </motion.h1>
          
          <motion.h2 variants={itemVariants} className="text-[25px] font-light leading-[35px] text-[#555]">
            {content.hero.subtitle1}
          </motion.h2>
          
          <motion.div variants={itemVariants} className="flex flex-col gap-[10px] mt-[10px]">
            {[
              { title: content.hero.badge1 },
              { title: content.hero.badge2 },
              { title: content.hero.badge3 }
            ].map((badge, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-center gap-[10px]"
                whileHover={{ x: 5 }}
                transition={{ type: "spring" as const, stiffness: 300 }}
              >
                <div className="w-[10px] h-[10px] rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand-pink-light)]"></div>
                <span className="text-[17px] font-medium text-[#262626]">{badge.title}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-[20px]">
            <a 
              href="#trial" 
              className="inline-block px-[24px] py-[10px] text-white text-[17px] font-bold rounded-[24px] btn-primary"
            >
              {content.hero.cta}
            </a>
          </motion.div>
        </motion.div>

        {/* Left side (Image) - flex: 1 */}
        <motion.div 
          className="flex-1 p-[10px]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="relative w-full aspect-square md:aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl bg-gradient-to-tr from-[var(--brand-light)] to-[var(--brand-pink-light)] flex items-center justify-center border-4 border-white"
            variants={floatVariants}
            animate="animate"
          >
            {/* The white border and gradient match modern premium styles, keeping the layout dimensions strictly exact */}
            <Image 
              src="/icon.png" 
              alt="Majd Academy" 
              width={300} 
              height={300} 
              className="object-contain drop-shadow-2xl" 
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
