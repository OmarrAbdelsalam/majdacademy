"use client";

import { motion } from "framer-motion";
import { useLang } from "../i18n/LangContext";

const reviewsRow1 = [
  {
    nameAr: "أحمد محمود", nameEn: "Ahmed Mahmoud",
    textAr: "أفضل موقع للاستثمار في الذهب في مصر. شفاف في التسعير وسهل الطلب. اشتريت سبيكة 50 جرام والتوصيل كان في نفس اليوم.",
    textEn: "Best gold investment platform in Egypt. Transparent pricing and easy to order. I bought a 50g bar and delivery was same-day.",
    rating: 5,
  },
  {
    nameAr: "سارة عبدالله", nameEn: "Sara Abdullah",
    textAr: "بدأت بسبيكة فضة والتجربة كانت ممتازة. الأسعار تنافسية جداً والموقع سلس. أنصح بيه أي حد عايز يستثمر.",
    textEn: "Started with a silver bar and the experience was excellent. Very competitive prices and smooth website. Highly recommend.",
    rating: 5,
  },
  {
    nameAr: "محمد إبراهيم", nameEn: "Mohamed Ibrahim",
    textAr: "حولت جزء من مدخراتي للذهب عن طريق GCT وكانت أفضل قرار. السبائك معتمدة والعيار مضمون 999.9.",
    textEn: "Moved part of my savings to gold through GCT and it was the best decision. Certified bars with guaranteed 999.9 purity.",
    rating: 5,
  },
  {
    nameAr: "نورهان حسن", nameEn: "Nourhan Hassan",
    textAr: "الأسعار محدّثة لحظياً وده ساعدني أشتري في الوقت المناسب. فعلاً منصة محترفة ومأمونة.",
    textEn: "Prices are updated in real-time which helped me buy at the right time. Truly a professional and secure platform.",
    rating: 5,
  },
];

const reviewsRow2 = [
  {
    nameAr: "عمر يوسف", nameEn: "Omar Youssef",
    textAr: "من أحسن المنصات اللي استخدمتها. التصميم راقي والشراء بيتم في ثواني. اشتريت جنيهات ذهب هدية لعيلتي.",
    textEn: "One of the best platforms I've used. Elegant design and buying takes seconds. Bought gold coins as gifts for my family.",
    rating: 5,
  },
  {
    nameAr: "فاطمة الزهراء", nameEn: "Fatma Al-Zahraa",
    textAr: "كنت متخوفة في البداية بس بعد أول طلب اطمنت تماماً. السبائك بتوصل مغلفة ومعاها شهادة ضمان.",
    textEn: "Was hesitant at first but after my first order I was completely reassured. Bars arrive sealed with a guarantee certificate.",
    rating: 5,
  },
  {
    nameAr: "خالد عبدالرحمن", nameEn: "Khaled Abdulrahman",
    textAr: "خدمة العملاء ممتازة وبيردوا بسرعة. السبائك بتوصل في علبة فاخرة ومعاها شهادة. تجربة شراء من الدرجة الأولى.",
    textEn: "Excellent customer service and fast responses. Bars arrive in a premium case with a certificate. A first-class buying experience.",
    rating: 5,
  },
  {
    nameAr: "ياسمين أحمد", nameEn: "Yasmin Ahmed",
    textAr: "أسعارهم أحسن من السوق وعندهم عروض مستمرة. بقالي سنة بتعامل معاهم ومفيش أي مشكلة. ممتازين.",
    textEn: "Their prices are better than the market and they have ongoing offers. Been dealing with them for a year with zero issues. Excellent.",
    rating: 5,
  },
];

function ReviewCard({ review, isRTL }: { review: typeof reviewsRow1[0]; isRTL: boolean }) {
  return (
    <div className="shrink-0 w-[320px] sm:w-[360px] bg-white rounded-2xl p-6 sm:p-7 border border-[#f0f0f0] flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Stars + Verified */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, si) => (
            <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-[#f5f5f5] rounded-full px-3 py-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1a1a1a"/>
            <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[11px] font-semibold text-[#555]">{isRTL ? "تقييم موثق" : "Verified Review"}</span>
        </div>
      </div>

      {/* Text */}
      <p className="text-[14px] sm:text-[15px] text-[#444] leading-[1.7] flex-1">
        {isRTL ? review.textAr : review.textEn}
      </p>

      {/* Author */}
      <p className="text-[14px] font-bold text-[#1a1a1a] pt-2">
        {isRTL ? review.nameAr : review.nameEn}
      </p>
    </div>
  );
}

export default function Reviews() {
  const { isRTL } = useLang();

  return (
    <section className="relative w-full bg-white py-20 md:py-32 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-[#1a1a1a] mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {isRTL ? "آراء عملائنا" : "See what our customers say"}
        </motion.h2>
        <motion.p
          className="text-[15px] sm:text-[17px] text-[#888] leading-relaxed max-w-[480px] mb-7"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {isRTL
            ? "آلاف المستثمرين يثقون في GCT Gold كمنصة موثوقة وعالية التقييم للاستثمار في المعادن الثمينة."
            : "With thousands of reviews, GCT Gold is one of the most trusted and highest rated platforms for precious metals."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <span className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] text-white rounded-full text-[14px] font-bold">
            {isRTL ? "التقييمات" : "Reviews"}
          </span>
        </motion.div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="mb-5 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-scroll-left gap-5">
          <div className="flex gap-5 shrink-0">
            {reviewsRow1.map((review, i) => (
              <ReviewCard key={`r1a-${i}`} review={review} isRTL={isRTL} />
            ))}
          </div>
          <div className="flex gap-5 shrink-0">
            {reviewsRow1.map((review, i) => (
              <ReviewCard key={`r1b-${i}`} review={review} isRTL={isRTL} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-scroll-right gap-5">
          <div className="flex gap-5 shrink-0">
            {reviewsRow2.map((review, i) => (
              <ReviewCard key={`r2a-${i}`} review={review} isRTL={isRTL} />
            ))}
          </div>
          <div className="flex gap-5 shrink-0">
            {reviewsRow2.map((review, i) => (
              <ReviewCard key={`r2b-${i}`} review={review} isRTL={isRTL} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
