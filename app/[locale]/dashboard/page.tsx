"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../../i18n/LangContext";

export default function DashboardPage() {
  const { lang } = useLang();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${lang}/dashboard/wallet`);
  }, [lang, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-[#999]">Redirecting...</p>
      </div>
    </div>
  );
}
