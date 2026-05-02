"use client";
import { motion } from "framer-motion";
import { useLang } from "../i18n/LangContext";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api-client";
import Link from "next/link";

interface NewsItem {
  id: number;
  title?: string;
  body?: string;
  image?: string | null;
  created_at?: string;
}

export default function LatestNews() {
  const { isRTL, lang } = useLang();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await apiRequest("/api/news", { method: "GET", locale: lang });
        if (res.success && res.data) {
          const items = Array.isArray(res.data)
            ? res.data
            : (res.data as { data?: NewsItem[] }).data || [];
          setNews(Array.isArray(items) ? items.slice(0, 6) : []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [lang]);

  // Don't render if no news
  if (!loading && news.length === 0) return null;

  return (
    <section
      className="relative w-full bg-[#FDFBF5] py-20 md:py-28 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[12px] sm:text-[13px] text-[#999] font-semibold uppercase tracking-wider mb-3">
            {isRTL ? "ابقَ على اطلاع" : "Stay Informed"}
          </p>
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold text-[#1a1a1a] leading-tight tracking-tight">
            {isRTL ? "آخر الأخبار" : "Latest News"}
          </h2>
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden animate-pulse"
              >
                <div className="w-full h-[180px] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {news.map((item, idx) => (
              <Link key={item.id} href={`/${lang}/news/${item.id}`} className="block group">
                <motion.article
                  className="bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  {/* Image */}
                  {item.image && (
                    <div className="w-full h-[180px] overflow-hidden bg-[#f5f5f5]">
                      <img
                        src={item.image}
                        alt={item.title || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a] leading-[1.5] mb-3 line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                      {item.title}
                    </h3>
                    {item.created_at && (
                      <p className="text-[12px] text-[#bbb] font-medium flex items-center gap-1.5">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-50"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {new Date(item.created_at).toLocaleDateString(
                          isRTL ? "ar-EG" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    )}
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
