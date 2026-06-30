import { requireInstaller } from "@/lib/session";
import { CREDITS_PER_LEAD_UNLOCK } from "@/lib/config";
import BuyCreditsClient from "./BuyCreditsClient";

export const dynamic = "force-dynamic";

export default async function BuyCreditsPage() {
  const installer = await requireInstaller();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Buy credits</h2>
        <p className="text-sm text-slate-500">
          You currently have <strong>{installer.credits}</strong> credits. Each
          lead unlock costs {CREDITS_PER_LEAD_UNLOCK} credits.
        </p>
      </div>
      <BuyCreditsClient />
    </div>
  );
}
