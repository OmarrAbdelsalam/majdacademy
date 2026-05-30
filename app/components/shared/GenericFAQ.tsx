"use client";
import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface GenericFAQProps {
  title: string;
  subtitle: string;
  items: FAQItem[];
  ctaText: string;
  whatsappLink?: string;
  isRTL?: boolean;
}

export default function GenericFAQ({
  title,
  subtitle,
  items,
  ctaText,
  whatsappLink = "https://wa.me/201098505924",
  isRTL = true,
}: GenericFAQProps) {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
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
            {title}
          </h2>
          <p
            className="mt-4 mx-auto"
            style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(38,38,38,0.6)", maxWidth: "550px" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Accordion */}
        <div className="mx-auto max-w-[900px]">
          {items.map((item, index) => {
            const isOpen = openId === index;
            return (
              <div key={index} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => setOpenId(isOpen ? null : index)}
                  className={`w-full flex items-center gap-4 px-2 py-6 md:py-7 group ${isRTL ? "text-right" : "text-left"}`}
                >
                  <span
                    className="text-[14px] font-bold flex-shrink-0 w-8 text-center transition-colors duration-300"
                    style={{ color: isOpen ? "#ef5da8" : "rgba(38,38,38,0.3)" }}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className="flex-1 font-bold text-[17px] md:text-[18px] leading-relaxed transition-colors duration-300"
                    style={{ color: isOpen ? "#262626" : "rgba(38,38,38,0.8)" }}
                  >
                    {item.question}
                  </span>
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: isOpen ? "#d3ff5f" : "transparent" }}
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#262626" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{ maxHeight: isOpen ? "250px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <div className={`${isRTL ? "pr-12" : "pl-12"} pb-6`}>
                    <p className="leading-[1.9]" style={{ fontSize: "16px", fontWeight: 500, color: "rgba(38,38,38,0.6)" }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#262626]/10 px-7 py-3.5 text-[15px] font-bold text-[#262626] hover:border-[#262626] hover:bg-[#262626] hover:text-white transition-all duration-300"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            <span>{ctaText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
