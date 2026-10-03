// environment.apiUrl would be undefined in a Client Component.
import "server-only";
import { apiFetch } from "../api";
import { environment } from "../config";
import {
  userProfileSchema,
  UserProfile,
  userProfilePictureStatusSchema,
  UserProfilePictureStatus,
} from "../schemas/user";
import { cache } from "react";

export const fetchUserProfile = cache(async (): Promise<UserProfile> => {
  const response = await apiFetch(`users/profile`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  const data = await response.json();
  // check if response body matches expected format
  const parsedData = userProfileSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Failed to fetch user profile - invalid format.");
  }
  return parsedData.data;
});

export function getProfilePictureUrl(filename: string): string {
  return `${environment.apiUrl}users/profile/picture/${filename}`;
}

export async function fetchProfilePictureStatus(): Promise<UserProfilePictureStatus> {
  const response = await apiFetch("users/profile/picture/status");
  if (!response.ok) {
    throw new Error(
      `Failed to fetch profile picture status (status ${response.status}).`,
    );
  }
  // check if response body matches expected format
  const parsedData = userProfilePictureStatusSchema.safeParse(
    await response.json(),
  );
  if (!parsedData.success) {
    throw new Error("Failed to fetch profile picture status - invalid format.");
  }
  return parsedData.data;
}

// interface ProfilePictureStatusResponse {
//   status: 'processing' | 'rejected' | 'done';
//   classification?: string;
// }

//   profilePictureStatus = signal<'processing' | 'rejected' | 'done' | null>(null);
//   pollProfilePictureStatus(intervalMs: number = 5000) {
//     const poll = async () => {
//       const profile = this.userProfile();
//       if (profile && this.profilePictureStatus() === 'processing') {
//         try {
//           const response = await firstValueFrom(
//             this.http.get<ProfilePictureStatusResponse>(
//               `${environment.apiUrl}users/profile/picture/status`,
//             ),
//           );
//           this.profilePictureStatus.set(response.status);
//           if (response.status === 'processing') {
//             setTimeout(poll, intervalMs);
//           } else {
//             // Patch the profile signal with the classification result
//             this.userProfile.update((p) =>
//               p
//                 ? {
//                     ...p,
//                     profile_picture_classification:
//                       response.classification ?? p.profile_picture_classification,
//                     profile_picture_is_nsfw: response.status === 'rejected',
//                   }
//                 : p,
//             );
//           }
//         } catch (err: any) {}
//       }
//     };
//     poll();
//   }
// }
