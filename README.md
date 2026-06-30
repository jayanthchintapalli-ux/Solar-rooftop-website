# HyderabadSolar — Rooftop Solar Leads Marketplace

A lead-generation marketplace for rooftop solar in Hyderabad, Telangana. Homeowners
get a free savings + PM Surya Ghar subsidy estimate and request a quote; verified
local installers buy credits and unlock leads in their service area.

> **Status:** Phase 1 complete — project scaffold, Prisma + SQLite, seed data, the
> public landing page, and a working savings/subsidy calculator. Lead capture,
> installer portal, and admin panel land in later phases.

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
