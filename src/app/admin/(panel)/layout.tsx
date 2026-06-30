import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/installers", label: "Installers" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="container-page py-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Admin panel</p>
          <h1 className="text-xl font-bold text-slate-900">HyderabadSolar control</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{admin.email}</span>
          <LogoutButton callbackUrl="/admin/login" />
        </div>
      </div>

      <nav className="mt-4 flex gap-1 overflow-x-auto">
        {adminLinks.map((l) => (
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
