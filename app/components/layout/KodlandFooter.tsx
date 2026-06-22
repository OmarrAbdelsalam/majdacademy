"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "../../i18n/LangContext";
import { useLandingContent } from "../landing/useLandingContent";

export default function KodlandFooter() {
  const content = useLandingContent();
  const { lang } = useLang();
  const landingPath = `/${lang}`;

  return (
    <footer
      role="contentinfo"
      className="relative w-full pt-12 sm:pt-16 pb-0"
    >
      {/* Dynamic Theme Background */}
      <div
        className="absolute inset-0 z-0 opacity-70"
        style={{
          background: `
            radial-gradient(70% 30% at 50% 100%, var(--color-highlight) 0%, rgba(255,255,255,0) 100%),
            radial-gradient(100% 50% at 50% 100%, var(--color-highlight-hover) 0%, rgba(255,255,255,0) 100%),
            radial-gradient(150% 80% at 50% 100%, var(--color-highlight-hover) 0%, rgba(255,255,255,0) 100%)
          `
        }}
      />
      {/* Top fade — smooth transition from white to transparent */}
      <div
        className="absolute top-0 left-0 right-0 z-[1] h-[200px]"
        style={{ background: "linear-gradient(to bottom, #ffffff, transparent)" }}
      />
      {/* White card */}
      <div className="relative z-10 px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm max-w-[1300px] mx-auto">

          {/* Top row — Logo + CTA */}
          <div className="flex items-center justify-between mb-10">
            <Image src="/majd.png" alt="مَجْد" width={120} height={40} className="h-10 w-auto" />
            <a
              href={`${landingPath}#packages`}
              className="inline-flex items-center justify-center rounded-full border border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-white transition-all duration-300"
              style={{ padding: "12px 28px", fontSize: "15px", fontWeight: 500 }}
            >
              {content.footer.cta}
            </a>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Column 1 — Mission Statement */}
            <div>
              <p className="text-[#262626] font-bold text-[18px] font-arabic mb-4">
                ﴿وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا﴾
              </p>
              <p className="text-[14px] font-medium text-[#262626]/70 mb-6 leading-relaxed">
                هُنَا فِي رِحَابِ الْعَرَبِيَّةِ، مِنْ نُورِ الْكَلِمَةِ إِلَى عُمْقِ الْمَعْنَى.<br/>
                وَإِذَا كَانَتِ الْأَسْمَاءُ أَوَّلَ أَبْوَابِ الْمَعْرِفَةِ، فَإِنَّ رِسَالَتَنَا أَنْ نُعِينَكُمْ عَلَى اكْتِشَافِ الْعَرَبِيَّةِ لُغَةً وَحَضَارَةً وَبَيَانًا، وَأَنْ نَنْقُلَ هَذَا الْعِلْمَ إِلَيْكُمْ بِأَمَانَةٍ وَإِتْقَانٍ.
              </p>
            </div>

            {/* Column 2 — Links */}
            <div>
              <p className="text-[13px] font-medium mb-4" style={{ color: "rgba(38,38,38,0.5)" }}>{content.footer.col1Title}</p>
              <ul className="flex flex-col gap-3">
                {content.footer.col1Links.map((link, i) => {
                  const teachLabel = lang === "ar" ? "انضم كمعلم" : "Teach with Us";
                  const contactLabel = lang === "ar" ? "تواصل معنا" : "Contact Us";
                  const isTeachLink = link === teachLabel;
                  const isContactLink = link === contactLabel;
                  if (isTeachLink) {
                    return (
                      <li key={i}><Link href={`/${lang}/teach-with-us`} className="text-[15px] font-medium text-[#262626] hover:text-[#ef5da8] transition-colors">{link}</Link></li>
                    );
                  }
                  if (isContactLink) {
                    return (
                      <li key={i}><Link href={`/${lang}/contact`} className="text-[15px] font-medium text-[#262626] hover:text-[#ef5da8] transition-colors">{link}</Link></li>
                    );
                  }
                  return (
                    <li key={i}><a href={landingPath} className="text-[15px] font-medium text-[#262626] hover:text-[#ef5da8] transition-colors">{link}</a></li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3 — Subjects */}
            <div>
              <p className="text-[13px] font-medium mb-4" style={{ color: "rgba(38,38,38,0.5)" }}>{content.footer.col2Title}</p>
              <ul className="flex flex-col gap-3">
                {content.footer.col2Links.map((link, i) => (
                  <li key={i}><a href={landingPath} className="text-[15px] font-medium text-[#262626] hover:text-[#ef5da8] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 mb-8">
            {/* WhatsApp */}
            <a href="https://wa.me/971528150547" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#262626] flex items-center justify-center hover:bg-[#ef5da8] transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            {/* Instagram */}
            <a href={landingPath} className="w-9 h-9 rounded-full bg-[#262626] flex items-center justify-center hover:bg-[#ef5da8] transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* Twitter/X */}
            <a href={landingPath} className="w-9 h-9 rounded-full bg-[#262626] flex items-center justify-center hover:bg-[#ef5da8] transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] font-medium" style={{ color: "rgba(38,38,38,0.5)" }}>
              {content.footer.copyright}
            </p>
            <div className="flex items-center gap-6">
              <a href={`/${lang}/privacy`} className="text-[13px] font-medium hover:text-[#ef5da8] transition-colors" style={{ color: "rgba(38,38,38,0.5)" }}>{content.footer.privacy}</a>
              <a href={`/${lang}/terms`} className="text-[13px] font-medium hover:text-[#ef5da8] transition-colors" style={{ color: "rgba(38,38,38,0.5)" }}>{content.footer.terms}</a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-16" />
    </footer>
  );
}
