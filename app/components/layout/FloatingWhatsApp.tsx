"use client";
import React, { useState, useEffect } from 'react';
export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/971528150547"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-[999] bg-[#25d366] text-white p-4 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all duration-500 ease-in-out group flex items-center justify-center ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
      }`}
      aria-label="تواصل معنا عبر واتساب"
    >
      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
        <path d="M12.0003 2.00018C6.47715 2.00018 2 6.47733 2 12.0005C2 13.9161 2.54133 15.7061 3.47952 17.2094L2.00427 22.0002L6.90317 20.5316C8.35165 21.3658 10.108 21.8493 12.0003 21.8493C17.5234 21.8493 22.0006 17.3722 22.0006 11.849C22.0006 6.32587 17.5234 2.00018 12.0003 2.00018ZM17.1856 16.2736C16.9697 16.8837 15.932 17.3722 15.2891 17.4727C14.8194 17.5458 14.1287 17.6554 11.6669 16.636C8.51357 15.3308 6.46747 12.1288 6.30906 11.9187C6.15065 11.7085 5.0005 10.1804 5.0005 8.59972C5.0005 7.01901 5.80936 6.24237 6.13289 5.91851C6.42048 5.6311 6.88851 5.50022 7.32049 5.50022C7.46445 5.50022 7.59404 5.50753 7.70923 5.51484C8.04033 5.53676 8.20593 5.55869 8.42186 6.07641C8.68097 6.69466 9.3144 8.23938 9.38638 8.39288C9.45835 8.54638 9.5591 8.76566 9.44391 8.99226C9.33592 9.21153 9.22792 9.32847 9.06951 9.51121C8.9111 9.69395 8.75988 9.84013 8.60147 10.0375C8.4575 10.2056 8.2919 10.3883 8.47188 10.6953C8.65185 11.0022 9.30002 12.062 10.2575 12.9103C11.4944 14.0063 12.4947 14.3571 12.8258 14.5033C13.1569 14.6495 13.5168 14.6202 13.7328 14.3863C13.9919 14.1086 14.3086 13.6335 14.6321 13.1584C14.8625 12.8222 15.136 12.7783 15.4236 12.888C15.7112 12.9976 17.2371 13.7505 17.5395 13.904C17.8419 14.0575 18.0434 14.1306 18.1154 14.2548C18.1874 14.379 18.1874 15.0003 17.1856 16.2736Z" />
      </svg>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        تواصل معنا
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-4 border-transparent border-l-white"></div>
      </span>
    </a>
  );
}
