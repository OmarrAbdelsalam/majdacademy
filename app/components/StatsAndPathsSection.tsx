"use client";
import React, { useState } from "react";
import { useLandingContent } from "./useLandingContent";

export default function StatsAndPathsSection() {
  const content = useLandingContent();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">

        {/* Stats Row */}
        <div className="text-center mb-20">
          <h2
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "140%",
              color: "#262626",
            }}
          >
            {content.stats.line1pre} <span className="inline-block px-2 py-0.5 rounded-lg text-white" style={{ background: "#498bff" }}>{content.stats.line1num}</span> {content.stats.line1post}
            <br />
            <span className="inline-block px-2 py-0.5 rounded-lg text-white" style={{ background: "#ef5da8" }}>{content.stats.line2num}</span> {content.stats.line2post} <span className="hidden sm:inline-block w-px h-8 bg-gray-300 mx-3 align-middle" /> <span className="block sm:inline-block mt-2 sm:mt-0"><span className="inline-block px-2 py-0.5 rounded-lg text-white" style={{ background: "#ff763d" }}>{content.stats.line3num}</span> {content.stats.line3post}</span>
          </h2>
        </div>

        {/* Paths Section — Blue card */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{
            backgroundImage: "url('https://cdn.kodland.org/main-site-v2/bg-blue.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Left side — Accordion */}
            <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: "clamp(22px, 3vw, 28px)",
                    fontWeight: 700,
                    color: "#262626",
                    lineHeight: "130%",
                    marginBottom: "20px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {content.paths.title}
                </h3>

                {/* Tabs */}
                <div className="flex flex-col gap-1">
                  {content.paths.items.map((path, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setActiveTab(activeTab === i ? -1 : i)}
                        className="w-full flex items-center justify-between py-3 text-right"
                      >
                        <span
                          className="font-extrabold"
                          style={{
                            fontSize: "22px",
                            color: activeTab === i ? "#498bff" : "#262626",
                          }}
                        >
                          {path.age}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${activeTab === i ? "rotate-180" : ""}`}
                          fill="none"
                          stroke={activeTab === i ? "#498bff" : "#262626"}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Content */}
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight: activeTab === i ? "200px" : "0px",
                          opacity: activeTab === i ? 1 : 0,
                        }}
                      >
                        <p
                          className="pb-3"
                          style={{
                            fontSize: "15px",
                            fontWeight: 500,
                            lineHeight: "24px",
                            color: "rgba(38,38,38,0.7)",
                          }}
                        >
                          {path.description}
                        </p>
                        <a
                          href="#packages"
                          className="text-[14px] font-bold text-[#498bff] hover:underline"
                        >
                          {content.paths.link}
                        </a>
                      </div>

                      {i < content.paths.items.length - 1 && <div className="border-b border-gray-100" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side — Kid image + floating tags */}
            <div className="w-full md:w-[55%] relative flex items-end justify-center min-h-[300px] md:min-h-0">
              {/* Floating tags */}
              <div className="absolute top-[15%] sm:top-[20%] right-[5%] sm:right-[10%] z-10 bg-[#ef5da8] text-white text-[11px] sm:text-[13px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md flex items-center gap-1.5">
                <span>⏱</span> {content.paths.items[activeTab >= 0 ? activeTab : 0].tags[0]}
              </div>
              <div className="absolute top-[45%] sm:top-[50%] right-[2%] sm:right-[5%] z-10 bg-[#ff763d] text-white text-[11px] sm:text-[13px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md flex items-center gap-1.5">
                <span>👥</span> {content.paths.items[activeTab >= 0 ? activeTab : 0].tags[1]}
              </div>
              <div className="absolute bottom-[10%] sm:bottom-[15%] left-[10%] sm:left-[15%] z-10 bg-[#498bff] text-white text-[11px] sm:text-[13px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md flex items-center gap-1.5">
                <span>💡</span> {content.paths.items[activeTab >= 0 ? activeTab : 0].tags[2]}
              </div>

              {/* Kid image */}
              <img
                src="https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp"
                alt=""
                className="relative z-0 h-[280px] sm:h-[350px] md:h-[480px] w-auto object-contain object-bottom"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
