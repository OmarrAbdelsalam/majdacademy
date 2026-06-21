"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../components/layout/FloatingWhatsApp";

export default function TermsPage() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "شروط",
      highlight: "الاستخدام",
      lastUpdated: "آخر تحديث: مايو 2025",
      sections: [
        { title: "القبول بالشروط", text: "باستخدامك لمنصة مَجد أكاديمي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة." },
        { title: "التسجيل والحسابات", text: "أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب أن تكون المعلومات المقدمة عند التسجيل صحيحة ودقيقة. يحق لنا تعليق أو إلغاء أي حساب يحتوي على معلومات مضللة." },
        { title: "الخدمات التعليمية", text: "نقدم خدمات تعليمية أونلاين تشمل حصص فردية وجماعية وفقاً للمنهج الإماراتي. نحتفظ بالحق في تعديل أو إيقاف أي خدمة مع إشعار مسبق. جميع المواد التعليمية محمية بحقوق الملكية الفكرية ولا يجوز نسخها أو توزيعها." },
        { title: "سياسة الدفع", text: "يتم الدفع مقدماً مقابل الباقات التعليمية المختارة. الأسعار المعروضة شاملة لجميع الرسوم ما لم يُذكر خلاف ذلك. نقبل الدفع عبر البطاقات البنكية والتحويل المصرفي." },
        { title: "سياسة الاسترداد", text: "يمكنك طلب استرداد المبلغ خلال 7 أيام من تاريخ الاشتراك بشرط عدم حضور أكثر من حصة واحدة. بعد انقضاء هذه المدة أو حضور أكثر من حصة، لا يمكن استرداد المبلغ." },
        { title: "جدولة الحصص والإلغاء", text: "يمكنك إعادة جدولة أو إلغاء حصة قبل 12 ساعة على الأقل من موعدها. الإلغاء المتأخر أو عدم الحضور دون إشعار مسبق يُحتسب كحصة مستهلكة من الباقة." },
        { title: "السلوك المقبول", text: "يُتوقع من جميع المستخدمين الالتزام بالاحترام والأدب أثناء الحصص والتواصل مع المعلمين. نحتفظ بالحق في إيقاف حساب أي مستخدم يخالف قواعد السلوك دون استرداد." },
        { title: "الملكية الفكرية", text: "جميع المحتويات المقدمة على المنصة بما في ذلك المواد التعليمية، التصاميم، الشعارات، والنصوص هي ملكية حصرية لمَجد أكاديمي. يُمنع نسخ أو إعادة نشر أو توزيع أي محتوى دون إذن كتابي مسبق." },
        { title: "حدود المسؤولية", text: "نبذل قصارى جهدنا لتقديم خدمة تعليمية عالية الجودة، لكننا لا نضمن نتائج أكاديمية محددة. المنصة غير مسؤولة عن أي أضرار غير مباشرة ناتجة عن استخدام الخدمة." },
        { title: "القانون المعمول به", text: "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة. أي نزاع ينشأ عن استخدام المنصة يخضع لاختصاص محاكم الإمارات." },
        { title: "تعديل الشروط", text: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة قبل 30 يوماً من تطبيقها." },
        { title: "التواصل", text: "لأي استفسار حول شروط الاستخدام، يمكنك التواصل معنا عبر البريد الإلكتروني: info@majdacademy.ae أو عبر الواتساب." },
      ],
    },
    en: {
      title: "Terms of",
      highlight: "Use",
      lastUpdated: "Last updated: May 2025",
      sections: [
        { title: "Acceptance of Terms", text: "By using Majd Academy platform, you agree to comply with these terms and conditions. If you do not agree to any of these terms, please do not use the platform." },
        { title: "Registration & Accounts", text: "You are responsible for maintaining the confidentiality of your account information and password. Information provided during registration must be accurate and truthful. We reserve the right to suspend or cancel any account containing misleading information." },
        { title: "Educational Services", text: "We provide online educational services including individual and group sessions following the UAE curriculum. We reserve the right to modify or discontinue any service with prior notice. All educational materials are protected by intellectual property rights." },
        { title: "Payment Policy", text: "Payment is made in advance for selected educational packages. Displayed prices are inclusive of all fees unless otherwise stated. We accept payment via bank cards and bank transfer." },
        { title: "Refund Policy", text: "You can request a refund within 7 days of subscription provided you have not attended more than one session. After this period or attending more than one session, refunds are not available." },
        { title: "Session Scheduling & Cancellation", text: "You can reschedule or cancel a session at least 12 hours before its scheduled time. Late cancellation or no-show without prior notice counts as a consumed session from your package." },
        { title: "Acceptable Conduct", text: "All users are expected to maintain respect and courtesy during sessions and communication with teachers. We reserve the right to suspend any user account that violates conduct rules without refund." },
        { title: "Intellectual Property", text: "All content provided on the platform including educational materials, designs, logos, and texts are the exclusive property of Majd Academy. Copying, republishing, or distributing any content without prior written permission is prohibited." },
        { title: "Limitation of Liability", text: "We do our best to provide high-quality educational services, but we do not guarantee specific academic results. The platform is not responsible for any indirect damages resulting from the use of the service." },
        { title: "Governing Law", text: "These terms are governed by the laws of the United Arab Emirates. Any dispute arising from the use of the platform is subject to the jurisdiction of UAE courts." },
        { title: "Modification of Terms", text: "We reserve the right to modify these terms at any time. You will be notified of any material changes via email or through a notification on the platform 30 days before implementation." },
        { title: "Contact", text: "For any questions about the terms of use, you can contact us via email: info@majdacademy.ae or via WhatsApp." },
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
          <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(140% 95% at 50% 0%, #fce7f3 0%, #f9a8d4 50%, #ffffff 100%)" }} />
          <div className="relative z-10 text-center mt-16 sm:mt-24 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: "clamp(36px, 8vw, 72px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "130%", color: "#262626" }}
            >
              {c.title}{" "}{c.highlight}
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
                  <span className="text-[14px] font-bold flex-shrink-0 w-8 text-center" style={{ color: "#ef5da8" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 700, color: "#262626", lineHeight: "130%" }}>
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
