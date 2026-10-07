"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col">
      <p>Something went wrong loading the user profile.</p>
      <p className="text-red-600">{error.message}</p>
      <div className="flex flex-row justify-end">
        <button className="filled-button" onClick={() => retry()}>
          <span className="material-symbols-outlined">refresh</span>Refresh
        </button>
      </div>
    </div>
  );
}
