"use client";
import { motion } from "framer-motion";
import { useLang } from "../i18n/LangContext";
import { useEffect, useState } from "react";
import { getBranches } from "../../lib/api";

interface Branch {
  id: number;
  name?: string;
  address?: string;
  city?: string;
  working_hours?: string;
  phone?: string;
}

export default function AboutUs() {
  const { isRTL, lang } = useLang();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    getBranches(lang).then((res) => {
      if (res.success && res.data) {
        setBranches(Array.isArray(res.data) ? res.data : []);
      }
    });
  }, [lang]);

  // Fallback branches if API returns empty
  const displayBranches =
    branches.length > 0
      ? branches
      : [
          {
            id: 1,
            name: isRTL ? "مصر الجديدة" : "Heliopolis",
            city: isRTL ? "القاهرة" : "Cairo",
          },
          {
            id: 2,
            name: isRTL ? "طنطا" : "Tanta",
            city: isRTL ? "الغربية" : "Gharbia",
          },
          {
            id: 3,
            name: isRTL ? "شبين الكوم" : "Shebin El Kom",
            city: isRTL ? "المنوفية" : "Menoufia",
          },
        ];

  const trustBadges = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      titleAr: "مرخص ومعتمد",
      titleEn: "Licensed & Certified",
      descAr: "شركة مصرية مرخصة ومعتمدة من الجهات الرقابية",
      descEn: "Egyptian company licensed and certified by regulatory authorities",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      titleAr: "متوافق مع الشريعة",
      titleEn: "Sharia Compliant",
      descAr: "جميع المعاملات متوافقة مع أحكام الشريعة الإسلامية",
      descEn: "All transactions comply with Islamic Sharia principles",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      titleAr: "توصيل لباب البيت",
      titleEn: "Doorstep Delivery",
      descAr: "توصيل مؤمن لباب بيتك في أسرع وقت",
      descEn: "Secure and fast doorstep delivery",
    },
  ];

  return (
    <section
      className="relative w-full bg-[#FDFBF5] py-20 md:py-28 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top gold glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[150px] sm:h-[200px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(212, 168, 42, 0.06), transparent 100%)",
        }}
      ></div>

      {/* Side ambient glows */}
      <div
        className="absolute bottom-20 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full blur-[80px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(212, 168, 42, 0.04), transparent 70%)",
        }}
      ></div>

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[13px] sm:text-[14px] text-[#aaa] font-bold mb-4 tracking-wide uppercase">
            {isRTL ? "تعرف علينا" : "Get to Know Us"}
          </p>
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold text-[#1a1a1a] leading-tight tracking-tight mb-5">
            {isRTL ? (
              <>
                عن{" "}
                <span className="gold-gradient-text">جولدن سيركل</span>
              </>
            ) : (
              <>
                About{" "}
                <span className="gold-gradient-text">Golden Circle</span>
              </>
            )}
          </h2>
          <p className="text-[14px] sm:text-[17px] text-[#777] max-w-2xl mx-auto leading-relaxed font-medium">
            {isRTL
              ? "منصة مرخصة ومتوافقة مع الشريعة الإسلامية للاستثمار في الذهب والفضة. نوفر لك سبائك وجنيهات ذهبية وفضية بأسعار تنافسية وتوصيل لباب بيتك."
              : "A licensed, Sharia-compliant platform for gold and silver investment. We offer premium gold and silver bars and coins at competitive prices with secure doorstep delivery."}
          </p>
        </motion.div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-14 sm:mb-20">
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#eee] shadow-sm p-6 sm:p-8 flex flex-col items-center text-center hover:border-[#C9A84C]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fdfdfd] border border-[#f0f0f0] flex items-center justify-center mb-5 group-hover:border-[#C9A84C]/40 transition-colors">
                {badge.icon}
              </div>
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#1a1a1a] mb-2">
                {isRTL ? badge.titleAr : badge.titleEn}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#777] leading-relaxed">
                {isRTL ? badge.descAr : badge.descEn}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Branches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-[11px] sm:text-[12px] font-bold text-[#aaa] uppercase tracking-[0.2em] text-center mb-8">
            {isRTL ? "فروعنا" : "Our Branches"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {displayBranches.map((branch, idx) => (
              <motion.div
                key={branch.id}
                className="bg-white rounded-2xl border border-[#eee] shadow-sm px-5 py-4 flex items-center gap-3 hover:border-[#C9A84C]/40 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.08 }}
              >
                <div className="w-9 h-9 rounded-xl bg-[#fdfdfd] border border-[#f0f0f0] flex items-center justify-center shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1a1a1a]">
                    {branch.name}
                  </p>
                  <p className="text-[12px] text-[#888]">
                    {branch.city || branch.address}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
