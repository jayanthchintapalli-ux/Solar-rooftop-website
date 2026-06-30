import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Solar blog — guides for Hyderabad homeowners",
  description:
    "Guides and explainers on rooftop solar in Hyderabad and Telangana: the PM Surya Ghar subsidy, system costs, savings and whether solar is worth it.",
};

// Always reflect the latest published posts.
export const dynamic = "force-dynamic";

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
        Solar guides & insights
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Plain-English guides to help Hyderabad homeowners make confident decisions
        about rooftop solar.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-slate-500">No posts yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card flex flex-col transition hover:border-brand-300 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {formatDate(post.publishedAt)}
              </p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{post.excerpt}</p>
              <span className="mt-4 text-sm font-semibold text-brand-600">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
