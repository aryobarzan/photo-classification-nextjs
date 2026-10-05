import { fetchUserProfile, getProfilePictureUrl } from "../lib/actions/user";
import { userProfileUpdateSchema } from "../lib/schemas/user";
import { ProfileEditorForm } from "./ProfileEditorForm";

export default async function ProfileEditorPage() {
  const profile = await fetchUserProfile();
  // Strips the fields the editor doesn't handle (id, picture, timestamps).
  const defaultValues = userProfileUpdateSchema.parse(profile);

  const pictureUrl = profile.profile_picture_filename
    ? getProfilePictureUrl(profile.profile_picture_filename)
    : null;

  return (
    <ProfileEditorForm
      defaultValues={defaultValues}
      currentPictureUrl={pictureUrl}
    />
  );
}
