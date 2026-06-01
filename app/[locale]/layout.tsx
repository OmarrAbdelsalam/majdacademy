import { Playfair_Display, Tajawal, Cairo, Baloo_Bhaijaan_2 } from "next/font/google";
import "../globals.css";
import { LangProvider } from "../i18n/LangContext";
import SkipLink from "../components/accessibility/SkipLink";
import SmoothScrollHandler from "../components/layout/SmoothScrollHandler";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const balooBhaijaan = Baloo_Bhaijaan_2({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

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
    <html className={`${tajawal.variable} ${cairo.variable} ${playfair.variable} ${balooBhaijaan.variable}`} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className={`${tajawal.variable} ${cairo.variable} ${playfair.variable} ${balooBhaijaan.variable} font-sans`}>
        <SkipLink locale={lang} />
        <SmoothScrollHandler />
        <LangProvider initialLang={lang}>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
