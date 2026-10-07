import Profile from "@/app/(main)/Profile";
import { fetchUserProfileById } from "@/app/lib/actions/admin";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardProfileView(
  props: PageProps<"/dashboard/profile/[user_id]">,
) {
  const { user_id } = await props.params;
  const profile = await fetchUserProfileById(user_id);
  if (!profile) notFound();

  return (
    <div className="container">
      <h2 className="mb-4">Profile View (Admin)</h2>
      <Profile profile={profile} />
      <div className="flex flex-row justify-end">
        <Link href="/dashboard" className="filled-button mt-2">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
