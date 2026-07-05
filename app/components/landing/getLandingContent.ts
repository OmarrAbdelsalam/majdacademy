import { landingContent } from "./landing-content";
import { landingContentFusha } from "./landing-content-fusha";

export function replaceCurriculum(obj: any, countryAr: string, countryEn: string): any {
  if (typeof obj === 'string') {
    return obj
      .replace(/المنهج الإماراتي/g, `المنهج المعتمد في ${countryAr}`)
      .replace(/منهج إماراتي/g, `منهج معتمد في ${countryAr}`)
      .replace(/UAE curriculum/gi, `${countryEn} curriculum`);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => replaceCurriculum(item, countryAr, countryEn));
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = replaceCurriculum(obj[key], countryAr, countryEn);
    }
    return newObj;
  }
  return obj;
}

export function getLandingContent(locale: string, variant: "default" | "fusha" = "default") {
  if (locale === "ar" && variant === "fusha") {
    return replaceCurriculum(landingContentFusha.ar, "بلدك", "your country");
  }
  const base = landingContent[locale as keyof typeof landingContent] || landingContent.ar;
  return replaceCurriculum(base, "بلدك", "your country");
}
