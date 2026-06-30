import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CREDIT_PRICE_INR, formatINR } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    leadsThisWeek,
    totalInstallers,
    verifiedInstallers,
    creditsSold,
    totalUnlocks,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.installer.count(),
    prisma.installer.count({ where: { verified: true } }),
    prisma.creditTransaction.aggregate({
      where: { type: "TOPUP" },
      _sum: { amount: true },
    }),
    prisma.leadPurchase.count(),
  ]);

  const creditsSoldTotal = creditsSold._sum.amount ?? 0;
  const estimatedRevenue = creditsSoldTotal * CREDIT_PRICE_INR;

  const cards = [
    { label: "Total leads", value: totalLeads.toLocaleString("en-IN") },
    { label: "Leads this week", value: leadsThisWeek.toLocaleString("en-IN") },
    {
      label: "Credits sold",
      value: creditsSoldTotal.toLocaleString("en-IN"),
      sub: "all-time TOPUPs",
    },
    {
      label: "Estimated revenue",
      value: formatINR(estimatedRevenue),
      sub: `@ ${formatINR(CREDIT_PRICE_INR)}/credit`,
    },
    {
      label: "Installers",
      value: `${verifiedInstallers}/${totalInstallers}`,
      sub: "verified / total",
    },
    { label: "Leads unlocked", value: totalUnlocks.toLocaleString("en-IN") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{c.value}</p>
            {c.sub && <p className="text-xs text-slate-400">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/admin/leads" className="btn-primary">View all leads</Link>
        <Link href="/admin/installers" className="btn-secondary">Manage installers</Link>
      </div>
    </div>
  );
}
