import type { Metadata } from "next";
import { Tajawal, Playfair_Display } from "next/font/google";
import "../globals.css";
import { LangProvider } from "../i18n/LangContext";
import RootWrapper from "../components/RootWrapper";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Circle Trading | استثمر في الذهب والفضة بأمان",
  description: "Golden Circle Trading — شركة مصرية مرخّصة لبيع وشراء السبائك الذهبية والفضية. استثمار مرن يبدأ بأي مبلغ مع تخزين آمن مجاني وتوصيل مؤمن. حمّل التطبيق الآن.",
  keywords: ["ذهب", "فضة", "سبائك", "استثمار", "Golden Circle", "GCT Gold", "شراء ذهب", "gold investment", "Egypt gold"],
  authors: [{ name: "Golden Circle Trading" }],
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "Golden Circle Trading | استثمر في الذهب والفضة بأمان",
    description: "شركة مصرية مرخّصة لبيع وشراء السبائك. استثمار مرن، تخزين آمن مجاني، وتوصيل مؤمن.",
    siteName: "Golden Circle Trading",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Circle Trading | استثمر في الذهب والفضة",
    description: "شركة مصرية مرخّصة لبيع وشراء السبائك. حمّل التطبيق الآن.",
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
    <html className={`${tajawal.variable} ${playfair.variable}`} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className={`${tajawal.variable} ${playfair.variable}`}>
        <LangProvider initialLang={lang}>
          <RootWrapper>{children}</RootWrapper>
        </LangProvider>
      </body>
    </html>
  );
}
