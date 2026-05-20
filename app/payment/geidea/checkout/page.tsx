"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

declare global {
  interface Window {
    GeideaCheckout?: new (
      onSuccess: (response: any) => void,
      onError: (error: any) => void,
      onCancel: () => void
    ) => {
      startPayment: (sessionId: string) => void;
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
        if (window.GeideaCheckout) {
          const checkout = new window.GeideaCheckout(
            (response: any) => {
              // Notify the opener (deposit page) so its polling can react
              if (window.opener) {
                window.opener.postMessage({ type: "geidea_result", status: "success", response }, "*");
              }
              window.close();
            },
            (error: any) => {
              if (error && Object.keys(error).length === 0) return; // Ignore empty false-positive errors
              console.error("Geidea payment error:", error);
              if (window.opener) {
                window.opener.postMessage({ type: "geidea_result", status: "failed", error }, "*");
              }
              window.close();
            },
            () => {
              if (window.opener) {
                window.opener.postMessage({ type: "geidea_result", status: "cancelled" }, "*");
              }
              window.close();
            }
          );
          
          checkout.startPayment(sessionId);
        } else {
          throw new Error("GeideaCheckout is not defined after script load");
        }
      } catch (err) {
        console.error("Geidea SDK error:", err);
        setStatus("error");
        setMessage("Failed to initialize payment");
      }
    };
    script.onerror = () => {
      setStatus("error");
      setMessage("Failed to load payment SDK");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [sessionId]);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }} />
  );
}

export default function GeideaCheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#ffffff" }} />}>
      <CheckoutInner />
    </Suspense>
  );
}
