"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Clear any stuck body overflow when route changes
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  }, [pathname]);

  return (
    <>
      {children}
    </>
  );
}
