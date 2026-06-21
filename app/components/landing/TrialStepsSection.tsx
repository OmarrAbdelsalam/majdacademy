"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLandingContent } from "./useLandingContent";
import InteractiveSteps from "./InteractiveSteps";

const stepImages = [
  "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png",
  "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png",
  "https://cdn.kodland.org/main-site-v2/en/main/step-3-en.png",
];

export default function TrialStepsSection() {
  const content = useLandingContent();

  const heading = (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        fontSize: "clamp(28px, 4vw, 40px)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: "130%",
        color: "#262626" }}
    >
      {content.trial.heading1}{" "}{content.trial.headingHighlight}
      <br />
      {content.trial.heading2}
    </motion.h2>
  );

  const titleIcon = (
    <img
      src="/icon6.webp"
      alt=""
      className="inline-block w-16 h-16 md:w-20 md:h-20 object-contain aspect-square -my-4"
      style={{ verticalAlign: "middle" }}
    />
  );

  return (
    <InteractiveSteps
      heading={heading}
      steps={content.trial.steps}
      stepLabel={content.trial.stepLabel}
      cta={content.trial.cta}
      images={stepImages}
      showArrowsDesktop={true}
      titleIcon={titleIcon}
    />
  );
}
