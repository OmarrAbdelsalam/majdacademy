"use client";
import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../components/layout/FloatingWhatsApp";
import { motion } from "framer-motion";

const content = {
  ar: {
    title: "تواصل",
    titleHighlight: "معنا",
    subtitle: "عندك سؤال أو استفسار؟ فريقنا جاهز يساعدك. تواصل معنا بالطريقة اللي تناسبك.",
    formTitle: "أرسل لنا رسالة",
    nameLabel: "الاسم",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "رقم الهاتف (اختياري)",
    subjectLabel: "الموضوع",
    subjectOptions: ["استفسار عام", "حجز حصة تجريبية", "مشكلة تقنية", "اقتراح أو شكوى", "أخرى"],
    messageLabel: "الرسالة",
    messagePlaceholder: "اكتب رسالتك هنا...",
    submit: "أرسل الرسالة",
    sending: "جارٍ الإرسال...",
    successMsg: "تم إرسال رسالتك بنجاح! بنرد عليك خلال 24 ساعة.",
    required: "*",
    contactTitle: "أو تواصل مباشرة",
    whatsapp: "واتساب",
    whatsappDesc: "رد سريع خلال دقائق",
    whatsappNum: "+971 50 000 0000",
    emailContact: "البريد الإلكتروني",
    emailContactDesc: "نرد خلال 24 ساعة",
    emailAddr: "info@majdacademy.ae",
    hours: "ساعات العمل",
    hoursDesc: "السبت - الخميس",
    hoursTime: "9:00 صباحاً - 9:00 مساءً",
    location: "الموقع",
    locationDesc: "الإمارات العربية المتحدة",
  },
  en: {
    title: "Contact",
    titleHighlight: "Us",
    subtitle: "Have a question or inquiry? Our team is ready to help. Reach out in the way that suits you best.",
    formTitle: "Send us a message",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    subjectLabel: "Subject",
    subjectOptions: ["General Inquiry", "Book a Trial Class", "Technical Issue", "Suggestion or Complaint", "Other"],
    messageLabel: "Message",
    messagePlaceholder: "Write your message here...",
    submit: "Send Message",
    sending: "Sending...",
    successMsg: "Message sent successfully! We'll respond within 24 hours.",
    required: "*",
    contactTitle: "Or reach us directly",
    whatsapp: "WhatsApp",
    whatsappDesc: "Quick reply within minutes",
    whatsappNum: "+971 50 000 0000",
    emailContact: "Email",
    emailContactDesc: "We respond within 24 hours",
    emailAddr: "info@majdacademy.ae",
    hours: "Working Hours",
    hoursDesc: "Saturday - Thursday",
    hoursTime: "9:00 AM - 9:00 PM",
    location: "Location",
    locationDesc: "United Arab Emirates",
  },
};

export default function ContactPage() {
  const { isRTL, lang } = useLang();
  const c = content[lang as keyof typeof content] || content.ar;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError(isRTL ? "الاسم مطلوب" : "Name is required"); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email"); return; }
    if (!subject) { setError(isRTL ? "اختر الموضوع" : "Select a subject"); return; }
    if (!message.trim()) { setError(isRTL ? "الرسالة مطلوبة" : "Message is required"); return; }

    setError("");
    setLoading(true);
    // Simulate submission
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

  const contactCards = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#ef5da8]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      title: c.whatsapp,
      desc: c.whatsappDesc,
      value: c.whatsappNum,
      href: "https://wa.me/971528150547",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#ef5da8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <polyline points="22,7 12,14 2,7" />
        </svg>
      ),
      title: c.emailContact,
      desc: c.emailContactDesc,
      value: c.emailAddr,
      href: "mailto:info@majdacademy.ae",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#ef5da8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: c.hours,
      desc: c.hoursDesc,
      value: c.hoursTime,
      href: null,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#ef5da8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: c.location,
      desc: c.locationDesc,
      value: "",
      href: null,
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-[#262626] flex flex-col relative"
      
    >
      <AcademyNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-white" />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: "radial-gradient(140% 95% at 50% 0%, #fce7f3 0%, #f9a8d4 50%, #ffffff 100%)"
          }}
        />
        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1
              className="text-[#262626] font-extrabold leading-[120%] mb-4"
              style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
            >
              {c.title}{" "}{c.titleHighlight}
            </h1>
            <p
              className="mx-auto"
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "28px",
                color: "rgba(38,38,38,0.6)",
                maxWidth: "600px" }}
            >
              {c.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards + Form */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Info Cards */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <motion.h3
                className="text-[24px] font-extrabold text-[#262626] mb-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                {c.contactTitle}
              </motion.h3>
              {contactCards.map((card, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-[32px] bg-[#f8f9fa] hover:-translate-y-1 hover:shadow-xl hover:border-[#262626]/10 border border-transparent transition-all duration-300 group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0, 0, 0.2, 1] as const } } }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#fef0f8] flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#262626]">{card.title}</p>
                      <p className="text-[13px] font-medium text-[rgba(38,38,38,0.4)] mb-1">{card.desc}</p>
                      {card.href ? (
                        <a
                          href={card.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] font-bold text-[#ef5da8] hover:text-[#262626] transition-colors"
                          dir="ltr"
                        >
                          {card.value}
                        </a>
                      ) : (
                        <p className="text-[14px] font-bold text-[#262626]" dir="ltr">{card.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <motion.div
                className="p-8 rounded-[32px] bg-[#f8f9fa]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <h3 className="text-[24px] font-extrabold text-[#262626] mb-6">{c.formTitle}</h3>

                {success ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-[#eefbf3] flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[18px] font-bold text-[#262626]">{c.successMsg}</p>
                  </div>
                ) : (
                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                          {c.nameLabel} <span className="text-[#ef5da8]">{c.required}</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isRTL ? "الاسم الكامل" : "Full name"}
                          className={inputCls}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                          {c.emailLabel} <span className="text-[#ef5da8]">{c.required}</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className={inputCls}
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Phone + Subject row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                          {c.phoneLabel}
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
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                          {c.subjectLabel} <span className="text-[#ef5da8]">{c.required}</span>
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={inputCls + " appearance-none cursor-pointer"}
                        >
                          <option value="">{isRTL ? "اختر..." : "Select..."}</option>
                          {c.subjectOptions.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                        {c.messageLabel} <span className="text-[#ef5da8]">{c.required}</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={c.messagePlaceholder}
                        rows={5}
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

          </div>
        </div>
      </section>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
