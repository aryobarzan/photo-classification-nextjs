import "server-only";
import { cache } from "react";
import { userProfileListSchema, UserProfile } from "../schemas/user";
import { apiFetch } from "../api";

export const fetchUserProfiles = cache(async (): Promise<UserProfile[]> => {
  const response = await apiFetch(`admin/users/profiles`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user profiles");
  }
  const data = await response.json();
  const parsedData = userProfileListSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Failed to fetch user profiles - invalid format.");
  }
  return parsedData.data;
});
