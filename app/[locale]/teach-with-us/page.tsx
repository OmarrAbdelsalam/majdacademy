"use client";
import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { useCountry } from "../../i18n/CountryContext";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../components/layout/FloatingWhatsApp";
import { motion } from "framer-motion";

const content = {
  ar: {
    heroTitle: "انضم لفريق معلمي",
    heroHighlight: "مَجْد",
    heroDesc: "نبحث عن معلمين متميزين يشاركوننا شغفنا بالتعليم. إذا عندك خبرة في المنهج الإماراتي وتحب تأثر في حياة الطلاب — مكانك معنا.",
    heroCta: "قدّم الآن",
    whyTitle: "ليش تنضم لـ",
    whyHighlight: "مَجْد؟",
    benefits: [
      { title: "دخل مجزي", desc: "رواتب تنافسية ومكافآت على الأداء المتميز" },
      { title: "مرونة كاملة", desc: "اشتغل من بيتك واختر أوقاتك المناسبة" },
      { title: "دعم مستمر", desc: "فريق أكاديمي يساعدك بالمناهج والمواد التعليمية" },
      { title: "تطوير مهني", desc: "تدريبات وورش عمل لتطوير مهاراتك التدريسية" },
      { title: "بيئة محفزة", desc: "مجتمع معلمين متحمسين يشاركونك نفس الرؤية" },
      { title: "تأثير حقيقي", desc: "ساهم في بناء جيل واثق ومتفوق" },
    ],
    formTitle: "سجّل معنا",
    formDesc: "عبّي البيانات وبنتواصل معك خلال 48 ساعة",
    nameLabel: "الاسم الكامل",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "رقم الهاتف",
    subjectLabel: "المادة / التخصص",
    subjectPlaceholder: "مثال: اللغة العربية، التربية الإسلامية",
    experienceLabel: "سنوات الخبرة",
    experienceOptions: ["أقل من سنة", "1-3 سنوات", "3-5 سنوات", "أكثر من 5 سنوات"],
    gradesLabel: "المراحل الدراسية",
    gradesOptions: ["الصف 1-5 (ابتدائي)", "الصف 6-9 (متوسط)", "الصف 10-12 (ثانوي)"],
    bioLabel: "نبذة عنك (اختياري)",
    bioPlaceholder: "اكتب نبذة مختصرة عن خبرتك وأسلوبك في التدريس...",
    submit: "أرسل طلبك",
    sending: "جارٍ الإرسال...",
    successMsg: "تم إرسال طلبك بنجاح! بنتواصل معك قريباً.",
    required: "*",
  },
  en: {
    heroTitle: "Join the",
    heroHighlight: "Majd",
    heroDesc: "We're looking for outstanding teachers who share our passion for education. If you have experience with the UAE curriculum and love making an impact — your place is with us.",
    heroCta: "Apply Now",
    whyTitle: "Why join",
    whyHighlight: "Majd?",
    benefits: [
      { title: "Competitive Pay", desc: "Attractive salaries with performance bonuses" },
      { title: "Full Flexibility", desc: "Work from home and choose your own schedule" },
      { title: "Ongoing Support", desc: "Academic team helps with curriculum and materials" },
      { title: "Professional Growth", desc: "Training and workshops to develop your skills" },
      { title: "Inspiring Community", desc: "A community of passionate teachers with shared vision" },
      { title: "Real Impact", desc: "Help build a confident and excelling generation" },
    ],
    formTitle: "Apply to Teach",
    formDesc: "Fill in your details and we'll get back to you within 48 hours",
    nameLabel: "Full Name",
    emailLabel: "Email",
    phoneLabel: "Phone Number",
    subjectLabel: "Subject / Specialization",
    subjectPlaceholder: "e.g. Arabic Language, Islamic Education",
    experienceLabel: "Years of Experience",
    experienceOptions: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"],
    gradesLabel: "Grade Levels",
    gradesOptions: ["Grades 1-5 (Primary)", "Grades 6-9 (Middle)", "Grades 10-12 (Secondary)"],
    bioLabel: "About You (optional)",
    bioPlaceholder: "Write a brief summary about your experience and teaching style...",
    submit: "Submit Application",
    sending: "Sending...",
    successMsg: "Application submitted successfully! We'll contact you soon.",
    required: "*",
  },
};

