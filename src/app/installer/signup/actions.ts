"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { parsePincodes } from "@/lib/leads";

export interface SignupState {
  error?: string;
  ok?: boolean;
}

/**
 * Register a new installer. New installers start unverified with 0 credits;
 * an admin verifies them later (Phase 4).
 */
export async function registerInstaller(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const name = String(formData.get("name") || "").trim();
  const companyName = String(formData.get("companyName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const pincodesRaw = String(formData.get("serviceAreaPincodes") || "").trim();

  if (name.length < 2) return { error: "Please enter your name." };
  if (companyName.length < 2) return { error: "Please enter your company name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (!/^[+]?\d[\d\s-]{7,14}$/.test(phone))
    return { error: "Please enter a valid phone number." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const pincodes = parsePincodes(pincodesRaw);
  if (pincodes.length === 0)
    return {
      error: "Please enter at least one 6-digit service-area pincode.",
    };

  const existing = await prisma.installer.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  await prisma.installer.create({
    data: {
      name,
      companyName,
      email,
      phone,
      passwordHash: await bcrypt.hash(password, 10),
      serviceAreaPincodes: pincodes.join(","),
      credits: 0,
      verified: false,
    },
  });

  return { ok: true };
}
