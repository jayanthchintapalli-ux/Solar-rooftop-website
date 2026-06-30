import Link from "next/link";
import { requireInstaller } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
import { formatINR, CREDIT_PRICE_INR } from "@/lib/config";

const portalLinks = [
  { href: "/installer/dashboard", label: "Dashboard" },
  { href: "/installer/available-leads", label: "Available leads" },
  { href: "/installer/my-leads", label: "My leads" },
  { href: "/installer/buy-credits", label: "Buy credits" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const installer = await requireInstaller();

  return (
    <div className="container-page py-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">{installer.companyName}</p>
          <h1 className="text-xl font-bold text-slate-900">
            Installer portal
            {!installer.verified && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-semibold text-amber-700">
                Pending verification
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700">
            {installer.credits} credits ({formatINR(installer.credits * CREDIT_PRICE_INR)} value)
          </span>
          <LogoutButton />
        </div>
      </div>

      <nav className="mt-4 flex gap-1 overflow-x-auto">
        {portalLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
