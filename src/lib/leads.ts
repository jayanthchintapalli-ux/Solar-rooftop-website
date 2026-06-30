import { PROPERTY_TYPES } from "@/lib/config";

/** Parse an installer's comma-separated service-area pincodes into a clean array. */
export function parsePincodes(raw: string): string[] {
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter((p) => /^\d{6}$/.test(p));
}

/** Human-friendly property type label. */
export function propertyTypeLabel(value: string): string {
  return PROPERTY_TYPES.find((p) => p.value === value)?.label ?? value;
}

/** Mask a phone number, revealing only the last 2 digits. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 2) return "•••••";
  return "••••• " + digits.slice(-2);
}

/** Mask a name, revealing only the first initial. */
export function maskName(name: string): string {
  const first = name.trim().charAt(0).toUpperCase();
  return first ? `${first}••••• (locked)` : "Locked";
}
