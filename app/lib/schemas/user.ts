export interface UserProfile {
  // Optional, as it is not set when first creating the profile.
  user_id?: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: "male" | "female" | "other";
  country_of_origin: string;
  place_of_residence: string;
  description?: string;
  profile_picture_filename?: string;
  profile_picture_is_nsfw?: boolean;
  profile_picture_classification?: string;
  created_at?: string;
  updated_at?: string;
}
