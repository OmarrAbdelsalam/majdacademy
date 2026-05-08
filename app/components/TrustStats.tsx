"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLang } from "../i18n/LangContext";

function AnimatedNumber({ target, duration = 2 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString('en-US')}</span>;
}

// Review data
const reviewsRow1 = [
  { nameAr: "أحمد محمود", nameEn: "Ahmed Mahmoud", textAr: "أفضل موقع لشراء الذهب في مصر. شفاف في التسعير وسهل الطلب. اشتريت سبيكة 50 جرام والتوصيل كان في نفس اليوم.", textEn: "Best platform to buy gold in Egypt. Transparent pricing and easy to order. I bought a 50g bar and delivery was same-day.", rating: 5 },
  { nameAr: "سارة عبدالله", nameEn: "Sara Abdullah", textAr: "بدأت بسبيكة فضة والتجربة كانت ممتازة. الأسعار تنافسية جداً والموقع سلس. أنصح بيه أي حد عايز يشتري ذهب أو فضة.", textEn: "Started with a silver bar and the experience was excellent. Very competitive prices and smooth website. Highly recommend.", rating: 5 },
  { nameAr: "محمد إبراهيم", nameEn: "Mohamed Ibrahim", textAr: "حولت جزء من مدخراتي للذهب عن طريق GCT وكانت أفضل قرار. السبائك معتمدة والعيار مضمون 999.9.", textEn: "Moved part of my savings to gold through GCT and it was the best decision. Certified bars with guaranteed 999.9 purity.", rating: 5 },
  { nameAr: "نورهان حسن", nameEn: "Nourhan Hassan", textAr: "الأسعار محدّثة لحظياً وده ساعدني أشتري في الوقت المناسب. فعلاً منصة محترفة ومأمونة.", textEn: "Prices are updated in real-time which helped me buy at the right time. Truly a professional and secure platform.", rating: 5 },
];

const reviewsRow2 = [
  { nameAr: "عمر يوسف", nameEn: "Omar Youssef", textAr: "من أحسن المنصات اللي استخدمتها. التصميم راقي والشراء بيتم في ثواني. اشتريت جنيهات ذهب هدية لعيلتي.", textEn: "One of the best platforms I've used. Elegant design and buying takes seconds. Bought gold coins as gifts for my family.", rating: 5 },
  { nameAr: "فاطمة الزهراء", nameEn: "Fatma Al-Zahraa", textAr: "كنت متخوفة في البداية بس بعد أول طلب اطمنت تماماً. السبائك بتوصل مغلفة ومعاها شهادة ضمان.", textEn: "Was hesitant at first but after my first order I was completely reassured. Bars arrive sealed with a guarantee certificate.", rating: 5 },
  { nameAr: "خالد عبدالرحمن", nameEn: "Khaled Abdulrahman", textAr: "خدمة العملاء ممتازة وبيردوا بسرعة. السبائك بتوصل في علبة فاخرة ومعاها شهادة. تجربة شراء من الدرجة الأولى.", textEn: "Excellent customer service and fast responses. Bars arrive in a premium case with a certificate. A first-class buying experience.", rating: 5 },
  { nameAr: "ياسمين أحمد", nameEn: "Yasmin Ahmed", textAr: "أسعارهم أحسن من السوق وعندهم عروض مستمرة. بقالي سنة بتعامل معاهم ومفيش أي مشكلة. ممتازين.", textEn: "Their prices are better than the market and they have ongoing offers. Been dealing with them for a year with zero issues. Excellent.", rating: 5 },
];

