import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { estimateFromBill } from "@/lib/solar";

const INSTALLER_PASSWORD = "installer12345";

export interface SeedSummary {
  admin: { email: string; password: string };
  installerPassword: string;
  installers: { email: string; companyName: string }[];
  counts: { installers: number; leads: number; blogPosts: number };
}

/**
 * Seed the database with an admin, sample installers, leads and blog posts.
 * Shared by the CLI script (prisma/seed.ts) and the protected /api/seed route.
 *
 * Destructive: clears existing rows first so re-running gives a clean state.
 */
export async function runSeed(): Promise<SeedSummary> {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin12345";

  // --- Clean slate ------------------------------------------------------
  await prisma.leadPurchase.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.installer.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.blogPost.deleteMany();

  // --- Admin ------------------------------------------------------------
  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  // --- Installers -------------------------------------------------------
  const installerSeed = [
    {
      name: "Ravi Kumar",
      companyName: "SunSure Solar Hyderabad",
      email: "ravi@sunsure.example.com",
      phone: "+919812300001",
      serviceAreaPincodes: "500081,500032,500084", // Gachibowli, Madhapur
      credits: 200,
    },
    {
      name: "Anjali Reddy",
      companyName: "GreenVolt Energy",
      email: "anjali@greenvolt.example.com",
      phone: "+919812300002",
      serviceAreaPincodes: "500072,500085,500090", // Kukatpally
      credits: 150,
    },
    {
      name: "Suresh Babu",
      companyName: "Deccan Solar Works",
      email: "suresh@deccansolar.example.com",
      phone: "+919812300003",
      serviceAreaPincodes: "500003,500009,500015", // Secunderabad
      credits: 100,
    },
    {
      name: "Priya Sharma",
      companyName: "BrightRoof Solar",
      email: "priya@brightroof.example.com",
      phone: "+919812300004",
      serviceAreaPincodes: "500081,500034,500033", // Gachibowli, Banjara Hills
      credits: 300,
    },
    {
      name: "Mohammed Imran",
      companyName: "Charminar Renewables",
      email: "imran@charminar.example.com",
      phone: "+919812300005",
      serviceAreaPincodes: "500028,500064,500005", // Old City
      credits: 50,
    },
  ];

  const installerPasswordHash = await bcrypt.hash(INSTALLER_PASSWORD, 10);
  for (const i of installerSeed) {
    await prisma.installer.create({
      data: {
        ...i,
        passwordHash: installerPasswordHash,
        verified: true,
        transactions: {
          create: {
            amount: i.credits,
            type: "TOPUP",
            note: "Initial seed credits",
          },
        },
      },
    });
  }

  // --- Leads ------------------------------------------------------------
  const leadSeed = [
    { name: "Venkat Rao", phone: "+919900000001", pincode: "500081", area: "Gachibowli", monthlyBill: 3500, propertyType: "INDEPENDENT_HOUSE" },
    { name: "Lakshmi Devi", phone: "+919900000002", pincode: "500072", area: "Kukatpally", monthlyBill: 2200, propertyType: "APARTMENT" },
    { name: "Arjun Nair", phone: "+919900000003", pincode: "500081", area: "Madhapur", monthlyBill: 5200, propertyType: "INDEPENDENT_HOUSE" },
    { name: "Fatima Begum", phone: "+919900000004", pincode: "500003", area: "Secunderabad", monthlyBill: 1800, propertyType: "APARTMENT" },
    { name: "Krishna Murthy", phone: "+919900000005", pincode: "500032", area: "Kondapur", monthlyBill: 7800, propertyType: "INDEPENDENT_HOUSE" },
    { name: "Deepa Iyer", phone: "+919900000006", pincode: "500034", area: "Banjara Hills", monthlyBill: 9500, propertyType: "INDEPENDENT_HOUSE" },
    { name: "Sai Teja", phone: "+919900000007", pincode: "500072", area: "Kukatpally", monthlyBill: 2800, propertyType: "APARTMENT" },
    { name: "Ramesh Goud", phone: "+919900000008", pincode: "500084", area: "Gachibowli", monthlyBill: 4100, propertyType: "INDEPENDENT_HOUSE" },
    { name: "Sneha Patel", phone: "+919900000009", pincode: "500009", area: "Secunderabad", monthlyBill: 12000, propertyType: "COMMERCIAL" },
    { name: "Harish Chandra", phone: "+919900000010", pincode: "500090", area: "Nizampet", monthlyBill: 3000, propertyType: "INDEPENDENT_HOUSE" },
  ];

  for (const l of leadSeed) {
    const est = estimateFromBill(l.monthlyBill);
    await prisma.lead.create({
      data: {
        ...l,
        estimatedKW: est.recommendedKW,
        estimatedSubsidy: est.subsidy,
        status: "NEW",
      },
    });
  }

  // --- Blog posts -------------------------------------------------------
  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  return {
    admin: { email: adminEmail, password: adminPassword },
    installerPassword: INSTALLER_PASSWORD,
    installers: installerSeed.map((i) => ({ email: i.email, companyName: i.companyName })),
    counts: {
      installers: installerSeed.length,
      leads: leadSeed.length,
      blogPosts: blogPosts.length,
    },
  };
}

