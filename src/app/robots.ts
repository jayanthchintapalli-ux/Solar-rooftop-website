import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/auth areas out of search results.
      disallow: ["/installer/", "/admin/", "/api/", "/get-quote/thank-you"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
