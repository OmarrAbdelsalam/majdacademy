"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Settings, LayoutDashboard, Users, CalendarDays } from "lucide-react";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRTL = pathname.includes("/ar");

  const locale = isRTL ? "ar" : "en";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { name: isRTL ? "الحجوزات" : "Bookings", href: `/${locale}/dashboard/bookings`, icon: Calendar },
    { name: isRTL ? "المشتركين" : "Subscribers", href: `/${locale}/dashboard/subscribers`, icon: Users },
    { name: isRTL ? "الجدول" : "Schedule", href: `/${locale}/dashboard/schedule`, icon: CalendarDays },
    { name: isRTL ? "الإعدادات" : "Settings", href: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#262626]">
      <AcademyNavbar />
      
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 md:px-8 py-4 md:py-8 mt-24">
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <span className="font-extrabold text-[#262626]">{isRTL ? "القائمة الرئيسية" : "Main Menu"}</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100">
            {/* simple hamburger icon using lucide-react if imported, or just svg */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>

        {/* Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out 
          md:relative md:translate-x-0 md:bg-transparent md:backdrop-blur-none md:shadow-none md:w-64 md:shrink-0 md:z-0
          ${isMobileMenuOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
        `}>
          <div className="h-full flex flex-col p-4 md:p-0 overflow-y-auto">
            {/* Mobile close button */}
            <div className="md:hidden flex justify-end mb-4">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <nav className="bg-white md:rounded-2xl md:p-4 md:shadow-sm md:border md:border-gray-100 flex flex-col gap-2 flex-1 rounded-2xl shadow-sm border border-gray-100 p-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
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
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 w-full mt-4 md:mt-0 ${isRTL ? 'md:mr-8' : 'md:ml-8'}`}>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
