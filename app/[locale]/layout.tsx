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
  title: "Golden Circle Gold | ادخر في الذهب والفضة بأمان",
  description: "Golden Circle Gold — شركة مصرية مرخّصة لبيع وشراء السبائك الذهبية والفضية. شراء مرن يبدأ بأي مبلغ مع تخزين آمن مجاني وتوصيل مؤمن. حمّل التطبيق الآن.",
  keywords: ["ذهب", "فضة", "سبائك", "ادخار", "Golden Circle", "GCT Gold", "شراء ذهب", "gold store", "Egypt gold"],
  authors: [{ name: "Golden Circle Gold" }],
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "Golden Circle Gold | ادخر في الذهب والفضة بأمان",
    description: "شركة مصرية مرخّصة لبيع وشراء السبائك. شراء مرن، تخزين آمن مجاني، وتوصيل مؤمن.",
    siteName: "Golden Circle Gold",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Circle Gold | ادخر في الذهب والفضة",
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
