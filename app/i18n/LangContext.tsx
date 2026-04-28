"use client";
import { createContext, useContext, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { t, Lang, Translations } from "./translations";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Translations;
  isRTL: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  tr: t.en,
  isRTL: false,
});

export function LangProvider({ children, initialLang = "en" }: { children: ReactNode; initialLang?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const lang: Lang = initialLang === "ar" ? "ar" : "en";

  const setLang = (newLang: Lang) => {
    // Replace current locale segment in URL
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/") || "/");
  };

  return (
    <LangContext.Provider value={{ lang, setLang, tr: t[lang], isRTL: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
