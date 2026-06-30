import Link from "next/link";
import { requireInstaller } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { maskName, maskPhone, parsePincodes, propertyTypeLabel } from "@/lib/leads";
import {
  CREDITS_PER_LEAD_UNLOCK,
  MAX_PURCHASES_PER_LEAD,
  formatINR,
} from "@/lib/config";
import UnlockButton from "@/components/UnlockButton";

export const dynamic = "force-dynamic";

export default async function AvailableLeadsPage() {
  const installer = await requireInstaller();
  const pincodes = parsePincodes(installer.serviceAreaPincodes);

  // Leads in the installer's service area that they haven't unlocked and that
  // haven't reached the purchase cap.
  const leads = await prisma.lead.findMany({
    where: {
      pincode: { in: pincodes },
      purchases: { none: { installerId: installer.id } },
    },
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: "desc" },
  });

  const available = leads.filter(
    (l) => l._count.purchases < MAX_PURCHASES_PER_LEAD,
  );

  const canUnlock = installer.verified && installer.credits >= CREDITS_PER_LEAD_UNLOCK;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Available leads</h2>
        <p className="text-sm text-slate-500">
          Homeowner enquiries in your service-area pincodes ({pincodes.join(", ")}).
          Contact details are revealed after you unlock a lead.
        </p>
      </div>

      {!installer.verified && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Your account is pending verification — unlocking is disabled until an
          admin verifies you.
        </div>
      )}

      {available.length === 0 ? (
        <div className="card text-sm text-slate-500">
          No available leads in your service area right now. Check back soon, or{" "}
          <Link href="/installer/buy-credits" className="font-semibold text-brand-600">
            top up credits
          </Link>{" "}
          so you're ready.
        </div>
      ) : (
        <div className="space-y-3">
          {available.map((lead) => {
            const reason = !installer.verified
              ? "Verification pending"
              : installer.credits < CREDITS_PER_LEAD_UNLOCK
                ? "Not enough credits"
                : undefined;
            return (
              <div key={lead.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{lead.area}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      {lead.pincode}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      {propertyTypeLabel(lead.propertyType)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {lead._count.purchases}/{MAX_PURCHASES_PER_LEAD} unlocked
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span>👤 {maskName(lead.name)}</span>
                    <span>📞 {maskPhone(lead.phone)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span className="text-slate-500">
                      Monthly bill: <strong className="text-slate-800">{formatINR(lead.monthlyBill)}</strong>
                    </span>
                    <span className="text-slate-500">
                      Est. size: <strong className="text-slate-800">{lead.estimatedKW} kW</strong>
                    </span>
                    <span className="text-slate-500">
                      Est. subsidy: <strong className="text-slate-800">{formatINR(lead.estimatedSubsidy)}</strong>
                    </span>
                  </div>
                </div>
                <UnlockButton
                  leadId={lead.id}
                  cost={CREDITS_PER_LEAD_UNLOCK}
                  disabled={!canUnlock}
                  disabledReason={reason}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
