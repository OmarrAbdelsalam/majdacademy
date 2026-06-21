"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import GenericHero from "../shared/GenericHero";

export default function AboutHero() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "من مَجد",
      subtitle: "تعرّف على مَجد أكاديمي وليش آلاف العائلات يثقون فينا",
      intro: "مَجد أكاديمي هي منصة تعليمية إماراتية متخصصة في تقديم دروس أونلاين عالية الجودة لطلاب المراحل من الصف الأول حتى الثاني عشر، وفقاً للمنهج الإماراتي المعتمد من وزارة التربية والتعليم.",
    },
    en: {
      title: "About Majd",
      subtitle: "Get to know Majd Academy and why thousands of families trust us",
      intro: "Majd Academy is a UAE-based educational platform specializing in high-quality online tutoring for students from Grade 1 to 12, following the UAE Ministry of Education curriculum.",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <GenericHero
      title={c.title}
      subtitle={`${c.subtitle}\n\n${c.intro}`}
    />
  );
}
