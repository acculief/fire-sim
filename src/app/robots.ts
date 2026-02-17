import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: "https://fire-sim-phi.vercel.app/sitemap.xml",
    host: "https://fire-sim-phi.vercel.app",
  };
}
