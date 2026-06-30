"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import { registerInstaller, type SignupState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create installer account"}
    </button>
  );
}

export default function InstallerSignupPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(registerInstaller, {} as SignupState);
  const formRef = useRef<HTMLFormElement>(null);

  // On successful registration, sign the installer in and go to the dashboard.
  useEffect(() => {
    if (!state.ok) return;
    const fd = new FormData(formRef.current ?? undefined);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res?.ok) router.push("/installer/dashboard");
      else router.push("/installer/login?registered=1");
    });
  }, [state.ok, router]);

  return (
    <div className="container-page max-w-lg py-12">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Become a partner installer
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign up to access homeowner leads in your service area. New accounts are
        reviewed and verified by our team.
      </p>

      <form ref={formRef} action={formAction} className="card mt-6 space-y-4">
        {state.error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Your name</label>
            <input id="name" name="name" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="companyName">Company name</label>
            <input id="companyName" name="companyName" className="input" required />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" required minLength={8} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="serviceAreaPincodes">
            Service-area pincodes
          </label>
          <input
            id="serviceAreaPincodes"
            name="serviceAreaPincodes"
            className="input"
            placeholder="e.g. 500081, 500032, 500084"
            required
          />
          <p className="mt-1 text-xs text-slate-400">
            Comma-separated 6-digit pincodes you serve. You'll see leads in these areas.
          </p>
        </div>

        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/installer/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
