import Link from "next/link";
import { whatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span aria-hidden>☀️</span> HyderabadSolar
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Free rooftop solar savings estimates and connections to verified,
            subsidy-approved installers across Hyderabad.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Homeowners</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/calculator" className="hover:text-brand-600">Savings calculator</Link></li>
            <li><Link href="/get-quote" className="hover:text-brand-600">Get a free quote</Link></li>
            <li><Link href="/subsidy-guide" className="hover:text-brand-600">PM Surya Ghar subsidy</Link></li>
            <li><Link href="/faq" className="hover:text-brand-600">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Installers</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/installer/signup" className="hover:text-brand-600">Become a partner</Link></li>
            <li><Link href="/installer/login" className="hover:text-brand-600">Installer login</Link></li>
            <li><Link href="/blog" className="hover:text-brand-600">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
          <p className="mt-3 text-sm text-slate-600">
            Have a question? Chat with us on WhatsApp.
          </p>
          <a
            href={whatsappLink("Hi! I have a question about rooftop solar in Hyderabad.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-3 !py-2 !px-4 text-sm"
          >
            WhatsApp us
          </a>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} HyderabadSolar. 100% free for homeowners.</p>
          <p>Subsidy figures are indicative — always verify on the official PM Surya Ghar portal.</p>
        </div>
      </div>
    </footer>
  );
}
