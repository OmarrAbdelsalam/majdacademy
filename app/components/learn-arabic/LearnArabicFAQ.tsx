"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import GenericFAQ from "../shared/GenericFAQ";

export default function LearnArabicFAQ() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات لأكثر الأسئلة شيوعاً حول دورة اللغة العربية",
      items: [
        { question: "هل يجب أن يعرف الحروف العربية مسبقاً؟", answer: "لا! نبدأ من الصفر تماماً. حتى وإن لم يعرف أي حرف، نعلّمه خطوة بخطوة من البداية." },
        { question: "ما هو العمر المناسب للطالب؟", answer: "نقبل الطلاب من عمر 4 سنوات فأكثر. لدينا مسارات مختلفة تناسب الفئة العمرية — أطفال صغار، مراهقون، وكبار." },
        { question: "هل الحصص باللغة العربية أم الإنجليزية؟", answer: "يستخدم المعلم كلتيهما! حيث يشرح بالإنجليزية ويُعلّم بالعربية. وكلما تقدم الطالب، نزيد من استخدام اللغة العربية." },
        { question: "كم تبلغ مدة الحصة الواحدة؟", answer: "45 دقيقة للأطفال (4-8 سنوات) و60 دقيقة للأعمار الأكبر. المدة مدروسة ليتحقق أقصى استفادة دون الشعور بالملل." },
        { question: "هل هناك شهادة بعد الدورة؟", answer: "نعم! نُقدم شهادة إتمام مستوى بعد كل مرحلة. توثّق هذه الشهادة مستوى الطالب ومدى تقدمه." },
      ],
      ctaText: "لم تجد إجابتك؟ تواصل معنا",
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
      whatsappLink="https://wa.me/971528150547"
      isRTL={isRTL}
    />
  );
}