export default function TeachWithUsPage() {
  const { isRTL, lang } = useLang();
  const { activeCountry } = useCountry();

  const countryAr = activeCountry.id === 'other' ? 'بلدك' : activeCountry.labelAr;
  const countryEn = activeCountry.id === 'other' ? 'your country' : activeCountry.labelEn;

  const dynamicContent = {
    ...content,
    ar: {
      ...content.ar,
      heroDesc: `نبحث عن معلمين متميزين يشاركوننا شغفنا بالتعليم. إذا عندك خبرة في المنهج المعتمد في ${countryAr} وتحب تأثر في حياة الطلاب — مكانك معنا.`,
    },
    en: {
      ...content.en,
      heroDesc: `We're looking for outstanding teachers who share our passion for education. If you have experience with the ${countryEn} curriculum and love making an impact — your place is with us.`,
    }
  };

  const c = dynamicContent[lang as keyof typeof dynamicContent] || dynamicContent.ar;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [grades, setGrades] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleGrade = (grade: string) => {
    setGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError(isRTL ? "الاسم مطلوب" : "Name is required"); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email"); return; }
    if (!phone.trim()) { setError(isRTL ? "رقم الهاتف مطلوب" : "Phone is required"); return; }
    if (!subject.trim()) { setError(isRTL ? "التخصص مطلوب" : "Subject is required"); return; }
    if (!experience) { setError(isRTL ? "اختر سنوات الخبرة" : "Select experience"); return; }
    if (grades.length === 0) { setError(isRTL ? "اختر مرحلة دراسية واحدة على الأقل" : "Select at least one grade level"); return; }

    setError("");
    setLoading(true);

    // Simulate submission (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
  };

  const inputCls =
    "w-full bg-[#f8f9fa] rounded-[32px] px-6 py-4 border border-transparent focus:border-[#ef5da8]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,93,168,0.08)] transition-all duration-200 text-[15px] font-medium text-[#262626] outline-none placeholder:text-[rgba(38,38,38,0.4)]";

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const } },
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-[#262626] flex flex-col relative"
      
    >
      <AcademyNavbar />

      {/* Hero Section — Lime gradient banner */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://cdn.kodland.org/main-site-v2/bg-pink.png')",
            backgroundSize: "cover",
            backgroundPosition: "center" }}
        />
        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1
              className="text-white font-extrabold leading-[120%] mb-6"
              style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
            >
              {c.heroTitle}{" "}<span>{c.heroHighlight}</span>
            </h1>
            <p
              className="mx-auto mb-8"
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "28px",
                color: "rgba(255,255,255,0.9)",
                maxWidth: "650px" }}
            >
              {c.heroDesc}
            </p>
            <a
              href="#apply-form"
              className="inline-flex items-center justify-center rounded-[60px] bg-white text-[#ef5da8] hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
              style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 600 }}
            >
              {c.heroCta}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2
              className="text-[#262626] font-extrabold leading-[120%]"
              style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
            >
              {c.whyTitle}{" "}{c.whyHighlight}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.benefits.map((item, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-[32px] bg-[#f8f9fa] hover:-translate-y-2 hover:shadow-xl hover:border-[#262626]/10 border border-transparent transition-all duration-300 group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0, 0, 0.2, 1] as const } } }}
              >
                <div className="w-12 h-12 rounded-full bg-[#ef5da8]/10 flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 text-[#ef5da8]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-[24px] font-extrabold text-[#262626] mb-3">{item.title}</h3>
                <p className="text-[15px] font-medium leading-[26px] text-[rgba(38,38,38,0.6)]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-form" className="py-12 md:py-16 bg-[#f8f9fa]">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="text-center mb-10">
              <h2
                className="text-[#262626] font-extrabold leading-[120%] mb-3"
                style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                {c.formTitle}
              </h2>
              <p className="text-[15px] font-medium text-[rgba(38,38,38,0.6)] leading-[26px]">
                {c.formDesc}
              </p>
            </div>

            {success ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-[#eefbf3] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[18px] font-bold text-[#262626]">{c.successMsg}</p>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.nameLabel} <span className="text-[#ef5da8]">{c.required}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRTL ? "محمد أحمد" : "Mohamed Ahmed"}
                    className={inputCls}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.emailLabel} <span className="text-[#ef5da8]">{c.required}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@email.com"
                    className={inputCls}
                    dir="ltr"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.phoneLabel} <span className="text-[#ef5da8]">{c.required}</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 XX XXX XXXX"
                    className={inputCls}
                    dir="ltr"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.subjectLabel} <span className="text-[#ef5da8]">{c.required}</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={c.subjectPlaceholder}
                    className={inputCls}
                  />
                </div>

                {/* Experience */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.experienceLabel} <span className="text-[#ef5da8]">{c.required}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {c.experienceOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setExperience(opt)}
                        className={`px-5 py-2.5 rounded-full text-[14px] font-bold transition-all duration-200 ${
                          experience === opt
                            ? "bg-[#262626] text-white"
                            : "bg-[#262626]/5 text-[#262626] hover:bg-[#262626] hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grades */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.gradesLabel} <span className="text-[#ef5da8]">{c.required}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {c.gradesOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleGrade(opt)}
                        className={`px-5 py-2.5 rounded-full text-[14px] font-bold transition-all duration-200 ${
                          grades.includes(opt)
                            ? "bg-[#ef5da8] text-white"
                            : "bg-[#262626]/5 text-[#262626] hover:bg-[#ef5da8] hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {c.bioLabel}
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={c.bioPlaceholder}
                    rows={4}
                    className="w-full bg-white rounded-[24px] px-6 py-4 border border-transparent focus:border-[#ef5da8]/40 focus:shadow-[0_0_0_3px_rgba(239,93,168,0.08)] transition-all duration-200 text-[15px] font-medium text-[#262626] outline-none placeholder:text-[rgba(38,38,38,0.4)] resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="px-5 py-3.5 rounded-[32px] bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
                >
                  {loading ? c.sending : c.submit}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
