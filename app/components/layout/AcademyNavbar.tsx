"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "../../i18n/LangContext";
import { useCountry, COUNTRIES } from "../../i18n/CountryContext";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogIn, User, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "../shared/BookingModal";
import CountryWelcomeModal from "../shared/CountryWelcomeModal";
import { createClient } from "@/utils/supabase/client";
const content = {
  ar: {
    brand: "مَجْد",
    login: "تسجيل الدخول",
    freeLesson: "حصة مجانية",
    langLabel: "AR",
    otherLangLabel: "EN",
    nav: [
      { label: "تعلّم العربية", href: "/ar/learn-arabic" },
    ],
    stages: {
      label: "المراحل الدراسية",
      items: [
        { label: "مرحلة الروضة", href: "/ar/grade/kg-1/arabic" },
        { label: "المرحلة الابتدائية", href: "/ar/grade/grade-1/arabic" },
        { label: "المرحلة الإعدادية", href: "/ar/grade/grade-6/arabic" },
        { label: "المرحلة الثانوية", href: "/ar/grade/grade-10/arabic" },
      ],
    },
    packagesLabel: "الباقات",
    about: {
      label: "عن مَجْد",
      items: [
        { label: "من نحن", href: "/ar/about" },
        { label: "الأسئلة الشائعة", href: "/ar#faq" },
        { label: "آراء أولياء الأمور", href: "/ar#testimonials" },
        { label: "ضماناتنا", href: "/ar#guarantees" },
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
      { label: "Learn Arabic", href: "/en/learn-arabic" },
    ],
    stages: {
      label: "Grade Levels",
      items: [
        { label: "Kindergarten", href: "/en/grade/kg-1/arabic" },
        { label: "Primary", href: "/en/grade/grade-1/arabic" },
        { label: "Middle School", href: "/en/grade/grade-6/arabic" },
        { label: "High School", href: "/en/grade/grade-10/arabic" },
      ],
    },
    packagesLabel: "Packages",
    about: {
      label: "About Majd",
      items: [
        { label: "Who We Are", href: "/en/about" },
        { label: "FAQ", href: "/en#faq" },
        { label: "Parent Reviews", href: "/en#testimonials" },
        { label: "Our Guarantees", href: "/en#guarantees" },
      ],
    },
  },
};

export default function AcademyNavbar({ 
  transparentLogo,
  navTheme = "dark"
}: { 
  transparentLogo?: string;
  navTheme?: "dark" | "light" | "gray";
} = {}) {
  const { lang, setLang } = useLang();
  const c = content[lang as keyof typeof content] || content.ar;
  const isArabic = lang === "ar";
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/" || pathname === "/ar" || pathname === "/en";
  const isCurriculums = pathname.includes("/curriculums");
  const isGradePage = pathname.includes("/grade/");
  const isLearnArabic = pathname.includes("/learn-arabic");

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [stagesOpen, setStagesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileStagesOpen, setMobileStagesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { country, setCountry, activeCountry } = useCountry();
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryModalStep, setCountryModalStep] = useState<1 | 2>(2);
  const aboutRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserDropdownOpen(false);
    router.push(`/${lang}/login`);
    router.refresh();
  };
  
  const useWhiteText = false;

  const getNavTextColor = () => {
    if (isScrolled) return "text-[#262626]/80 hover:bg-[#262626]/5 hover:text-[#262626]";
    if (navTheme === "gray") return "text-gray-100 hover:bg-white/10 hover:text-white";
    if (navTheme === "light" || useWhiteText) return "text-white/90 hover:bg-white/10 hover:text-white";
    return "text-[#262626]/80 hover:bg-[#262626]/5 hover:text-[#262626]";
  };

  const getNavBtnColor = () => {
    if (isScrolled) return "text-[#262626] hover:bg-[#262626]/5";
    if (navTheme === "gray" || navTheme === "light" || useWhiteText) return "text-white hover:bg-white/10";
    return "text-[#262626] hover:bg-[#262626]/5";
  };

  useEffect(() => {
    const hasCountryInUrl = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("country");
    if ((isHome || isCurriculums || isGradePage) && !hasCountryInUrl) {
      setCountryModalStep(isHome ? 1 : 2);
      setIsCountryModalOpen(true);
    }
  }, [isHome, isCurriculums, isGradePage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("booking") === "true") {
        setIsModalOpen(true);
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("booking");
        window.history.replaceState({}, "", newUrl.toString());
      }
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
      if (stagesRef.current && !stagesRef.current.contains(e.target as Node)) {
        setStagesOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        role="banner"
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
                isScrolled ? "h-[60px] sm:h-[64px] md:h-[72px] w-12 sm:w-12" : "h-[72px] sm:h-[76px] md:h-[88px] w-24 sm:w-28 md:w-32"
              }`}>
                <img
                  src={transparentLogo || "/majd.png"}
                  alt="مَجْد"
                  className={`absolute object-contain transition-all duration-500 ease-in-out w-auto ${
                    isScrolled ? "opacity-0 scale-75 h-0" : "opacity-100 scale-100 h-[64px] sm:h-[78px] md:h-[94px]"
                  } ${useWhiteText && !transparentLogo ? "brightness-0 invert" : ""}`}
                />
                <img
                  src="/majdlogo.png"
                  alt="مَجْد"
                  className={`absolute object-contain transition-all duration-500 ease-in-out h-[38px] sm:h-10 w-auto ${
                    isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {/* Stages Dropdown */}
              <div ref={stagesRef} className="relative">
                <button
                  onClick={() => setStagesOpen(!stagesOpen)}
                  aria-expanded={stagesOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium transition-all duration-200 whitespace-nowrap ${getNavTextColor()}`}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {c.stages.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${stagesOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {stagesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      role="menu"
                      className="absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px]"
                      style={{ [isArabic ? "right" : "left"]: 0 }}
                    >
                      {c.stages.items.map((item: any, i: number) => (
                        <a
                          key={i}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setStagesOpen(false)}
                          className="block px-5 py-3 text-[15px] font-medium text-[#262626]/90 hover:bg-[#262626]/5 hover:text-[#262626] transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Packages Button */}
              <button
                onClick={() => {
                  if (isCurriculums || isLearnArabic) {
                    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
                  } else if (isHome) {
                    setCountryModalStep(1);
                    setIsCountryModalOpen(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className={`inline-flex items-center rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium transition-all duration-200 whitespace-nowrap ${getNavTextColor()}`}
                style={{ letterSpacing: "-0.01em" }}
              >
                {c.packagesLabel}
              </button>

              {/* Other Nav Links */}
              {c.nav.map((item: any, i: number) => (
                <a
                  key={i}
                  href={item.href}
                  className={`inline-flex items-center rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium transition-all duration-200 whitespace-nowrap ${getNavTextColor()}`}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item.label}
                </a>
              ))}

              {/* About Dropdown */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  aria-expanded={aboutOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium transition-all duration-200 whitespace-nowrap ${getNavTextColor()}`}
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
                      role="menu"
                      className="absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[200px]"
                      style={{ [isArabic ? "right" : "left"]: 0 }}
                    >
                      {c.about.items.map((item: any, i: number) => (
                        <a
                          key={i}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setAboutOpen(false)}
                          className="block px-5 py-3 text-[15px] font-medium text-[#262626]/90 hover:bg-[#262626]/5 hover:text-[#262626] transition-colors"
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
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className={`inline-flex items-center justify-center rounded-full text-[15px] font-medium transition-all duration-200 ${getNavBtnColor()}`}
              style={{ height: "40px", padding: "0 14px" }}
            >
              {c.otherLangLabel}
            </button>

            {/* Country Selector */}
            {!isLearnArabic && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setCountryModalStep(isHome ? 1 : 2);
                    setIsCountryModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center rounded-full transition-all duration-300 gap-2.5 bg-white text-[#262626] border border-[#262626]/20 hover:bg-[#262626] hover:text-white shadow-sm"
                  style={{
                    height: "48px",
                    padding: "0 20px",
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    lineHeight: "20px" }}
                >
                  <span className="hidden lg:inline-block">
                    {lang === "ar" ? "اختر الدولة" : "Country"}
                  </span>
                  {activeCountry.flag === "un" ? "🌍" : (
                    <img src={`https://flagcdn.com/w40/${activeCountry.flag}.png`} alt="" className="w-7 h-5 object-cover rounded shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                  )}
                </button>
              </div>
            )}

            {/* User Dropdown / Login */}
            {isAuthLoading ? (
              <div className="hidden sm:block w-[110px] h-[40px] bg-black/5 rounded-full animate-pulse border border-transparent"></div>
            ) : user ? (
              <div ref={userDropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 lg:px-4 py-2.5 text-[15px] lg:text-[18px] font-medium transition-all duration-200 whitespace-nowrap ${getNavTextColor()}`}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{lang === "ar" ? "مَجْد" : "Majd"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-56 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[rgba(38,38,38,0.05)] py-2"
                      style={{ [isArabic ? "left" : "right"]: 0 }}
                    >
                      <Link
                        href={`/${lang}/dashboard`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3.5 text-[15px] font-bold text-[#262626] hover:bg-[#f8f9fa] transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5 text-[rgba(38,38,38,0.5)]" />
                        {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                      </Link>
                      <div className="h-[1px] bg-[rgba(38,38,38,0.05)] my-1 mx-4"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-[15px] font-bold text-red-500 hover:bg-red-50 transition-colors text-start"
                      >
                        <LogOut className="w-5 h-5" />
                        {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 shadow-sm"
                style={{
                  height: "48px",
                  padding: "0 24px",
                  fontSize: "16px",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  lineHeight: "20px" }}
              >
                {c.login}
                <LogIn className="w-4 h-4 rtl:-scale-x-100 ml-1" />
              </Link>
            )}

            <button
              className={`lg:hidden relative z-50 p-2 rounded-lg ${useWhiteText ? "text-white" : "text-[#262626]"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-panel"
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
            id="mobile-menu-panel"
            role="navigation"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-[90] bg-white pt-[80px] px-6 lg:hidden flex flex-col overflow-y-auto"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div className="flex flex-col gap-2 mt-4">
              {/* Mobile Stages Dropdown */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileStagesOpen(!mobileStagesOpen)}
                  className="w-full flex items-center justify-between text-[17px] font-medium text-[#262626] py-3"
                >
                  {c.stages.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileStagesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileStagesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 flex flex-col gap-1">
                        {c.stages.items.map((item: any, i: number) => (
                          <a
                            key={i}
                            href={item.href}
                            onClick={() => { setMobileMenuOpen(false); setMobileStagesOpen(false); }}
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

              {/* Mobile Packages Button */}
              <button
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  if (isCurriculums || isLearnArabic) {
                    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
                  } else if (isHome) {
                    setCountryModalStep(1);
                    setIsCountryModalOpen(true); 
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="text-[17px] font-medium text-[#262626] py-3 border-b border-gray-100 text-start"
              >
                {c.packagesLabel}
              </button>

              {/* Other Nav Links */}
              {c.nav.map((item: any, i: number) => (
                <a
                  key={i}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[17px] font-medium text-[#262626] py-3 border-b border-gray-100"
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile Country Selector (moved up) */}
              {!isLearnArabic && (
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCountryModalStep(isHome ? 1 : 2);
                      setIsCountryModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between text-[17px] font-medium text-[#262626] py-3"
                  >
                    <div className="flex items-center gap-2">
                      {activeCountry.flag === "un" ? <span className="leading-none">🌍</span> : (
                        <img src={`https://flagcdn.com/w20/${activeCountry.flag}.png`} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
                      )}
                      {lang === "ar" ? "تغيير الدولة" : "Change Country"}
                    </div>
                  </button>
                </div>
              )}

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
                        {c.about.items.map((item: any, i: number) => (
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
                {isAuthLoading ? (
                  <div className="w-full h-[52px] bg-black/5 rounded-[20px] animate-pulse"></div>
                ) : user ? (
                  <>
                    <Link
                      href={`/${lang}/dashboard`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[20px] text-[16px] font-bold bg-[#fdf2f8] text-[#ef5da8] active:scale-95 transition-transform"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[20px] text-[16px] font-bold text-red-500 border border-red-100 bg-red-50 active:scale-95 transition-transform"
                    >
                      <LogOut className="w-5 h-5" />
                      {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${lang}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 rounded-full text-[16px] font-bold border border-[#262626]/20 text-[#262626] active:scale-95 transition-transform"
                  >
                    {c.login}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={isLearnArabic ? "learn-arabic" : "default"} />
      <CountryWelcomeModal 
        isOpen={isCountryModalOpen} 
        onClose={() => setIsCountryModalOpen(false)} 
        initialStep={countryModalStep}
      />
    </>
  );
}