const blogPosts = [
  {
    slug: "pm-surya-ghar-subsidy-explained-hyderabad",
    title: "PM Surya Ghar subsidy explained for Hyderabad homeowners",
    excerpt:
      "A plain-English guide to the PM Surya Ghar rooftop solar subsidy, how the slabs work, and how much a Hyderabad household can actually claim.",
    publishedAt: new Date("2026-01-15"),
    contentMarkdown: `# PM Surya Ghar subsidy explained for Hyderabad homeowners

If you've been thinking about rooftop solar in Hyderabad, you've probably heard about the **PM Surya Ghar: Muft Bijli Yojana** — the central government scheme that pays a chunk of your installation cost. But the details can be confusing. Here's a clear breakdown.

## What is PM Surya Ghar?

PM Surya Ghar is a Government of India scheme launched to help households install rooftop solar and reduce their electricity bills. The government provides a direct **Central Financial Assistance (CFA)** — a subsidy paid into your bank account after your system is installed and verified.

## How the subsidy slabs work

The subsidy is calculated on your system size, in slabs:

- **First 2 kW:** ₹30,000 per kW
- **3rd kW:** ₹18,000 per kW
- **Above 3 kW:** no additional subsidy

This means the subsidy is **capped at ₹78,000**, no matter how large your system is. Some quick examples:

- A **1 kW** system → ₹30,000
- A **2 kW** system → ₹60,000
- A **3 kW** system → ₹78,000
- A **5 kW** system → still ₹78,000

For most Hyderabad homes with a monthly bill of ₹2,000–₹5,000, a 2–3 kW system is the sweet spot, which means you can claim ₹60,000–₹78,000.

## Who is eligible?

- You must be a residential electricity consumer.
- You need a suitable rooftop that you own (or have permission to use).
- The system must be installed by a registered vendor and connected to the grid through your DISCOM (in Telangana, that's typically TGSPDCL).

## How to apply

1. Register on the official **PM Surya Ghar portal** (pmsuryaghar.gov.in).
2. Apply for feasibility approval from your DISCOM.
3. Get the system installed by a registered installer.
4. Submit for net-metering and inspection.
5. Receive the subsidy directly in your bank account.

## A note on changing rules

Subsidy slabs and eligibility rules **can change**. The numbers above are accurate at the time of writing and are what our calculator uses, but you should always verify the latest figures on the official portal before making a decision.

## The bottom line

For a typical Hyderabad household, the subsidy can cover a large share of the cost of a 2–3 kW system, with the rest usually paying for itself in just a few years through bill savings. Use our [free calculator](/calculator) to see your numbers, then [request a free quote](/get-quote) from a verified local installer.
`,
  },
  {
    slug: "rooftop-solar-cost-hyderabad",
    title: "How much does rooftop solar cost in Hyderabad?",
    excerpt:
      "A realistic look at rooftop solar prices in Hyderabad in 2026 — system costs per kW, what the subsidy knocks off, and the net price you'll actually pay.",
    publishedAt: new Date("2026-02-02"),
    contentMarkdown: `# How much does rooftop solar cost in Hyderabad?

The single most common question we get is simple: **what will it actually cost me?** Let's break down realistic rooftop solar prices for a Hyderabad home in 2026.

## The headline number: about ₹55,000 per kW

A good-quality grid-connected rooftop solar system in Hyderabad costs roughly **₹50,000–₹60,000 per kW** installed, before any subsidy. We use ₹55,000/kW as a planning figure. This typically includes:

- Solar panels (modules)
- Inverter
- Mounting structure and cabling
- Installation labour
- Net-metering setup

## What the subsidy takes off

Thanks to the PM Surya Ghar scheme, the central subsidy is:

- ₹30,000/kW for the first 2 kW
- ₹18,000 for the 3rd kW
- Capped at ₹78,000

So your **net cost** drops significantly:

| System size | Gross cost | Subsidy | Net cost |
|-------------|-----------:|--------:|---------:|
| 2 kW | ₹1,10,000 | ₹60,000 | ₹50,000 |
| 3 kW | ₹1,65,000 | ₹78,000 | ₹87,000 |
| 5 kW | ₹2,75,000 | ₹78,000 | ₹1,97,000 |

## How big a system do you need?

It depends on your electricity bill. As a rule of thumb in Hyderabad, **1 kW generates about 120 units a month**. So:

- A ₹2,500/month bill (~310 units) → about 2.5 kW
- A ₹4,000/month bill (~500 units) → about 4 kW

Our [calculator](/calculator) sizes this automatically from your bill.

## What about ongoing costs?

Solar is refreshingly low-maintenance. Panels typically carry 25-year performance warranties, and the main upkeep is occasional cleaning. Inverters may need replacing after 8–12 years. There are no fuel costs — sunshine is free.

## Is it worth financing?

Many households pay upfront, but solar loans are increasingly available, and because the monthly savings often exceed the EMI, you can be cash-flow positive from day one. Ask your installer about financing options.

## The real takeaway

After subsidy, a typical 2–3 kW Hyderabad home system costs roughly **₹50,000–₹90,000 net**, and usually pays for itself within 4–6 years — after which the electricity is essentially free for the remaining 20+ year life of the panels.

Ready to see your numbers? [Run the calculator](/calculator) and [get a free quote](/get-quote) from a verified installer near you.
`,
  },
  {
    slug: "is-rooftop-solar-worth-it-telangana",
    title: "Is rooftop solar worth it in Telangana?",
    excerpt:
      "With strong sunshine, rising tariffs and a generous central subsidy, we look at whether rooftop solar genuinely pays off for Telangana households.",
    publishedAt: new Date("2026-02-20"),
    contentMarkdown: `# Is rooftop solar worth it in Telangana?

Short answer: for most homeowners with a decent south-facing roof and a monthly bill above ₹1,500, **yes** — rooftop solar in Telangana is one of the better investments you can make. Here's why.

## 1. Telangana gets a lot of sun

Telangana enjoys roughly 300 sunny days a year. In Hyderabad, **1 kW of rooftop solar generates about 120 units of electricity per month**. That strong, consistent generation is the foundation of solar's economics here — your panels are productive for most of the year.

## 2. Electricity tariffs keep rising

Grid electricity only gets more expensive over time. Every unit you generate yourself is a unit you don't buy from the DISCOM. At a residential tariff of around ₹8/unit, a 3 kW system generating ~360 units a month can offset close to ₹2,800 every month — money that stays in your pocket.

## 3. The subsidy dramatically shortens payback

The PM Surya Ghar subsidy (up to ₹78,000) cuts your upfront cost substantially. Combine that with monthly savings, and a typical system pays for itself in **4–6 years**. Since panels last 25+ years, that's roughly two decades of nearly free electricity after payback.

## 4. Net metering means you don't waste extra power

Through net metering with TGSPDCL, surplus electricity you export to the grid is credited against what you draw at night or on cloudy days. This makes a grid-connected system far more economical than relying on batteries.

## When might it *not* be worth it?

Solar isn't for everyone. It may not make sense if:

- You have very little usable roof space (common for some apartments).
- Your roof is heavily shaded by buildings or trees.
- Your electricity bill is very low (under ₹1,000/month), which lengthens payback.
- You don't own your roof and can't get permission.

## Running the numbers for your home

The honest way to decide is to look at your own figures: your bill, your roof, your subsidy. Our [free calculator](/calculator) does this in seconds, showing your recommended system size, subsidy, net cost and payback period.

If the numbers look good — and for most Telangana homeowners they do — the next step is to [get a free, no-obligation quote](/get-quote) from a verified local installer. There's no cost to you, and you'll get a clear picture of what solar would mean for your home.
`,
  },
];
