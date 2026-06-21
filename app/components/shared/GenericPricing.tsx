"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import BookingModal from "./BookingModal";

export interface PricingPackage {
  title: string;
  description: string;
  price: string;
  period: string | React.ReactNode;
  features: string[];
  featured?: boolean;
}

interface GenericPricingProps {
  subtitle?: string;
  title: string;
  titleHighlight: string;
  packages: PricingPackage[];
  ctaText: string;
  modalVariant?: "default" | "learn-arabic";
  breakHighlight?: boolean;
}

export default function GenericPricing({
  subtitle,
  title,
  titleHighlight,
  packages: pkgs,
  ctaText,
  modalVariant = "default",
  breakHighlight = false,
}: GenericPricingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="packages" className="py-12 md:py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: "120%",
                color: "#262626" }}
            >
              {title}{" "}{breakHighlight && <br />}<span className="text-[#ef5da8]">{titleHighlight}</span>
            </h2>
            {subtitle && (
              <p
                className="mt-4 mx-auto"
                style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(38,38,38,0.6)", maxWidth: "550px" }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Cards Grid */}
          <div className={`grid grid-cols-1 ${pkgs.length > 1 ? 'md:grid-cols-2' : 'max-w-[450px]'} gap-5 md:gap-6 items-stretch max-w-[900px] mx-auto`}>
            {pkgs.map((pkg, index) => {
              const featured = pkg.featured ?? index === 0;
              return (
                <div
                  key={index}
                  className={`rounded-[32px] p-8 md:p-10 flex flex-col transition-transform duration-300 relative overflow-hidden ${
                    featured ? "lg:scale-[1.02]" : ""
                  }`}
                  style={
                    featured
                      ? {
                          boxShadow: "0 20px 50px rgba(246,66,140,0.25)",
                        }
                      : {
                          background: "#f8f9fa",
                          border: "1px solid #f0f0f2",
                        }
                  }
                >
                  {featured && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                        <defs>
                          <linearGradient id={`priceBaseGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e8347d" />
                            <stop offset="60%" stopColor="#f6428c" />
                            <stop offset="100%" stopColor="#ff66a3" />
                          </linearGradient>
                          <linearGradient id={`priceWaveGrad1-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id={`priceWaveGrad2-${index}`} x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <rect width="1000" height="300" fill={`url(#priceBaseGrad-${index})`} />
                        <path d="M0,140 C300,80 700,240 1000,110 L1000,300 L0,300 Z" fill={`url(#priceWaveGrad1-${index})`} />
                        <path d="M0,230 C350,290 650,180 1000,250 L1000,300 L0,300 Z" fill={`url(#priceWaveGrad2-${index})`} />
                      </svg>
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-[22px] md:text-[24px] font-black mb-2" style={{ color: featured ? "#fff" : "#262626" }}>
                      {pkg.title}
                    </h3>
                    <p className="text-[14px] md:text-[15px] font-medium mb-6 leading-relaxed" style={{ color: featured ? "rgba(255,255,255,0.9)" : "rgba(38,38,38,0.7)" }}>
                      {pkg.description}
                    </p>
                    <div className="mb-8">
                      <span className="text-[36px] md:text-[42px] font-black leading-none" style={{ color: featured ? "#fff" : "#262626" }}>
                        {pkg.price}
                      </span>
                      <span className="text-[14px] font-medium mr-2" style={{ color: featured ? "rgba(255,255,255,0.9)" : "rgba(38,38,38,0.6)" }}>
                        {pkg.period}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-4 flex-1">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: featured ? "rgba(255,255,255,0.2)" : "rgba(38,38,38,0.06)" }}
                          >
                            <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: featured ? "#fff" : "#262626" }} />
                          </div>
                          <span className="text-[14px] md:text-[15px] font-medium" style={{ color: featured ? "#fff" : "#262626" }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full mt-8 rounded-[60px] font-bold text-[15px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                      style={{ padding: "20px 40px", background: featured ? "#fff" : "#262626", color: featured ? "#ef5da8" : "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
                    >
                      {ctaText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant} />
    </>
  );
}
