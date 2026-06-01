"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global smooth scroll handler.
 * Intercepts anchor link clicks and applies smooth scrolling.
 * Handles both same-page (#section) and cross-page (/path#section) links.
 */
export default function SmoothScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // On page load, if there's a hash in the URL, scroll to it smoothly
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      // Small delay to let the page render
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Case 1: Pure hash link like "#packages"
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (!id) return;
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
        return;
      }

      // Case 2: Path with hash like "/ar#packages" or "/en#faq"
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return; // No hash, let normal navigation happen

      const linkPath = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex + 1);
      if (!hash) return;

      // Check if we're already on the same page
      const currentPath = pathname;
      const normalizedLinkPath = linkPath.endsWith("/") ? linkPath.slice(0, -1) : linkPath;
      const normalizedCurrentPath = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;

      if (normalizedLinkPath === normalizedCurrentPath) {
        // Same page — smooth scroll
        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${hash}`);
        }
      }
      // Different page — let the browser navigate normally, the useEffect above
      // will handle smooth scrolling to the hash after the page loads
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
