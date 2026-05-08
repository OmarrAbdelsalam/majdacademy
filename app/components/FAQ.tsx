"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../i18n/LangContext";

const faqData = [
  {
    questionAr: "ما هي GCT Gold وكيف تعمل؟",
    questionEn: "What is GCT Gold and how does it work?",
    answerAr: "GCT Gold هي منصة رقمية موثوقة لبيع الذهب والفضة. نوفر لك السبائك والجنيهات الذهبية بأسعار تنافسية مع إمكانية التوصيل لباب البيت.",
    answerEn: "GCT Gold is a trusted digital platform for selling gold and silver. We offer bars and gold coins at competitive prices with home delivery options.",
  },
  {
    questionAr: "هل السبائك معتمدة ومضمونة؟",
    questionEn: "Are the bars certified and guaranteed?",
    answerAr: "نعم، جميع السبائك معتمدة من هيئات دولية وتأتي مع شهادة ضمان توضح العيار والوزن. السبائك الذهبية بعيار 24 (999.9) والفضة بعيار 999.",
    answerEn: "Yes, all bars are internationally certified and come with a guarantee certificate showing purity and weight. Gold bars are 24K (999.9) and silver bars are 999 purity.",
  },
  {
    questionAr: "كيف يتم تسعير الذهب والفضة؟",
    questionEn: "How is gold and silver priced?",
    answerAr: "الأسعار مرتبطة بالسوق العالمي مباشرة ويتم تحديثها لحظياً. نوفر لك أسعار شفافة وتنافسية بدون رسوم خفية، مع إشعارات فورية عند تغير الأسعار.",
    answerEn: "Prices are directly linked to the global market and updated in real-time. We provide transparent and competitive pricing with no hidden fees, plus instant notifications when prices change.",
  },
  {
    questionAr: "ما هي طرق الدفع المتاحة؟",
    questionEn: "What payment methods are available?",
    answerAr: "نقبل الدفع عبر التحويل البنكي، البطاقات الائتمانية (فيزا وماستركارد)، والمحافظ الإلكترونية. جميع المعاملات مؤمنة بتشفير عالي المستوى.",
    answerEn: "We accept bank transfers, credit cards (Visa and Mastercard), and digital wallets. All transactions are secured with high-level encryption.",
  },
  {
    questionAr: "كم يستغرق التوصيل؟",
    questionEn: "How long does delivery take?",
    answerAr: "التوصيل يتم خلال 24-48 ساعة داخل القاهرة الكبرى، و3-5 أيام عمل للمحافظات. جميع الشحنات مؤمنة ومغلفة بعناية فائقة.",
    answerEn: "Delivery takes 24-48 hours within Greater Cairo, and 3-5 business days for other governorates. All shipments are insured and carefully packaged.",
  },

];

function FAQItem({ item, isRTL, isOpen, onToggle }: { 
  item: typeof faqData[0]; 
  isRTL: boolean; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#eee] last:border-b-0 ">
      <button
        onClick={onToggle}
        className="w-full flex items-start sm:items-center justify-between gap-4 py-6 text-start group"
      >
        <span className="text-[14px] sm:text-[18px] font-bold text-[#1a1a1a] leading-relaxed">
          {isRTL ? item.questionAr : item.questionEn}
        </span>
        <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#1a1a1a] text-white rotate-45' : 'bg-[#f5f5f5] text-[#999] group-hover:bg-[#eee]'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[13px] sm:text-[15px] text-[#777] leading-[1.8] pb-6">
              {isRTL ? item.answerAr : item.answerEn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { isRTL } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full bg-white py-20 md:py-32" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
          {/* Left / Top — Title */}
          <div>
            <motion.h2
              className="text-[28px] sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-[#1a1a1a] mb-3 sm:mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </motion.h2>
            <motion.p
              className="text-[13px] sm:text-[16px] text-[#888] leading-relaxed max-w-[400px] mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {isRTL
                ? "كل ما تحتاج معرفته عن شراء وبيع الذهب والفضة من خلال منصة GCT Gold."
                : "Everything you need to know about buying and selling gold and silver through GCT Gold."}
            </motion.p>

            <motion.a
              href="#contact"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-[14px] text-[14px] sm:text-[15px] font-bold hover:bg-black transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {isRTL ? "تواصل معنا" : "Contact Us"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.a>

            <div className="w-full flex justify-center lg:justify-start relative z-10">
              <motion.div
                className="hidden lg:flex flex-col items-center justify-center mt-20 w-full max-w-[600px] cursor-pointer pointer-events-auto"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <div className="flex items-center gap-12 mb-2" dir="ltr">
                  {["G", "C", "T"].map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        rest: { opacity: 0.2, y: 0, scale: 1 },
                        hover: { 
                          opacity: 1, 
                          y: -10, 
                          scale: 1.1,
                          transition: { delay: (3 - i) * 0.1 } 
                        }
                      }}
                      className="text-[120px] xl:text-[200px] font-black leading-none drop-shadow-2xl"
                      style={{
                        background: "linear-gradient(135deg, #FFD700 0%, #D4A82A 50%, #B8860B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
                
              </motion.div>
            </div>
          </div>

          {/* Right / Bottom — Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {faqData.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                isRTL={isRTL}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
