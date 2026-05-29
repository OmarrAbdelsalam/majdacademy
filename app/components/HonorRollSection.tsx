"use client";
import React from "react";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";

const topStudents = [
  {
    id: 1,
    name: "فاطمة أحمد",
    grade: "الصف الثاني عشر",
    score: "99.5%",
    rank: 1,
  },
  {
    id: 2,
    name: "عمر خالد",
    grade: "الصف العاشر",
    score: "98.8%",
    rank: 2,
  },
  {
    id: 3,
    name: "سارة محمد",
    grade: "الصف التاسع",
    score: "98.2%",
    rank: 3,
  },
];

const otherStudents = [
  { id: 4, name: "عبدالله سالم", grade: "الصف الثامن", score: "97.5%" },
  { id: 5, name: "مريم علي", grade: "الصف الحادي عشر", score: "97.0%" },
  { id: 6, name: "راشد محمد", grade: "الصف السابع", score: "96.8%" },
  { id: 7, name: "نورة خالد", grade: "الصف العاشر", score: "96.5%" },
];

export default function HonorRollSection() {
  return (
    <section className="py-16 md:py-[100px] bg-white relative overflow-hidden" dir="rtl">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: "rgba(240,84,139,0.08)" }}>
            <Trophy className="w-4 h-4 text-[#F0548B]" />
            <span className="text-[#F0548B] text-sm font-bold">لوحة الشرف</span>
          </div>
          <h2 className="text-3xl md:text-[44px] font-black text-[#1B2D4F] mb-4 leading-tight">
            أبطال <span className="text-[#F0548B]">مَجْد</span> هالشهر 🏆
          </h2>
          <p className="text-[#8B6E96] text-lg md:text-[20px] font-medium max-w-2xl mx-auto leading-relaxed">
            طلابنا اللي تعبوا واجتهدوا ورفعوا الراية.. نفخر فيكم!
          </p>
        </div>

        {/* Top 3 - Leaderboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8 max-w-[950px] mx-auto">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 md:mt-8">
            <LeaderCard student={topStudents[1]} />
          </div>
          {/* 1st Place */}
          <div className="order-1 md:order-2">
            <LeaderCard student={topStudents[0]} isChampion />
          </div>
          {/* 3rd Place */}
          <div className="order-3 md:mt-8">
            <LeaderCard student={topStudents[2]} />
          </div>
        </div>

        {/* Other Students - Simple List */}
        <div className="max-w-[700px] mx-auto">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#f9fafb", border: "1px solid #f0f0f2" }}>
            {otherStudents.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between px-5 md:px-6 py-4"
                style={{ borderBottom: index < otherStudents.length - 1 ? "1px solid #f0f0f2" : "none" }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#8B6E96] font-bold text-sm w-6">{index + 4}</span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "#F0548B" }}
                  >
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2D4F] text-[15px]">{student.name}</p>
                    <p className="text-[#8B6E96] text-[12px]">{student.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1B2D4F] text-[15px]">{student.score}</span>
                  <Star className="w-4 h-4 text-[#FFC843]" fill="#FFC843" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            className="text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-1"
            style={{ background: "#1B2D4F", boxShadow: "0 8px 25px rgba(27,45,79,0.2)" }}
          >
            كون بطل مَجْد القادم!
          </button>
        </div>

      </div>
    </section>
  );
}

function LeaderCard({ student, isChampion = false }: { student: typeof topStudents[0]; isChampion?: boolean }) {
  const rankConfig = {
    1: { icon: <Crown className="w-5 h-5" />, color: "#FFD700", bg: "linear-gradient(135deg, #FFF9E6, #FFF3CC)", border: "#FFD700" },
    2: { icon: <Medal className="w-5 h-5" />, color: "#A8A8A8", bg: "linear-gradient(135deg, #f8f9fa, #f0f0f0)", border: "#d4d4d4" },
    3: { icon: <Award className="w-5 h-5" />, color: "#CD7F32", bg: "linear-gradient(135deg, #FFF8F0, #FFEDD5)", border: "#CD7F32" },
  };

  const config = rankConfig[student.rank as keyof typeof rankConfig];

  return (
    <div
      className={`rounded-3xl p-6 text-center relative transition-all duration-300 hover:-translate-y-1 ${isChampion ? "ring-2" : ""}`}
      style={{
        background: config.bg,
        border: `1.5px solid ${config.border}40`,
        boxShadow: isChampion ? `0 12px 35px ${config.color}20` : "0 4px 15px rgba(0,0,0,0.04)",
        ...(isChampion ? { ringColor: `${config.color}50` } : {}),
      }}
    >
      {/* Rank Badge */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-black"
        style={{ background: config.color, boxShadow: `0 4px 10px ${config.color}40` }}
      >
        {student.rank}
      </div>

      {/* Champion crown */}
      {isChampion && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <span className="text-2xl">👑</span>
        </div>
      )}

      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full mx-auto mt-4 mb-3 flex items-center justify-center text-xl font-black text-white"
        style={{ background: config.color, boxShadow: `0 6px 20px ${config.color}30` }}
      >
        {student.name.charAt(0)}
      </div>

      <h3 className="font-black text-[#1B2D4F] text-[17px] mb-1">{student.name}</h3>
      <p className="text-[#8B6E96] text-[12px] font-medium mb-3">{student.grade}</p>

      {/* Score */}
      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full" style={{ background: `${config.color}15` }}>
        <span className="font-black text-[18px]" style={{ color: config.color }}>{student.score}</span>
      </div>
    </div>
  );
}
