"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import styles from "./Dashboard.module.css";

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
      <p>Failed to fetch user profiles.</p>
      <p className={styles.error}>{error.message}</p>
      <div className="flex flex-row justify-end">
        <button className="filled-button" onClick={() => retry()}>
          <span className="material-symbols-outlined">refresh</span>Refresh
        </button>
      </div>
    </div>
  );
}
