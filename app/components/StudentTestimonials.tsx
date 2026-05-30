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
    <section id="testimonials" className="py-12 md:py-16 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 text-center mb-16">
        <p className="text-[14px] font-medium mb-3" style={{ color: "rgba(38,38,38,0.5)" }}>
          {content.testimonials.subtitle}
        </p>
        <h2
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: "120%",
            color: "#262626",
          }}
        >
          {content.testimonials.title}{" "}
          <span className="relative inline-block">
            <span
              className="absolute z-0 rounded-md"
              style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }}
            />
            <span className="relative z-10">{content.testimonials.titleHighlight}</span>
          </span>
        </h2>
      </div>

      {/* Horizontal row — all cards on same level, full width */}
      <div className="flex flex-col md:flex-row items-stretch gap-3 px-4 sm:px-6 md:px-10 transition-all duration-500">
        {/* Left side cards */}
        {sideItems.slice(0, 2).map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveId(content.testimonials.items.indexOf(item))}
            className="hidden md:flex flex-1 min-w-0 rounded-[32px] p-5 cursor-pointer transition-all duration-500 hover:shadow-lg flex-col border-2 border-transparent hover:border-[#d3ff5f]"
            style={{ background: "#f8f8f8", minHeight: "400px" }}
          >
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
              <span className="text-[#ef5da8] font-bold text-[15px]">
                {item.name.split(" ")[1]?.charAt(0) || "م"}
              </span>
            </div>
            <h4 className="font-bold text-[15px] text-[#262626]" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {item.name}
            </h4>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(38,38,38,0.4)" }}>{item.grade}</p>
            <span className="inline-block self-start text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#d3ff5f] text-[#262626] mt-3">
              {item.subject}
            </span>
            <p className="text-[13px] leading-[22px] mt-3 flex-1" style={{ color: "rgba(38,38,38,0.6)" }}>
              &ldquo;{item.text}&rdquo;
            </p>
          </div>
        ))}

        {/* Center — Featured card (big, takes 3x space) */}
        <div
          className="w-full md:flex-[3] min-w-0 rounded-3xl relative overflow-hidden transition-all duration-500"
          style={{
            backgroundImage: "url('https://cdn.kodland.org/main-site-v2/student-card-open-orange.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "350px",
          }}
        >
          {/* Large quote mark decoration */}
          <div className="absolute top-6 right-8 text-[120px] leading-none font-serif text-white/10 select-none z-0">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0 p-9 md:p-12 flex flex-col justify-center z-10"
            >
              <span className="inline-block self-start text-[13px] font-bold px-4 py-1.5 rounded-full bg-[#d3ff5f] text-[#262626] mb-5">
                {activeItem.subject}
              </span>
              <h3
                className="text-white mb-4"
                style={{ fontFamily: "'Cairo', sans-serif", fontSize: "28px", fontWeight: 700 }}
              >
                {activeItem.name}، {activeItem.grade}
              </h3>
              <p className="text-white/90 text-[18px] leading-[32px] font-medium max-w-[450px]">
                &ldquo;{activeItem.text}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side cards */}
        {sideItems.slice(2, 4).map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveId(content.testimonials.items.indexOf(item))}
            className="hidden md:flex flex-1 min-w-0 rounded-[32px] p-5 cursor-pointer transition-all duration-500 hover:shadow-lg flex-col border-2 border-transparent hover:border-[#d3ff5f]"
            style={{ background: "#f8f8f8", minHeight: "400px" }}
          >
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
              <span className="text-[#ef5da8] font-bold text-[15px]">
                {item.name.split(" ")[1]?.charAt(0) || "م"}
              </span>
            </div>
            <h4 className="font-bold text-[15px] text-[#262626]" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {item.name}
            </h4>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(38,38,38,0.4)" }}>{item.grade}</p>
            <span className="inline-block self-start text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#d3ff5f] text-[#262626] mt-3">
              {item.subject}
            </span>
            <p className="text-[13px] leading-[22px] mt-3 flex-1" style={{ color: "rgba(38,38,38,0.6)" }}>
              &ldquo;{item.text}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-8">
        <a
          href="#packages"
          className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
          style={{ padding: "22px 44px", fontSize: "18px", fontWeight: 500 }}
        >
          {content.testimonials.cta}
        </a>
      </div>
    </section>
  );
}
