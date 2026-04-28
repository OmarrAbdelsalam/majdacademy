"use client";

export default function WhatsAppButton() {
  const phoneNumber = "2001070085405";
  const message = encodeURIComponent("مرحباً، أريد الاستفسار عن منتجات GCT Gold");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)] hover:scale-110 transition-all duration-300 group"
    >
      <svg
        viewBox="0 0 32 32"
        fill="white"
        width="28"
        height="28"
        className="drop-shadow-sm"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.738 3.054 9.37L1.054 31.44l6.256-1.97C9.87 31.064 12.832 32 16.004 32 24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.316 22.594c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.826-6.81-8.064-7.124-.23-.314-1.932-2.574-1.932-4.91s1.222-3.482 1.656-3.96c.434-.478.948-.598 1.264-.598.314 0 .634.004.91.016.292.014.684-.11 1.07.816.39.948 1.328 3.244 1.446 3.48.118.236.196.51.04.824-.158.314-.236.51-.472.786-.236.274-.496.614-.71.824-.236.236-.482.492-.206.964.274.472 1.222 2.016 2.624 3.264 1.806 1.606 3.328 2.104 3.8 2.34.472.236.748.196 1.024-.118.274-.314 1.184-1.382 1.5-1.858.314-.478.634-.394 1.07-.236.434.158 2.768 1.304 3.242 1.542.472.236.79.354.906.55.12.196.12 1.14-.268 2.24z"/>
      </svg>
    </a>
  );
}
