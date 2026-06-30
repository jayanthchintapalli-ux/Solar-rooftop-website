"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ callbackUrl = "/" }: { callbackUrl?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl })}
      className="text-sm font-medium text-slate-500 hover:text-slate-800"
    >
      Log out
    </button>
  );
}
