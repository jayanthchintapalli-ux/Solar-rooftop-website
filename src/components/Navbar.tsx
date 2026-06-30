import Link from "next/link";

const navLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/subsidy-guide", label: "Subsidy Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="text-2xl" aria-hidden>
            ☀️
          </span>
          <span className="text-lg leading-tight">
            Hyderabad<span className="text-brand-500">Solar</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/installer/login" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Installer login
          </Link>
          <Link href="/get-quote" className="btn-primary !py-2 !px-4 text-sm">
            Get my free quote
          </Link>
        </nav>

        {/* Mobile: quick CTA + CSS-only dropdown menu via <details> */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/get-quote" className="btn-primary !py-2 !px-3 text-sm">
            Free quote
          </Link>
          <details className="relative">
            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-300 text-slate-700">
              <span className="text-lg leading-none" aria-label="Open menu">☰</span>
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-1 border-t border-slate-100" />
              <Link
                href="/installer/login"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Installer login
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
