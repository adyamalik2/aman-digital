import type { MetadataRoute } from "next";

// Wajib untuk output: 'export' — render sebagai file statis saat build.
export const dynamic = "force-static";

const SITE_URL = "https://amandigital.my.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
