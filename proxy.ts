import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const locales = ["en", "ar"];
const defaultLocale = "en";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, sanctum, payment, and IPN (Geidea return) pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sanctum") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/ipn") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Refreshes the Supabase session
  const { supabaseResponse, user } = await updateSession(request);

  let locale = defaultLocale;
  const pathLocale = pathname.split('/')[1];

  // Check if pathname already has a locale
  const hasLocale = locales.includes(pathLocale);

  if (!hasLocale) {
    // Detect preferred language from Accept-Language header
    const acceptLang = request.headers.get("accept-language") || "";
    const preferred = acceptLang.toLowerCase().includes("ar") ? "ar" : defaultLocale;
    locale = preferred;
    
    // Redirect preserving Supabase cookies
    const redirectResponse = NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url));
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  } else {
    locale = pathLocale;
  }

  // Auth Guard
  if (pathname.startsWith(`/${locale}/dashboard`)) {
    if (!user) {
      const redirectResponse = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next|api|sanctum|payment|ipn|favicon.ico).*)"],
};
