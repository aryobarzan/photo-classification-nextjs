import { z } from "zod";

// The API returns null for unset optional fields. Mapping it to undefined keeps
// the inferred types as `T | undefined`.
const optional = <T extends z.ZodType>(schema: T) =>
  schema.nullish().transform((value) => value ?? undefined);

export const userProfileSchema = z.object({
  // Optional, as it is not set when first creating the profile.
  user_id: optional(z.number()),
  first_name: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-zA-Z]+$/),
  last_name: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-zA-Z]+$/),
  age: z.number().int().min(18).max(120).positive(),
  gender: z.enum(["male", "female", "other"]),
  country_of_origin: z.string().min(1),
  place_of_residence: z.string().min(2).max(100),
  description: optional(z.string().max(500)),
  profile_picture_filename: optional(z.string()),
  profile_picture_is_nsfw: optional(z.boolean()),
  profile_picture_classification: optional(z.string()),
  created_at: optional(z.string()),
  updated_at: optional(z.string()),
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

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

export const userProfilePictureStatusSchema = z.object({
  status: z.enum(["processing", "rejected", "done"]),
  classification: z.string().optional(),
});

export type UserProfilePictureStatus = z.infer<
  typeof userProfilePictureStatusSchema
>;
