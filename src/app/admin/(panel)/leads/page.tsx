import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { propertyTypeLabel } from "@/lib/leads";
import { MAX_PURCHASES_PER_LEAD, formatINR } from "@/lib/config";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  NEW: "bg-brand-100 text-brand-700",
  SOLD: "bg-amber-100 text-amber-700",
  CLOSED: "bg-slate-200 text-slate-600",
};

export default async function AdminLeadsPage() {
  await requireAdmin();

  const leads = await prisma.lead.findMany({
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        All leads ({leads.length})
      </h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Area / Pincode</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Bill</th>
              <th className="px-4 py-3">Est. kW</th>
              <th className="px-4 py-3">Subsidy</th>
              <th className="px-4 py-3">Sold to</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{l.name}</td>
                <td className="px-4 py-3 text-slate-600">{l.phone}</td>
                <td className="px-4 py-3 text-slate-600">{l.area} · {l.pincode}</td>
                <td className="px-4 py-3 text-slate-600">{propertyTypeLabel(l.propertyType)}</td>
                <td className="px-4 py-3 text-slate-600">{formatINR(l.monthlyBill)}</td>
                <td className="px-4 py-3 text-slate-600">{l.estimatedKW}</td>
                <td className="px-4 py-3 text-slate-600">{formatINR(l.estimatedSubsidy)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {l._count.purchases}/{MAX_PURCHASES_PER_LEAD}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[l.status] ?? ""}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
