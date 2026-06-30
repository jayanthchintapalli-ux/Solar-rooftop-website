"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unlockLead } from "@/app/installer/(portal)/available-leads/actions";

export default function UnlockButton({
  leadId,
  cost,
  disabled,
  disabledReason,
}: {
  leadId: string;
  cost: number;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await unlockLead(leadId);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  if (disabled) {
    return (
      <span className="text-xs font-medium text-slate-400">{disabledReason}</span>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={handleClick}
        disabled={pending}
        className="btn-primary !py-2 !px-4 text-sm"
      >
        {pending ? "Unlocking…" : `Unlock for ${cost} credits`}
      </button>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
