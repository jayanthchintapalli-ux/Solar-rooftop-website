"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { estimateFromBill } from "@/lib/solar";
import { PROPERTY_TYPES } from "@/lib/config";

export interface LeadFormState {
  error?: string;
}

const VALID_TYPES = PROPERTY_TYPES.map((p) => p.value) as string[];

/**
 * Server action: validate the homeowner enquiry, compute the estimate
 * server-side (never trust client numbers), persist a Lead, then redirect to
 * the thank-you page.
 */
export async function createLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const pincode = String(formData.get("pincode") || "").trim();
  const area = String(formData.get("area") || "").trim();
  const monthlyBill = Number(formData.get("monthlyBill"));
  const propertyType = String(formData.get("propertyType") || "");

  // --- Validation -------------------------------------------------------
  if (name.length < 2) return { error: "Please enter your name." };
  if (!/^[+]?\d[\d\s-]{7,14}$/.test(phone))
    return { error: "Please enter a valid phone number." };
  if (!/^\d{6}$/.test(pincode))
    return { error: "Please enter a valid 6-digit pincode." };
  if (area.length < 2) return { error: "Please enter your area/locality." };
  if (!Number.isFinite(monthlyBill) || monthlyBill <= 0)
    return { error: "Please enter your average monthly electricity bill." };
  if (!VALID_TYPES.includes(propertyType))
    return { error: "Please select a valid property type." };

  // --- Compute estimate server-side ------------------------------------
  const estimate = estimateFromBill(monthlyBill);

  await prisma.lead.create({
    data: {
      name,
      phone,
      pincode,
      area,
      monthlyBill: Math.round(monthlyBill),
      propertyType,
      estimatedKW: estimate.recommendedKW,
      estimatedSubsidy: estimate.subsidy,
      status: "NEW",
    },
  });

  redirect("/get-quote/thank-you");
}
