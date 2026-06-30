# HyderabadSolar — Rooftop Solar Leads Marketplace

A lead-generation marketplace for rooftop solar in Hyderabad, Telangana. Homeowners
get a free savings + PM Surya Ghar subsidy estimate and request a quote; verified
local installers buy credits and unlock leads in their service area.

> **Status:** Phases 1–4 complete — public site (landing, calculator, lead capture,
> subsidy guide, FAQ, blog), the full **installer portal** (auth, wallet, masked
> available-leads, unlock-with-credits, my-leads), and the **admin panel** (analytics,
> leads table, installer verify/credit management). Phase 5 is final polish.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (mobile-first)
- **Prisma ORM** with **SQLite** for local dev (switch to Postgres for production via `DATABASE_URL`)
- NextAuth credentials auth (installer + admin roles) — added in later phases

## Getting started

Requires Node 18+.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
#   (defaults work out of the box for local SQLite dev)

# 3. Create the database and generate the Prisma client
npx prisma db push

# 4. Seed sample data (admin, installers, leads, blog posts)
npm run seed

# 5. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

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

## Switching to Postgres for production

1. In `prisma/schema.prisma`, change `datasource db { provider = "sqlite" }` to
   `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Postgres connection string.
3. Run `npx prisma migrate deploy` (or `prisma db push`) against the new database,
   then `npm run seed` if you want sample data.

Deploy to Vercel by setting `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` as
environment variables (full deploy guide in Phase 5).

## Project structure

```
prisma/
  schema.prisma     # full data model (Lead, Installer, LeadPurchase, ...)
  seed.ts           # admin, installers, leads, blog posts
src/
  app/              # App Router pages (/, /calculator, ...)
  components/        # Navbar, Footer, Calculator, WhatsApp button
  lib/
    config.ts       # editable business constants
    solar.ts        # core calculator math (pure, testable)
    prisma.ts       # Prisma client singleton
```
