"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import GenericFAQ from "../shared/GenericFAQ";

export default function LearnArabicFAQ() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات لأكثر الأسئلة اللي توصلنا عن كورس العربية",
      items: [
        { question: "هل لازم يعرف حروف عربية قبل؟", answer: "لا! نبدأ من الصفر تماماً. حتى لو ما يعرف ولا حرف، نعلّمه خطوة بخطوة من البداية." },
        { question: "كم عمر الطالب المناسب؟", answer: "نقبل من عمر 4 سنوات وفوق. عندنا مسارات مختلفة حسب العمر — أطفال صغار، مراهقين، وكبار." },
        { question: "الحصص بالعربي ولا بالإنجليزي؟", answer: "المعلم يستخدم الاثنين! يشرح بالإنجليزي ويعلّم بالعربي. كل ما الطالب يتقدم، نزيد نسبة العربي." },
        { question: "كم مدة الحصة الواحدة؟", answer: "45 دقيقة للأطفال (4-8 سنوات) و60 دقيقة للأكبر. المدة مدروسة عشان يستفيد بدون ما يمل." },
        { question: "هل فيه شهادة بعد الكورس؟", answer: "نعم! نقدم شهادة إتمام مستوى بعد كل مرحلة. الشهادة توثّق مستوى الطالب وتقدمه." },
      ],
      ctaText: "ما لقيت جوابك؟ كلمنا",
    },
    en: {
      title: "FAQ",
      subtitle: "Answers to the most common questions about our Arabic course",
      items: [
        { question: "Do they need to know Arabic letters first?", answer: "No! We start from absolute zero. Even if they don't know a single letter, we teach step by step from the beginning." },
        { question: "What's the suitable age?", answer: "We accept from age 4 and above. We have different tracks by age — young children, teenagers, and adults." },
        { question: "Are classes in Arabic or English?", answer: "The teacher uses both! Explains in English and teaches in Arabic. As the student progresses, we increase the Arabic ratio." },
        { question: "How long is each session?", answer: "45 minutes for children (4-8 years) and 60 minutes for older students. The duration is designed for maximum benefit without boredom." },
        { question: "Is there a certificate?", answer: "Yes! We provide a level completion certificate after each stage. The certificate documents the student's level and progress." },
      ],
      ctaText: "Didn't find your answer? Contact us",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <GenericFAQ
      title={c.title}
      subtitle={c.subtitle}
      items={c.items}
      ctaText={c.ctaText}
      whatsappLink="https://wa.me/201098505924"
      isRTL={isRTL}
    />
  );
}
