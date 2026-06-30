"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createLead, type LeadFormState } from "@/app/get-quote/actions";
import { PROPERTY_TYPES, formatINR } from "@/lib/config";
import { estimateFromBill } from "@/lib/solar";
import { useMemo, useState } from "react";

interface Props {
  defaultBill?: string;
  defaultType?: string;
  defaultPincode?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Submitting…" : "Get my free quote"}
    </button>
  );
}

export default function LeadForm({
  defaultBill,
  defaultType,
  defaultPincode,
}: Props) {
  const initial: LeadFormState = {};
  const [state, formAction] = useFormState(createLead, initial);
  const [bill, setBill] = useState(defaultBill || "");

  const billNum = Number(bill) || 0;
  const estimate = useMemo(
    () => (billNum > 0 ? estimateFromBill(billNum) : null),
    [billNum],
  );

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form action={formAction} className="card space-y-4">
        {state.error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}

        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" className="input" required placeholder="Your name" />
        </div>

        <div>
          <label className="label" htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            required
            placeholder="e.g. +91 98XXXXXXXX"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              name="pincode"
              inputMode="numeric"
              className="input"
              required
              defaultValue={defaultPincode}
              placeholder="500081"
            />
          </div>
          <div>
            <label className="label" htmlFor="area">Area / locality</label>
            <input id="area" name="area" className="input" required placeholder="e.g. Gachibowli" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="monthlyBill">Average monthly electricity bill (₹)</label>
          <input
            id="monthlyBill"
            name="monthlyBill"
            type="number"
            inputMode="numeric"
            min={1}
            className="input"
            required
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="e.g. 3000"
          />
        </div>

        <div>
          <label className="label" htmlFor="propertyType">Property type</label>
          <select
            id="propertyType"
            name="propertyType"
            className="input"
            defaultValue={defaultType || "INDEPENDENT_HOUSE"}
          >
            {PROPERTY_TYPES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <SubmitButton />

        <p className="text-center text-xs text-slate-400">
          100% free for homeowners. We'll connect you with verified installers.
          No spam.
        </p>
      </form>

      {/* Live estimate echo */}
      <div className="card h-fit">
        <h3 className="text-lg font-semibold text-slate-900">Your estimate</h3>
        {estimate ? (
          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label="Recommended size" value={`${estimate.recommendedKW} kW`} />
            <Row label="Gross cost" value={formatINR(estimate.grossCost)} />
            <Row label="PM Surya Ghar subsidy" value={`– ${formatINR(estimate.subsidy)}`} />
            <Row label="Net cost" value={formatINR(estimate.netCost)} highlight />
            <Row label="Est. monthly savings" value={formatINR(estimate.monthlySavings)} />
            <Row label="Payback" value={`${estimate.paybackYears} years`} highlight />
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Enter your monthly bill to preview your savings estimate.
          </p>
        )}
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Subsidy slabs can change — verify the latest on the official PM Surya
          Ghar portal.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className={highlight ? "font-bold text-brand-600" : "font-semibold text-slate-900"}>
        {value}
      </dd>
    </div>
  );
}
