// ----------------------------------------------------------------------------
// Editable business constants. Change these in one place to retune the whole
// site's calculator, pricing, and contact details.
// ----------------------------------------------------------------------------

/** Average solar generation in Hyderabad: units (kWh) per kW per month. */
export const UNITS_PER_KW_PER_MONTH = 120;

/** Residential electricity tariff in ₹ per unit (kWh). */
export const TARIFF_PER_UNIT = 8;

/** Installed system cost in ₹ per kW, before subsidy. */
export const SYSTEM_COST_PER_KW = 55000;

/** System sizing limits (kW). */
export const MIN_KW = 1;
export const MAX_KW = 10;

/** PM Surya Ghar (Central Financial Assistance) subsidy slabs. */
export const SUBSIDY_FIRST_2KW_PER_KW = 30000; // first 2 kW
export const SUBSIDY_THIRD_KW = 18000; // the 3rd kW
export const SUBSIDY_CAP = 78000; // hard cap

/** Cost the installer pays (in credits) to unlock one lead. */
export const CREDITS_PER_LEAD_UNLOCK = 50;

/** Maximum number of installers that can buy the same lead. */
export const MAX_PURCHASES_PER_LEAD = 3;

/** Seeded "social proof" counter shown on the homepage. */
export const HOMEOWNERS_HELPED = 1240;

/** Contact: WhatsApp number (international format, no "+"). */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

/** Build a wa.me click-to-chat link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const PROPERTY_TYPES = [
  { value: "INDEPENDENT_HOUSE", label: "Independent house" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "COMMERCIAL", label: "Commercial" },
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

/** Format a number as Indian Rupees, e.g. 78000 -> "₹78,000". */
export function formatINR(amount: number): string {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}
