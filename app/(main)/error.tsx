"use client";
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  // retry() re-fetches profile and re-renders children. reset() would only clear the error state, but not attempt another fetch.
  return (
    <div className="flex flex-col">
      <p>Failed to fetch your profile.</p>
      <div className="flex flex-row justify-end">
        <button className="filled-button" onClick={() => retry()}>
          <span className="material-symbols-outlined">refresh</span>Refresh
        </button>
      </div>
    </div>
  );
}
