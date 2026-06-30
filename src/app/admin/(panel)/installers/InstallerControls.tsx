"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adjustInstallerCredits, setInstallerVerified } from "./actions";

export function VerifyToggle({
  installerId,
  verified,
}: {
  installerId: string;
  verified: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await setInstallerVerified(installerId, !verified);
          router.refresh();
        })
      }
      disabled={pending}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        verified
          ? "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
          : "bg-brand-500 text-white hover:bg-brand-600"
      }`}
    >
      {pending ? "…" : verified ? "Unverify" : "Verify"}
    </button>
  );
}

export function CreditAdjuster({ installerId }: { installerId: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function apply(sign: 1 | -1) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      setError("Enter a positive number.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await adjustInstallerCredits(installerId, sign * Math.round(n));
      if (res.error) setError(res.error);
      else {
        setValue("");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="qty"
          className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <button
          onClick={() => apply(1)}
          disabled={pending}
          className="rounded-md bg-brand-500 px-2 py-1 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          title="Add credits"
        >
          +
        </button>
        <button
          onClick={() => apply(-1)}
          disabled={pending}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          title="Deduct credits"
        >
          −
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
