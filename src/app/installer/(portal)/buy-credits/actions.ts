"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireInstaller } from "@/lib/session";
import { CREDIT_PACKS } from "@/lib/config";

export interface TopupResult {
  ok?: boolean;
  error?: string;
  added?: number;
}

/**
 * STUB top-up. In production this would be called only after a successful
 * payment.
 *
 * TODO(payments): Integrate Razorpay for real INR payments.
 *   1. Create a Razorpay order server-side (amount = credits * CREDIT_PRICE_INR).
 *   2. Open Razorpay Checkout on the client and collect payment.
 *   3. Verify the payment signature in a webhook / verify route.
 *   4. ONLY THEN credit the wallet (the logic below).
 * Until then, this button simply grants the credits for demo purposes.
 */
export async function topUpCredits(credits: number): Promise<TopupResult> {
  const installer = await requireInstaller();

  const pack = CREDIT_PACKS.find((p) => p.credits === credits);
  if (!pack) return { error: "Invalid credit pack." };

  await prisma.$transaction([
    prisma.installer.update({
      where: { id: installer.id },
      data: { credits: { increment: pack.credits } },
    }),
    prisma.creditTransaction.create({
      data: {
        installerId: installer.id,
        amount: pack.credits,
        type: "TOPUP",
        note: `${pack.label} pack (demo top-up)`,
      },
    }),
  ]);

  revalidatePath("/installer/buy-credits");
  revalidatePath("/installer/dashboard");
  return { ok: true, added: pack.credits };
}
