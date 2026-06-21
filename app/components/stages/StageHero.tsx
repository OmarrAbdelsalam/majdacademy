"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import { stagesContent, StageKey } from "./stagesContent";
import GenericHero from "../shared/GenericHero";

export default function StageHero({ stage }: { stage: StageKey }) {
  const { lang } = useLang();
  const c = stagesContent[lang as "ar" | "en"][stage];

  return (
    <GenericHero 
      badge={c.badge}
      title={c.title}
      subtitle={c.subtitle}
      cta={c.cta}
    />
  );
}
