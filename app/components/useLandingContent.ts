import { useLang } from "../i18n/LangContext";
import { landingContent } from "./landing-content";

export function useLandingContent() {
  const { lang } = useLang();
  return landingContent[lang as keyof typeof landingContent] || landingContent.ar;
}
