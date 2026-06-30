import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/calculator",
    "/get-quote",
    "/subsidy-guide",
    "/faq",
    "/blog",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let posts: { slug: string; publishedAt: Date | null }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, publishedAt: true },
    });
  } catch {
    // If the DB is unavailable at build/runtime, still return static routes.
  }

  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.publishedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
