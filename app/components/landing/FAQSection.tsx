import React from "react";
import { getLandingContent } from "./getLandingContent";
import GenericFAQ from "../shared/GenericFAQ";

export default function FAQSection({ locale }: { locale: string }) {
  const content = getLandingContent(locale);
  const isRTL = locale === "ar";

  return (
    <GenericFAQ
      title={content.faq.title}
      subtitle={content.faq.subtitle}
      items={content.faq.items}
      ctaText={content.faq.ctaText}
      whatsappLink="https://wa.me/201098505924"
      isRTL={isRTL}
    />
  );
}
