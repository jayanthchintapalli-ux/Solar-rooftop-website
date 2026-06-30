"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export interface AdminActionResult {
  ok?: boolean;
  error?: string;
}

/** Toggle an installer's verified flag. */
export async function setInstallerVerified(
  installerId: string,
  verified: boolean,
): Promise<AdminActionResult> {
  await requireAdmin();
  await prisma.installer.update({
    where: { id: installerId },
    data: { verified },
  });
  revalidatePath("/admin/installers");
  return { ok: true };
}

/**
 * Manually adjust an installer's credits (positive = grant, negative = deduct).
 * Records a matching ledger entry so the wallet history stays accurate.
 */
export async function adjustInstallerCredits(
  installerId: string,
  delta: number,
): Promise<AdminActionResult> {
  await requireAdmin();

  if (!Number.isInteger(delta) || delta === 0) {
    return { error: "Enter a non-zero whole number." };
  }

  const installer = await prisma.installer.findUnique({
    where: { id: installerId },
    select: { credits: true },
  });
  if (!installer) return { error: "Installer not found." };
  if (installer.credits + delta < 0) {
    return { error: "Adjustment would make the balance negative." };
  }

  await prisma.$transaction([
    prisma.installer.update({
      where: { id: installerId },
      data: { credits: { increment: delta } },
    }),
    prisma.creditTransaction.create({
      data: {
        installerId,
        amount: Math.abs(delta),
        type: delta > 0 ? "TOPUP" : "SPEND",
        note: `Admin manual adjustment (${delta > 0 ? "+" : ""}${delta})`,
      },
    }),
  ]);

  revalidatePath("/admin/installers");
  revalidatePath("/admin");
  return { ok: true };
}
