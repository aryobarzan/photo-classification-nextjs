"use client";
import useSWR from "swr";
import {
  userProfilePictureStatusSchema,
  UserProfilePictureStatus,
} from "../schemas/user";

async function fetcher(url: string): Promise<UserProfilePictureStatus> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Status request failed (${res.status}).`);
  return userProfilePictureStatusSchema.parse(await res.json());
}

// Polls every `intervalMs` while `enabled` and the status is "processing".
// Pass enabled=false when no picture was uploaded, so nothing is requested.
export function useProfilePictureStatus(enabled: boolean, intervalMs = 5000) {
  return useSWR<UserProfilePictureStatus>(
    enabled ? "/api/profile/picture-status" : null,
    fetcher,
    {
      refreshInterval: (data) =>
        data && data.status !== "processing" ? 0 : intervalMs,
    },
  );
}
