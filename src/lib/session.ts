import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Current session user (or null). */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/**
 * Require a logged-in INSTALLER and return the full Installer record.
 * Redirects to login (or admin home) otherwise.
 */
export async function requireInstaller() {
  const user = await getSessionUser();
  if (!user) redirect("/installer/login");
  if (user.role !== "INSTALLER") redirect("/admin");

  const installer = await prisma.installer.findUnique({ where: { id: user.id } });
  if (!installer) redirect("/installer/login");
  return installer;
}

/** Require a logged-in ADMIN. Redirects otherwise. */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") redirect("/installer/login");
  return user;
}
