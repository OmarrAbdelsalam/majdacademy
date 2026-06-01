"use client";
import React from "react";
import { useLandingContent, LandingVariantContext } from "./useLandingContent";
import { useContext } from "react";
import GenericPricing from "../shared/GenericPricing";

export default function PackagesSection() {
  const content = useLandingContent();
  const variant = useContext(LandingVariantContext);

  const packages = content.packages.items.map((pkg, index) => ({
    title: pkg.title,
    description: pkg.description,
    price: pkg.price,
    period: pkg.period,
    features: pkg.features,
    featured: index === 0,
  }));

  return (
    <GenericPricing
      subtitle={content.packages.subtitle}
      title={content.packages.title}
      titleHighlight={content.packages.titleHighlight}
      packages={packages}
      ctaText={content.packages.cta}
      modalVariant="default"
      breakHighlight={variant === "fusha"}
    />
  );
}
