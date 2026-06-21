"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Star, Award } from "lucide-react";

export default function FeaturesSection4({ content }: { content: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemLeftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring" as const, stiffness: 70, damping: 20 }
    }
  };

  const itemRightVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring" as const, stiffness: 70, damping: 20 }
    }
  };

  // Map features to icons dynamically if possible, or just use a default
  const getFeatureIcon = (idx: number) => {
    const icons = [Star, Award, ShieldCheck, CheckCircle2];
    const Icon = icons[idx % icons.length];
    return <Icon className="w-6 h-6 text-[var(--brand)]" />;
  };

  return (
    <section className="w-full py-[60px] px-[10px] overflow-hidden">
      <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row gap-[40px]">
        
        {/* Left Side (Features List) */}
        <motion.div 
          className="flex-1 flex flex-col gap-[20px] justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 variants={itemLeftVariants} className="text-[32px] font-bold leading-[32px]">
            {content.whyMajd.title1} <span className="gold-text">{content.whyMajd.title2}</span>
          </motion.h2>
          
          <div className="flex flex-col gap-[15px]">
            {content.whyMajd.features.map((feat: any, idx: number) => (
              <motion.div 
                key={idx} 
                variants={itemLeftVariants}
                whileHover={{ x: 10, backgroundColor: "#fef1f8" }}
                className="flex gap-[15px] items-start p-[15px] bg-gray-50 rounded-[15px] transition-colors cursor-default"
              >
                <div className="min-w-[44px] h-[44px] rounded-full bg-[var(--brand-pink-light)] shadow-inner flex items-center justify-center">
                  {getFeatureIcon(idx)}
                </div>
                <div>
                  <h4 className="text-[21px] font-bold mb-[5px] text-[#262626]">{feat.title}</h4>
                  <p className="text-[17px] font-light text-gray-600 leading-[24px]">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side (Guarantees Block) */}
        <motion.div 
          className="flex-1"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={itemRightVariants}
            className="w-full h-full min-h-[400px] bg-gradient-to-bl from-[var(--brand)] via-[var(--brand-pink)] to-[var(--brand-purple)] rounded-[24px] p-[40px] text-white flex flex-col justify-center shadow-2xl relative overflow-hidden group"
          >
            {/* Glassmorphism subtle overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
            
            {/* Shimmer animation for premium feel */}
            <div className="absolute inset-0 translate-x-[-150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>

            <div className="relative z-10">
              <h3 className="text-[32px] font-bold mb-[30px] flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-white" />
                {content.guarantees.cardTitle}
              </h3>
              
              <ul className="flex flex-col gap-[20px]">
                {content.guarantees.items.map((item: string, idx: number) => (
                  <motion.li 
                    key={idx} 
                    whileHover={{ x: 5 }}
                    className="text-[21px] font-medium flex items-center gap-[15px]"
                  >
                    <CheckCircle2 className="w-7 h-7 text-[var(--brand-pink-light)] drop-shadow-md" />
                    <span className="drop-shadow-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
