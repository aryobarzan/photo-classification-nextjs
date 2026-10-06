import { fetchUserProfile, getProfilePictureUrl } from "../../lib/actions/user";
import { userProfileUpdateSchema } from "../../lib/schemas/user";
import { ProfileEditorForm } from "./ProfileEditorForm";

export default async function ProfileEditorPage() {
  const profile = await fetchUserProfile();
  // Strips the fields the editor doesn't handle (id, picture, timestamps).
  // A user without a profile yet gets an empty form.
  // Age is omitted so the number input starts blank rather than showing 0.
  const defaultValues = profile
    ? userProfileUpdateSchema.parse(profile)
    : {
        first_name: "",
        last_name: "",
        // "" is not a valid gender, hence `as never`. It makes the select start
        // on its "Select gender" placeholder instead of the first option.
        gender: "" as never,
        country_of_origin: "",
        place_of_residence: "",
        description: "",
      };

  const pictureUrl = profile?.profile_picture_filename
    ? getProfilePictureUrl(profile.profile_picture_filename)
    : null;

  return (
    <ProfileEditorForm
      defaultValues={defaultValues}
      currentPictureUrl={pictureUrl}
    />
  );
}
