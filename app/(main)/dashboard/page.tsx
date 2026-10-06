import { fetchUserProfiles } from "@/app/lib/actions/admin";
import ProfileTable from "./ProfileTable";

export default async function Dashboard() {
  const userProfiles = await fetchUserProfiles();
  return <ProfileTable userProfiles={userProfiles} />;
}
