import { landingContent } from "./landing-content";
import { landingContentFusha } from "./landing-content-fusha";

export function getLandingContent(locale: string, variant: "default" | "fusha" = "default") {
  if (locale === "ar" && variant === "fusha") {
    return landingContentFusha.ar;
  }
  return landingContent[locale as keyof typeof landingContent] || landingContent.ar;
}
