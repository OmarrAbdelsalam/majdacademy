"use client";
import React from "react";
import { Clock, Users, BookOpen, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  reverse?: boolean;
}

const features: Feature[] = [
  {
    title: "حصص أونلاين تفاعلية",
    description: "الطالب يحضر من البيت بكل راحة، يتفاعل مع المعلم مباشرة ويسأل ويشارك كأنه في الفصل.",
    icon: <Smartphone className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "معلمين متخصصين بالمنهج الإماراتي",
    description: "كل معلم خبير بمادته ويعرف كيف يوصّل المعلومة بأسلوب يحبب الطالب بالدراسة.",
    icon: <Users className="w-6 h-6" strokeWidth={1.5} />,
    reverse: true,
  },
  {
    title: "جدول مرن يناسب وقتكم",
    description: "اختاروا المواعيد اللي تريحكم — صباحية أو مسائية. ما نضغط على الطالب، نخليه يدرس وهو مرتاح.",
    icon: <Clock className="w-6 h-6" strokeWidth={1.5} />,
  },
  {
    title: "متابعة مستمرة لولي الأمر",
    description: "تقارير دورية وتواصل مباشر عبر الواتساب. دايماً تعرف وين وصل مستوى ولدك.",
    icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} />,
    reverse: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function WhyMajdSection() {
  return (
    <section className="py-20 md:py-28 bg-white" dir="rtl" id="features">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16 md:mb-20"
        >
          <h2
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "120%",
              color: "#262626",
            }}
          >
            ليش <span style={{ color: "#ef5da8" }}>مَجْد</span>؟
          </h2>
          <p
            className="mx-auto"
            style={{
              fontSize: "20px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: "28px",
              marginTop: "24px",
              maxWidth: "700px",
              color: "rgba(38, 38, 38, 0.7)",
            }}
          >
            نوفر لعيالكم تجربة تعليمية متكاملة تجمع بين الجودة والراحة
          </p>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col gap-20 md:gap-28">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`flex flex-col ${feature.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16`}
            >
              {/* Image/Visual Side */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div
                  className="relative w-full max-w-[450px] aspect-[4/3] rounded-3xl flex items-center justify-center overflow-hidden"
                  style={{ background: "#fafafa" }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(239,93,168,0.1)" }}>
                    <span className="text-[#ef5da8]">{feature.icon}</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full" style={{ background: "rgba(239,93,168,0.05)" }} />
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full" style={{ background: "rgba(239,93,168,0.03)" }} />

                  {/* Placeholder mockup */}
                  <div className="relative z-10 w-[60%] aspect-[9/16] rounded-[24px] flex flex-col items-center justify-center p-4" style={{ background: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(38,38,38,0.05)" }}>
                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ background: "rgba(239,93,168,0.1)" }}>
                      <span className="text-[#ef5da8]">{feature.icon}</span>
                    </div>
                    <div className="w-[80%] h-2 rounded-full mb-2" style={{ background: "#f0f0f0" }} />
                    <div className="w-[60%] h-2 rounded-full mb-4" style={{ background: "#f0f0f0" }} />
                    <div className="w-full space-y-2">
                      <div className="w-full h-2 rounded-full" style={{ background: "#f8f8f8" }} />
                      <div className="w-[90%] h-2 rounded-full" style={{ background: "#f8f8f8" }} />
                      <div className="w-[75%] h-2 rounded-full" style={{ background: "#f8f8f8" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,93,168,0.1)", color: "#ef5da8" }}>
                    {feature.icon}
                  </div>
                  <span className="text-[#ef5da8] text-sm font-bold">0{index + 1}</span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "#262626",
                    lineHeight: "130%",
                    marginBottom: "16px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    lineHeight: "28px",
                    color: "rgba(38, 38, 38, 0.7)",
                    maxWidth: "420px",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
