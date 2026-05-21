"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "../i18n/LangContext";

export default function Footer() {
  const { isRTL } = useLang();

  const companyLinks = [
    { label: isRTL ? "المنتجات" : "Products", href: "/#products" },
    { label: isRTL ? "المميزات" : "Features", href: "/#features" },
    { label: isRTL ? "الأسئلة الشائعة" : "FAQ", href: "/#faq" },
    { label: isRTL ? "تواصل معنا" : "Contact", href: "/Contactus" },
  ];

  const legalLinks = [
    { label: isRTL ? "سياسة الخصوصية" : "Privacy Policy", href: "/privacy" },
    { label: isRTL ? "الشروط والأحكام" : "Terms of Service", href: "/terms" },
  ];

  const branches = [
    { name: isRTL ? "مصر الجديدة" : "Heliopolis", city: isRTL ? "القاهرة" : "Cairo" },
    { name: isRTL ? "طنطا" : "Tanta", city: isRTL ? "الغربية" : "Gharbia" },
    { name: isRTL ? "شبين الكوم" : "Shebin El Kom", city: isRTL ? "المنوفية" : "Menoufia" },
  ];

  const socials = [
    { name: "WhatsApp", href: "https://wa.me/+201070085406", d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
    { name: "Facebook", href: "https://www.facebook.com/GoldenCircle.eg", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { name: "Instagram", href: "https://www.instagram.com/golden_circle_egypt/", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  ];

  return (
    <footer className="relative bg-black overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>

      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 md:pt-60 pb-10">

        {/* Top: Logo + Nav Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 pb-16">

          {/* Logo Side — spans 5 cols */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <Image 
              src="/logo.png" 
              alt="GCT Gold" 
              width={300} 
              height={120} 
              className="w-[180px] sm:w-[220px] h-auto object-contain mb-6 opacity-90"
              style={{ filter: "brightness(0) invert(1)", WebkitFilter: "brightness(0) invert(1)" }}
            />
            <p className="text-[14px] text-white leading-[1.8] max-w-[340px] mb-8 text-center lg:text-start">
              {isRTL
                ? "وجهتك الموثوقة لشراء الذهب والفضة. منصة مرخصة ومتوافقة مع الشريعة الإسلامية."
                : "Your trusted destination to buy gold & silver. Licensed and fully Sharia-compliant."}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-white hover:text-[#E9C237] hover:border-[#E9C237]/30 transition-all duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns — spans 7 cols */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-8 flex flex-col items-center lg:items-start px-6 lg:px-0">

            {/* Company */}
            <div className="flex flex-col items-start text-start">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">
                {isRTL ? "الشركة" : "Company"}
              </h4>
              <ul className="space-y-4">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14px] text-white hover:text-[#E9C237] transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Branches + Legal */}
            <div className="flex flex-col items-start text-start">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">
                {isRTL ? "فروعنا" : "Branches"}
              </h4>
              <ul className="space-y-4 mb-10">
                {branches.map((b, i) => (
                  <li key={i} className="flex items-center justify-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#E9C237]/40 shrink-0"></span>
                    <span className="text-[14px] text-white">{b.name}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">
                {isRTL ? "قانوني" : "Legal"}
              </h4>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14px] text-white hover:text-[#E9C237] transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reach Us */}
            <div className="flex flex-col items-start text-start">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">
                {isRTL ? "تواصل" : "Reach Us"}
              </h4>
              <div className="space-y-4">
                {/* Phone */}
                <a href="tel:0221247767" className="flex items-center gap-3 text-[14px] text-white hover:text-[#E9C237] transition-colors duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:border-[#E9C237]/30 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 015.06 2h3a2 2 0 012 1.72 12.81 12.81 0 00.63 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7z"/></svg>
                  </div>
                  <span dir="ltr" className="font-medium tracking-wide">02 2124 7767</span>
                </a>
                
                {/* WhatsApp */}
                <a href="https://wa.me/+2001070085406" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[14px] text-white hover:text-[#E9C237] transition-colors duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:border-[#E9C237]/30 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-40 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span dir="ltr" className="font-medium tracking-wide">0107 008 5406</span>
                </a>

                {/* Email */}
                <a href="mailto:Support@golden-circle.net" className="flex items-center gap-3 text-[14px] text-white hover:text-[#E9C237] transition-colors duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:border-[#E9C237]/30 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <span dir="ltr" className="font-medium">Support@golden-circle.net</span>
                </a>

                <p className="text-[13px] text-white pt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E9C237]/20"></span>
                  {isRTL ? "الأحد - الخميس | 11ص - 7م" : "Sun - Thu | 11AM - 7PM"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width GOLDEN CIRCLE brand text */}
      {/* Full-width GOLDEN CIRCLE brand text (DESKTOP) */}
      <div className="hidden sm:block relative z-10 w-full overflow-hidden mt-4 mb-2 px-4 select-none">
        <svg viewBox="0 0 1000 100" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="45%" stopColor="#F5E6A3" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F5E6A3" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1000 0"
                to="1000 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          {/* Static base text so the wording is visible in the dark */}
          <text
            x="500"
            y="78"
            textAnchor="middle"
            className="uppercase"
            style={{
              fontSize: '110px',
              fontWeight: 900,
              letterSpacing: '0.04em',
              fill: 'rgba(255,255,255,0.008)',
              stroke: '#D4A82A',
              strokeWidth: '1px',
              strokeOpacity: 0.04,
              fontFamily: 'var(--font-tajawal), Tajawal, system-ui, -apple-system, sans-serif',
            }}
          >
            GOLDEN CIRCLE
          </text>

          {/* Animated shimmer passing over */}
          <text
            x="500"
            y="78"
            textAnchor="middle"
            className="uppercase"
            style={{
              fontSize: '110px',
              fontWeight: 900,
              letterSpacing: '0.04em',
              fill: 'url(#goldGradient)',
              stroke: '#D4A82A',
              strokeWidth: '1px',
              strokeOpacity: 0.25,
              opacity: 0.35,
              fontFamily: 'var(--font-tajawal), Tajawal, system-ui, -apple-system, sans-serif',
            }}
          >
            GOLDEN CIRCLE
          </text>
        </svg>
      </div>

      {/* Full-width GOLDEN CIRCLE brand text (MOBILE) */}
      <div className="block sm:hidden relative z-10 w-full overflow-hidden mt-4 mb-2 px-0 select-none flex justify-center items-center">
        <svg viewBox="0 0 1000 100" className="w-[130%] h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="goldGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="45%" stopColor="#F5E6A3" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F5E6A3" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1000 0"
                to="1000 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <text
            x="500"
            y="78"
            textAnchor="middle"
            className="uppercase"
            style={{
              fontSize: '110px',
              fontWeight: 900,
              letterSpacing: '0.04em',
              fill: 'rgba(255,255,255,0.008)',
              stroke: '#D4A82A',
              strokeWidth: '1.5px',
              strokeOpacity: 0.12,
              fontFamily: 'var(--font-tajawal), Tajawal, system-ui, -apple-system, sans-serif',
            }}
          >
            GOLDEN CIRCLE
          </text>
          <text
            x="500"
            y="78"
            textAnchor="middle"
            className="uppercase"
            style={{
              fontSize: '110px',
              fontWeight: 900,
              letterSpacing: '0.04em',
              fill: 'url(#goldGradientMobile)',
              stroke: '#D4A82A',
              strokeWidth: '1.5px',
              strokeOpacity: 0.35,
              opacity: 0.55,
              fontFamily: 'var(--font-tajawal), Tajawal, system-ui, -apple-system, sans-serif',
            }}
          >
            GOLDEN CIRCLE
          </text>
        </svg>
      </div>

      {/* Bottom copyright */}
      <div className="relative mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex items-center justify-center">
        <p className="text-[12px] text-white font-medium text-center">
          &copy; {new Date().getFullYear()} GCT For Gold Trade. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
