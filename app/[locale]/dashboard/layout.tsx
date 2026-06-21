"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Settings, LayoutDashboard } from "lucide-react";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRTL = pathname.includes("/ar");

  const menuItems = [
    { name: isRTL ? "الحجوزات" : "Bookings", href: isRTL ? "/ar/dashboard/bookings" : "/en/dashboard/bookings", icon: Calendar },
    { name: isRTL ? "الإعدادات" : "Settings", href: isRTL ? "/ar/dashboard/settings" : "/en/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#262626]">
      <AcademyNavbar />
      
      <div className="flex-1 flex container mx-auto px-4 md:px-8 py-8 mt-24">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <nav className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? "bg-[#fdf2f8] text-[#f6428c] font-bold" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${isRTL ? 'md:mr-8' : 'md:ml-8'}`}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
