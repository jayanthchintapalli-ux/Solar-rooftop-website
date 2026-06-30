import Link from "next/link";
import Calculator from "@/components/Calculator";
import { HOMEOWNERS_HELPED, formatINR, SUBSIDY_CAP, whatsappLink } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              PM Surya Ghar subsidy up to {formatINR(SUBSIDY_CAP)}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              Cut your electricity bill with rooftop solar in{" "}
              <span className="text-brand-600">Hyderabad</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              See your savings and government subsidy in 30 seconds, then get
              connected with verified local installers. Always 100% free for
              homeowners.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/get-quote" className="btn-primary">
                Get my free solar quote
              </Link>
              <Link href="/calculator" className="btn-secondary">
                Open the calculator
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>✅ Subsidy-approved installers</span>
              <span>✅ 100% free for homeowners</span>
              <span>✅ {HOMEOWNERS_HELPED.toLocaleString("en-IN")}+ homeowners helped</span>
            </div>
          </div>

          {/* Calculator preview */}
          <div>
            <Calculator compact />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-14">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Estimate your savings",
              body: "Use our free calculator to see your recommended system size, subsidy and payback period.",
            },
            {
              step: "2",
              title: "Request a free quote",
              body: "Share a few details. There's no cost and no obligation — we never charge homeowners.",
            },
            {
              step: "3",
              title: "Connect with verified installers",
              body: "Subsidy-approved local installers reach out with tailored quotes for your rooftop.",
            },
          ].map((s) => (
            <div key={s.step} className="card text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-slate-50 py-12">
        <div className="container-page grid gap-6 text-center sm:grid-cols-3">
          <div>
            <div className="text-3xl font-extrabold text-brand-600">
              {HOMEOWNERS_HELPED.toLocaleString("en-IN")}+
            </div>
            <p className="mt-1 text-sm text-slate-600">Hyderabad homeowners helped</p>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-brand-600">
              {formatINR(SUBSIDY_CAP)}
            </div>
            <p className="mt-1 text-sm text-slate-600">Max central subsidy (3 kW+)</p>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-brand-600">100% free</div>
            <p className="mt-1 text-sm text-slate-600">No cost for homeowners, ever</p>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="container-page py-14">
        <div className="rounded-2xl bg-brand-600 px-6 py-10 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold">
            Not sure if solar is worth it for your home?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-50">
            Read our plain-English guide to the PM Surya Ghar subsidy, or message
            us on WhatsApp — we're happy to help.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/subsidy-guide" className="btn bg-white text-brand-700 hover:bg-brand-50">
              Read the subsidy guide
            </Link>
            <a
              href={whatsappLink("Hi! I'd like help understanding rooftop solar savings.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
