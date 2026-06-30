import { NextResponse } from "next/server";
import { runSeed } from "@/lib/seed";

// bcrypt + Prisma need the Node.js runtime (not edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-time, browser-triggered database seed.
 *
 * Protected by the SEED_SECRET env var:
 *   GET /api/seed?key=YOUR_SEED_SECRET
 *
 * - If SEED_SECRET is not set, the route is disabled (403) so it can never be
 *   triggered by accident or by a crawler.
 * - This is DESTRUCTIVE: it clears existing rows and reseeds sample data.
 *   Use it once after the first deploy, then unset SEED_SECRET (or remove this
 *   route) so production data can't be wiped.
 */
async function handle(key: string | null) {
  const secret = process.env.SEED_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Seeding is disabled. Set the SEED_SECRET environment variable in your host to enable it.",
      },
      { status: 403 },
    );
  }

  if (!key || key !== secret) {
    return NextResponse.json(
      { error: "Unauthorized: missing or incorrect key." },
      { status: 401 },
    );
  }

  try {
    const summary = await runSeed();
    const installerList = summary.installers
      .map((i) => `<li>${i.email} — ${i.companyName}</li>`)
      .join("");

    const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Seed complete</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#0f172a}
  .card{border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-top:16px}
  code{background:#f1f5f9;padding:2px 6px;border-radius:6px}
  .ok{color:#16a34a}
  .warn{background:#fffbeb;border:1px solid #fde68a;color:#92400e;padding:12px;border-radius:8px;margin-top:16px;font-size:14px}
  ul{padding-left:20px}
</style></head>
<body>
  <h1 class="ok">✅ Database seeded</h1>
  <p>Created ${summary.counts.installers} installers, ${summary.counts.leads} leads and ${summary.counts.blogPosts} blog posts.</p>
  <div class="card">
    <h3>Admin login</h3>
    <p>Email: <code>${summary.admin.email}</code><br/>Password: <code>${summary.admin.password}</code></p>
    <p style="font-size:14px;color:#64748b">Log in at <code>/admin/login</code>.</p>
  </div>
  <div class="card">
    <h3>Sample installer logins</h3>
    <p>Password for all: <code>${summary.installerPassword}</code></p>
    <ul>${installerList}</ul>
    <p style="font-size:14px;color:#64748b">Log in at <code>/installer/login</code>.</p>
  </div>
  <p class="warn">⚠️ This route can wipe and reseed your database. Now that seeding is done,
  remove the <code>SEED_SECRET</code> environment variable (and redeploy) so it can't be
  triggered again.</p>
</body></html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seeding failed." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  return handle(key);
}

export async function POST(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  return handle(key);
}
