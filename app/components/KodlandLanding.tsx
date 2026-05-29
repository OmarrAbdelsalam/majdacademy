"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ChevronDown,
  Users,
  Sparkles,
  Heart,
  Target,
  Lightbulb,
  Code,
  Palette,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

interface KodlandLandingProps {
  locale: "ar" | "en";
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function KodlandLanding({ locale }: KodlandLandingProps) {
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar isRTL={isRTL} />
      <HeroSection isRTL={isRTL} />
      <InterestsSection isRTL={isRTL} />
      <StatsSection isRTL={isRTL} />
      <AgeGroupsSection isRTL={isRTL} />
      <TrialLessonSection isRTL={isRTL} />
      <ReviewsSection isRTL={isRTL} />
      <PrinciplesSection isRTL={isRTL} />
      <LearningProcessSection isRTL={isRTL} />
      <TeachersSection isRTL={isRTL} />
      <CourseCTASection isRTL={isRTL} />
      <CaseStudiesSection isRTL={isRTL} />
      <CTASection isRTL={isRTL} />
      <FAQSection isRTL={isRTL} />
      <FooterSection isRTL={isRTL} />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
function Navbar({ isRTL }: { isRTL: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"}`}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.kodland.org/main-site-v2/kodland-logo.svg"
              alt="Kodland"
              className="h-8"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-[22px] font-bold text-[#1a1a2e]">
              {isRTL ? "كودلاند" : "Kodland"}
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://learn.kodland.org/"
              className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#6c5ce7] hover:text-[#6c5ce7] transition-colors"
            >
              {isRTL ? "تسجيل الدخول" : "Log in"}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-3 mobile-menu-enter shadow-lg">
          <a
            href="https://learn.kodland.org/"
            className="block w-full text-center px-5 py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-700"
          >
            {isRTL ? "تسجيل الدخول" : "Log in"}
          </a>
        </div>
      )}
    </nav>
  );
}


/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
function HeroSection({ isRTL }: { isRTL: boolean }) {
  return (
    <section className="relative pt-[72px] overflow-hidden bg-[#f0f4ff]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-16">
        <div className="flex flex-col items-center text-center relative z-10">
          {/* Kids images - left and right */}
          <div className="hidden lg:block absolute left-0 top-8 w-[200px]">
            <img
              src="https://cdn.kodland.org/main-site-v2/en/main/kid-left.png"
              alt=""
              className="w-full h-auto"
            />
          </div>
          <div className="hidden lg:block absolute right-0 top-8 w-[200px]">
            <img
              src="https://cdn.kodland.org/main-site-v2/en/main/kid-right.png"
              alt=""
              className="w-full h-auto"
            />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight text-[#1a1a2e] max-w-3xl"
          >
            {isRTL ? (
              <>
                مدرسة أونلاين
                <br />
                <span className="text-[#6c5ce7]">للأطفال من 8 إلى 17 سنة</span>
              </>
            ) : (
              <>
                Online school
                <br />
                <span className="text-[#6c5ce7]">for kids ages 8-17</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 text-lg text-gray-600 max-w-xl"
          >
            {isRTL
              ? "نحوّل الاهتمامات العابرة إلى مهارات للمستقبل. نعلّم التفكير النقدي والإبداع"
              : "We turn casual interests into skills for the future. We teach critical thinking and creativity"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <a
              href="#cta"
              className="inline-block px-8 py-4 rounded-full bg-[#6c5ce7] text-white font-semibold text-base hover:bg-[#5a4bd6] transition-all shadow-lg shadow-[#6c5ce7]/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              {isRTL ? "سجّل في درس تجريبي مجاني" : "Sign up for a trial class"}
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <a href="https://www.trustpilot.com/review/kodland.org" className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
                ))}
              </div>
              <span>{isRTL ? "4.7 من 5 بناءً على 9,488 مراجعة" : "4.7 out of 5 rating based on 9,488 reviews"}</span>
            </a>
            <div className="flex items-center gap-2">
              <img
                src="https://cdn.kodland.org/main-site-v2/stemi.png"
                alt="STEM.org"
                className="h-10"
              />
              <span className="text-xs text-gray-500 font-medium">{isRTL ? "معتمد من STEM.org" : "STEM.org Accredited"}</span>
            </div>
          </motion.div>

          {/* Bottom kid image */}
          <div className="mt-8 lg:mt-4 w-full max-w-[400px]">
            <img
              src="https://cdn.kodland.org/main-site-v2/en/main/kid-bottom.png"
              alt=""
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   INTERESTS SECTION - "What inspires your kid?"
   ═══════════════════════════════════════════════════════════ */
function InterestsSection({ isRTL }: { isRTL: boolean }) {
  const interests = isRTL
    ? [
        { title: "البرمجة", icon: Code, color: "bg-blue-100 text-blue-600", href: "#" },
        { title: "التصميم", icon: Palette, color: "bg-pink-100 text-pink-600", href: "#" },
        { title: "الرسم", icon: Sparkles, color: "bg-purple-100 text-purple-600", href: "#" },
        { title: "الرياضيات", icon: Target, color: "bg-green-100 text-green-600", href: "#" },
      ]
    : [
        { title: "Coding", icon: Code, color: "bg-blue-100 text-blue-600", href: "#" },
        { title: "Design", icon: Palette, color: "bg-pink-100 text-pink-600", href: "#" },
        { title: "Drawing", icon: Sparkles, color: "bg-purple-100 text-purple-600", href: "#" },
        { title: "Math", icon: Target, color: "bg-green-100 text-green-600", href: "#" },
      ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-4"
        >
          {isRTL ? "ما الذي يلهم طفلك الآن؟" : "What inspires your kid at the moment?"}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
        >
          {interests.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              variants={fadeUp}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-[#6c5ce7]/20 transition-all group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7" />
              </div>
              <span className="font-semibold text-[#1a1a2e]">{item.title}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12 bg-[#f0f4ff] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
              {isRTL ? "هل تريد إيجاد الدورة المثالية لطفلك؟" : "Want to find a perfect course for your kid?"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isRTL
                ? "في درسنا التجريبي المجاني الأول، سنساعدك في اختيار الاتجاه المناسب لعمره واهتماماته"
                : "In our first free lesson, we'll help you choose a direction for their age and interests"}
            </p>
          </div>
          <a
            href="#cta"
            className="px-7 py-3.5 rounded-full bg-[#6c5ce7] text-white font-semibold text-sm hover:bg-[#5a4bd6] transition-colors shadow-md whitespace-nowrap"
          >
            {isRTL ? "احجز درس تجريبي مجاني" : "Book a free trial"}
          </a>
          <img
            src="https://cdn.kodland.org/main-site-v2/en/main/kid_boy.png"
            alt=""
            className="w-32 h-auto hidden md:block"
          />
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   STATS SECTION
   ═══════════════════════════════════════════════════════════ */
function StatsSection({ isRTL }: { isRTL: boolean }) {
  const stats = isRTL
    ? [
        { value: "7+", label: "سنوات من التعليم الناجح", img: "https://cdn.kodland.org/main-site-v2/7.svg" },
        { value: "41K+", label: "طفل من جميع أنحاء العالم", img: "https://cdn.kodland.org/main-site-v2/200k.svg" },
        { value: "12", label: "دولة", img: "https://cdn.kodland.org/main-site-v2/12.svg" },
        { value: "10K+", label: "معلم ومرشد خبير", img: "https://cdn.kodland.org/main-site-v2/1_7k.svg" },
      ]
    : [
        { value: "7+", label: "years of successful teaching", img: "https://cdn.kodland.org/main-site-v2/7.svg" },
        { value: "41K+", label: "children worldwide", img: "https://cdn.kodland.org/main-site-v2/200k.svg" },
        { value: "12", label: "countries", img: "https://cdn.kodland.org/main-site-v2/12.svg" },
        { value: "10K+", label: "expert mentors & teachers", img: "https://cdn.kodland.org/main-site-v2/1_7k.svg" },
      ];

  return (
    <section className="py-14 bg-[#1a1a2e]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <img src={stat.img} alt={stat.value} className="h-12 mx-auto mb-3" />
              <p className="text-sm text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   AGE GROUPS SECTION
   ═══════════════════════════════════════════════════════════ */
function AgeGroupsSection({ isRTL }: { isRTL: boolean }) {
  const [activeTab, setActiveTab] = useState(0);

  const groups = isRTL
    ? [
        {
          age: "8-10",
          title: "التعلم من خلال اللعب",
          desc: "يتعلم الأطفال من خلال اللعب والتجارب العملية. مع مرشدهم بجانبهم، يجربون أشياء جديدة في مساحة آمنة يشعرون فيها بالراحة لطرح الأسئلة.",
          features: ["جلسات قصيرة", "التعلم معاً", "تنمية الفضول"],
          img: "https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp",
        },
        {
          age: "11-14",
          title: "بناء المشاريع الحقيقية",
          desc: "يبدأ المراهقون في بناء مشاريع حقيقية ويتعلمون العمل الجماعي. يطورون مهارات حل المشكلات والتفكير المنطقي.",
          features: ["مشاريع حقيقية", "عمل جماعي", "تفكير منطقي"],
          img: "https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp",
        },
        {
          age: "15-17",
          title: "مهارات احترافية",
          desc: "يتعلم الشباب مهارات احترافية تؤهلهم لسوق العمل. يعملون على مشاريع متقدمة باستخدام أدوات صناعية.",
          features: ["أدوات احترافية", "محفظة أعمال", "تحضير مهني"],
          img: "https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp",
        },
      ]
    : [
        {
          age: "8-10",
          title: "Learning through play",
          desc: "Kids learn through play and hands-on experiments. With our mentor by their side, they try new things in a safe space where they feel comfortable asking questions.",
          features: ["Short sessions", "Learning together", "Developing curiosity"],
          img: "https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp",
        },
        {
          age: "11-14",
          title: "Building real projects",
          desc: "Teens start building real projects and learn teamwork. They develop problem-solving skills and logical thinking through collaborative coding.",
          features: ["Real projects", "Teamwork", "Logical thinking"],
          img: "https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp",
        },
        {
          age: "15-17",
          title: "Professional skills",
          desc: "Young adults learn professional skills that prepare them for the job market. They work on advanced projects using industry-standard tools.",
          features: ["Professional tools", "Portfolio building", "Career prep"],
          img: "https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp",
        },
      ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-4">
            {isRTL ? "فلسفة واحدة ومسارات مختلفة لكل عمر" : "One philosophy & different paths at every age"}
          </motion.h2>

          {/* Tabs */}
          <motion.div variants={fadeUp} className="flex justify-center gap-3 mt-8 mb-10">
            {groups.map((group, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  activeTab === i
                    ? "bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isRTL ? `${group.age} سنة` : `Ages ${group.age}`}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#f0f4ff] rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">{groups[activeTab].title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{groups[activeTab].desc}</p>
                <div className="flex flex-wrap gap-3">
                  {groups[activeTab].features.map((feature, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-sm font-medium text-gray-700 border border-gray-200 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-[#6c5ce7]" />
                      {feature}
                    </span>
                  ))}
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 mt-6 text-[#6c5ce7] font-semibold text-sm hover:underline"
                >
                  {isRTL ? "اكتشف الدورات" : "Find your course"}
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </a>
              </div>
              <div className="flex justify-center">
                <img
                  src={groups[activeTab].img}
                  alt=""
                  className="w-full max-w-[350px] h-auto rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   TRIAL LESSON SECTION - "Start with a free trial"
   ═══════════════════════════════════════════════════════════ */
function TrialLessonSection({ isRTL }: { isRTL: boolean }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = isRTL
    ? [
        { step: 1, title: "تعرّف على مرشدك", desc: "تبدأ الجلسة بالتعرف على طفلك - ما يستمتع به وما يلهمه وكيف يحب أن يتعلم ويستكشف. كثير من الأطفال يشعرون بالخجل في البداية، لذلك نركز على بناء الثقة وخلق جو هادئ وداعم.", img: "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png" },
        { step: 2, title: "اكتشف المسار", desc: "نوصي بأفضل مسار تعليمي بناءً على اهتمامات طفلك وعمره وأسلوب تعلمه.", img: "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png" },
        { step: 3, title: "ابدأ التعلم", desc: "يبدأ طفلك في استكشاف المجال المختار من خلال الممارسة العملية مع مرشد متخصص.", img: "https://cdn.kodland.org/main-site-v2/en/main/step-3-en.png" },
      ]
    : [
        { step: 1, title: "Meet your mentor", desc: "The session begins with getting to know your kid – what they enjoy, what inspires them, and how they like to learn and explore. Many children feel shy or unsure at first, so we focus on building trust and creating a calm, supportive atmosphere where they feel confident and at ease.", img: "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png" },
        { step: 2, title: "Discover the path", desc: "We recommend the best learning path based on their interests, age, and learning style.", img: "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png" },
        { step: 3, title: "Start learning", desc: "Your kid starts to explore the chosen field through hands-on practice with a dedicated mentor.", img: "https://cdn.kodland.org/main-site-v2/en/main/step-3-en.png" },
      ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-14">
            {isRTL ? "ابدأ بدرس تجريبي مجاني لترى كيف يعمل" : "Start with a free trial lesson to see how it works"}
          </motion.h2>

          <motion.div variants={fadeUp} className="grid md:grid-cols-[1fr_1.5fr] gap-10 items-start">
            {/* Steps navigation */}
            <div className="space-y-4">
              {steps.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-start p-5 rounded-2xl transition-all ${
                    activeStep === i
                      ? "bg-white shadow-lg border border-[#6c5ce7]/20"
                      : "bg-white/50 border border-transparent hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      activeStep === i ? "bg-[#6c5ce7] text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {item.step}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">
                        {isRTL ? `الخطوة ${item.step} / 3` : `STEP ${item.step} / 3`}
                      </p>
                      <h3 className={`font-bold ${activeStep === i ? "text-[#1a1a2e]" : "text-gray-500"}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Step content */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <img
                src={steps[activeStep].img}
                alt=""
                className="w-full h-auto rounded-2xl mb-6"
              />
              <p className="text-gray-600 leading-relaxed">{steps[activeStep].desc}</p>
              <a
                href="#cta"
                className="inline-block mt-6 px-7 py-3.5 rounded-full bg-[#6c5ce7] text-white font-semibold text-sm hover:bg-[#5a4bd6] transition-colors"
              >
                {isRTL ? "جرّب الآن" : "Try now"}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   REVIEWS SECTION
   ═══════════════════════════════════════════════════════════ */
function ReviewsSection({ isRTL }: { isRTL: boolean }) {
  const reviews = isRTL
    ? [
        { name: "سارة م.", role: "أم", course: "Minecraft", text: "ابني راضٍ جداً عن دروسه في كودلاند. لديه معلم ممتاز، والدروس عبر الإنترنت تعمل بسلاسة دون أي مشاكل تقنية.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-1.png" },
        { name: "رينزو", role: "9 سنوات", course: "تصميم ويب", text: "لقد تعلمت بالفعل كيفية تصميم المواقع. لقد أنشأت بعض المواقع الجيدة حقاً بما في ذلك موقع بيتزا.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-2.png" },
        { name: "ليام", role: "11 سنة", course: "Python", text: "الدروس ممتعة فعلاً. الأسبوع الماضي أجرينا مسابقة لمعرفة من يمكنه صنع أطرف بوت. وعندما تخطئ، لا أحد يصرخ عليك.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-4.png" },
        { name: "إيما", role: "أم", course: "Unity", text: "ابني يعاني من تكوين صداقات. لكن هنا حدث شيء ما. تم إقرانه مع طفل آخر في مشروع، والآن هما لا ينفصلان.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-6.png" },
        { name: "لوكاس", role: "أب", course: "Roblox", text: "مشكلة نوح أنه كان يحب كل شيء. اقترح المرشد تطوير الألعاب لأنه يجمع بين البرمجة والمرئيات. اختيار ذكي!", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-7.png" },
      ]
    : [
        { name: "Sarah M.", role: "Parent", course: "Minecraft", text: "My son is very satisfied with his classes at Kodland. He has an excellent teacher, and the online lessons work smoothly without any technical issues.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-1.png" },
        { name: "Renzo", role: "9 years old", course: "Web Design", text: "I've already learned how to do web design. I've created some really good websites including a pizzeria website.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-2.png" },
        { name: "Liam", role: "11 years old", course: "Python", text: "The classes are actually fun. Last week we had a competition to see who could make the funniest bot. When you mess up, they just help you fix it.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-4.png" },
        { name: "Emma", role: "Parent", course: "Unity", text: "My son struggles with making friends. But here something clicked. He was partnered with another kid on a project, and now they're inseparable.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-6.png" },
        { name: "Lucas", role: "Parent", course: "Roblox", text: "Noah liked everything. The mentor suggested game development since it combines coding and visuals. Smart call! He finally found his thing.", img: "https://cdn.kodland.org/main-site-v2/en/reviews/review-en-7.png" },
      ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">
            {isRTL ? "آلاف العائلات معنا بالفعل" : "Thousands of families are already with us"}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-[#00b67a]">Trustpilot</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scrolling reviews */}
      <div className="relative">
        <div className="flex gap-5 animate-scroll-left hover:[animation-play-state:paused] px-5">
          {[...reviews, ...reviews].map((review, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[340px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a1a2e] text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f0f4ff] text-[#6c5ce7] text-xs font-semibold">
                  {review.course}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   PRINCIPLES SECTION
   ═══════════════════════════════════════════════════════════ */
function PrinciplesSection({ isRTL }: { isRTL: boolean }) {
  const principles = isRTL
    ? [
        { icon: Lightbulb, title: "الحرية والفضول", desc: "الفضول هو أساس كل نمو. نخلق مساحة يمكن للأطفال فيها اختيار ما يلهمهم حقاً والاكتشاف بوتيرتهم الخاصة." },
        { icon: Target, title: "التعلم من خلال الممارسة", desc: "الممارسة تحوّل المعرفة إلى مهارات حقيقية. طلابنا يعملون على مشاريع حقيقية ويقسمون الأهداف الكبيرة إلى خطوات واضحة." },
        { icon: Heart, title: "الرحلة أهم من الوجهة", desc: "لا نؤمن بالصواب أو الخطأ. المسار الأكثر فعالية هو التركيز على العملية: عندما يكون الطفل مهتماً حقاً، يزدهر أسرع." },
        { icon: Users, title: "الناس أهم من التكنولوجيا", desc: "التكنولوجيا أداة رائعة لكنها لن تحل محل التواصل الإنساني. التعلم الحقيقي يحدث من خلال الثقة والتفاعل." },
      ]
    : [
        { icon: Lightbulb, title: "Freedom and curiosity", desc: "Curiosity is the foundation of all growth. We create a space where kids can choose what truly inspires them and discover new ideas at their own pace." },
        { icon: Target, title: "Learning through practice", desc: "Practice turns knowledge into real-life skills. Our students work on real projects and break big goals into clear, achievable steps." },
        { icon: Heart, title: "The journey matters more than the destination", desc: "We don't believe in \"right\" or \"wrong,\" or in grades that label. The most effective path to results is focusing on the process." },
        { icon: Users, title: "People matter more than technology", desc: "Technology is a great tool yet will not replace human connection. Real learning happens through trust and meaningful mentor-student interaction." },
      ];

  return (
    <section className="py-20 bg-[#1a1a2e] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://cdn.kodland.org/main-site-v2/principles__bg.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Decorative heading */}
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {isRTL ? "نحن فخورون بمبادئنا" : "We're proud of our principles"}
            </h2>
            <p className="text-gray-400 text-lg">
              {isRTL
                ? "شكّلتها الخبرة والرغبة الحقيقية في مساعدة الأطفال على النمو بثقة"
                : "shaped by experience and by a genuine desire to help children grow with confidence"}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#6c5ce7]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#6c5ce7]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#a29bfe]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   LEARNING PROCESS SECTION
   ═══════════════════════════════════════════════════════════ */
function LearningProcessSection({ isRTL }: { isRTL: boolean }) {
  const items = isRTL
    ? [
        { title: "من الألعاب المفضلة إلى المشاريع الأصلية", desc: "نبدأ بما يحبه الأطفال بالفعل — مع منصات مثل Roblox و Minecraft." },
        { title: "مسار تعليمي واضح", desc: "من البرمجة البسيطة بالكتل إلى الكود الحقيقي بـ JavaScript أو Python." },
        { title: "العمل الجماعي", desc: "يتعلم الأطفال العمل معاً كفريق لبناء عوالم ألعاب مشتركة واختبار مشاريع بعضهم." },
        { title: "التعلم بالممارسة", desc: "لا تمارين مجردة، فقط مشاريع حقيقية: ألعاب ومواقع وتطبيقات." },
      ]
    : [
        { title: "From favorite games to original projects", desc: "We start with what children already love — with platforms like Roblox and Minecraft." },
        { title: "Clear learning path", desc: "From simple block-based programming to real code in JavaScript or Python." },
        { title: "Teamwork", desc: "Children learn to work together as a team building shared game worlds and testing each other's projects." },
        { title: "Learning by doing", desc: "No abstract exercises, only real-life projects: games, websites, and apps." },
      ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-4">
            {isRTL ? "عملية التعلم" : "Learning process"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">
            {isRTL
              ? "نؤمن أن أقوى دافع للطفل ليس الدرجات — بل الفضول. ننمّي ما يهتم به طفلك حقاً ونحوّل تلك الاهتمامات إلى مهارات حقيقية"
              : "We believe a child's strongest motivation isn't grades — it's curiosity. We nurture what genuinely interests your kid and turn those interests into real-life skills"}
          </motion.p>

          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <img
                src="https://cdn.kodland.org/main-site-v2/en/main/learn-1-en.png"
                alt=""
                className="w-full h-auto rounded-2xl"
              />
            </div>

            {/* Items */}
            <div className="order-1 md:order-2 space-y-5">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-[#f8f9ff] border border-[#e8e8ff]">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   TEACHERS SECTION
   ═══════════════════════════════════════════════════════════ */
function TeachersSection({ isRTL }: { isRTL: boolean }) {
  const teachers = isRTL
    ? [
        { name: "أنطونيا سيمونيدو", exp: "7 سنوات خبرة", subjects: ["Scratch", "Python"], desc: "مصممة مناهج ماهرة تبني دروساً مبسطة للمبتدئين في Scratch و Python وتطوير الويب.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/antonia.png" },
        { name: "نيناد توسيتش", exp: "سنة خبرة", subjects: ["Python", "JavaScript"], desc: "متدرب في تطوير البرمجيات متخصص في Python و JavaScript و SQL.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/nenad.png" },
        { name: "أنتونيلا لوساردي", exp: "10+ سنوات خبرة", subjects: ["Roblox", "Scratch"], desc: "أكثر من 10 سنوات خبرة في التدريس مع شغف بإنشاء الألعاب.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/antonella.png" },
        { name: "مايا بروساك", exp: "7+ سنوات خبرة", subjects: ["Fantastic World Design"], desc: "متخصصة في تصميم الألعاب والواقع الافتراضي مع شغف بتصميم الشخصيات.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/maja.png" },
        { name: "ماركو ميليتشيفيتش", exp: "5 سنوات خبرة", subjects: ["JavaScript", "Python"], desc: "مدرس برمجة بأكثر من 7 سنوات خبرة في تطوير البرمجيات.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/marko.png" },
      ]
    : [
        { name: "Antonia Symeonidou", exp: "7 years of experience", subjects: ["Scratch", "Python"], desc: "Skilled curriculum designer who builds beginner-friendly lessons in Scratch, Python, web development, Unity, and Unreal Engine.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/antonia.png" },
        { name: "Nenad Tosic", exp: "1 year of experience", subjects: ["Python", "JavaScript"], desc: "Trained in software development specializing in Python, JavaScript, and SQL.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/nenad.png" },
        { name: "Antonella Lusardi", exp: "10+ years of experience", subjects: ["Roblox", "Scratch"], desc: "Over 10 years of teaching experience with a passion for creating games with Lua in Roblox and Scratch.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/antonella.png" },
        { name: "Maja Prusak", exp: "7+ years of experience", subjects: ["Fantastic World Design"], desc: "Graduated with a degree in Graphic Design, specializing in Game Design and Virtual Reality.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/maja.png" },
        { name: "Marko Milicevic", exp: "5 years of experience", subjects: ["JavaScript", "Python"], desc: "Programming tutor with over seven years of experience in software development, DevOps, and cloud infrastructure.", img: "https://cdn.kodland.org/main-site-v2/en/teachers/marko.png" },
      ];

  const [activeTeacher, setActiveTeacher] = useState(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-14">
            {isRTL ? "معلمونا هم جوهر مدرستنا" : "Our teachers are the core of our school"}
          </motion.h2>

          <motion.div variants={fadeUp} className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
            {/* Teacher list */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {teachers.map((teacher, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTeacher(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all flex-shrink-0 lg:flex-shrink text-start ${
                    activeTeacher === i
                      ? "bg-white shadow-md border border-[#6c5ce7]/20"
                      : "hover:bg-white/50"
                  }`}
                >
                  <img
                    src={teacher.img}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#1a1a2e] truncate">{teacher.name}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {teacher.subjects.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#6c5ce7] text-[10px] font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active teacher detail */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={teachers[activeTeacher].img}
                  alt={teachers[activeTeacher].name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a2e]">{teachers[activeTeacher].name}</h3>
                  <p className="text-sm text-[#6c5ce7] font-medium mt-1">{teachers[activeTeacher].exp}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {teachers[activeTeacher].subjects.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-[#f0f4ff] text-[#6c5ce7] text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed text-sm">{teachers[activeTeacher].desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   COURSE CTA SECTION
   ═══════════════════════════════════════════════════════════ */
function CourseCTASection({ isRTL }: { isRTL: boolean }) {
  return (
    <section className="py-16 bg-[#f0f4ff]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            {isRTL
              ? "اعثر على الدورة المثالية لطفلك حسب عمره واهتماماته"
              : "Find your perfect fit: a course tailored to your kid's age and interests"}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-8">
            <a
              href="#cta"
              className="inline-block px-8 py-4 rounded-full bg-[#6c5ce7] text-white font-semibold text-base hover:bg-[#5a4bd6] transition-colors shadow-lg shadow-[#6c5ce7]/25"
            >
              {isRTL ? "احجز درس تجريبي مجاني" : "Book a Free Trial"}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   CASE STUDIES SECTION
   ═══════════════════════════════════════════════════════════ */
function CaseStudiesSection({ isRTL }: { isRTL: boolean }) {
  const cases = isRTL
    ? [
        { name: "عمان", age: 14, course: "Python", summary: "أكمل الدورة وبنى ثلاث ألعاب بتوجيه معلمه، والآن يصنع لعبته الخاصة — محاكي كرة قدم", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/oman-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/oman-project.gif" },
        { name: "ألينا", age: 14, course: "Python", summary: "تغلبت على توترها في بيئة كودلاند الترحيبية — وبدأت بالفعل ببناء مشروعها الأول بعد أسبوعين فقط", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/alina-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/alina-project.gif" },
        { name: "شرياس", age: 12, course: "تصميم ويب", summary: "يبني موقعاً لمدرسة الرقص والموسيقى الخاصة بأمه ويتطلع لإنهائه ونشره", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/shreas-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/shreas-project.gif" },
        { name: "كوبان", age: 12, course: "Roblox", summary: "يبني ألعاب محاكاة على Roblox ويتطلع لصنع المزيد في المستقبل", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/coban-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/coban-project.gif" },
        { name: "رينزو", age: 9, course: "تصميم ويب", summary: "من متعلم إلى مبدع: لم يدرس تصميم الويب فحسب — بل بنى مواقع حقيقية", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/renzo-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/renzo-project.gif" },
        { name: "كيشتو", age: 12, course: "Scratch", summary: "يجمع بين البرمجة والرسوم المتحركة في دورة Scratch ويزدهر في بيئة كودلاند", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/keshto-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/keshto-project.gif" },
      ]
    : [
        { name: "Oman", age: 14, course: "Python", summary: "Completed the course, built three games under his teacher's guidance, and is now creating his own — a football simulator", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/oman-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/oman-project.gif" },
        { name: "Alina", age: 14, course: "Python", summary: "Conquered her nerves in Kodland's welcoming space — and is already building her first project just two weeks in", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/alina-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/alina-project.gif" },
        { name: "Shreas", age: 12, course: "Web design", summary: "Creating a website for his mom's dance music school and hoping to finish and publish it", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/shreas-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/shreas-project.gif" },
        { name: "Coban", age: 12, course: "Roblox", summary: "Building simulator games on Roblox and looking forward to making more in the future", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/coban-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/coban-project.gif" },
        { name: "Renzo", age: 9, course: "Web design", summary: "From learner to creator: didn't just study web design — he built live websites, including one for a local pizzeria idea", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/renzo-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/renzo-project.gif" },
        { name: "Keshto", age: 12, course: "Scratch", summary: "Combining coding and animation in his Scratch course, thriving in the Kodland environment", img: "https://cdn.kodland.org/main-site-v2/en/students-stories/keshto-portrait.png", projectImg: "https://cdn.kodland.org/main-site-v2/en/students-stories/keshto-project.gif" },
      ];

  const [activeCase, setActiveCase] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-4">
            {isRTL ? "من الفضول إلى الاكتشاف" : "From Curiosity to Discovery"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-gray-500 mb-12">
            {isRTL ? "قصص نجاح طلابنا" : "Case studies"}
          </motion.p>

          {/* Case study cards - horizontal scroll */}
          <motion.div variants={fadeUp} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {cases.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveCase(i)}
                className={`flex-shrink-0 w-[160px] p-3 rounded-2xl text-center transition-all ${
                  activeCase === i
                    ? "bg-[#f0f4ff] border-2 border-[#6c5ce7]"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover mb-2"
                />
                <p className="font-semibold text-sm text-[#1a1a2e]">{item.name}, {item.age}</p>
                <p className="text-xs text-[#6c5ce7] font-medium">{item.course}</p>
              </button>
            ))}
          </motion.div>

          {/* Active case detail */}
          <div className="mt-8 grid md:grid-cols-2 gap-8 bg-[#f8f9ff] rounded-3xl p-8 border border-[#e8e8ff]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={cases[activeCase].img}
                  alt={cases[activeCase].name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-[#1a1a2e]">{cases[activeCase].name}, {cases[activeCase].age}</p>
                  <p className="text-sm text-[#6c5ce7] font-medium">{cases[activeCase].course}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{cases[activeCase].summary}</p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={cases[activeCase].projectImg}
                alt=""
                className="w-full max-w-[300px] h-auto rounded-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   CTA SECTION - "Join us for a free trial lesson"
   ═══════════════════════════════════════════════════════════ */
function CTASection({ isRTL }: { isRTL: boolean }) {
  return (
    <section id="cta" className="py-20 bg-[#6c5ce7] text-white">
      <div className="max-w-[700px] mx-auto px-5 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">
            {isRTL ? "انضم إلينا في درس تجريبي مجاني" : "Join us for a free trial lesson"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/80 text-base mb-10 max-w-xl mx-auto">
            {isRTL
              ? "اختر دورة الآن، أو اتخذ قرارك بعد الدرس التجريبي وملاحظات المرشد! في ساعة واحدة فقط، سنتعرف على طفلك ونوصي بأفضل مسار تعليمي."
              : "Choose a course right away, or make your choice after the trial lesson and feedback from the mentor! In just one hour, we'll get to know your kid, recommend the best learning path based on their interests, and start to explore the chosen field through hands-on practice."}
          </motion.p>

          {/* Form */}
          <motion.div variants={fadeUp} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2 text-start">
                  {isRTL ? "اختر لغة الدراسة" : "Select the language in which you would like to study"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(isRTL
                    ? ["الإنجليزية", "الإسبانية", "الإندونيسية", "الإيطالية", "التركية", "البولندية", "البرتغالية", "أخرى"]
                    : ["English", "Spanish", "Indonesian", "Italian", "Turkish", "Polish", "Portuguese", "Other"]
                  ).map((lang) => (
                    <button
                      key={lang}
                      className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full px-8 py-4 rounded-xl bg-white text-[#6c5ce7] font-bold text-base hover:bg-gray-50 transition-colors shadow-lg mt-4">
                {isRTL ? "الخطوة التالية" : "Next step"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════════════════ */
function FAQSection({ isRTL }: { isRTL: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = isRTL
    ? [
        { q: "هل يمكننا تغيير المعلم/الدورة/الجدول؟", a: "نعم! يمكنك تغيير المعلم أو الدورة أو الجدول في أي وقت. فريق الدعم لدينا سيساعدك في إجراء أي تعديلات." },
        { q: "هل يمكننا الانضمام للدروس عبر الهاتف أو التابلت؟", a: "نوصي باستخدام كمبيوتر محمول أو مكتبي للحصول على أفضل تجربة تعليمية، لكن بعض الدورات يمكن الوصول إليها عبر التابلت." },
        { q: "كيف يمكنني متابعة تقدم طفلي؟", a: "لدينا منصة تعليمية حيث يمكنك رؤية تقدم طفلك ودرجاته ومشاريعه. كما ستتلقى تقارير منتظمة من المعلم." },
        { q: "كيف تثبتون أن شركتكم حقيقية؟", a: "نحن معتمدون من STEM.org ولدينا أكثر من 9000 مراجعة على Trustpilot. يمكنك أيضاً التحقق من سجلنا التجاري." },
        { q: "كيف تُعقد الدروس؟", a: "الدروس تُعقد عبر الإنترنت في فصول افتراضية مع معلم مباشر. كل درس مدته 50 دقيقة ويتضمن نظرية وممارسة عملية." },
      ]
    : [
        { q: "Can we change the tutor/course/schedule?", a: "Yes! You can change the tutor, course, or schedule at any time. Our support team will help you make any adjustments needed." },
        { q: "Can we join the classes through mobile devices like phones or tablets?", a: "We recommend using a laptop or desktop for the best learning experience, but some courses can be accessed via tablet." },
        { q: "How can I track my child's progress?", a: "We have a learning platform where you can see your child's progress, grades, and projects. You'll also receive regular reports from the teacher." },
        { q: "How can you prove that your company is real? What if it's all a scam?", a: "We are STEM.org accredited and have over 9,000 reviews on Trustpilot. You can also verify our business registration." },
        { q: "How are the lessons held?", a: "Lessons are held online in virtual classrooms with a live teacher. Each lesson is 50 minutes and includes theory and hands-on practice." },
      ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[700px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#1a1a2e] text-center mb-4">
            {isRTL ? "الأسئلة الشائعة" : "FAQ"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-gray-500 mb-10">
            {isRTL
              ? "تحقق من إجابات الأسئلة الأكثر شيوعاً أدناه، أو قم بزيارة مركز المساعدة لمزيد من المعلومات"
              : "Check answers to the most common questions below, or visit the Help Center for more information"}
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-start"
                >
                  <span className="font-medium text-[#1a1a2e] text-sm pe-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          <div className="mt-8 text-center">
            <a href="#" className="text-[#6c5ce7] font-semibold text-sm hover:underline">
              {isRTL ? "مركز المساعدة" : "Help Center"}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════
   FOOTER SECTION
   ═══════════════════════════════════════════════════════════ */
function FooterSection({ isRTL }: { isRTL: boolean }) {
  return (
    <footer className="bg-[#1a1a2e] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">{isRTL ? "كودلاند" : "Kodland"}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {isRTL
                ? "KODLAND PTE. LTD.\n68 CIRCULAR ROAD 02-01\nSINGAPORE (049422)"
                : "KODLAND PTE. LTD.\n68 CIRCULAR ROAD 02-01\nSINGAPORE (049422)"}
            </p>
          </div>

          {/* School links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{isRTL ? "المدرسة" : "School"}</h4>
            <ul className="space-y-2.5">
              {(isRTL
                ? ["عن المدرسة", "المنهجية", "المعلمون", "الوظائف", "اتصل بنا"]
                : ["About us", "Methods", "Tutors", "Careers", "Contacts"]
              ).map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#a29bfe] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{isRTL ? "الدورات" : "Courses"}</h4>
            <ul className="space-y-2.5">
              {(isRTL
                ? ["جميع الدورات", "البرمجة", "التصميم", "الرسم", "الرياضيات"]
                : ["All courses", "Programming", "Design", "Drawing", "Math"]
              ).map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[#a29bfe] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{isRTL ? "النشرة الإخبارية" : "Newsletter"}</h4>
            <p className="text-sm text-gray-400 mb-4">
              {isRTL
                ? "ابق على اطلاع بالبرامج والفعاليات الجديدة ونصائح لتطوير طفلك"
                : "Stay up to date with new programs, events, and tips for your child's development"}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={isRTL ? "بريدك الإلكتروني" : "Your email"}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6c5ce7]"
              />
              <button className="px-4 py-2.5 rounded-lg bg-[#6c5ce7] text-white text-sm font-medium hover:bg-[#5a4bd6] transition-colors">
                {isRTL ? "اشترك" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© Kodland, 2026</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {isRTL ? "سياسة الخصوصية" : "Privacy policy"}
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {isRTL ? "شروط الاستخدام" : "Terms of use"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
