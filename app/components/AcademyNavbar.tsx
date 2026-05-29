"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "../i18n/LangContext";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const content = {
  ar: {
    brand: "مَجْد",
    login: "تسجيل الدخول",
    freeLesson: "حصة مجانية",
    langLabel: "AR",
    otherLangLabel: "EN",
    nav: [
      { label: "المراحل الدراسية", href: "#grades" },
      { label: "الباقات", href: "#packages" },
      { label: "تعلّم العربية", href: "/ar/learn-arabic" },
    ],
    about: {
      label: "عن مَجْد",
      items: [
        { label: "من نحن", href: "#about" },
        { label: "المميزات", href: "#features" },
        { label: "الأسئلة الشائعة", href: "#faq" },
        { label: "آراء أولياء الأمور", href: "#testimonials" },
        { label: "ضماناتنا", href: "#guarantees" },
      ],
    },
  },
  en: {
    brand: "Majd",
    login: "Log in",
    freeLesson: "Free lesson",
    langLabel: "EN",
    otherLangLabel: "AR",
    nav: [
      { label: "Grade Levels", href: "#grades" },
      { label: "Packages", href: "#packages" },
      { label: "Learn Arabic", href: "/en/learn-arabic" },
    ],
    about: {
      label: "About Majd",
      items: [
        { label: "Who We Are", href: "#about" },
        { label: "Features", href: "#features" },
        { label: "FAQ", href: "#faq" },
        { label: "Parent Reviews", href: "#testimonials" },
        { label: "Our Guarantees", href: "#guarantees" },
      ],
    },
  },
};

export default function AcademyNavbar() {
  const { lang, setLang } = useLang();
  const c = content[lang as keyof typeof content] || content.ar;
  const isArabic = lang === "ar";

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed z-[100] transition-all duration-500 ease-in-out overflow-visible ${
          isScrolled
            ? "top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 md:left-10 md:right-10 bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] rounded-2xl sm:rounded-full"
            : "top-0 left-0 right-0 bg-transparent"
        }`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className={`flex items-center justify-between mx-auto w-full transition-all duration-500 ${
          isScrolled ? "px-4 sm:px-6 md:px-8 lg:px-12 h-[56px] sm:h-[64px] md:h-[72px]" : "px-4 sm:px-5 md:px-10 lg:px-16 h-[64px] sm:h-[76px] md:h-[88px]"
        }`}>
          {/* Logo + Nav Links */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
            <Link
              href={`/${lang}`}
              className="flex items-center relative z-50 overflow-visible"
            >
              <div className={`relative flex items-center justify-center shrink-0 transition-all duration-500 ${
                isScrolled ? "h-[56px] sm:h-[64px] md:h-[72px] w-10 sm:w-12" : "h-[64px] sm:h-[76px] md:h-[88px] w-20 sm:w-28 md:w-32"
              }`}>
                <img
                  src="/majd.png"
                  alt="مَجْد"
                  className={`absolute object-contain transition-all duration-500 ease-in-out w-auto ${
                    isScrolled ? "opacity-0 scale-75 h-0" : "opacity-100 scale-100 h-[54px] sm:h-[78px] md:h-[94px]"
                  }`}
                />
                <img
                  src="/majdlogo.png"
                  alt="مَجْد"
                  className={`absolute object-contain transition-all duration-500 ease-in-out h-8 sm:h-10 w-auto ${
                    isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {c.nav.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="inline-flex items-center rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium text-[#262626]/70 hover:bg-[#262626]/5 hover:text-[#262626] transition-all duration-200 whitespace-nowrap"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item.label}
                </a>
              ))}

              {/* About Dropdown */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="inline-flex items-center gap-1 rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium text-[#262626]/70 hover:bg-[#262626]/5 hover:text-[#262626] transition-all duration-200 whitespace-nowrap"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {c.about.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px]"
                      style={{ [isArabic ? "right" : "left"]: 0 }}
                    >
                      {c.about.items.map((item, i) => (
                        <a
                          key={i}
                          href={item.href}
                          onClick={() => setAboutOpen(false)}
                          className="block px-5 py-3 text-[15px] font-medium text-[#262626]/80 hover:bg-[#262626]/5 hover:text-[#262626] transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="inline-flex items-center justify-center rounded-full text-[15px] font-medium text-[#262626] hover:bg-[#262626]/5 transition-all duration-200"
              style={{ height: "40px", padding: "0 14px" }}
            >
              {c.otherLangLabel}
            </button>

            <Link
              href={`/${lang}/login`}
              className={`hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full text-[#262626] transition-all duration-300 ${
                isScrolled
                  ? "bg-transparent border border-transparent hover:bg-[#262626]/5"
                  : "bg-white border border-[#262626]/15 hover:bg-[#262626] hover:text-white hover:border-[#262626]"
              }`}
              style={{
                height: "48px",
                padding: "0 24px",
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: "20px",
              }}
            >
              <LogIn className="w-4 h-4" />
              {c.login}
            </Link>

            <Link
              href="#packages"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#262626] text-white hover:bg-[#3a3a3a] hover:scale-[1.02] transition-all duration-300"
              style={{
                height: "48px",
                padding: "0 24px",
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: "20px",
              }}
            >
              {c.freeLesson}
            </Link>

            <button
              className="md:hidden relative z-50 p-2 rounded-lg text-[#262626]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-white pt-[80px] px-6 md:hidden flex flex-col overflow-y-auto"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div className="flex flex-col gap-2 mt-4">
              {c.nav.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[17px] font-medium text-[#262626] py-3 border-b border-gray-100"
                >
                  {item.label}
                </a>
              ))}

              {/* About — expandable on mobile */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="w-full flex items-center justify-between text-[17px] font-medium text-[#262626] py-3"
                >
                  {c.about.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileAboutOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 flex flex-col gap-1">
                        {c.about.items.map((item, i) => (
                          <a
                            key={i}
                            href={item.href}
                            onClick={() => { setMobileMenuOpen(false); setMobileAboutOpen(false); }}
                            className="text-[15px] font-medium text-[#262626]/70 py-2 pr-4 pl-4"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href={`/${lang}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-full text-[16px] font-bold border border-[#262626]/20 text-[#262626] active:scale-95 transition-transform"
                >
                  {c.login}
                </Link>
                <Link
                  href="#packages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3.5 rounded-full text-[16px] font-bold bg-[#262626] text-white active:scale-95 transition-transform"
                >
                  {c.freeLesson}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
