import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Get your free solar quote",
  description:
    "Request a free, no-obligation rooftop solar quote in Hyderabad. We connect you with verified, subsidy-approved local installers.",
};

export default function GetQuotePage({
  searchParams,
}: {
  searchParams: { bill?: string; type?: string; pincode?: string };
}) {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">
        Get my free solar quote
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Share a few details and we'll connect you with verified, subsidy-approved
        installers in your area. It's 100% free, with no obligation.
      </p>

      <div className="mt-8">
        <LeadForm
          defaultBill={searchParams.bill}
          defaultType={searchParams.type}
          defaultPincode={searchParams.pincode}
        />
      </div>
    </div>
  );
}
