# HyderabadSolar — Rooftop Solar Leads Marketplace

A lead-generation marketplace for rooftop solar in Hyderabad, Telangana. Homeowners
get a free savings + PM Surya Ghar subsidy estimate and request a quote; verified
local installers buy credits and unlock leads in their service area.

> **Status:** Complete (Phases 1–5). Public site (landing, calculator, lead capture,
> subsidy guide, FAQ, blog), the full **installer portal** (auth, wallet, masked
> available-leads, unlock-with-credits, my-leads), the **admin panel** (analytics,
> leads table, installer verify/credit management), plus SEO (sitemap/robots/JSON-LD),
> loading/error/404 states, and a mobile menu.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (mobile-first)
- **Prisma ORM** with **SQLite** for local dev (switch to Postgres for production via `DATABASE_URL`)
- **NextAuth** credentials auth (JWT sessions) with two roles: `INSTALLER` and `ADMIN`
- Server actions for forms, lead unlocks, top-ups, and admin operations

## Getting started

Requires Node 18+. The project uses **PostgreSQL** (so it matches production).
The fastest local database is a free [Neon](https://neon.tech) project — create one
and copy its connection string.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
#   Set DATABASE_URL to your Postgres/Neon connection string, and set
#   NEXTAUTH_SECRET (run: openssl rand -base64 32).

# 3. Apply the schema (creates the tables) and generate the Prisma client
npx prisma migrate deploy
npx prisma generate

# 4. Seed sample data (admin, installers, leads, blog posts)
npm run seed

# 5. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

> **Prefer local SQLite instead?** Set `provider = "sqlite"` in
> `prisma/schema.prisma` and `DATABASE_URL="file:./dev.db"` in `.env`, then run
> `npx prisma db push && npm run seed`. Don't commit that schema change — production
> uses Postgres.

> **Note on this environment:** Prisma downloads its engine binaries on install.
> If you're behind a proxy and `npm install`'s postinstall fails, run
> `npm install --ignore-scripts` then `npx prisma generate` (retry if the
> download is interrupted).

## What to test in Phase 1

1. **Landing page** (`/`) — hero with the "Get my free solar quote" CTA, a 3-step
   "how it works", trust signals, an embedded calculator preview, and a footer with
   WhatsApp contact + a floating WhatsApp button.
2. **Calculator** (`/calculator`) — enter a monthly bill (try **₹3,000**) and tap
   **Calculate my savings**. You should see:
   - Recommended system size: **3 kW**
   - Gross cost: **₹1,65,000**, Subsidy: **₹78,000**, Net cost: **₹87,000**
   - Monthly savings: **₹2,880**, Payback: **2.5 years**
   - A note to verify subsidy figures on the official PM Surya Ghar portal.
3. **Subsidy sanity check** — set the bill so the system rounds to 1 kW (e.g. ₹900),
   2 kW (e.g. ₹1,800), and 3 kW+ (e.g. ₹5,000): subsidy should be ₹30,000 / ₹60,000 /
   ₹78,000 respectively.

## What to test in Phase 2

1. **Lead form** (`/get-quote`) — fill name, phone, pincode, area, monthly bill,
   property type. The right-hand panel previews your estimate live. Submit → you're
   redirected to a **thank-you page** and a `Lead` is saved (estimated kW + subsidy
   computed server-side). Try invalid input (bad phone/pincode) to see validation.
   You can deep-link with prefill: `/get-quote?bill=3000&type=APARTMENT&pincode=500072`.
2. **Subsidy guide** (`/subsidy-guide`) — SEO explainer with the slab table.
3. **FAQ** (`/faq`) — expandable questions.
4. **Blog** (`/blog`) — lists the 3 seeded posts; click into `/blog/[slug]` to read
   the rendered Markdown.

## What to test in Phase 3 (installer portal)

1. Go to `/installer/login` and log in as `ravi@sunsure.example.com` / `installer12345`
   (Ravi serves pincodes 500081/500032/500084 and starts with 200 credits).
2. **Dashboard** (`/installer/dashboard`) — credit balance, available-leads count,
   leads unlocked, and recent wallet activity.
3. **Available leads** (`/installer/available-leads`) — leads in Ravi's pincodes with
   the name/phone **masked**; click **"Unlock for 50 credits"** → credits drop by 50,
   the lead moves to *My leads*, and contact details are revealed.
4. **My leads** (`/installer/my-leads`) — unlocked leads with full phone + a WhatsApp
   click-to-chat link prefilled for that homeowner.
5. **Buy credits** (`/installer/buy-credits`) — demo top-up packs (Razorpay stubbed;
   clicking adds credits and logs a TOPUP transaction).
6. **Guards** — visiting `/installer/dashboard` while logged out redirects to login.
   New signups (`/installer/signup`) start *unverified* with 0 credits and can't unlock
   until an admin verifies them (Phase 4).

The 3-purchases-per-lead cap, duplicate-unlock prevention, out-of-area blocking, and
credit deduction are enforced atomically in a DB transaction.

## What to test in Phase 4 (admin panel)

1. Log in at `/admin/login` as `admin@example.com` / `admin12345`.
2. **Overview** (`/admin`) — analytics cards: total leads, leads this week, credits
   sold, estimated revenue, verified/total installers, leads unlocked.
3. **Leads** (`/admin/leads`) — every lead with full contact details, estimated kW /
   subsidy, how many installers bought it (`N/3`), status, and date.
4. **Installers** (`/admin/installers`) — Verify/Unverify each installer and adjust
   their credits with the +/− controls (each change writes a ledger entry; deducting
   below zero is blocked).
5. **Guards** — an installer who logs in and visits `/admin` is redirected to the
   installer login; logged-out `/admin` redirects to `/admin/login`.

## Test accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin12345` |
| Installer | `ravi@sunsure.example.com` (and others) | `installer12345` |

(The seed script prints all installer emails to the console.)

## Domain math (configurable)

All business constants live in [`src/lib/config.ts`](src/lib/config.ts); the pure
calculation logic is in [`src/lib/solar.ts`](src/lib/solar.ts).

- Generation: 1 kW ≈ 120 units/month in Hyderabad
- Tariff: ₹8/unit · System cost: ₹55,000/kW
- PM Surya Ghar subsidy: ₹30,000/kW (first 2 kW) + ₹18,000 (3rd kW), capped at ₹78,000

## Credit economics (configurable)

- Unlocking a lead costs **50 credits** (`CREDITS_PER_LEAD_UNLOCK`).
- A credit is priced at **₹10** (`CREDIT_PRICE_INR`) — so one lead ≈ ₹500.
- A lead can be sold to at most **3 installers** (`MAX_PURCHASES_PER_LEAD`).
- Top-up packs: Starter 100 / Growth 250 / Pro 500 (`CREDIT_PACKS`).

Payments are **stubbed** — the "Buy now" button credits the wallet instantly. The
Razorpay integration point is marked with a `TODO(payments)` in
[`src/app/installer/(portal)/buy-credits/actions.ts`](src/app/installer/(portal)/buy-credits/actions.ts).

## Deploying to Vercel (with Neon Postgres)

The repo is already configured for this: Prisma uses `postgresql`, an initial
migration lives in `prisma/migrations/0_init`, and [`vercel.json`](vercel.json) runs
`prisma generate && prisma migrate deploy && next build` on every deploy — so the
database schema is created/updated automatically.

> Vercel's free **Hobby** plan is fine for testing/demos. Its terms reserve Hobby for
> non-commercial use, so move to **Pro** once you point real marketing/ads at the site.

**1. Create a free Postgres database**

Sign up at [neon.tech](https://neon.tech) (or Supabase / Vercel Postgres), create a
project, and copy the connection string. For Neon it looks like:

```
postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

**2. Import the repo in Vercel**

Push to GitHub → [vercel.com](https://vercel.com) → **Add New… → Project** → import
this repository. Vercel auto-detects Next.js.

**3. Set environment variables** in the Vercel project (Settings → Environment
Variables) — and locally in `.env`:

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Your Neon/Postgres connection string (include `?sslmode=require` for Neon) |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployment URL, e.g. `https://your-app.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Same URL (used for sitemap/canonical/SEO) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your real WhatsApp number, e.g. `9198XXXXXXXX` (no `+`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Admin login created by the seed |

**4. Deploy.** The build runs the migration and creates all tables in your database.

**5. Seed the initial data once** (creates the admin login + sample installers, leads
and blog posts). From your machine, with `DATABASE_URL` pointed at the **same** Neon
database:

```bash
npm run seed
```

That's it — your site is live. `robots.txt` and `sitemap.xml` are generated from
`NEXT_PUBLIC_SITE_URL` automatically.

> **Going to production for real?** Before marketing: set strong admin credentials,
> a unique `NEXTAUTH_SECRET`, your real WhatsApp number, and integrate Razorpay for
> credit purchases (see the `TODO(payments)` in `buy-credits/actions.ts`). You may
> also want to re-seed without the sample leads so installers only see real enquiries.

### Deploying to Render instead

Render works too: create a **PostgreSQL** instance + a **Web Service** from this repo
with build command `npm install && npx prisma migrate deploy && npm run build` and
start command `npm start`. Set the same environment variables, then run `npm run seed`
once from the Render shell. (A ~$7/mo Starter web service stays always-on; the free
tier sleeps when idle.)

> **First production admin:** since signup only creates installers, the admin account
> comes from the seed (`npm run seed`). To create an admin without reseeding, insert a
> row into `AdminUser` with a bcrypt-hashed password.

## SEO & polish

- Per-page `<title>`/description metadata, OpenGraph tags, and `metadataBase`.
- `app/sitemap.ts` (static routes + published blog posts) and `app/robots.ts`
  (private `/installer`, `/admin`, `/api` areas disallowed).
- JSON-LD structured data: `FAQPage` on `/faq`, `Article` on blog posts.
- `loading.tsx` skeletons, a global `error.tsx` boundary, and a custom `not-found.tsx`.
- Mobile-first throughout, with a CSS-only mobile navigation menu.

## Project structure

```
prisma/
  schema.prisma          # data model (Lead, Installer, LeadPurchase,
                         #   CreditTransaction, AdminUser, BlogPost)
  seed.ts                # admin, installers, leads, blog posts
src/
  app/
    page.tsx             # landing page
    calculator/          # savings + subsidy calculator
    get-quote/           # lead form + server action + thank-you
    subsidy-guide/  faq/  blog/   # SEO content pages
    installer/
      login/  signup/    # installer auth
      (portal)/          # protected: dashboard, available-leads,
                         #   my-leads, buy-credits (+ server actions)
    admin/
      login/
      (panel)/           # protected: overview, leads, installers
    api/auth/[...nextauth]/   # NextAuth route handler
    sitemap.ts  robots.ts  error.tsx  not-found.tsx  loading.tsx
  components/             # Navbar, Footer, Calculator, LeadForm,
                         #   UnlockButton, WhatsAppFab, Spinner, ...
  lib/
    config.ts            # editable business constants
    solar.ts             # core calculator math (pure, testable)
    auth.ts              # NextAuth options (credentials, roles)
    session.ts           # requireInstaller / requireAdmin guards
    leads.ts             # masking + service-area helpers
    prisma.ts            # Prisma client singleton
  types/next-auth.d.ts   # session/JWT role typing
```

## Data model summary

| Model | Purpose |
|-------|---------|
| `Lead` | Homeowner enquiry (contact, bill, estimated kW/subsidy, status) |
| `Installer` | Partner account (credits, service-area pincodes, verified) |
| `LeadPurchase` | One installer unlocking one lead (unique per pair) |
| `CreditTransaction` | Wallet ledger (`TOPUP` / `SPEND`) |
| `AdminUser` | Admin login |
| `BlogPost` | SEO content (markdown) |
