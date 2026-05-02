"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "../../../../app/i18n/LangContext";
import { apiRequest } from "../../../../lib/api-client";
import Navbar from "../../../../app/components/Navbar";
import Footer from "../../../../app/components/Footer";

interface NewsItem {
  id: number;
  title?: string;
  body?: string;
  image?: string | null;
  created_at?: string;
}

export default function ArticlePage() {
  const { isRTL, lang } = useLang();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch all news and find the matching ID (safest approach without knowing the exact API single-fetch route)
        const res = await apiRequest("/api/news", { method: "GET", locale: lang });
        if (res.success && res.data) {
          const items = Array.isArray(res.data)
            ? res.data
            : (res.data as { data?: NewsItem[] }).data || [];
          const found = items.find((item: NewsItem) => item.id.toString() === id);
          setArticle(found || null);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, lang]);

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#FDFBF5] min-h-screen pb-20" dir={isRTL ? "rtl" : "ltr"}>
        {/* Subtle Background Pattern */}
        <div
          className="fixed inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 max-w-[950px] mx-auto px-4 sm:px-6 pt-28 md:pt-36">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#777] hover:text-[#C9A84C] transition-colors mb-6 sm:mb-8 font-medium text-[15px] bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#f0f0f0] w-fit shadow-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isRTL ? "rotate-180" : ""}
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {isRTL ? "العودة للأخبار" : "Back to News"}
          </button>

          {loading ? (
            <div className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#f0f0f0] p-6 sm:p-12 md:p-16 animate-pulse">
              <div className="h-10 bg-gray-100 rounded-lg w-3/4 mb-6"></div>
              <div className="h-6 bg-gray-100 rounded w-1/4 mb-10"></div>
              <div className="w-full h-[400px] bg-gray-100 rounded-2xl mb-10"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
          ) : article ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-[#f5f5f5] p-6 sm:p-10 md:p-16 mb-20 relative overflow-hidden"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#E9C237] via-[#C9A84C] to-[#E9C237]"></div>

              {/* Header */}
              <header className="mb-10">
                <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-extrabold text-[#111] leading-[1.3] tracking-tight mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-[#777] text-[14px] font-medium border-b border-[#f0f0f0] pb-8">
                  {article.created_at && (
                    <div className="flex items-center gap-2 bg-[#f9f9f9] px-4 py-2 rounded-full border border-[#f0f0f0]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <time>
                        {new Date(article.created_at).toLocaleDateString(
                          isRTL ? "ar-EG" : "en-US",
                          { weekday: 'long', year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-[#f9f9f9] px-4 py-2 rounded-full border border-[#f0f0f0]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[#111] font-bold">{isRTL ? "فريق جولدن سيركل" : "Golden Circle Team"}</span>
                  </div>
                </div>
              </header>

              {/* Hero Image */}
              {article.image && (
                <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-[24px] overflow-hidden mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#f0f0f0]">
                  <img
                    src={article.image}
                    alt={article.title || "Article Image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Content Body */}
              <div 
                className="article-content text-[17px] sm:text-[18px] md:text-[20px] text-[#222] leading-[1.8] sm:leading-[2.1] font-normal"
                dangerouslySetInnerHTML={{ __html: article.body || "" }}
              />
            </motion.article>
          ) : (
            <div className="bg-white rounded-[32px] shadow-sm border border-[#f0f0f0] text-center py-32 mb-20">
              <div className="w-20 h-20 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111] mb-4">
                {isRTL ? "المقال غير موجود" : "Article not found"}
              </h2>
              <p className="text-[#777] mb-8 max-w-md mx-auto text-lg">
                {isRTL ? "يبدو أن هذا المقال قد تم حذفه أو أن الرابط غير صحيح. يمكنك العودة واستكشاف مقالات أخرى." : "This article may have been deleted or the link is incorrect. You can go back and explore other articles."}
              </p>
              <button
                onClick={() => router.push(`/${lang}/prices`)}
                className="bg-[#111] text-white px-8 py-4 rounded-full font-bold hover:bg-[#C9A84C] transition-colors text-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
              >
                {isRTL ? "تصفح الأسعار والأخبار" : "Browse Prices & News"}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      <style dangerouslySetInnerHTML={{__html: `
        .article-content {
          max-width: 100%;
          overflow-wrap: break-word;
        }
        .article-content p {
          margin-bottom: 1.8em;
          color: #333;
        }
        .article-content h2 {
          color: #111;
          font-weight: 800;
          font-size: 1.6em;
          margin-top: 2em;
          margin-bottom: 1em;
          line-height: 1.4;
          letter-spacing: -0.02em;
        }
        .article-content h3 {
          color: #222;
          font-weight: 700;
          font-size: 1.3em;
          margin-top: 1.8em;
          margin-bottom: 0.8em;
          line-height: 1.4;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.8em;
          padding-inline-start: 1.5em;
          color: #333;
        }
        .article-content li {
          margin-bottom: 0.8em;
          position: relative;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 2em 0;
          border: 1px solid #f0f0f0;
        }
        .article-content a {
          color: #C9A84C;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid rgba(201,168,76,0.3);
          transition: all 0.2s ease;
        }
        .article-content a:hover {
          border-bottom-color: #C9A84C;
          background: rgba(201,168,76,0.05);
        }
        .article-content strong, .article-content b {
          color: #111;
          font-weight: 800;
        }
        .article-content blockquote {
          border-inline-start: 5px solid #C9A84C;
          margin: 2.5em 0;
          font-style: italic;
          color: #444;
          background: #fdfbf5;
          padding: 1.8em 2em;
          border-radius: 0 16px 16px 0;
          font-size: 1.1em;
          line-height: 1.8;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
        }
        [dir="rtl"] .article-content blockquote {
          border-inline-start: none;
          border-inline-end: 5px solid #C9A84C;
          border-radius: 16px 0 0 16px;
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2em 0;
        }
        .article-content th, .article-content td {
          border: 1px solid #eaeaea;
          padding: 1em;
          text-align: right;
        }
        [dir="ltr"] .article-content th, [dir="ltr"] .article-content td {
          text-align: left;
        }
        .article-content th {
          background: #f9f9f9;
          font-weight: 700;
          color: #111;
        }
      `}} />
    </>
  );
}
