"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production you'd report this to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        Sorry — an unexpected error occurred. You can try again, or head back to
        the homepage.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/" className="btn-secondary">
          Go home
        </a>
      </div>
    </div>
  );
}
