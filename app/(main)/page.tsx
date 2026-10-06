import Link from "next/link";
import { fetchUserProfile } from "../lib/actions/user";
import { getUser } from "../lib/session";
import Profile from "./Profile";

export default async function Home() {
  const [profile, user] = await Promise.all([fetchUserProfile(), getUser()]);
  return (
    <div className="container">
      {profile ? (
        <Profile profile={profile} />
      ) : (
        <>
          <p>
            Hello <b>{user?.username}</b>!
          </p>
          <p>You have not set up your profile yet.</p>
        </>
      )}
      <div className="flex justify-end mt-8">
        <Link href="/profile-editor" className="filled-button">
          <span className="material-symbols-outlined">edit</span>Edit Profile
        </Link>
      </div>
    </div>
  );
}
