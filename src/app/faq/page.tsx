import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Common questions about rooftop solar in Hyderabad: cost, the PM Surya Ghar subsidy, savings, net metering, apartments, and how our free quote service works.",
};

const faqs = [
  {
    q: "Is this service really free for homeowners?",
    a: "Yes, completely. We never charge homeowners. We're a connection service — verified installers pay us to receive genuine enquiries, so you get free quotes with no obligation.",
  },
  {
    q: "How much does rooftop solar cost in Hyderabad?",
    a: "Roughly ₹55,000 per kW before subsidy. After the PM Surya Ghar subsidy (up to ₹78,000), a typical 2–3 kW home system costs around ₹50,000–₹90,000 net. Use our calculator for your specific numbers.",
  },
  {
    q: "How much can I save?",
    a: "It depends on your bill, but most homeowners offset the bulk of their electricity usage. A 3 kW system can save roughly ₹2,500–₹3,000 a month, typically paying for itself in 4–6 years.",
  },
  {
    q: "What is the PM Surya Ghar subsidy?",
    a: "It's a central government subsidy for rooftop solar: ₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000. See our subsidy guide for full details.",
  },
  {
    q: "Can I get solar if I live in an apartment?",
    a: "It's possible but more complex, as it usually requires society approval and shared roof access. Independent houses are the most straightforward. Tell us your situation and we'll connect you with installers who handle apartments.",
  },
  {
    q: "What is net metering?",
    a: "Net metering lets you export surplus solar power to the grid and get credited against the electricity you draw at night or on cloudy days. In Hyderabad this is handled through TGSPDCL.",
  },
  {
    q: "How long does installation take?",
    a: "The physical installation is usually 2–4 days. The full process — feasibility approval, installation, net-metering and subsidy disbursement — typically takes a few weeks.",
  },
  {
    q: "How do you choose the installers?",
    a: "We work with verified, subsidy-approved local installers. You'll receive quotes from more than one where possible so you can compare and choose.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Everything you need to know about rooftop solar in Hyderabad and how our
          free quote service works.
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                {f.q}
                <span className="ml-4 text-brand-500 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-600 px-6 py-8 text-center text-white">
          <h2 className="text-xl font-bold">Still have questions?</h2>
          <p className="mt-1 text-brand-50">
            Get a free quote and a verified installer will answer everything.
          </p>
          <Link href="/get-quote" className="btn mt-4 bg-white text-brand-700 hover:bg-brand-50">
            Get my free quote
          </Link>
        </div>
      </div>
    </div>
  );
}
