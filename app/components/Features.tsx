"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLang } from "../i18n/LangContext";

function SketchyNumber({ num }: { num: number }) {
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (num / 4) * circumference;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 48 48" fill="none" className="absolute inset-0 w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="24" cy="24" r="21" stroke="#E9C237" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
        <circle
          cx="24" cy="24" r="21"
          stroke="#E9C237" strokeWidth="2.5" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={visible ? targetOffset : circumference}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s" }}
        />
      </svg>
      <span className="text-[16px] sm:text-[18px] font-semibold text-[#E9C237] leading-none z-10 relative">
        {num}
      </span>
    </div>
  );
}

const FeaturesSection = () => {
  const { isRTL } = useLang();

  const row1 = [
    {
      num: 1,
      title: isRTL ? "بدون عمولات خفية." : "Zero Hidden Commissions.",
      desc: isRTL
        ? "استثمر بأفضل أسعار السوق المباشرة بدون أي عمولات خفية أو مصاريف إضافية عند الشراء. نحن نضمن لك أقصى قيمة لأموالك."
        : "Invest at the best direct market prices with absolutely no hidden commissions or extra fees on buying.",
    },
    {
      num: 2,
      title: isRTL ? "توصيل سريع ومجاني." : "Fast & Free Delivery.",
      desc: isRTL
        ? "استلم طلباتك بكل سهولة عند باب بيتك مجاناً عبر شركاء التوصيل المعتمدين والمؤمنين بالكامل."
        : "Receive your orders easily at your doorstep for free via fully insured certified delivery partners.",
    },
  ];

  const row2 = [
    {
      num: 3,
      title: isRTL ? "شركة قانونية مرخصة." : "Licensed Legal Company.",
      desc: isRTL
        ? "شركتنا تعمل بترخيص رسمي من وزارة التموين ومصلحة الدمغة والموازين لضمان حقوقك بالكامل، مع تقديم دعم فني مستمر في أي وقت."
        : "We operate with official licenses from the Ministry of Supply and Purity Control to fully guarantee your rights, with continuous technical support.",
      metrics: [
        { val: "32600", label: isRTL ? "السجل التجاري" : "Commercial Reg." },
        { val: "755-992-512", label: isRTL ? "الرقم الضريبي" : "Tax Number" },
        { val: isRTL ? "مرخصة" : "Certified", label: isRTL ? "وزارة التموين" : "Ministry of Supply" },
        { val: "100%", label: isRTL ? "قانونية بالكامل" : "Fully Legal" },
      ],
    },
    {
      num: 4,
      title: isRTL ? "استثمار مطابق للشريعة." : "Sharia Compliant Investment.",
      desc: isRTL
        ? "نضمن لك استثماراً حلالاً 100% ومتوافقاً تماماً مع ضوابط الشريعة الإسلامية لضمان راحة بالك."
        : "We guarantee a 100% Halal investment fully compliant with Islamic Sharia rules for your peace of mind.",
    },
  ];

  return (
    <section id="features" className="bg-white overflow-hidden pt-0 pb-0 px-2 md:px-4 lg:px-5 -mt-[1px]">
      <div className="mx-auto w-full max-w-[1920px]">
        <div className="bg-black w-full text-white rounded-[1rem] pt-20 md:pt-32 pb-24 md:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
              <motion.h2
                className="text-[30px] sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {isRTL
                  ? <>{" "}ليه تختار <span className="gold-gradient-text">GCT</span></>
                  : <>Why Choose <span className="gold-gradient-text">GCT</span>?</>}
              </motion.h2>
              <motion.p
                className="text-[14px] sm:text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {isRTL
                  ? "شركة مصرية مرخّصة رسميًا تعمل في السوق منذ 2023. استثمار مرن بأي مبلغ مع توصيل مؤمن ودعم فني مستمر."
                  : "An officially licensed Egyptian company operating since 2023. Flexible investment at any amount, with secure delivery and continuous support."}
              </motion.p>
            </div>

            {/* Row 1: Feature 1 + Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16" dir={isRTL ? "rtl" : "ltr"}>
              {row1.map((feat) => (
                <motion.div
                  key={feat.num}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: (feat.num - 1) * 0.1 }}
                >
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 mb-4 text-center lg:text-start">
                    <SketchyNumber num={feat.num} />
                    <h3 className="text-[24px] sm:text-[32px] lg:text-[38px] leading-[1.2] font-bold text-white tracking-tight">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-[14px] sm:text-[17px] text-white/60 leading-relaxed text-center lg:text-start px-2 lg:px-0">
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Delivery image — full width between row 1 and row 2 */}
            <motion.div
              className="w-full my-12 lg:my-16 rounded-[24px] overflow-hidden relative h-[260px] sm:h-[380px] flex flex-col justify-end group"
              dir="ltr"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <img
                src="/delivery.jpg"
                alt="Secure Delivery"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-[16px] shadow-2xl m-4 sm:m-6 transform transition-transform duration-500 group-hover:-translate-y-1 max-w-sm">
                <div className="flex flex-col">
                  <h4 className="text-white font-bold text-[15px] flex items-center gap-2">
                    {isRTL ? "توصيل لحد الباب" : "Doorstep Delivery"}
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  </h4>
                  <p className="text-white/70 text-[12px] mt-1 leading-snug">
                    {isRTL ? "مؤمن ومجاني ويوصلك مباشرة من فريقنا." : "Secure, free, and handed directly to you."}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-[#10B981] flex items-center justify-center shrink-0 shadow-lg ms-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Row 2: Feature 3 + Feature 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16" dir={isRTL ? "rtl" : "ltr"}>
              {/* Feature 3 — Legal */}
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 mb-4 text-center lg:text-start">
                  <SketchyNumber num={3} />
                  <h3 className="text-[24px] sm:text-[32px] lg:text-[38px] leading-[1.2] font-bold text-white tracking-tight">
                    {row2[0].title}
                  </h3>
                </div>
                <p className="text-[14px] sm:text-[17px] text-white/60 leading-relaxed mb-8 text-center lg:text-start px-2 lg:px-0">
                  {row2[0].desc}
                </p>
                <div className="grid grid-cols-2 gap-3 w-full sm:max-w-md mx-auto lg:mx-0">
                  {row2[0].metrics!.map((m, i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-[16px] p-4 sm:p-5 flex flex-col justify-center border border-white/[0.03]">
                      <span className="text-[18px] sm:text-[22px] font-bold text-white mb-1 leading-none">{m.val}</span>
                      <span className="text-[11px] sm:text-[12px] text-white/50 leading-tight">{m.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feature 4 — Sharia */}
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col lg:flex-row items-center gap-3 mb-4">
                  <SketchyNumber num={4} />
                  <h3 className="text-[24px] sm:text-[32px] lg:text-[38px] leading-[1.2] font-bold text-white tracking-tight">
                    {row2[1].title}
                  </h3>
                </div>
                <p className="text-[14px] sm:text-[17px] text-white/60 leading-relaxed mb-8 px-2 lg:px-0">
                  {row2[1].desc}
                </p>
                <div className="flex items-center justify-center w-full">
                  <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]">
                    <img
                      src="/Sharia.svg"
                      alt="Sharia Compliant"
                      className="w-full h-full object-contain opacity-70 drop-shadow-2xl"
                      onError={(e) => { e.currentTarget.src = "/gold_sharia_compliance_1775710353547.png"; }}
                    />
                    <div className="absolute -inset-8 bg-[#E9C237]/15 blur-3xl -z-10 rounded-full pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
