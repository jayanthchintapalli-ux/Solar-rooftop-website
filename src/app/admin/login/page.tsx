"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      redirect: false,
    });
    setPending(false);
    if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="container-page max-w-md py-12">
      <h1 className="text-2xl font-extrabold text-slate-900">Admin login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Restricted area. Sign in with your admin credentials.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="input" required />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
