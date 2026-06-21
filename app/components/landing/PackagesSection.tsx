"use client";
import React, { useState } from "react";
import { LandingVariantContext } from "./useLandingContent";
import { getLandingContent } from "./getLandingContent";
import { useContext } from "react";
import GenericPricing from "../shared/GenericPricing";
import { usePricing } from "../../i18n/CountryContext";
import { useLang } from "../../i18n/LangContext";

export default function PackagesSection({ locale }: { locale: string }) {
  const content = getLandingContent(locale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const variant = useContext(LandingVariantContext);
  const { formatPrice } = usePricing();
  const { lang } = useLang();

  const packages = content.packages.items.map((pkg, index) => {
    const { price, currency, icon } = formatPrice(pkg.price);
    const periodContent = (
      <span className="inline-flex items-center gap-1">
        {icon ? (
          <img src={icon} alt={currency} className="w-5 h-5 object-contain mix-blend-multiply dark:invert" />
        ) : (
          <span>{currency}</span>
        )}
        <span>{lang === "ar" ? "/شهرياً" : "/month"}</span>
      </span>
    );
    return {
      title: pkg.title,
      description: pkg.description,
      price: price,
      period: periodContent,
      features: pkg.features,
      featured: index === 0,
    };
  });

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
