import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Solar savings & subsidy calculator",
  description:
    "Free rooftop solar calculator for Hyderabad. Estimate your system size, PM Surya Ghar subsidy, net cost, monthly savings and payback period.",
};

export default function CalculatorPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">
        Rooftop solar savings calculator
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Estimate your recommended system size, government subsidy, net cost and
        payback period for Hyderabad. Adjust your monthly bill to see how it
        changes.
      </p>

      <div className="mt-8">
        <Calculator />
      </div>

      <div className="mt-10 max-w-2xl text-sm text-slate-500">
        <h2 className="font-semibold text-slate-700">How we calculate this</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>1 kW of rooftop solar generates roughly 120 units per month in Hyderabad.</li>
          <li>We size your system from your bill at a residential tariff of ₹8/unit.</li>
          <li>System cost is estimated at ₹55,000/kW before subsidy.</li>
          <li>
            PM Surya Ghar subsidy: ₹30,000/kW for the first 2 kW, ₹18,000 for the
            3rd kW, capped at ₹78,000.
          </li>
        </ul>
      </div>
    </div>
  );
}
