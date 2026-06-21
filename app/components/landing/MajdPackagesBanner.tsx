"use client";
import React, { useState } from "react";
import Image from "next/image";
import BookingModal from "../shared/BookingModal";
import { ArrowLeft } from "lucide-react";

export default function MajdPackagesBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-white" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Banner Container */}
        <div className="relative w-full rounded-[32px] overflow-hidden p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_20px_50px_rgba(246,66,140,0.25)] border border-white/10 group">
          
          {/* Pure SVG background with custom hero-themed pink gradients and waves */}
          <div className="absolute inset-0 z-0">
            <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                {/* Base Gradient */}
                <linearGradient id="bannerBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8347d" />
                  <stop offset="60%" stopColor="#f6428c" />
                  <stop offset="100%" stopColor="#ff66a3" />
                </linearGradient>
                {/* Wave 1 Gradient */}
                <linearGradient id="bannerWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                {/* Wave 2 Gradient */}
                <linearGradient id="bannerWaveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Base Color Fill */}
              <rect width="1000" height="300" fill="url(#bannerBaseGrad)" />
              
              {/* Smooth middle diagonal wave */}
              <path d="M0,140 C300,80 700,240 1000,110 L1000,300 L0,300 Z" fill="url(#bannerWaveGrad1)" />
              
              {/* Bottom subtle wave overlay */}
              <path d="M0,230 C350,290 650,180 1000,250 L1000,300 L0,300 Z" fill="url(#bannerWaveGrad2)" />
            </svg>
          </div>

          {/* Text Content Column */}
          <div className="w-full md:w-7/12 flex flex-col items-start text-right relative z-10 text-white">
            
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-5 drop-shadow-sm">
              باقات مجد المميزة
            </h2>
            
            {/* Description */}
            <p className="text-[14px] sm:text-base md:text-lg leading-relaxed text-white/95 mb-8 font-medium max-w-xl drop-shadow-sm">
              استثمر في مستقبلك التعليمي من خلال الوصول إلى أفضل الباقات الدراسية. باقاتنا توفر لك تغطية شاملة للمناهج مع دعم مستمر لضمان استيعابك لكافة المفاهيم.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#f6428c] hover:bg-[#fff0f5] rounded-full font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
            >
              عرض جميع الباقات
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>

          </div>

          {/* Image Column (Graduation Mirror Illustration) */}
          <div className="w-full md:w-5/12 flex justify-center items-center relative z-10">
            <div className="relative w-full max-w-[360px] aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/5 group">
              <img
                src="/majd_packages_banner.png"
                alt="باقات مجد المميزة"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#f6428c]/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
