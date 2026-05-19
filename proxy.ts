import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and payment pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/payment") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let locale = defaultLocale;
  const pathLocale = pathname.split('/')[1];

  // Check if pathname already has a locale
  const hasLocale = locales.includes(pathLocale);

  if (!hasLocale) {
    // Detect preferred language from Accept-Language header
    const acceptLang = request.headers.get("accept-language") || "";
    const preferred = acceptLang.toLowerCase().includes("ar") ? "ar" : defaultLocale;
    locale = preferred;
    return NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url));
  } else {
    locale = pathLocale;
  }

  // Auth Guard
  if (pathname.startsWith(`/${locale}/dashboard`)) {
    const token = request.cookies.get("gct_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|payment|favicon.ico).*)"],
};
