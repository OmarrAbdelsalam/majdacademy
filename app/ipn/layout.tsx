import "../globals.css";
import { Tajawal, Playfair_Display } from "next/font/google";

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

export default function IpnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${tajawal.variable} ${playfair.variable}`} lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${tajawal.variable} ${playfair.variable}`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
