"use client";
import { createContext, useContext, ReactNode } from "react";
import { useLang } from "../../i18n/LangContext";
import { landingContent } from "./landing-content";
import { landingContentFusha } from "./landing-content-fusha";

export const LandingVariantContext = createContext<"default" | "fusha">("default");

export function LandingVariantProvider({ variant, children }: { variant: "default" | "fusha"; children: ReactNode }) {
  return (
    <LandingVariantContext.Provider value={variant}>
      {children}
    </LandingVariantContext.Provider>
  );
}

export function useLandingContent() {
  const { lang } = useLang();
  const variant = useContext(LandingVariantContext);
  
  if (lang === "ar" && variant === "fusha") {
    return landingContentFusha.ar;
  }
  
  return landingContent[lang as keyof typeof landingContent] || landingContent.ar;
}
