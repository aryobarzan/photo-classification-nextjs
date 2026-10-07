import "server-only";
import { cache } from "react";
import {
  userProfileListSchema,
  UserProfile,
  userProfileSchema,
} from "../schemas/user";
import { apiFetch } from "../api";
import { NO_FILTERS, toSearchParams, UserProfileFilters } from "../filters";

// Cached per request, keyed by the query string (objects would never hit the cache).
const fetchUserProfilesByQuery = cache(
  async (query: string): Promise<UserProfile[]> => {
    const response = await apiFetch(
      `admin/users/profiles${query ? `?${query}` : ""}`,
      { method: "GET" },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user profiles");
    }
    const data = await response.json();
    const parsedData = userProfileListSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Failed to fetch user profiles - invalid format.");
    }
    return parsedData.data;
  },
);

export function fetchUserProfiles(
  filters: UserProfileFilters = NO_FILTERS,
): Promise<UserProfile[]> {
  return fetchUserProfilesByQuery(toSearchParams(filters).toString());
}

// Cached per request, so repeated calls with the same id only fetch once.
export const fetchUserProfileById = cache(
  async (id: string): Promise<UserProfile | null> => {
    const response = await apiFetch(`admin/users/profile/${id}`, {
      method: "GET",
    });
    // 404 - not found
    // 422 - user_id is not numeric
    if (response.status === 404 || response.status === 422) {
      return null;
    }
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const data = await response.json();
    const parsedData = userProfileSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Failed to fetch user profile - invalid format.");
    }
    return parsedData.data;
  },
);
