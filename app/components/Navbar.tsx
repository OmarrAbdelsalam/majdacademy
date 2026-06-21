"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "../i18n/LangContext";
import { useCountry, COUNTRIES } from "../i18n/CountryContext";
import { getProfile } from "../../lib/api";
// import { useCart } from "../cart/CartContext";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

export default function Navbar() {
  const { tr, lang, setLang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/ar";
  const isStaticPage = pathname?.includes("/privacy") || pathname?.includes("/terms");
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const [user, setUser] = useState<{ firstname?: string; lastname?: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { country, setCountry, activeCountry } = useCountry();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [mobileCountryOpen, setMobileCountryOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  const isCompact = scrolled || pathname?.includes("/login") || pathname?.includes("/register") || pathname?.includes("/forgot-password");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = getCookie("gct_token");
    if (token) {
      setIsLoggedIn(true);
      getProfile(lang).then(res => {
        if (res.success && res.data) {
          setUser(res.data);
        }
      }).catch(() => {});
    }
  }, [lang]);

  // Handle outside click for user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = [
    { label: lang === "en" ? "Home" : "الرئيسية", href: isHome ? "#home" : `/${lang}` },
    { label: lang === "en" ? "Products" : "المنتجات", href: isHome ? "#products" : `/${lang}#products` },
    { label: lang === "en" ? "Features" : "المميزات", href: isHome ? "#features" : `/${lang}#features` },
    { label: lang === "en" ? "FAQ" : "الأسئلة الشائعة", href: isHome ? "#faq" : `/${lang}#faq` },
  ];

  const handleLogout = () => {
    document.cookie = "gct_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsLoggedIn(false);
    setUser(null);
    setUserDropdownOpen(false);
    router.push(`/${lang}/login`);
  };

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const userName = user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : (lang === "en" ? "User" : "مستخدم");

  return (
    <>
      <header className={`${isStaticPage ? "absolute" : "fixed"} left-0 right-0 z-50 pointer-events-none will-change-[top,padding] ${
        (isCompact && !isStaticPage && !isAuthPage) ? "top-4 px-4 sm:top-4 sm:px-6" : "top-0 px-0 sm:top-4 sm:px-6"
      }`} style={{ transition: 'top 0.5s ease, padding 0.5s ease' }}>
        <div
          className={`mx-auto pointer-events-auto will-change-[max-width,background-color,box-shadow,border-radius] ${
            (isCompact && !isStaticPage && !isAuthPage) ? "rounded-[32px] lg:rounded-full" : "rounded-none sm:rounded-full"
          } ${
            menuOpen
              ? "max-w-full sm:max-w-[1400px] bg-white ring-1 ring-black/5 shadow-md"
              : (isStaticPage || isAuthPage)
              ? "max-w-full sm:max-w-[1400px] bg-transparent shadow-none ring-0"
              : isCompact
              ? "max-w-[1200px] bg-white lg:bg-white/95 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 lg:translate-y-1"
              : "max-w-full sm:max-w-[1400px] bg-white lg:bg-transparent backdrop-blur-none lg:backdrop-blur-none shadow-sm lg:shadow-none ring-1 ring-black/5 lg:ring-transparent"
          }`}
          style={{ transition: 'max-width 0.5s ease, background-color 0.5s ease, box-shadow 0.5s ease, border-radius 0.5s ease' }}
        >

          <div className={`flex items-center justify-between gap-4 lg:gap-6 transition-all duration-500 ${
            isCompact ? "px-4 sm:px-8 h-[56px] lg:h-[80px]" : "px-4 sm:px-10 h-[60px] lg:h-[100px]"
          }`}>
            {/* Logo */}
            <Link href={`/${lang}`} className="flex items-center gap-1 shrink-0 group ml-1 transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="relative shrink-0">
                <Image
                  src="/majd.png"
                  alt="Majd"
                  width={100}
                  height={100}
                  className={`object-contain transition-all duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                    isCompact ? "opacity-0 scale-75 h-0 w-0" : "opacity-100 scale-100 h-14 sm:h-16 lg:h-[72px] w-14 sm:w-16 lg:w-[72px]"
                  }`}
                  priority
                />
                <Image
                  src="/logo.png"
                  alt="Golden Circle"
                  width={80}
                  height={80}
                  className={`object-contain transition-all duration-500 ${
                    isCompact ? "opacity-100 scale-100 h-12 sm:h-14 lg:h-16 w-12 sm:w-14 lg:w-16" : "opacity-0 scale-75 h-0 w-0"
                  }`}
                  priority
                />
              </div>
              <span className={`${isCompact ? "text-[13.5px] sm:text-[14px] text-[#1a1a1a]" : "text-[15px] sm:text-[18px] text-white"} lg:text-[20px] transition-all duration-300 font-bold tracking-[0.1em] uppercase leading-none mt-1 lg:-mt-1 relative translate-y-[2px] sm:translate-y-[2.5px] lg:translate-y-[3.5px] whitespace-nowrap shrink-0`}>
                GCT FOR GOLD TRADE
              </span>
            </Link>

            {/* Desktop navigation links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (isHome && item.href.includes("#")) {
                      e.preventDefault();
                      const targetId = item.href.split("#")[1];
                      const element = document.getElementById(targetId);
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }
                  }}
                  className={`text-[15px] ${isCompact ? "text-[#1a1a1a]/70 hover:text-[#1a1a1a]" : "text-white/90 hover:text-white"} transition-all duration-300 font-semibold tracking-wide relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C9A84C] after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-5">
              {/* Country Selector */}
              <div className="relative" ref={countryDropdownRef}>
                <button
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className={`flex items-center gap-1.5 text-[15px] font-semibold ${isCompact ? "text-[#1a1a1a]/70 hover:text-[#1a1a1a]" : "text-white/90 hover:text-white"} transition-colors duration-300 cursor-pointer`}
                >
                  {activeCountry.flag === "un" ? "🌍" : (
                    <img src={`https://flagcdn.com/w20/${activeCountry.flag}.png`} alt={activeCountry.labelAr} className="w-4 h-3 object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                  )}
                  <span className="uppercase">{activeCountry.id === "other" ? "USD" : activeCountry.id}</span>
                </button>
                
                {countryDropdownOpen && (
                  <div className={`absolute top-full mt-2 ${lang === 'ar' ? 'left-0' : 'right-0'} w-[200px] bg-white rounded-2xl shadow-xl border border-[#f0f0f0] overflow-hidden py-1.5 z-[100]`}>
                    {COUNTRIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCountry(c.id);
                          setCountryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold transition-colors ${activeCountry.id === c.id ? 'bg-[#f7f7f7] text-[#C9A84C]' : 'text-[#1a1a1a] hover:bg-[#f7f7f7]'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          {c.flag === "un" ? <span className="text-[16px] leading-none">🌍</span> : (
                            <img src={`https://flagcdn.com/w20/${c.flag}.png`} alt="" className="w-5 h-3.5 object-cover rounded-[2px] shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                          )}
                          <span>{lang === "ar" ? c.labelAr : c.labelEn}</span>
                        </div>
                        <span className="text-[10px] text-[#888] font-bold">{c.currencyEn}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="w-[1px] h-4 bg-black/10 mx-1"></span>

              {/* Language switcher */}
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className={`flex items-center gap-1.5 text-[15px] font-semibold ${isCompact ? "text-[#1a1a1a]/70 hover:text-[#1a1a1a]" : "text-white/90 hover:text-white"} transition-colors duration-300 cursor-pointer`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
                {lang === "en" ? "AR" : "EN"}
              </button>

              <span className="w-[1px] h-4 bg-black/10 mx-1"></span>

              {/* Cart icon */}
              <CartIcon lang={lang} isWhite={!isCompact} />

              {/* Authentication Button/Menu */}
              {isLoggedIn ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 text-[13px] font-semibold ${isCompact ? "text-[#1a1a1a] hover:bg-gray-50" : "text-white hover:bg-white/10"} bg-transparent rounded-full transition-colors outline-none focus:outline-none`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-sm">
                      {userName.charAt(0)}
                    </div>
                    <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${scrolled ? 'max-w-0 opacity-0' : 'max-w-[100px] opacity-100'}`}>{userName.split(" ")[0]}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${userDropdownOpen ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {userDropdownOpen && (
                    <div className={`absolute top-full mt-2 ${lang === 'ar' ? 'left-0' : 'right-0'} w-[180px] bg-white rounded-2xl shadow-xl border border-[#f0f0f0] overflow-hidden py-1.5 z-[100]`}>
                      <Link
                        href={`/${lang}/dashboard/wallet`}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 14a1 1 0 100 2 1 1 0 000-2z"/></svg>
                        {lang === "en" ? "Dashboard" : "لوحة التحكم"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors border-t border-[#f5f5f5]"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        {lang === "en" ? "Logout" : "تسجيل الخروج"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  className={`flex items-center gap-2 px-8 py-3.5 text-[14px] font-bold rounded-full transition-all duration-300 shadow-md group ml-2 ${isCompact ? "text-white bg-[#1a1a1a] hover:bg-black" : "text-[#f04da1] bg-white hover:bg-gray-50"}`}
                >
                  {lang === "en" ? "Login" : "تسجيل الدخول"}
                </Link>
              )}
            </div>

            {/* Mobile cart + burger */}
            <div className="lg:hidden flex items-center gap-2">
              <CartIcon lang={lang} isWhite={!isCompact} />
              <button
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f5f5f5]/80 transition-colors mr-1"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <div className="w-[18px] h-[14px] flex flex-col justify-between">
                  <span
                    className={`block h-[1.5px] ${isCompact ? "bg-[#333]" : "bg-white"} rounded-full transition-all duration-300 origin-center ${
                      menuOpen ? "rotate-45 translate-y-[6px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-[1.5px] ${isCompact ? "bg-[#333]" : "bg-white"} rounded-full transition-all duration-300 ${
                      menuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-[1.5px] ${isCompact ? "bg-[#333]" : "bg-white"} rounded-full transition-all duration-300 origin-center ${
                      menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`lg:hidden overflow-hidden ${
              menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ transition: 'max-height 0.25s ease, opacity 0.2s ease' }}
          >
            <div className="border-t border-[#f0f0f0]/60 px-5 py-5 flex flex-col gap-1">
              {isLoggedIn && (
                <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-[#f9f9f9] rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-white font-bold text-[14px]">
                    {userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1a1a1a]">{userName}</p>
                    <p className="text-[12px] text-[#888]">{lang === 'en' ? 'Welcome back' : 'مرحباً بك مجدداً'}</p>
                  </div>
                </div>
              )}

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (isHome && item.href.includes("#")) {
                      e.preventDefault();
                      const targetId = item.href.split("#")[1];
                      setTimeout(() => {
                        const element = document.getElementById(targetId);
                        if (element) {
                          const y = element.getBoundingClientRect().top + window.scrollY - 80;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }, 100);
                    }
                    setActiveSection(item.href);
                  }}
                  className={`flex items-center px-4 py-3 rounded-2xl text-[16px] font-medium ${
                    activeSection === item.href ? "text-[#1a1a1a] font-bold" : "text-[#888]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-4 mt-3 border-t border-[#f0f0f0]/60">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={`/${lang}/dashboard/wallet`}
                      onClick={() => setMenuOpen(false)}
                      className="w-full py-3 flex items-center justify-center gap-2 text-[15px] font-semibold text-white bg-[#1a1a1a] rounded-2xl shadow-lg"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 14a1 1 0 100 2 1 1 0 000-2z"/></svg>
                      {lang === "en" ? "Go to Dashboard" : "الذهاب إلى لوحة التحكم"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 flex items-center justify-center gap-2 text-[15px] font-semibold text-red-500 bg-red-50 rounded-2xl"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      {lang === "en" ? "Logout" : "تسجيل الخروج"}
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${lang}/login`}
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-3 flex items-center justify-center gap-1.5 text-[15px] font-semibold text-white bg-[#1a1a1a] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                  >
                    {lang === "en" ? "Login" : "تسجيل الدخول"}
                  </Link>
                )}

                {/* Mobile Country Selector */}
                <div className="w-full mt-2">
                  <button
                    onClick={() => setMobileCountryOpen(!mobileCountryOpen)}
                    className="w-full py-2.5 rounded-2xl border border-[#e0e0e0] text-[15px] font-medium text-[#555] flex items-center justify-center gap-2"
                  >
                    {activeCountry.flag === "un" ? <span className="leading-none">🌍</span> : (
                      <img src={`https://flagcdn.com/w20/${activeCountry.flag}.png`} alt="" className="w-4 h-3 object-cover rounded-sm" />
                    )}
                    {lang === "ar" ? activeCountry.labelAr : activeCountry.labelEn}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${mobileCountryOpen ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  {mobileCountryOpen && (
                    <div className="mt-2 flex flex-col gap-1 border border-[#f0f0f0] rounded-2xl p-2 bg-[#f9f9f9]">
                      {COUNTRIES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setCountry(c.id);
                            setMobileCountryOpen(false);
                            // don't close the whole menu so they can see it changed, or close it:
                            setMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-[14px] transition-colors ${activeCountry.id === c.id ? 'bg-white shadow-sm font-bold text-[#C9A84C]' : 'text-[#555]'}`}
                        >
                          <div className="flex items-center gap-2">
                            {c.flag === "un" ? <span className="leading-none">🌍</span> : (
                              <img src={`https://flagcdn.com/w20/${c.flag}.png`} alt="" className="w-4 h-3 object-cover rounded-sm" />
                            )}
                            <span>{lang === "ar" ? c.labelAr : c.labelEn}</span>
                          </div>
                          <span className="text-[11px] text-[#888]">{c.currencyEn}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setLang(lang === "en" ? "ar" : "en");
                    setMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl border border-[#e0e0e0] text-[15px] font-medium text-[#555] flex items-center justify-center gap-2 mt-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                  </svg>
                  {lang === "en" ? "العربية" : "English"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        style={{ top: "68px", transition: 'opacity 0.2s ease' }}
      />
    </>
  );
}

function CartIcon({ lang, isWhite }: { lang: string, isWhite?: boolean }) {
  // const { totalItems } = useCart();
  const totalItems = 0;
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const handleBump = () => {
      setBump(true);
      setTimeout(() => setBump(false), 500);
    };
    window.addEventListener("cart-bump", handleBump);
    return () => window.removeEventListener("cart-bump", handleBump);
  }, []);

  return (
    <Link
      href={`/${lang}/cart`}
      className={`relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f5f5]/80 transition-all duration-300 ${bump ? "scale-125 -translate-y-1 drop-shadow-md text-[#C9A84C]" : ""}`}
      aria-label="Cart"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={bump ? "#C9A84C" : isWhite ? "#ffffff" : "#1a1a1a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      {totalItems > 0 && (
        <span className={`absolute -top-0.5 -end-0.5 min-w-[16px] h-[16px] rounded-full bg-[#C9A84C] flex items-center justify-center text-[9px] font-extrabold text-white px-0.5 shadow-sm transition-transform duration-300 ${bump ? "scale-110" : ""}`}>
          {totalItems}
        </span>
      )}
    </Link>
  );
}
