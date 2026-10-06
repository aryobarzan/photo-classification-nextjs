import { getProfilePictureUrl } from "../lib/actions/user";
import { COUNTRIES } from "../lib/data/countries";
import { UserProfile } from "../lib/schemas/user";
import { isAdmin } from "../lib/session";
import ProfilePicture from "./ProfilePicture";
import styles from "./Profile.module.css";

export default async function Profile({ profile }: { profile: UserProfile }) {
  function countryName(code: string): string {
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }
  const roleIsAdmin = await isAdmin();
  return (
    <div className={styles.profileBox}>
      <div className="flex flex-row gap-2 items-center">
        <ProfilePicture
          pictureUrl={
            profile.profile_picture_filename
              ? getProfilePictureUrl(profile.profile_picture_filename)
              : undefined
          }
          isNsfw={profile.profile_picture_is_nsfw}
          // The profile has no explicit status field: a picture without a
          // classification or NSFW verdict yet is still being processed.
          initiallyProcessing={
            !!profile.profile_picture_filename &&
            profile.profile_picture_is_nsfw === undefined &&
            !profile.profile_picture_classification
          }
        />
        <span className={styles.name}>
          {profile.first_name}, {profile.last_name}
        </span>
      </div>
      <div>
        <pre>
          {/* JSX collapses newlines in source, so line breaks must be explicit. */}
          <b>Age:</b> {profile.age}
          {"\n"}
          <b>Gender:</b> {profile.gender}
          {"\n"}
          <b>Country of Origin:</b> {countryName(profile.country_of_origin)}
          {"\n"}
          <b>Place of Residence:</b> {profile.place_of_residence}
          {profile.description && (
            <>
              {"\n"}
              <b>Description:</b> {profile.description}
            </>
          )}
        </pre>
        {roleIsAdmin ? (
          <span>
            <hr className="divider" />
            <pre>
              <b>Created at:</b> {profile.created_at}
              {"\n"}
              <b>Updated at:</b> {profile.updated_at}
              {"\n"}
              <b>Profile Picture Classification:</b>{" "}
              {profile.profile_picture_classification || "N/A"}
              {"\n"}
              <b>Profile Picture NSFW:</b>{" "}
              {profile.profile_picture_is_nsfw !== undefined
                ? profile.profile_picture_is_nsfw
                  ? "Yes"
                  : "No"
                : "N/A"}
            </pre>
          </span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
