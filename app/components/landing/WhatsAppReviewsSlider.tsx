"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "../../i18n/LangContext";

export default function WhatsAppReviewsSlider() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const t = {
    badge: isAr ? "آراء المتميزين" : "Outstanding Reviews",
    title: isAr ? "رأي طلابنا المتفوقين" : "Our Top Students' Feedback",
    desc: isAr 
      ? "تعرف على آراء طلابنا الذين حققوا نتائج مميزة معنا" 
      : "Discover the feedback from our students who achieved outstanding results with us",
    successStory: isAr ? "قصص النجاح" : "Success Stories"
  };

  const reviews = [
    {
      name: isAr ? "محمد علي" : "Mohammed Ali",
      grade: isAr ? "الصف الثاني الثانوي" : "11th Grade",
      image: "/testimonials/media__1781178101489.png",
      score: "95%",
    },
    {
      name: isAr ? "سارة إبراهيم" : "Sarah Ibrahim",
      grade: isAr ? "الصف الثالث الثانوي" : "12th Grade",
      image: "/testimonials/media__1781178107598.png",
      score: "96%",
    },
    {
      name: isAr ? "نور الدين" : "Nour Eldin",
      grade: isAr ? "الصف الأول الثانوي" : "10th Grade",
      image: "/testimonials/media__1781178113328.png",
      score: "98%",
    },
    {
      name: isAr ? "أحمد محمود" : "Ahmed Mahmoud",
      grade: isAr ? "الصف الثالث الثانوي" : "12th Grade",
      image: "/testimonials/media__1781178123601.png",
      score: "97%",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2.2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1.1); // Mobile: 1 full card + part of 2nd
      } else if (window.innerWidth < 1024) {
        setVisibleCount(1.5); // Tablet: 1 full card + half of 2nd
      } else {
        setVisibleCount(2.2); // Desktop: 2 full cards + part of 3rd
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (reviews.length - Math.floor(visibleCount) + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (reviews.length - Math.floor(visibleCount) + 1)) % (reviews.length - Math.floor(visibleCount) + 1));
  };

  return (
    <section id="reviews" className="w-full bg-white relative overflow-hidden py-16 md:py-24" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Main Content Container (Reverted to white background with dark text) */}
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#f6428c]/10 text-[#f6428c] rounded-full text-[14px] font-bold mb-4">
            {t.badge}
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "120%",
              color: "#262626",
            }}
          >
            {t.title}
          </h2>
          <p
            className="mt-4 mx-auto"
            style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(38,38,38,0.6)", maxWidth: "550px" }}
          >
            {t.desc}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-6 z-10">
          
          {/* Slider Content Wrapper */}
          <div className="overflow-hidden py-8 px-4 -mx-4">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out items-center"
              style={{
                transform: `translateX(${isAr ? (currentIndex * (100 / visibleCount)) : -(currentIndex * (100 / visibleCount))}%)`,
                width: `${(reviews.length / visibleCount) * 100}%`
              }}
            >
              {reviews.map((review, idx) => (
                <div 
                  key={idx}
                  style={{ width: `calc(${100 / reviews.length}% - ${((visibleCount - 1) * 24) / reviews.length}px)` }}
                  className="flex-shrink-0"
                >
                  {/* Card with Gradient Background as the frame */}
                  <div className="relative rounded-[32px] p-3 sm:p-4 shadow-[0_12px_30px_rgba(246,66,140,0.2)] hover:shadow-[0_20px_50px_rgba(246,66,140,0.4)] hover:-translate-y-2 transition-all duration-500 flex flex-col group border-[4px] border-white/20 mx-auto w-full max-w-[550px]" style={{ backgroundImage: "linear-gradient(to bottom right, #e8347d, #f6428c, #ff66a3)" }}>
                    
                    {/* Simulated Phone Header (Dynamic Island vibe) */}
                    <div className="flex justify-center mb-4 mt-1">
                      <div className="bg-white/20 backdrop-blur-md text-white font-bold px-4 py-1.5 rounded-full text-[11px] shadow-sm tracking-wider flex items-center gap-2 border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
                        {t.successStory}
                      </div>
                    </div>

                    {/* Review Screenshot (Phone Screen Container) */}
                    <div className="overflow-hidden rounded-[20px] bg-slate-50 relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-[6px] border-[#1a1a1a]">
                      {/* Notch / Speaker visual detail */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-4 bg-[#1a1a1a] rounded-b-xl z-10 flex justify-center items-center">
                         <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                      </div>
                      
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="w-full h-auto object-cover relative z-0 pt-4"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          {reviews.length > Math.floor(visibleCount) && (
            <>
              <button 
                onClick={isAr ? prevSlide : nextSlide}
                className={`absolute top-1/2 -right-2 md:-right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#262626] hover:bg-[#f6428c] hover:text-white transition-all z-40`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <button 
                onClick={isAr ? nextSlide : prevSlide}
                className={`absolute top-1/2 -left-2 md:-left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#262626] hover:bg-[#f6428c] hover:text-white transition-all z-40`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}

        </div>

        {/* Pagination / Bottom Dots */}
        <div className="relative z-10 flex justify-center items-center gap-2 mt-10">
          {[...Array(reviews.length - Math.floor(visibleCount) + 1)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? "w-6 bg-[#262626]" : "w-2.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
