"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const content = {
  ar: {
    title: "أوووه! الصفحة ضايعة",
    subtitle: "يمكن الرابط غلط أو الصفحة انتقلت. لا تشيل هم، نرجعك للمكان الصح.",
    home: "الصفحة الرئيسية",
    contact: "تواصل معنا",
  },
  en: {
    title: "Oops! Page not found",
    subtitle: "The page you're looking for doesn't exist or has been moved. Don't worry, we'll get you back on track.",
    home: "Go to Homepage",
    contact: "Contact Us",
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/en") ? "en" : "ar";
  const isRTL = lang === "ar";
  const t = content[lang];

  return (
    <html lang={lang} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400;500;600;700;800&family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Baloo Bhaijaan 2', 'Cairo', sans-serif" }}>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <div className="max-w-[500px]">
            {/* 404 Number */}
            <div className="relative inline-block mb-8">
              <span
                className="text-[120px] sm:text-[180px] font-extrabold leading-none select-none"
                style={{ color: "rgba(38,38,38,0.03)" }}
              >
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/majdlogo.png" alt="مَجْد" className="h-16 sm:h-20 w-auto opacity-90" />
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-[#262626] font-extrabold leading-[120%] mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              {t.title}
            </h1>
            <p
              className="mb-8"
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "28px",
                color: "rgba(38,38,38,0.6)",
              }}
            >
              {t.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${lang}`}
                className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-200"
                style={{ padding: "16px 36px", fontSize: "16px", fontWeight: 500 }}
              >
                {t.home}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center justify-center text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-200"
              >
                {t.contact}
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
