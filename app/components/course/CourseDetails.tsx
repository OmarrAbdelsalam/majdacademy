"use client";
import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import { CourseDetails as ICourseDetails, coursesData } from "./courseData";
import { useCountry, usePricing } from "../../i18n/CountryContext";
import BookingModal from "../shared/BookingModal";
import GenericHero from "../shared/GenericHero";
import InteractiveFeatureList from "../shared/InteractiveFeatureList";
import WhySubscribeSection from "../landing/WhySubscribeSection";
import Link from "next/link";

interface CourseDetailsProps {
  course: ICourseDetails;
  isGradePage?: boolean;
  isSubjectPage?: boolean;
  gradeSlug?: string;
}

export default function CourseDetails({ course, isGradePage, isSubjectPage, gradeSlug }: CourseDetailsProps) {
  const { lang, isRTL } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formatPrice } = usePricing();
  const { activeCountry } = useCountry();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [course.title]);

  const priceData = (() => {
    if (!isGradePage) {
      const aedPrice = "2000";
      const usdPrice = "545";
      const displayPrice = lang === "ar" 
        ? `${aedPrice} درهم / ${usdPrice}$`
        : `${aedPrice} AED / ${usdPrice}$`;
      return { price: displayPrice, currency: "", icon: undefined };
    } else {
      return formatPrice("1000");
    }
  })();

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const countryText = activeCountry.id === "other" ? "" : ` في ${activeCountry.labelAr}`;
  const extraGradeIntro = isGradePage 
    ? (lang === "ar" ? `ونقدم شرحاً مبسطاً يواكب المنهج المعتمد${countryText} لضمان تفوق الطالب في مدرسته.` : `We provide simplified explanations aligned with the official curriculum${countryText} to ensure your child's academic success.`)
    : "";

  return (
    <>
      {/* Hero Section */}
      <GenericHero 
        badge={
          isGradePage
            ? (lang === "ar" ? "منهج دراسي" : "School Curriculum")
            : course.title.includes("العربية")
            ? (lang === "ar" ? "لغة عربية" : "Arabic Language")
            : course.title.includes("القرآن")
            ? (lang === "ar" ? "القرآن الكريم" : "Holy Quran")
            : (lang === "ar" ? "التربية الإسلامية" : "Islamic Studies")
        }
        title={course.title}
        subtitle={course.subtitle}
        cta={lang === "ar" ? "احجز حصة تجريبية" : "Book a trial class"}
        ctaVariant={isGradePage ? "default" : "learn-arabic"}
      />

      {/* Main Content Section */}
      <section className="py-10 md:py-16 bg-white min-h-[80vh]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href={`/${lang}/learn-arabic`} className="hover:text-[#ef5da8] transition-colors">
              {lang === "ar" ? "تعلم العربية" : "Learn Arabic"}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#262626]">{course.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Main Content Column */}
            <div className="w-full lg:w-2/3 flex flex-col gap-10 md:gap-14">
              
              {/* Intro Section */}
              {!isSubjectPage && (
              <div className="flex flex-col gap-6">
                <h2 className="text-[24px] md:text-[28px] font-black text-[#ef5da8] leading-relaxed">
                  {course.subtitle}
                </h2>
                <p className="text-[18px] md:text-[20px] text-gray-700 leading-loose font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  {course.intro}
                  {extraGradeIntro && <span className="font-bold text-[#ef5da8] block mt-3">{extraGradeIntro}</span>}
                </p>
              </div>
              )}

              {/* Subjects Section */}
              {isGradePage && !isSubjectPage && gradeSlug && (
                <div>
                  <h2 className="text-[26px] font-black text-[#262626] mb-6">
                    {lang === "ar" ? "المواد الدراسية المتوفرة" : "Available Subjects"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                      href={`/${lang}/grade/${gradeSlug}/arabic`}
                      className="group p-8 bg-white border-2 border-gray-100 hover:border-[#ef5da8] rounded-[32px] flex flex-col gap-3 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[20px] font-black text-[#262626] group-hover:text-[#ef5da8] transition-colors">
                          {lang === "ar" ? "اللغة العربية" : "Arabic Language"}
                        </h3>
                        <ArrowIcon className="w-5 h-5 text-gray-400 group-hover:text-[#ef5da8] transition-all transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
                      </div>
                      <p className="text-gray-500 text-[15px] leading-relaxed">
                        {lang === "ar" 
                          ? "تأسيس شامل ومكثف في اللغة العربية يغطي القراءة، الكتابة، التحدث والنطق السليم للحروف." 
                          : "Comprehensive Arabic foundation covering reading, writing, speaking, and proper pronunciation."}
                      </p>
                    </Link>

                    <Link
                      href={`/${lang}/grade/${gradeSlug}/islamic`}
                      className="group p-8 bg-white border-2 border-gray-100 hover:border-[#ef5da8] rounded-[32px] flex flex-col gap-3 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[20px] font-black text-[#262626] group-hover:text-[#ef5da8] transition-colors">
                          {lang === "ar" ? "التربية الإسلامية" : "Islamic Studies"}
                        </h3>
                        <ArrowIcon className="w-5 h-5 text-gray-400 group-hover:text-[#ef5da8] transition-all transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
                      </div>
                      <p className="text-gray-500 text-[15px] leading-relaxed">
                        {lang === "ar"
                          ? "تعليم العقيدة، السيرة النبوية، العبادات، والأخلاق الإسلامية بالإضافة إلى قصار السور بطريقة مبسطة."
                          : "Teaching Islamic creed, Prophet's biography, worship, manners, and short Quranic chapters simplified."}
                      </p>
                    </Link>
                  </div>
                </div>
              )}

              {/* Why Majd Specifically Section */}
              {!isGradePage && (
              <div>
                <h2 className="text-[26px] font-black text-[#262626] mb-6">
                  {lang === "ar" ? "لماذا مجد بالتحديد؟" : "Why Majd specifically?"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(lang === "ar" ? [
                    { title: "معلمون ناطقون بالفصحى", desc: "نخبة من المعلمين المتميزين والناطقين باللغة العربية الفصحى لضمان النطق والمخارج السليمة للحروف." },
                    { title: "أساليب تعليمية تفاعلية", desc: "حصص حية ومباشرة تعتمد على الألعاب والأنشطة التفاعلية والوسائل البصرية لجذب انتباه طفلك." },
                    { title: "تقارير ومتابعة مستمرة", desc: "تقارير دورية نرسلها لك توضح بالتفصيل مدى تقدم طفلك الدراسي والنقاط التي تحتاج إلى تركيز." },
                    { title: "مرونة في الجداول والمواعيد", desc: "إمكانية اختيار الأوقات التي تناسب جدول طفلك الدراسي واليومي بكل سهولة ومرونة." }
                  ] : [
                    { title: "Native Arabic Tutors", desc: "A select group of distinguished tutors speaking Classical Arabic to ensure correct pronunciation." },
                    { title: "Interactive Learning Methods", desc: "Live, interactive classes utilizing games, visual aids, and engaging activities to capture your child's interest." },
                    { title: "Continuous Progress Reports", desc: "We provide regular, detailed progress reports to keep you informed of your child's academic growth." },
                    { title: "Flexible Scheduling", desc: "Easily choose class times that fit seamlessly into your child's daily and academic routine." }
                  ]).map((item, idx) => (
                    <div key={idx} className="p-6 bg-[#fafafa] rounded-2xl border border-gray-100 flex flex-col gap-2 hover:border-[#ef5da8]/30 transition-all">
                      <h3 className="font-bold text-[#ef5da8] text-[18px]">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Details Section */}
              <div>
                <h2 className="text-[26px] font-black text-[#262626] mb-6">
                  {lang === "ar" ? "التفاصيل" : "Details"}
                </h2>
                <div className="flex flex-col gap-4 text-gray-700 text-[16px] md:text-[18px] leading-loose">
                  {course.details.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Features List Section */}
              <div>
                <h2 className="text-[26px] font-black text-[#262626] mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fff8f0] flex items-center justify-center">
                    <span className="text-[#f59e0b] text-lg font-black">★</span>
                  </div>
                  {lang === "ar" ? `مميزات دورة ${course.title}:` : `Features of ${course.title}:`}
                </h2>
                <ul className="flex flex-col gap-4">
                  {course.featuresList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0 mt-3"></div>
                      <span className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What you will learn */}
              <div>
                <h2 className="text-[26px] font-black text-[#262626] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef0f8] flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-[#ef5da8]" />
                  </div>
                  {lang === "ar" ? "ماذا يتعلم الطالب في هذه الدورة؟" : "What will the student learn in this course?"}
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#eefbf3] flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-[16px] md:text-[18px] font-medium text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h2 className="text-[26px] font-black text-[#262626] mb-6">
                  {lang === "ar" ? "الأثر المتوقع في نهاية الدورة:" : "Expected outcomes by the end of the course:"}
                </h2>
                <ul className="flex flex-col gap-4">
                  {course.expectedOutcomes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-blue-500 font-bold text-sm">✓</span>
                      </div>
                      <span className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conclusion */}
              <div className="bg-[#fdf2f8] rounded-[32px] p-8 md:p-10 border border-pink-100 text-center mt-4">
                <p className="text-[18px] md:text-[22px] font-bold text-[#ef5da8] leading-loose">
                  {course.conclusion}
                </p>
              </div>

            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-28">
              <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-pink-900/5 border border-gray-100">
                {/* Image Header */}
                <div className="w-full h-[220px] bg-[#fff8f0] flex items-center justify-center relative overflow-hidden">
                  {/* SVG background effect */}
                  <div className="absolute inset-0 z-0 opacity-40">
                    <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="sidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fdf2f8" />
                          <stop offset="100%" stopColor="#fce7f3" />
                        </linearGradient>
                      </defs>
                      <rect width="1000" height="300" fill="url(#sidebarGrad)" />
                    </svg>
                  </div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-[160px] h-[160px] object-contain relative z-10 hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Sidebar Content */}
                <div className="p-6 md:p-8">
                  {/* Pricing Area */}
                  <div className="mb-6">
                    {course.period === "يبدأ من" && (
                      <div className="text-gray-500 font-medium mb-1 text-sm">
                        {lang === "ar" ? "يبدأ من" : "Starts from"}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 text-[#262626] flex-wrap">
                      <span className="text-[26px] md:text-[32px] font-black leading-none">
                        {course.price || priceData.price}
                      </span>
                      <div className="flex flex-col">
                        {priceData.currency && (
                          <span className="text-[16px] font-bold">
                            {priceData.currency}
                          </span>
                        )}
                        {course.period !== "يبدأ من" && (
                          <span className="text-[13px] text-gray-500 font-medium">
                            {course.period || (isGradePage ? (lang === "ar" ? "/شهرياً" : "/month") : (lang === "ar" ? "/للمستوى" : "/level"))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#ef5da8] text-white rounded-full py-4 text-[16px] font-bold hover:bg-[#d9488d] transition-all hover:-translate-y-0.5 shadow-lg shadow-pink-500/30 mb-6 flex justify-center items-center gap-2 group"
                  >
                    {lang === "ar" ? "احجز حصتك المجانية" : "Book your free class"}
                    <ArrowIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </button>

                  <hr className="border-gray-100 mb-6" />

                  <h3 className="text-[16px] font-bold text-[#262626] mb-4">
                    {lang === "ar" ? "مميزات الدورة:" : "Course Features:"}
                  </h3>
                  
                  <ul className="flex flex-col gap-3">
                    {course.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#ef5da8]" strokeWidth={3} />
                        </div>
                        <span className="text-[14px] font-medium text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
        
        <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={isGradePage ? "default" : "learn-arabic"} />
      </section>

      {/* Why Subscribe Section */}
      {isGradePage && <WhySubscribeSection />}

      {/* Related Courses Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-[24px] font-black text-[#262626] mb-8">
            {lang === "ar" ? "مراحل ودورات أخرى قد تهمك" : "Other stages and courses you might like"}
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 ${isGradePage ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
            {(isGradePage ? [
              { slug: "kindergarten", title: lang === "ar" ? "مرحلة الروضة" : "Kindergarten", subtitle: lang === "ar" ? "سن 4-5" : "Ages 4-5", image: "/girll.png", pathPrefix: "stages" },
              { slug: "primary", title: lang === "ar" ? "المرحلة الابتدائية" : "Primary Stage", subtitle: lang === "ar" ? "الصفوف 1-5" : "Grades 1-5", image: "/boyy.png", pathPrefix: "stages" },
              { slug: "middle", title: lang === "ar" ? "المرحلة المتوسطة" : "Middle Stage", subtitle: lang === "ar" ? "الصفوف 6-9" : "Grades 6-9", image: "/girll.png", pathPrefix: "stages" },
              { slug: "secondary", title: lang === "ar" ? "المرحلة الثانوية" : "Secondary Stage", subtitle: lang === "ar" ? "الصفوف 10-12" : "Grades 10-12", image: "/boyy.png", pathPrefix: "stages" },
            ] : coursesData.filter(c => c[lang === "ar" ? "ar" : "en"].title !== course.title).slice(0, 3).map(c => ({
              slug: c.slug,
              title: c[lang === "ar" ? "ar" : "en"].title,
              subtitle: c[lang === "ar" ? "ar" : "en"].subtitle,
              image: c[lang === "ar" ? "ar" : "en"].image,
              pathPrefix: "course"
            }))).map((item, idx) => (
              <Link 
                href={`/${lang}/${item.pathPrefix}/${item.slug}`} 
                key={idx}
                className="group flex flex-col items-center justify-center text-center p-6 bg-[#fafafa] rounded-[32px] border border-gray-100 hover:border-[#ef5da8] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md min-h-[140px]"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-[#262626] text-[18px] group-hover:text-[#ef5da8] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
