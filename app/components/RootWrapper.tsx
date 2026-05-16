"use client";
import { useLang } from "../i18n/LangContext";
import { ReactNode, useState, useEffect } from "react";
import MaintenanceScreen from "./MaintenanceScreen";
import { CartProvider } from "../cart/CartContext";

export default function RootWrapper({ children }: { children: ReactNode }) {
  const { isRTL } = useLang();
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    const handleMaintenance = () => setMaintenance(true);
    window.addEventListener("gct-maintenance", handleMaintenance);
    return () => window.removeEventListener("gct-maintenance", handleMaintenance);
  }, []);

  return (
    <CartProvider>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        lang={isRTL ? "ar" : "en"}
        style={{
          fontFamily: "var(--font-tajawal), 'Segoe UI', sans-serif",
        }}
      >
        {children}
        <MaintenanceScreen visible={maintenance} />
      </div>
    </CartProvider>
  );
}
