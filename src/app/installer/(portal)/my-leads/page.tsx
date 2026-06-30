import Link from "next/link";
import { requireInstaller } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { propertyTypeLabel } from "@/lib/leads";
import { formatINR, whatsappLink } from "@/lib/config";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function MyLeadsPage() {
  const installer = await requireInstaller();

  const purchases = await prisma.leadPurchase.findMany({
    where: { installerId: installer.id },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My leads</h2>
        <p className="text-sm text-slate-500">
          Full contact details for the {purchases.length} lead
          {purchases.length === 1 ? "" : "s"} you've unlocked.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="card text-sm text-slate-500">
          You haven't unlocked any leads yet.{" "}
          <Link href="/installer/available-leads" className="font-semibold text-brand-600">
            Browse available leads →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map(({ lead, id, createdAt, creditsSpent }) => {
            const waMsg = `Hi ${lead.name.split(" ")[0]}, this is ${installer.companyName}. You requested a rooftop solar quote in ${lead.area} — I'd love to help you go solar.`;
            return (
              <div key={id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                  <span className="text-xs text-slate-400">
                    Unlocked {formatDate(createdAt)} · {creditsSpent} credits
                  </span>
                </div>

                <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  <p className="text-slate-600">📞 <a href={`tel:${lead.phone}`} className="font-medium text-slate-900 hover:underline">{lead.phone}</a></p>
                  <p className="text-slate-600">📍 {lead.area}, {lead.pincode}</p>
                  <p className="text-slate-600">🏠 {propertyTypeLabel(lead.propertyType)}</p>
                  <p className="text-slate-600">💡 Monthly bill: <strong className="text-slate-900">{formatINR(lead.monthlyBill)}</strong></p>
                  <p className="text-slate-600">⚡ Est. size: <strong className="text-slate-900">{lead.estimatedKW} kW</strong></p>
                  <p className="text-slate-600">🏦 Est. subsidy: <strong className="text-slate-900">{formatINR(lead.estimatedSubsidy)}</strong></p>
                </div>

                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp mt-3 !py-2 !px-4 text-sm"
                >
                  Message on WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
