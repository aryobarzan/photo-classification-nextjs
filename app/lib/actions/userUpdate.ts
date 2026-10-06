"use server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "../api";
import {
  userProfileSchema,
  UserProfile,
  userProfileUpdateSchema,
  UserProfileUpdate,
} from "../schemas/user";
import { redirect } from "next/navigation";

const ALLOWED_PICTURE_TYPES = ["image/jpeg", "image/png"];
const MAX_PICTURE_SIZE = 4 * 1024 * 1024; // 4MB

// Errors are returned instead of thrown: in production, the message of an error thrown
// from a Server Action is replaced with a generic one before it reaches the client.
export type UpdateUserProfileResult =
  | { ok: true; profile: UserProfile }
  | { ok: false; error: string };

export async function saveUserProfile(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const parsed = userProfileUpdateSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    // FormData values are strings, but the schema expects a number.
    age: Number(formData.get("age")),
    gender: formData.get("gender"),
    place_of_residence: formData.get("place_of_residence"),
    country_of_origin: formData.get("country_of_origin"),
    // get() returns null when the field is absent, which the schema rejects.
    description: formData.get("description") ?? undefined,
  });
  if (!parsed.success) return "Invalid format.";
  const picture = formData.get("profile_picture");

  const result = await updateUserProfile(
    parsed.data,
    picture instanceof File && picture.size > 0 ? picture : null,
  );
  if (!result.ok) return result.error;
  redirect("/");
}

export async function updateUserProfile(
  profileData: UserProfileUpdate,
  profilePicture: File | null,
): Promise<UpdateUserProfileResult> {
  const preDataParse = userProfileUpdateSchema.safeParse(profileData);
  if (!preDataParse.success) {
    return { ok: false, error: "The profile data is invalid." };
  }
  if (profilePicture) {
    if (!ALLOWED_PICTURE_TYPES.includes(profilePicture.type)) {
      return {
        ok: false,
        error: "Invalid picture type. Only JPG and PNG are allowed.",
      };
    }
    if (profilePicture.size > MAX_PICTURE_SIZE) {
      return { ok: false, error: "The picture must not be larger than 4MB." };
    }
  }

  const formData = new FormData();
  //   TODO: check backend whether it properly handles the filename field when it is omitted by the client
  formData.append("profile_data", JSON.stringify(preDataParse.data));
  if (profilePicture) {
    formData.append("profile_picture", profilePicture);
  }

  // apiFetch redirects to /login on 401 (by throwing), which must not be caught here.
  const response = await apiFetch(`users/profile`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    return {
      ok: false,
      error: `Failed to update the profile (status ${response.status}).`,
    };
  }
  const data = await response.json();
  // check if response body matches expected format
  const parsedData = userProfileSchema.safeParse(data);
  if (!parsedData.success) {
    return { ok: false, error: "The server returned an unexpected response." };
  }
  // re-render profile page so the cached data isn't re-used
  revalidatePath("/");
  revalidatePath("/profile-editor");
  return { ok: true, profile: parsedData.data };
}
