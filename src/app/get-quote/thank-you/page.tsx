import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Thank you — your request is in",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          Thank you! Your request is in.
        </h1>
        <p className="mt-3 text-slate-600">
          We've received your details and verified installers in your area will
          reach out with a tailored quote. This service is completely free for
          you.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left text-sm text-slate-600">
          <p className="font-semibold text-slate-800">What happens next?</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>A verified installer reviews your enquiry.</li>
            <li>They contact you (usually within 1–2 working days).</li>
            <li>You compare quotes and choose — no obligation.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink("Hi! I just submitted a solar quote request and have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            Chat with us on WhatsApp
          </a>
          <Link href="/subsidy-guide" className="btn-secondary">
            Learn about the subsidy
          </Link>
        </div>

        <Link href="/" className="mt-6 inline-block text-sm text-slate-400 hover:text-slate-600">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
