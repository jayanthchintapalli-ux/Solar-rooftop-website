import Link from "next/link";
import { requireInstaller } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parsePincodes } from "@/lib/leads";
import {
  CREDITS_PER_LEAD_UNLOCK,
  CREDIT_PRICE_INR,
  formatINR,
} from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const installer = await requireInstaller();
  const pincodes = parsePincodes(installer.serviceAreaPincodes);

  const [myLeadsCount, availableCount, recentTx] = await Promise.all([
    prisma.leadPurchase.count({ where: { installerId: installer.id } }),
    prisma.lead.count({
      where: {
        pincode: { in: pincodes },
        purchases: { none: { installerId: installer.id } },
      },
    }),
    prisma.creditTransaction.findMany({
      where: { installerId: installer.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const cards = [
    {
      label: "Credit balance",
      value: `${installer.credits}`,
      sub: `${formatINR(installer.credits * CREDIT_PRICE_INR)} value`,
    },
    { label: "Leads unlocked", value: `${myLeadsCount}`, sub: "lifetime" },
    {
      label: "Available in your areas",
      value: `${availableCount}`,
      sub: "not yet unlocked",
    },
    {
      label: "Cost per unlock",
      value: `${CREDITS_PER_LEAD_UNLOCK}`,
      sub: "credits",
    },
  ];

  return (
    <div className="space-y-8">
      {!installer.verified && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Your account is <strong>pending verification</strong>. You can browse and
          buy credits now; an admin will verify you shortly.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-400">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/installer/available-leads" className="btn-primary">
          Browse available leads
        </Link>
        <Link href="/installer/buy-credits" className="btn-secondary">
          Buy more credits
        </Link>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Recent wallet activity</h2>
        {recentTx.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recentTx.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <span
                    className={`mr-2 rounded px-1.5 py-0.5 text-xs font-semibold ${
                      t.type === "TOPUP"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.type}
                  </span>
                  <span className="text-slate-600">{t.note}</span>
                </div>
                <span
                  className={`font-semibold ${
                    t.type === "TOPUP" ? "text-brand-600" : "text-slate-700"
                  }`}
                >
                  {t.type === "TOPUP" ? "+" : "−"}
                  {t.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
