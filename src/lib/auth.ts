import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type UserRole = "INSTALLER" | "ADMIN";

/**
 * Single credentials provider that authenticates against either the Installer
 * table or the AdminUser table. The resulting session carries the user's id
 * and role so route handlers and pages can authorise by role.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/installer/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        // Try installer first.
        const installer = await prisma.installer.findUnique({ where: { email } });
        if (installer && (await bcrypt.compare(password, installer.passwordHash))) {
          return {
            id: installer.id,
            email: installer.email,
            name: installer.name,
            role: "INSTALLER" as UserRole,
          };
        }

        // Then admin.
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
          return {
            id: admin.id,
            email: admin.email,
            name: "Admin",
            role: "ADMIN" as UserRole,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};
