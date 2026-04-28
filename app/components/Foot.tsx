"use client";
import { useLang } from "../i18n/LangContext";
import { motion } from "framer-motion";

export default function Foot() {
  const { tr, isRTL } = useLang();
  const h = tr.hero;

  return (
    <section id="download" className="relative bg-white w-full overflow-x-clip flex flex-col -mt-[1px] border-t-0 pt-[1px] z-20 pb-10 sm:pb-0">

      {/* White area — headline */}
      <div className="relative flex-1 flex items-end w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-[40px] lg:pt-[80px] z-40">
        <motion.div
          className="w-full text-start pb-2 relative z-50 lg:px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-[32px] sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-[#1a1a1a]">
            {isRTL ? "استثمر بذكاء." : "Invest Smart."}
            <br />
            <span className={isRTL ? "text-[28px] sm:text-[42px] md:text-[52px]" : ""}>
              {isRTL ? "في الذهب والفضة." : "In Gold & Silver."}
            </span>
          </h2>
        </motion.div>
      </div>

      {/* Gold card */}
      <div className="relative w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 -mb-16 sm:-mb-24 lg:-mb-32 mt-8 z-30 drop-shadow-2xl">
        <motion.div
          className="w-full bg-[#FFF3D0] rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] px-8 sm:px-12 md:px-14 lg:px-16 py-10 md:py-12 lg:py-16 border border-[#F0E2B4]/60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <div className="w-full lg:w-[60%] relative z-10 text-start">
            <p className="text-[14px] sm:text-[18px] lg:text-[19px] text-[#555] leading-relaxed mb-6 sm:mb-8 max-w-[480px]">
              {h.sub}
            </p>
            <div className="flex flex-row items-center gap-2 sm:gap-3 justify-start mt-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-bold text-[15px] sm:text-[17px] hover:bg-black transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
              >
                {isRTL ? "اشتر الآن" : "Buy Now"}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
