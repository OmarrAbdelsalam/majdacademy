"use client";
import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Download, ChevronDown } from 'lucide-react';

export default function HamadFooter() {
  return (
    <footer className="w-full bg-[#fdfafb] pb-6 pt-10" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Footer Container */}
        <div className="bg-gradient-to-r from-[#8E2DE2] to-[#5b1b7a] rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-xl text-white">
          
          {/* Subtle overlay effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, #ffffff, transparent)' }}></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Column 1: Logo & Info */}
            <div className="flex flex-col gap-6 items-start lg:items-start text-start">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-[#5b1b7a] font-black text-xl shadow-lg">م</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-xl font-black text-white">مَجْد أكاديمي</span>
                  <span className="text-[12px] font-bold uppercase text-white/70">MAJD ACADEMY</span>
                </span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                نحن مجد أكاديمي منصة تعليمية، نسعى جاهدين للوصول إلى كل طلاب الخليج و ذلك بهدف تقديم تعليم جيد، يساعدهم على بناء مستقبل أفضل
              </p>
              
              <div className="flex items-center gap-3 mt-2 w-full">
                <button className="flex-1 bg-white text-[#5b1b7a] px-4 py-2.5 rounded-full font-bold text-sm flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm">
                  <span>اختر الدولة</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex-[1.5] bg-transparent border border-white/30 text-white px-4 py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                  <span>تحميل الملخصات</span>
                  <span className="tracking-tighter">»</span>
                </button>
              </div>
            </div>

            {/* Column 2: Links */}
            <div className="flex flex-col gap-5 items-start lg:items-center text-start lg:text-center">
              <h3 className="font-bold text-lg text-white mb-2">الصفحات</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors">مدونة</Link></li>
                <li><Link href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors">من نحن</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="flex flex-col gap-5 items-start lg:items-end text-start lg:text-right">
              <h3 className="font-bold text-lg text-white mb-2">تواصل معنا الآن</h3>
              <ul className="flex flex-col gap-4 items-start lg:items-end w-full">
                <li className="flex items-center gap-3 flex-row-reverse w-full justify-start lg:justify-end">
                  <Phone className="w-5 h-5 text-white/90 shrink-0" />
                  <a href="tel:+96555511660" dir="ltr" className="text-sm font-medium text-white/90 hover:text-white transition-colors">+96555511660</a>
                </li>
                <li className="flex items-center gap-3 flex-row-reverse w-full justify-start lg:justify-end">
                  <Mail className="w-5 h-5 text-white/90 shrink-0" />
                  <a href="mailto:info@majdacademy.net" className="text-sm font-medium text-white/90 hover:text-white transition-colors">info@majdacademy.net</a>
                </li>
                <li className="flex items-start gap-3 flex-row-reverse w-full justify-start lg:justify-end">
                  <MapPin className="w-5 h-5 text-white/90 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white/90">أينما كنت يمكننا الوصول إليك</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Slogan & CTA */}
            <div className="flex flex-col gap-6 items-start lg:items-end text-start lg:text-right">
              <h3 className="font-bold text-xl leading-snug text-white">
                تعليم جيد لصناعة مستقبل<br/>أفضل
              </h3>
              
              <button className="bg-[#fc4f4f] hover:bg-[#e74343] text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-transform hover:-translate-y-1 shadow-lg w-full sm:w-auto justify-center">
                <span>تواصل معنا الآن</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>

              {/* Social Icons */}
              <div className="flex items-center justify-start lg:justify-end gap-3 w-full">
                {['telegram', 'youtube', 'x', 'instagram', 'facebook'].map((social) => (
                  <a key={social} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    {social === 'telegram' && <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>}
                    {social === 'youtube' && <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                    {social === 'x' && <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                    {social === 'instagram' && <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                    {social === 'facebook' && <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Copyright Line */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-[13px] font-medium text-white/80">
              جميع الحقوق الطبع والنشر محفوظة {new Date().getFullYear()} برايت ليرن ذ م م
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
