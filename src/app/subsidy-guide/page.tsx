import type { Metadata } from "next";
import Link from "next/link";
import { formatINR } from "@/lib/config";

export const metadata: Metadata = {
  title: "How the PM Surya Ghar subsidy works in Hyderabad",
  description:
    "A clear, plain-English guide to the PM Surya Ghar rooftop solar subsidy: how the slabs work (₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd, capped at ₹78,000), who is eligible, and how to apply in Hyderabad.",
};

export default function SubsidyGuidePage() {
  return (
    <article className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          How the PM Surya Ghar subsidy works
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The Government of India's <strong>PM Surya Ghar: Muft Bijli Yojana</strong>{" "}
          pays a direct subsidy for installing rooftop solar. Here's exactly how
          much you can claim as a Hyderabad homeowner.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">The subsidy slabs</h2>
          <p className="mt-2 text-slate-600">
            The Central Financial Assistance (CFA) is calculated in slabs based on
            your system size:
          </p>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li>• <strong>First 2 kW:</strong> {formatINR(30000)} per kW</li>
            <li>• <strong>3rd kW:</strong> {formatINR(18000)} per kW</li>
            <li>• <strong>Above 3 kW:</strong> no additional subsidy</li>
            <li>• <strong>Hard cap:</strong> {formatINR(78000)} total</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Quick examples</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2 font-semibold">System size</th>
                  <th className="px-4 py-2 font-semibold">Your subsidy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["1 kW", 30000],
                  ["2 kW", 60000],
                  ["3 kW", 78000],
                  ["5 kW", 78000],
                ].map(([size, amt]) => (
                  <tr key={size as string}>
                    <td className="px-4 py-2.5 text-slate-700">{size}</td>
                    <td className="px-4 py-2.5 font-semibold text-brand-600">
                      {formatINR(amt as number)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Most Hyderabad homes (bills of ₹2,000–₹5,000/month) need a 2–3 kW
            system, claiming {formatINR(60000)}–{formatINR(78000)}.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Who is eligible?</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>You're a residential electricity consumer.</li>
            <li>You own a suitable rooftop (or have permission to use it).</li>
            <li>The system is installed by a registered vendor and grid-connected through your DISCOM (TGSPDCL in Hyderabad).</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">How to apply</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-700">
            <li>Register on the official PM Surya Ghar portal.</li>
            <li>Apply for feasibility approval from your DISCOM.</li>
            <li>Get the system installed by a registered installer.</li>
            <li>Apply for net-metering and inspection.</li>
            <li>Receive the subsidy directly in your bank account.</li>
          </ol>
        </section>

        <div className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ <strong>Important:</strong> Subsidy slabs and eligibility rules are set
          by the government and <strong>can change</strong>. Always verify the
          latest figures on the official{" "}
          <a
            href="https://pmsuryaghar.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            PM Surya Ghar portal
          </a>{" "}
          before making a decision.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/calculator" className="btn-primary">
            Calculate my subsidy & savings
          </Link>
          <Link href="/get-quote" className="btn-secondary">
            Get a free quote
          </Link>
        </div>
      </div>
    </article>
  );
}
