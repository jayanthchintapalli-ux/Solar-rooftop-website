import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/config";
import { CreditAdjuster, VerifyToggle } from "./InstallerControls";

export const dynamic = "force-dynamic";

export default async function AdminInstallersPage() {
  await requireAdmin();

  const installers = await prisma.installer.findMany({
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Installers ({installers.length})
      </h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Service areas</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Unlocked</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Adjust credits</th>
              <th className="px-4 py-3">Verify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {installers.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{i.companyName}</div>
                  <div className="text-xs text-slate-400">{i.name}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{i.email}</div>
                  <div className="text-xs text-slate-400">{i.phone}</div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{i.serviceAreaPincodes}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-900">{i.credits}</span>
                  <div className="text-xs text-slate-400">{formatINR(i.credits * 10)}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{i._count.purchases}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      i.verified
                        ? "bg-brand-100 text-brand-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {i.verified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CreditAdjuster installerId={i.id} />
                </td>
                <td className="px-4 py-3">
                  <VerifyToggle installerId={i.id} verified={i.verified} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
