// Fonts are loaded via standard <link> tags in the head to avoid Turbopack fetch issues during build
import "../globals.css";
import { LangProvider } from "../i18n/LangContext";
import { CountryProvider } from "../i18n/CountryContext";
import SkipLink from "../components/accessibility/SkipLink";
import SmoothScrollHandler from "../components/layout/SmoothScrollHandler";

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export const metadata = {
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  authors: [{ name: "Majd Academy" }],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Baloo+Bhaijaan+2:wght@400..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans font-tajawal bg-white text-[#262626] antialiased" suppressHydrationWarning>
        <SkipLink locale={lang} />
        <SmoothScrollHandler />
        <LangProvider initialLang={lang}>
          <CountryProvider>
            {children}
          </CountryProvider>
        </LangProvider>
      </body>
    </html>
  );
}
