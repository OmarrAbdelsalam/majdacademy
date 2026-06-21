"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLandingContent } from "./useLandingContent";

export default function StudentTestimonials() {
  const content = useLandingContent();
  const [activeId, setActiveId] = useState(2);
  const activeItem = content.testimonials.items[activeId];
  const sideItems = content.testimonials.items.filter((_, i) => i !== activeId);

  return (
    <section id="testimonials" className="py-8 md:py-12 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 text-center mb-8 md:mb-12">
        <p className="text-[14px] font-medium mb-3" style={{ color: "rgba(38,38,38,0.5)" }}>
          {content.testimonials.subtitle}
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: "120%",
            color: "#262626" }}
        >
          {content.testimonials.title}{" "}{content.testimonials.titleHighlight}
        </h2>
      </div>

      {/* Grid of cards */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {[
            "media__1781178101489.png",
            "media__1781178107598.png",
            "media__1781178113328.png",
            "media__1781178123601.png"
          ].map((filename, i) => (
            <div
              key={i}
              className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative group border border-gray-100 bg-[#f8f8f8]"
            >
              <img 
                src={`/testimonials/${filename}`} 
                alt={`WhatsApp Review ${i + 1}`} 
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-12">
        <a
          href="#packages"
          className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
          style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 700 }}
        >
          {content.testimonials.cta}
        </a>
      </div>
    </section>
  );
}
