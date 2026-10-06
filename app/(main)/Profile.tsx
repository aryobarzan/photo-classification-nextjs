import { COUNTRIES } from "../lib/data/countries";
import { UserProfile } from "../lib/schemas/user";
import { isAdmin } from "../lib/session";
import ProfilePicture from "./ProfilePicture";

export default async function Profile({ profile }: { profile: UserProfile }) {
  function countryName(code: string): string {
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }
  const roleIsAdmin = await isAdmin();
  return (
    <div className="profile-box">
      <div className="flex flex-row gap-2 items-center">
        <ProfilePicture
          filename={profile.profile_picture_filename}
          isNsfw={profile.profile_picture_is_nsfw}
          processingStatus="processing"
        />
        <span className="name">
          {profile.first_name}, {profile.last_name}
        </span>
      </div>
      <div className="profile-info">
        <pre>
          <b>Age:</b> {profile.age}
          <b>Gender:</b> {profile.gender}
          <b>Country of Origin:</b> {countryName(profile.country_of_origin)}
          <b>Place of Residence:</b> {profile.place_of_residence}
          {profile.description && (
            <>
              <b>Description </b>
              {profile.description}
            </>
          )}
        </pre>
        {roleIsAdmin ? (
          <span>
            <hr className="divider" />
            <pre>
              <b>Created at:</b> {profile.created_at}
              <b>Updated at:</b> {profile.updated_at}
              <b>Profile Picture Classification:</b>{" "}
              {profile.profile_picture_classification || "N/A"}
              <b>Profile Picture NSFW: </b>
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
