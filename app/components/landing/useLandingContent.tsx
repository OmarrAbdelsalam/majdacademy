"use client";
import { createContext, useContext, ReactNode } from "react";
import { useLang } from "../../i18n/LangContext";
import { landingContent } from "./landing-content";
import { landingContentFusha } from "./landing-content-fusha";

import { getLandingContent, replaceCurriculum } from "./getLandingContent";
import { useCountry } from "../../i18n/CountryContext";

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
  const { activeCountry } = useCountry();
  
  let baseContent;
  if (lang === "ar" && variant === "fusha") {
    baseContent = landingContentFusha.ar;
  } else {
    baseContent = landingContent[lang as keyof typeof landingContent] || landingContent.ar;
  }
  
  const countryAr = activeCountry.id === 'other' ? 'بلدك' : activeCountry.labelAr;
  const countryEn = activeCountry.id === 'other' ? 'your country' : activeCountry.labelEn;
  
  return replaceCurriculum(baseContent, countryAr, countryEn);
}
