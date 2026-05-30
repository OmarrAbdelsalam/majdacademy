interface SkipLinkProps {
  locale: string;
}

export default function SkipLink({ locale }: SkipLinkProps) {
  const text = locale === "ar" ? "تخطي إلى المحتوى الرئيسي" : "Skip to main content";

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[#262626] focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#262626] text-sm font-medium"
    >
      {text}
    </a>
  );
}
