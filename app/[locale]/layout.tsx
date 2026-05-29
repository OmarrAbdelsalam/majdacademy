import type { Metadata } from "next";
import { Playfair_Display, Tajawal, Cairo, Baloo_Bhaijaan_2 } from "next/font/google";
import "../globals.css";
import RootWrapper from "../components/RootWrapper";
import { LangProvider } from "../i18n/LangContext";

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

export const metadata: Metadata = {
  title: "أكاديمية مَجْد | لغة عربية وتربية إسلامية في الإمارات",
  description:
    "أكاديمية مَجْد تقدم تعليم اللغة العربية والتربية الإسلامية في الإمارات من Grade 1 إلى Grade 12، مع برنامج خاص للعربية لغير الناطقين.",
  keywords: [
    "أكاديمية لغة عربية",
    "تربية إسلامية",
    "تعليم عربي في الإمارات",
    "Arabic tutor UAE",
    "Islamic education UAE",
    "Arabic for non native speakers",
    "Grade 1 Grade 12 Arabic",
  ],
  authors: [{ name: "Majd Academy" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "أكاديمية مَجْد | تعليم عربي وتربية إسلامية للأطفال",
    description:
      "برامج عربية وإسلامية موجهة للأطفال في الإمارات من Grade 1 إلى Grade 12، مع مسار للعربية لغير الناطقين.",
    siteName: "Majd Academy",
    type: "website",
    locale: "ar_AE",
    images: ["/academy-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية مَجْد | لغة عربية وتربية إسلامية",
    description:
      "تعليم عربي وتربية إسلامية في الإمارات من Grade 1 إلى Grade 12، وبرنامج للعربية لغير الناطقين.",
    images: ["/academy-hero.png"],
  },
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400;500;600;700;800&family=Cairo:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${tajawal.variable} ${cairo.variable} ${playfair.variable} ${balooBhaijaan.variable} font-sans`}>
        <LangProvider initialLang={lang}>
          <RootWrapper>{children}</RootWrapper>
        </LangProvider>
      </body>
    </html>
  );
}
