"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfilePictureStatus } from "../lib/hooks/useProfilePictureStatus";
import styles from "./ProfilePicture.module.css";

type PictureState = "empty" | "processing" | "nsfw" | "ready";

export default function ProfilePicture({
  pictureUrl,
  isNsfw,
  initiallyProcessing,
  size = 128,
}: {
  // undefined if the user has not uploaded a picture.
  pictureUrl: string | undefined;
  isNsfw: boolean | undefined;
  initiallyProcessing: boolean;
  size?: number;
}) {
  const router = useRouter();
  const { data } = useProfilePictureStatus(initiallyProcessing);

  // Once polling reports a result, re-render the server component so the rest
  // of the profile (e.g. the admin-only classification) picks it up too.
  const polledStatus = data?.status;
  useEffect(() => {
    if (polledStatus && polledStatus !== "processing") router.refresh();
  }, [polledStatus, router]);

  // The polled status takes precedence over the server-rendered props.
  const nsfw = polledStatus ? polledStatus === "rejected" : isNsfw;
  const processing = polledStatus
    ? polledStatus === "processing"
    : initiallyProcessing;

  const state: PictureState = !pictureUrl
    ? "empty"
    : nsfw
      ? "nsfw"
      : processing
        ? "processing"
        : "ready";
  const dims = { width: size, height: size };

  switch (state) {
    case "empty":
      return (
        <span
          className={styles.placeholder}
          style={{ ...dims, fontSize: size }}
          title="No profile picture"
        >
          <span className="material-symbols-outlined">account_circle</span>
        </span>
      );
    case "processing":
      return (
        <span
          className={`${styles.stateBox} ${styles.processing}`}
          style={dims}
          title="Profile picture is being processed"
        >
          <span className={`material-symbols-outlined ${styles.spinning}`}>
            sync
          </span>
          <span className={styles.stateLabel}>Processing…</span>
        </span>
      );
    case "nsfw":
      return (
        <span
          className={`${styles.stateBox} ${styles.nsfw}`}
          style={dims}
          title="Profile picture was flagged as inappropriate"
        >
          <span className="material-symbols-outlined">hide_image</span>
          <span className={styles.stateLabel}>Flagged</span>
        </span>
      );
    case "ready":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pictureUrl}
          alt="Profile picture"
          style={dims}
          className={styles.picture}
        />
      );
  }
}
