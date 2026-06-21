"use client";
import React from "react";
import { BookOpen, MessageCircle, FileText, Globe } from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import InteractiveFeatureList from "../shared/InteractiveFeatureList";

export default function WhatTheyLearn() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      heading: "ماذا",
      highlight: "يتعلمون؟",
      features: [
        { title: "القراءة والكتابة", desc: "الحروف، التشكيل، تكوين الكلمات — من الصفر وصولاً إلى القراءة والكتابة بطلاقة.", icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "المحادثة اليومية", desc: "جمل عملية ومواقف حقيقية — ليتعلم التحدث بالعربية في حياته اليومية.", icon: <MessageCircle className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "القواعد الأساسية", desc: "بأسلوب مبسط ومن دون تعقيد — ليفهم بنية الجملة ويستخدمها بشكل صحيح.", icon: <FileText className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "الثقافة العربية", desc: "عادات، تعبيرات، أمثال — ليفهم اللغة في سياقها الثقافي.", icon: <Globe className="w-6 h-6" strokeWidth={1.5} /> },
      ],
    },
    en: {
      heading: "What will they",
      highlight: "learn?",
      features: [
        { title: "Reading & Writing", desc: "Letters, diacritics, word formation — from zero to fluent reading and writing.", icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "Daily Conversation", desc: "Practical phrases and real situations — learn to speak Arabic in everyday life.", icon: <MessageCircle className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "Basic Grammar", desc: "Simplified without complexity — understand sentence structure and use it correctly.", icon: <FileText className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "Arabic Culture", desc: "Customs, expressions, proverbs — understand the language in its cultural context.", icon: <Globe className="w-6 h-6" strokeWidth={1.5} /> },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

  const heading = (
    <h2
      className="text-center mb-8 md:mb-12"
      style={{
        fontSize: "clamp(28px, 4vw, 40px)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: "120%",
        color: "#262626" }}
    >
      {c.heading}{" "}{c.highlight}
    </h2>
  );

  const imageContent = (
    <div className="flex justify-center items-end relative h-[350px] md:h-[500px] mt-10 md:mt-0 md:-translate-y-8 lg:-translate-y-12">
      <div 
        className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] bottom-0 z-0" 
        style={{ 
          backgroundColor: '#fef0f8',
          borderRadius: '200px 200px 24px 24px'
        }} 
      />
      <img
        src="/girll.png"
        alt=""
        className="w-[310px] md:w-[460px] h-auto object-contain relative z-10 transition-transform duration-500 hover:scale-105 origin-bottom"
        loading="lazy"
        style={{ marginBottom: '-2px' }}
      />
    </div>
  );

  return (
    <InteractiveFeatureList
      heading={heading}
      features={c.features}
      imageContent={imageContent}
    />
  );
}
