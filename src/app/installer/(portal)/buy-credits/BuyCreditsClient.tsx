"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { topUpCredits } from "./actions";
import { CREDIT_PACKS, CREDIT_PRICE_INR, formatINR } from "@/lib/config";

export default function BuyCreditsClient() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activePack, setActivePack] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function buy(credits: number) {
    setMessage(null);
    setActivePack(credits);
    startTransition(async () => {
      const res = await topUpCredits(credits);
      setActivePack(null);
      if (res.error) setMessage(res.error);
      else {
        setMessage(`✅ Added ${res.added} credits to your wallet.`);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {message && (
        <p className="rounded-lg bg-brand-50 p-3 text-sm font-medium text-brand-700">
          {message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {CREDIT_PACKS.map((pack) => (
          <div key={pack.credits} className="card flex flex-col text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              {pack.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {pack.credits}
            </p>
            <p className="text-xs text-slate-400">credits</p>
            <p className="mt-2 text-lg font-bold text-slate-700">
              {formatINR(pack.credits * CREDIT_PRICE_INR)}
            </p>
            <button
              onClick={() => buy(pack.credits)}
              disabled={pending}
              className="btn-primary mt-4"
            >
              {pending && activePack === pack.credits ? "Processing…" : "Buy now"}
            </button>
          </div>
        ))}
      </div>

      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        💳 <strong>Demo mode:</strong> payments are stubbed — clicking “Buy now”
        instantly credits your wallet. Razorpay integration for real INR payments
        is planned (see the TODO in <code>buy-credits/actions.ts</code>).
      </p>
    </div>
  );
}
