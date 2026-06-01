"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import BookingModal from "./BookingModal";

export interface PricingPackage {
  title: string;
  description: string;
  price: string;
  period: string;
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
          <div className="text-center mb-16">
            {subtitle && (
              <p className="text-[#262626] text-lg font-medium mb-3">{subtitle}</p>
            )}
            <h2
              style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#262626" }}
            >
              {title}{" "}
              {breakHighlight && <br />}
              <span className="relative inline-block mt-2">
                <span className="absolute z-0 rounded-md" style={{ background: "#ef5da8", inset: "-2px -8px", borderRadius: "8px" }} />
                <span className="relative z-10 text-white">{titleHighlight}</span>
              </span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch max-w-[900px] mx-auto">
            {pkgs.map((pkg, index) => {
              const featured = pkg.featured ?? index === 0;
              return (
                <div
                  key={index}
                  className={`rounded-[32px] p-8 md:p-10 flex flex-col transition-transform duration-300 ${
                    featured ? "lg:scale-[1.02]" : ""
                  }`}
                  style={
                    featured
                      ? {
                          backgroundImage: "url('https://cdn.kodland.org/main-site-v2/banner.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundColor: "#d3ff5f",
                          boxShadow: "0 20px 50px rgba(211,255,95,0.3)",
                        }
                      : {
                          background: "#f8f9fa",
                          border: "1px solid #f0f0f2",
                        }
                  }
                >
                  <h3 className="text-[22px] md:text-[24px] font-black mb-2" style={{ color: "#262626" }}>
                    {pkg.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] font-medium mb-6 leading-relaxed" style={{ color: "rgba(38,38,38,0.7)" }}>
                    {pkg.description}
                  </p>
                  <div className="mb-8">
                    <span className="text-[36px] md:text-[42px] font-black leading-none" style={{ color: "#262626" }}>
                      {pkg.price}
                    </span>
                    <span className="text-[14px] font-medium mr-2" style={{ color: "rgba(38,38,38,0.6)" }}>
                      {pkg.period}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-4 flex-1">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: featured ? "rgba(38,38,38,0.1)" : "rgba(38,38,38,0.06)" }}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: "#262626" }} />
                        </div>
                        <span className="text-[14px] md:text-[15px] font-medium" style={{ color: "#262626" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-8 rounded-[60px] font-bold text-[15px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                    style={{ padding: "20px 40px", background: "#262626", color: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
                  >
                    {ctaText}
                  </button>
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
