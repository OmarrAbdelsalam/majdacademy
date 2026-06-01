"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../components/layout/FloatingWhatsApp";

export default function PrivacyPage() {
  const { isRTL, lang } = useLang();

  const content = {
    ar: {
      title: "سياسة",
      highlight: "الخصوصية",
      lastUpdated: "آخر تحديث: مايو 2025",
      sections: [
        { title: "جمع المعلومات", text: "نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل في المنصة، مثل الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات الطالب (الاسم، الصف الدراسي). نستخدم هذه المعلومات فقط لتقديم خدماتنا التعليمية وتحسين تجربتك." },
        { title: "حماية البيانات", text: "نلتزم بحماية بياناتك الشخصية باستخدام أحدث تقنيات التشفير والأمان. لا نشارك معلوماتك مع أي طرف ثالث دون موافقتك الصريحة، إلا في الحالات التي يتطلبها القانون." },
        { title: "ملفات تعريف الارتباط (Cookies)", text: "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتك. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك." },
        { title: "حقوقك", text: "يحق لك طلب الوصول إلى بياناتك الشخصية، تصحيحها، أو حذفها في أي وقت. يمكنك التواصل معنا عبر البريد الإلكتروني لممارسة هذه الحقوق." },
        { title: "التواصل معنا", text: "إذا كان لديك أي استفسار حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني: info@majdacademy.ae أو عبر الواتساب." },
      ],
    },
    en: {
      title: "Privacy",
      highlight: "Policy",
      lastUpdated: "Last updated: May 2025",
      sections: [
        { title: "Information Collection", text: "We collect information you provide directly when registering on the platform, such as name, email, phone number, and student information (name, grade level). We use this information solely to provide our educational services and improve your experience." },
        { title: "Data Protection", text: "We are committed to protecting your personal data using the latest encryption and security technologies. We do not share your information with any third party without your explicit consent, except where required by law." },
        { title: "Cookies", text: "We use cookies to improve your browsing experience and remember your preferences. You can control cookie settings through your browser." },
        { title: "Your Rights", text: "You have the right to request access to your personal data, correct it, or delete it at any time. You can contact us via email to exercise these rights." },
        { title: "Contact Us", text: "If you have any questions about the privacy policy, you can contact us via email: info@majdacademy.ae or via WhatsApp." },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center overflow-hidden pt-[60px] pb-8">
          <div className="absolute inset-0 z-0 bg-white" />
          <div className="absolute inset-0 z-[1]" style={{ backgroundImage: "url('https://cdn.kodland.org/main-site-v2/bg-ellipse.webp')", backgroundSize: "cover", backgroundPosition: "center -10vh", backgroundRepeat: "no-repeat" }} />
          <div className="relative z-10 text-center mt-16 sm:mt-24 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ fontFamily: "'Baloo Bhaijaan 2', var(--font-baloo), sans-serif", fontSize: "clamp(36px, 8vw, 72px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "130%", color: "#262626" }}
            >
              {c.title}{" "}
              <span className="relative inline-block">
                <span className="absolute z-0" style={{ background: "#d3ff5f", borderRadius: "14px 20px 18px 22px", top: "-4px", bottom: "-4px", left: "-12px", right: "-12px" }} />
                <span className="relative z-10">{c.highlight}</span>
              </span>
            </motion.h1>
            <p className="mt-4" style={{ fontSize: "14px", fontWeight: 600, color: "#ef5da8" }}>{c.lastUpdated}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            {c.sections.map((section, i) => (
              <div key={i} className="border-b border-gray-100 last:border-b-0 py-8 first:pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[14px] font-bold flex-shrink-0 w-8 text-center" style={{ color: "#ef5da8" }}>0{i + 1}</span>
                  <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: "#262626", lineHeight: "130%" }}>
                    {section.title}
                  </h2>
                </div>
                <p className="pr-11" style={{ fontSize: "16px", fontWeight: 500, lineHeight: "30px", color: "rgba(38,38,38,0.6)" }}>
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
