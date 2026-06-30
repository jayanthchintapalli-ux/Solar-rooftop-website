export default function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500"
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
