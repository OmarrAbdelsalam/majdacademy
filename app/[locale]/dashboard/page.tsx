"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.locale) {
      router.replace(`/${params.locale}/dashboard/bookings`);
    } else {
      router.replace(`/ar/dashboard/bookings`);
    }
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#ef5da8] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
