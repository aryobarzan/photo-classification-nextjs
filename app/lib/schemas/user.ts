import { z } from "zod";

export const userProfileSchema = z.object({
  // Optional, as it is not set when first creating the profile.
  user_id: z.number().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  age: z.number().int().positive(),
  gender: z.enum(["male", "female", "other"]),
  country_of_origin: z.string().min(1),
  place_of_residence: z.string().min(1),
  description: z.string().optional(),
  profile_picture_filename: z.string().optional(),
  profile_picture_is_nsfw: z.boolean().optional(),
  profile_picture_classification: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const userProfileUpdateSchema = userProfileSchema.omit({
  user_id: true,
  profile_picture_filename: true,
  profile_picture_is_nsfw: true,
  profile_picture_classification: true,
  created_at: true,
  updated_at: true,
});

export const userProfilePictureStatusSchema = z.object({
  status: z.enum(["processing", "rejected", "done"]),
  classification: z.string().optional(),
});

export type UserProfilePictureStatus = z.infer<
  typeof userProfilePictureStatusSchema
>;
