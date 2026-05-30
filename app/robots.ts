import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/academy/",
        "/login/",
        "/payment/",
        "/ipn/",
        "/sanctum/",
        "/api/",
        "/register/",
        "/forgot-password/",
        "/dashboard/",
        "/cart/",
        "/checkout/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