function ReviewCard({ review, isRTL }: { review: typeof reviewsRow1[0]; isRTL: boolean }) {
  return (
    <div className="shrink-0 w-[300px] sm:w-[340px] bg-white rounded-2xl p-6 sm:p-7 border border-[#f0f0f0] flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, si) => (
            <svg key={si} width="15" height="15" viewBox="0 0 24 24" fill="#1a1a1a" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-[#f5f5f5] rounded-full px-2.5 py-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1a1a1a"/>
            <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] font-semibold text-[#555]">{isRTL ? "تقييم موثق" : "Verified Review"}</span>
        </div>
      </div>
      <p className="text-[13px] sm:text-[14px] text-[#444] leading-[1.7] flex-1">
        {isRTL ? review.textAr : review.textEn}
      </p>
      <p className="text-[13px] font-bold text-[#1a1a1a] pt-1">
        {isRTL ? review.nameAr : review.nameEn}
      </p>
    </div>
  );
}

export default function TrustStats() {
  const { isRTL } = useLang();

  return (
    <section className="relative w-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white h-20 md:h-32" />
      {/* Main dark area */}
      <div className="relative bg-[#0A0A0A] py-20 md:py-32 flex flex-col items-center">

        {/* Top gold glow — positioned inside the dark container for reliable mobile rendering */}
        <div className="absolute top-0 left-0 right-0 h-[150px] sm:h-[200px] pointer-events-none z-0" style={{
          background: 'linear-gradient(to bottom, rgba(212, 168, 42, 0.25), rgba(212, 168, 42, 0.08) 50%, transparent 100%)'
        }}></div>
        
        {/* Side ambient glows */}
        <div className="absolute top-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full blur-[60px] sm:blur-[80px] pointer-events-none z-0" style={{
          background: 'radial-gradient(circle, rgba(212, 168, 42, 0.15), transparent 70%)'
        }}></div>
        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full blur-[60px] sm:blur-[80px] pointer-events-none z-0" style={{
          background: 'radial-gradient(circle, rgba(212, 168, 42, 0.15), transparent 70%)'
        }}></div>

        {/* Text content */}
        <div className="relative z-20 text-center px-6 flex flex-col items-center mb-16 sm:mb-20">
          <motion.p
            className="text-[13px] sm:text-[15px] text-white/40 font-medium mb-6 sm:mb-8 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isRTL ? "موثوق من آلاف المستخدمين في مصر والوطن العربي." : "Trusted by thousands of users across Egypt & the Arab world."}
          </motion.p>

          <motion.h2
            className="text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] font-bold text-white leading-none tracking-tight mb-3 sm:mb-5 tabular-nums"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <AnimatedNumber target={15000} />+
          </motion.h2>

          <motion.p
            className="text-[14px] sm:text-[17px] text-white/30 font-medium tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {isRTL ? "حساب موثق" : "Verified accounts"}
          </motion.p>
        </div>

        {/* Review Row 1 — scrolls left */}
        <div className="mb-8 relative w-full overflow-hidden" dir="ltr">
          <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-[#0A0A0A] to-[#0A0A0A]/0 z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-[#0A0A0A] to-[#0A0A0A]/0 z-10 pointer-events-none"></div>
          <div className="flex w-max animate-scroll-left">
            <div className="flex gap-5 shrink-0 px-2.5">
              {[...reviewsRow1, ...reviewsRow1, ...reviewsRow1].map((review, i) => (
                <div key={`r1a-${i}`} dir={isRTL ? "rtl" : "ltr"}>
                  <ReviewCard review={review} isRTL={isRTL} />
                </div>
              ))}
            </div>
            <div className="flex gap-5 shrink-0 px-2.5">
              {[...reviewsRow1, ...reviewsRow1, ...reviewsRow1].map((review, i) => (
                <div key={`r1b-${i}`} dir={isRTL ? "rtl" : "ltr"}>
                  <ReviewCard review={review} isRTL={isRTL} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Row 2 — scrolls right */}
        <div className="relative w-full overflow-hidden" dir="ltr">
          <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-[#0A0A0A] to-[#0A0A0A]/0 z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-[#0A0A0A] to-[#0A0A0A]/0 z-10 pointer-events-none"></div>
          <div className="flex w-max animate-scroll-right">
            <div className="flex gap-5 shrink-0 px-2.5">
              {[...reviewsRow2, ...reviewsRow2, ...reviewsRow2].map((review, i) => (
                <div key={`r2a-${i}`} dir={isRTL ? "rtl" : "ltr"}>
                  <ReviewCard review={review} isRTL={isRTL} />
                </div>
              ))}
            </div>
            <div className="flex gap-5 shrink-0 px-2.5">
              {[...reviewsRow2, ...reviewsRow2, ...reviewsRow2].map((review, i) => (
                <div key={`r2b-${i}`} dir={isRTL ? "rtl" : "ltr"}>
                  <ReviewCard review={review} isRTL={isRTL} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
