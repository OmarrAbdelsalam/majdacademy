"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLandingContent } from "./useLandingContent";

const stageThemes = [
  {
    bgImage: "https://cdn.kodland.org/main-site-v2/bg-blue.png",
    color: "#498bff",
    tagColors: ["#ef5da8", "#ff763d", "#498bff"],
    kidImage: "/boyy.png",
  },
  {
    bgImage: "https://cdn.kodland.org/main-site-v2/bg-pink.png",
    color: "#ec4899",
    tagColors: ["#ec4899", "#f97316", "#8b5cf6"],
    kidImage: "/boyy.png",
  },
  {
    bgImage: "https://cdn.kodland.org/main-site-v2/bg-orange.png",
    color: "#f97316",
    tagColors: ["#f97316", "#ef5da8", "#498bff"],
    kidImage: "/boyy.png",
  },
];

export default function StatsAndPathsSection() {
  const content = useLandingContent();
  const [activeTab, setActiveTab] = useState(0);
  const currentTheme = stageThemes[activeTab >= 0 ? activeTab : 0];
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);

  const measureHeights = useCallback(() => {
    const newHeights = contentRefs.current.map((ref) => {
      if (!ref) return 0;
      return ref.scrollHeight;
    });
    setHeights(newHeights);
  }, []);

  useEffect(() => {
    measureHeights();
  }, [measureHeights]);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">

        {/* Stats Row */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "140%",
              color: "#262626" }}
          >
            {content.stats.line1pre} <span className="inline-block px-2 py-0.5 rounded-lg text-white" style={{ background: "#498bff" }}>{content.stats.line1num}</span>{" "}
            {content.stats.line1post.split(" ").map((word, i) => (
              <React.Fragment key={i}>
                <span className={word === "ناجح" || word === "successful" ? "hidden sm:inline" : ""}>{word}</span>
                {i < content.stats.line1post.split(" ").length - 1 && " "}
              </React.Fragment>
            ))}
            <br />
            <span className="inline-block px-2 py-0.5 rounded-lg text-white" style={{ background: "#ef5da8" }}>{content.stats.line2num}</span> {content.stats.line2post} <span className="hidden sm:inline-block w-px h-8 bg-gray-300 mx-3 align-middle" /> <span className="block sm:inline-block mt-2 sm:mt-0"><span className="inline-block px-2 py-0.5 rounded-lg text-white" style={{ background: "#ff763d" }}>{content.stats.line3num}</span> {content.stats.line3post}</span>
          </h2>
        </div>

        {/* Paths Section — Dynamic color card */}
        <div
          className="rounded-3xl overflow-hidden relative transition-all duration-500"
          style={{
            backgroundImage: `url('${currentTheme.bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center" }}
        >
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Left side — Accordion */}
            <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3
                  style={{
                    fontSize: "clamp(22px, 3vw, 28px)",
                    fontWeight: 700,
                    color: "#262626",
                    lineHeight: "130%",
                    marginBottom: "20px",
                    whiteSpace: "pre-line" }}
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
                          className="font-extrabold transition-colors duration-300"
                          style={{
                            fontSize: "22px",
                            color: activeTab === i ? currentTheme.color : "#262626" }}
                        >
                          {path.age}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${activeTab === i ? "rotate-180" : ""}`}
                          fill="none"
                          stroke={activeTab === i ? currentTheme.color : "#262626"}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Content */}
                      <div
                        ref={(el) => { contentRefs.current[i] = el; }}
                        className="overflow-hidden transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0,0,0.2,1)]"
                        style={{
                          maxHeight: activeTab === i ? `${heights[i] || 200}px` : "0px",
                          opacity: activeTab === i ? 1 : 0 }}
                      >
                        <p
                          className="pb-3"
                          style={{
                            fontSize: "15px",
                            fontWeight: 500,
                            lineHeight: "24px",
                            color: "rgba(38,38,38,0.7)" }}
                        >
                          {path.description}
                        </p>
                        <a
                          href="#packages"
                          className="text-[14px] font-bold hover:underline pb-4 inline-block"
                          style={{ color: currentTheme.color }}
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
              {/* Floating pills — glassmorphism style */}
              <div
                className="absolute top-[12%] sm:top-[16%] right-[3%] sm:right-[8%] z-10 text-white font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-[36px] flex items-center gap-2.5 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.tagColors[0]}cc, ${currentTheme.tagColors[0]})`,
                  fontSize: "clamp(16px, 2vw, 20px)",
                  letterSpacing: "-0.02em",
                  lineHeight: "0.95",
                  boxShadow: `0 8px 32px ${currentTheme.tagColors[0]}40, inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)`,
                  border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{content.paths.items[activeTab >= 0 ? activeTab : 0].tags[0]}</span>
              </div>
              <div
                className="absolute top-[45%] sm:top-[50%] right-[0%] sm:right-[3%] z-10 text-white font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-[36px] flex items-center gap-2.5 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.tagColors[1]}cc, ${currentTheme.tagColors[1]})`,
                  fontSize: "clamp(16px, 2vw, 20px)",
                  letterSpacing: "-0.02em",
                  lineHeight: "0.95",
                  boxShadow: `0 8px 32px ${currentTheme.tagColors[1]}40, inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)`,
                  border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>{content.paths.items[activeTab >= 0 ? activeTab : 0].tags[1]}</span>
              </div>
              <div
                className="absolute bottom-[12%] sm:bottom-[18%] left-[5%] sm:left-[12%] z-10 text-white font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-[36px] flex items-center gap-2.5 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.tagColors[2]}cc, ${currentTheme.tagColors[2]})`,
                  fontSize: "clamp(16px, 2vw, 20px)",
                  letterSpacing: "-0.02em",
                  lineHeight: "0.95",
                  boxShadow: `0 8px 32px ${currentTheme.tagColors[2]}40, inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)`,
                  border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-1.988-.832l-.548-.547z"/></svg>
                <span>{content.paths.items[activeTab >= 0 ? activeTab : 0].tags[2]}</span>
              </div>

              {/* Kid image */}
              <img
                src={currentTheme.kidImage}
                alt=""
                className="relative z-0 h-[280px] sm:h-[350px] md:h-[480px] w-auto object-contain object-bottom transition-opacity duration-500"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
