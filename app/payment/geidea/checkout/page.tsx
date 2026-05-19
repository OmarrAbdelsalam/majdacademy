"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

declare global {
  interface Window {
    GeideaCheckout?: {
      onCardComplete: (callback: (response: any) => void) => void;
      onPaymentCancel: (callback: () => void) => void;
      onPaymentError: (callback: (error: any) => void) => void;
    };
  }
}

type Status = "loading" | "ready" | "success" | "error" | "cancel";

function CheckoutInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const trx = searchParams.get("trx");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Missing session ID");
      return;
    }

    // Load Geidea SDK
    const script = document.createElement("script");
    script.src = "https://www.merchant.geidea.net/hpp/geideaCheckout.min.js";
    script.async = true;
    script.onload = () => {
      setStatus("ready");
      try {
        const checkout = window.GeideaCheckout;
        if (checkout) {
          checkout.onCardComplete((response: any) => {
            setStatus("success");
            setMessage("تم الدفع بنجاح ✓");
          });
          checkout.onPaymentCancel(() => {
            setStatus("cancel");
            setMessage("تم إلغاء الدفع");
          });
          checkout.onPaymentError((error: any) => {
            setStatus("error");
            setMessage(error?.message || "حدث خطأ أثناء الدفع");
          });
        }
      } catch (err) {
        console.error("Geidea SDK error:", err);
      }
    };
    script.onerror = () => {
      setStatus("error");
      setMessage("Failed to load payment SDK");
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [sessionId]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      background: "#f5f5f5",
      direction: "rtl",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {status === "loading" && (
          <>
            <div style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e0e0e0",
              borderTop: "4px solid #C9A84C",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{ color: "#666", fontSize: "16px" }}>جاري تحميل بوابة الدفع...</p>
          </>
        )}

        {status === "ready" && (
          <>
            <div style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e0e0e0",
              borderTop: "4px solid #C9A84C",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>Geidea Payment</p>
            <p style={{ color: "#999", fontSize: "13px", marginTop: "8px" }}>{trx}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "28px",
              color: "#fff",
            }}>✓</div>
            <p style={{ color: "#333", fontSize: "18px", fontWeight: "bold" }}>{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#f44336",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "28px",
              color: "#fff",
            }}>✕</div>
            <p style={{ color: "#333", fontSize: "18px", fontWeight: "bold" }}>{message}</p>
          </>
        )}

        {status === "cancel" && (
          <>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#FF9800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "28px",
              color: "#fff",
            }}>!</div>
            <p style={{ color: "#333", fontSize: "18px", fontWeight: "bold" }}>{message}</p>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function GeideaCheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
