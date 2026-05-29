"use client";
import React from "react";
import { Check } from "lucide-react";
import { useLandingContent } from "./useLandingContent";

export default function PackagesSection() {
  const content = useLandingContent();

  return (
    <section id="packages" className="py-12 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#262626] text-lg font-medium mb-3">
            {content.packages.subtitle}
          </p>
          <h2
            style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#262626" }}
          >
            {content.packages.title}{" "}
            <span className="relative inline-block">
              <span className="absolute z-0 rounded-md" style={{ background: "#ef5da8", inset: "-2px -8px", borderRadius: "8px" }} />
              <span className="relative z-10 text-white">{content.packages.titleHighlight}</span>
            </span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch max-w-[900px] mx-auto">
          {content.packages.items.map((pkg, index) => {
            const featured = index === 0;
            return (
              <div
                key={index}
                className={`rounded-3xl p-8 md:p-10 flex flex-col transition-transform duration-300 ${
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
                {/* Card Title */}
                <h3
                  className="text-[22px] md:text-[24px] font-black mb-2"
                  style={{ color: "#262626" }}
                >
                  {pkg.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[14px] md:text-[15px] font-medium mb-6 leading-relaxed"
                  style={{ color: "rgba(38,38,38,0.7)" }}
                >
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span
                    className="text-[36px] md:text-[42px] font-black leading-none"
                    style={{ color: "#262626" }}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className="text-[14px] font-medium mr-2"
                    style={{ color: "rgba(38,38,38,0.6)" }}
                  >
                    {pkg.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-4 flex-1">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      {/* Checkmark */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: featured ? "rgba(38,38,38,0.1)" : "rgba(38,38,38,0.06)",
                        }}
                      >
                        <Check
                          className="w-3.5 h-3.5"
                          strokeWidth={3}
                          style={{ color: "#262626" }}
                        />
                      </div>

                      {/* Feature text */}
                      <span
                        className="text-[14px] md:text-[15px] font-medium"
                        style={{ color: "#262626" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className="w-full mt-8 py-3.5 rounded-[60px] font-bold text-[15px] transition-all duration-300 hover:-translate-y-0.5"
                  style={
                    featured
                      ? { background: "#262626", color: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }
                      : { background: "#262626", color: "#fff", boxShadow: "0 4px 15px rgba(38,38,38,0.2)" }
                  }
                >
                  {content.packages.cta}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
