"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { estimateFromBill } from "@/lib/solar";
import { PROPERTY_TYPES, formatINR } from "@/lib/config";

interface Props {
  /** Compact mode renders a slimmer preview (used on the homepage). */
  compact?: boolean;
}

export default function Calculator({ compact = false }: Props) {
  const [bill, setBill] = useState<string>("3000");
  const [propertyType, setPropertyType] = useState<string>("INDEPENDENT_HOUSE");
  const [pincode, setPincode] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(!compact);

  const billNum = Math.max(0, Number(bill) || 0);
  const estimate = useMemo(
    () => (billNum > 0 ? estimateFromBill(billNum) : null),
    [billNum],
  );

  const show = submitted && estimate;

  const quoteHref = estimate
    ? `/get-quote?bill=${billNum}&type=${propertyType}${
        pincode ? `&pincode=${pincode}` : ""
      }`
    : "/get-quote";

  return (
    <div className={compact ? "" : "grid gap-8 md:grid-cols-2"}>
      {/* Inputs */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-slate-900">
          Estimate your solar savings
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Enter your average monthly electricity bill to get started.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="label" htmlFor="bill">
              Average monthly electricity bill (₹)
            </label>
            <input
              id="bill"
              type="number"
              inputMode="numeric"
              min={0}
              className="input"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="e.g. 3000"
            />
          </div>

          <div>
            <label className="label" htmlFor="propertyType">
              Property type
            </label>
            <select
              id="propertyType"
              className="input"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              {PROPERTY_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="pincode">
              Pincode <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              className="input"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 500081"
            />
          </div>

          {compact && (
            <button type="submit" className="btn-primary w-full">
              Calculate my savings
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {show ? (
        <ResultCard estimate={estimate} quoteHref={quoteHref} />
      ) : (
        <div className="card flex items-center justify-center text-center text-sm text-slate-400">
          Enter your bill and tap “Calculate my savings” to see your estimate.
        </div>
      )}
    </div>
  );
}

function ResultCard({
  estimate,
  quoteHref,
}: {
  estimate: ReturnType<typeof estimateFromBill>;
  quoteHref: string;
}) {
  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Recommended system size", value: `${estimate.recommendedKW} kW` },
    { label: "Gross system cost", value: formatINR(estimate.grossCost) },
    { label: "PM Surya Ghar subsidy", value: `– ${formatINR(estimate.subsidy)}` },
    { label: "Your net cost", value: formatINR(estimate.netCost), highlight: true },
    { label: "Estimated monthly savings", value: formatINR(estimate.monthlySavings) },
    { label: "Estimated annual savings", value: formatINR(estimate.annualSavings) },
    {
      label: "Payback period",
      value: `${estimate.paybackYears} years`,
      highlight: true,
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900">Your solar estimate</h3>
      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between py-2.5 text-sm"
          >
            <dt className="text-slate-600">{r.label}</dt>
            <dd
              className={
                r.highlight
                  ? "text-base font-bold text-brand-600"
                  : "font-semibold text-slate-900"
              }
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
        ⚠️ Subsidy slabs are set by the government and can change. Please verify
        the latest amounts on the official{" "}
        <a
          href="https://pmsuryaghar.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
        >
          PM Surya Ghar portal
        </a>
        . These figures are estimates to help you plan.
      </p>

      <Link href={quoteHref} className="btn-primary mt-4 w-full">
        Get connected to verified installers →
      </Link>
    </div>
  );
}
