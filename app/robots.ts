import type { MetadataRoute } from "next";

const siteUrl = "https://www.joindhaga.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/dashboard/",
        "/my-bookings/",
        "/profile/",
        "/tailor-dashboard/",
        "/become-tailor/",
        "/login/",
        "/register/",
        "/forgot-password/",
        "/reset-password/",
        "/tailors/*/book/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
