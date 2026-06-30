import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

marked.setOptions({ gfm: true, breaks: false });

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post || !post.publishedAt) notFound();

  const html = marked.parse(post.contentMarkdown) as string;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    author: { "@type": "Organization", name: "HyderabadSolar" },
  };

  return (
    <article className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-medium text-brand-600 hover:underline">
          ← All posts
        </Link>
        <p className="mt-4 text-sm font-medium text-slate-500">
          {formatDate(post.publishedAt)}
        </p>

        <div className="prose mt-3" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="mt-10 rounded-2xl bg-brand-600 px-6 py-8 text-center text-white">
          <h2 className="text-xl font-bold">See your own solar numbers</h2>
          <p className="mt-1 text-brand-50">
            Free calculator, free quote, no obligation.
          </p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/calculator" className="btn bg-white text-brand-700 hover:bg-brand-50">
              Open the calculator
            </Link>
            <Link href="/get-quote" className="btn border border-white/40 text-white hover:bg-brand-700">
              Get a free quote
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
