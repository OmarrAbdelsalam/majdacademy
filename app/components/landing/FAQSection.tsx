"use client";
import React from "react";
import { useLandingContent } from "./useLandingContent";
import { useLang } from "../../i18n/LangContext";
import GenericFAQ from "../shared/GenericFAQ";

export default function FAQSection() {
  const content = useLandingContent();
  const { isRTL } = useLang();

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
