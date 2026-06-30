import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-6xl">🔌</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/calculator" className="btn-secondary">Open the calculator</Link>
      </div>
    </div>
  );
}
