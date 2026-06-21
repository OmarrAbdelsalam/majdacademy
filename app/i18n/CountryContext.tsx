"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLang } from "./LangContext";

export type CountryCode = "ae" | "sa" | "kw" | "qa" | "om" | "bh" | "other";

export interface CountryInfo {
  id: CountryCode;
  labelAr: string;
  labelEn: string;
  flag: string;
  currencyAr: string;
  currencyEn: string;
  exchangeRate: number; // 1 AED = X Currency
  timeOffset: number; // Offset in hours relative to Dubai (UTC+4)
  icon?: string;
}

export const COUNTRIES: CountryInfo[] = [
  { id: "ae", labelAr: "الإمارات", labelEn: "UAE", flag: "ae", currencyAr: "درهم إماراتي", currencyEn: "AED", exchangeRate: 1, timeOffset: 0 },
  { id: "sa", labelAr: "السعودية", labelEn: "KSA", flag: "sa", currencyAr: "ريال سعودي", currencyEn: "SAR", exchangeRate: 1.0211, timeOffset: -1 },
  { id: "kw", labelAr: "الكويت", labelEn: "Kuwait", flag: "kw", currencyAr: "دينار كويتي", currencyEn: "KWD", exchangeRate: 0.0838, timeOffset: -1 },
  { id: "qa", labelAr: "قطر", labelEn: "Qatar", flag: "qa", currencyAr: "ريال قطري", currencyEn: "QAR", exchangeRate: 0.9911, timeOffset: -1 },
  { id: "om", labelAr: "عمان", labelEn: "Oman", flag: "om", currencyAr: "ريال عماني", currencyEn: "OMR", exchangeRate: 0.1048, timeOffset: 0 },
  { id: "bh", labelAr: "البحرين", labelEn: "Bahrain", flag: "bh", currencyAr: "دينار بحريني", currencyEn: "BHD", exchangeRate: 0.1026, timeOffset: -1 },
  { id: "other", labelAr: "أخرى", labelEn: "Other", flag: "un", currencyAr: "دولار أمريكي", currencyEn: "USD", exchangeRate: 0.2723, timeOffset: 0 },
];

interface CountryContextType {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  activeCountry: CountryInfo;
}

const CountryContext = createContext<CountryContextType>({
  country: "ae",
  setCountry: () => {},
  activeCountry: COUNTRIES[0],
});

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>("ae");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let urlCountry = null;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      urlCountry = searchParams.get("country") as CountryCode;
    }
    
    if (urlCountry && COUNTRIES.find(c => c.id === urlCountry)) {
      setCountryState(urlCountry);
      localStorage.setItem("gct_country", urlCountry);
    } else {
      const saved = localStorage.getItem("gct_country") as CountryCode;
      if (saved && COUNTRIES.find(c => c.id === saved)) {
        setCountryState(saved);
      }
    }
  }, []);

  const setCountry = (newCountry: CountryCode) => {
    setCountryState(newCountry);
    localStorage.setItem("gct_country", newCountry);
  };

  const activeCountry = COUNTRIES.find((c) => c.id === country) || COUNTRIES[0];

  return (
    <CountryContext.Provider value={{ country: mounted ? country : "ae", setCountry, activeCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export const useCountry = () => useContext(CountryContext);

export function usePricing() {
  const { activeCountry } = useCountry();
  const { lang } = useLang();

  const convertPrice = (aedPrice: number | string): string => {
    const numericPrice = typeof aedPrice === "string" ? parseFloat(aedPrice) : aedPrice;
    if (isNaN(numericPrice)) return aedPrice as string;

    const converted = numericPrice * activeCountry.exchangeRate;
    return Math.ceil(converted).toString();
  };

  const formatPrice = (aedPrice: number | string) => {
    const price = convertPrice(aedPrice);
    const currency = lang === "ar" ? activeCountry.currencyAr : activeCountry.currencyEn;
    return { price, currency, icon: activeCountry.icon };
  };

  return { convertPrice, formatPrice, activeCountry };
}
