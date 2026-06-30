"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireInstaller } from "@/lib/session";
import { parsePincodes } from "@/lib/leads";
import { CREDITS_PER_LEAD_UNLOCK, MAX_PURCHASES_PER_LEAD } from "@/lib/config";

export interface UnlockResult {
  ok?: boolean;
  error?: string;
}

/**
 * Unlock (purchase) a lead for the current installer.
 *
 * Runs inside an interactive transaction so the credit check, purchase cap,
 * credit deduction, LeadPurchase row, and SPEND ledger entry are all atomic.
 */
export async function unlockLead(leadId: string): Promise<UnlockResult> {
  const installer = await requireInstaller();

  if (!installer.verified) {
    return { error: "Your account must be verified before unlocking leads." };
  }

  const pincodes = parsePincodes(installer.serviceAreaPincodes);

  try {
    await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
        include: { _count: { select: { purchases: true } } },
      });
      if (!lead) throw new Error("This lead is no longer available.");

      if (!pincodes.includes(lead.pincode)) {
        throw new Error("This lead is outside your service area.");
      }
      if (lead._count.purchases >= MAX_PURCHASES_PER_LEAD) {
        throw new Error("This lead has reached its purchase limit.");
      }

      // Re-read credits inside the transaction to avoid races.
      const fresh = await tx.installer.findUnique({
        where: { id: installer.id },
        select: { credits: true },
      });
      if (!fresh || fresh.credits < CREDITS_PER_LEAD_UNLOCK) {
        throw new Error("Not enough credits. Please top up.");
      }

      // Create the purchase (unique [leadId, installerId] guards double-buys).
      await tx.leadPurchase.create({
        data: {
          leadId: lead.id,
          installerId: installer.id,
          creditsSpent: CREDITS_PER_LEAD_UNLOCK,
        },
      });

      await tx.installer.update({
        where: { id: installer.id },
        data: { credits: { decrement: CREDITS_PER_LEAD_UNLOCK } },
      });

      await tx.creditTransaction.create({
        data: {
          installerId: installer.id,
          amount: CREDITS_PER_LEAD_UNLOCK,
          type: "SPEND",
          note: `Unlocked lead in ${lead.area} (${lead.pincode})`,
        },
      });

      // Mark as SOLD once the purchase cap is reached.
      if (lead._count.purchases + 1 >= MAX_PURCHASES_PER_LEAD) {
        await tx.lead.update({
          where: { id: lead.id },
          data: { status: "SOLD" },
        });
      }
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "You have already unlocked this lead." };
    }
    return {
      error: err instanceof Error ? err.message : "Could not unlock this lead.",
    };
  }

  revalidatePath("/installer/available-leads");
  revalidatePath("/installer/my-leads");
  revalidatePath("/installer/dashboard");
  return { ok: true };
}
