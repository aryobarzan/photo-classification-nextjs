import { fetchUserProfiles } from "@/app/lib/actions/admin";
import { parseFilters, toSearchParams } from "@/app/lib/filters";
import ProfileFilters from "./ProfileFilters";
import ProfileTable from "./ProfileTable";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The applied filters live in the URL, so applying them re-runs this server fetch.
  const filters = parseFilters(await searchParams);
  const userProfiles = await fetchUserProfiles(filters);

  return (
    <>
      <p>{userProfiles.length} user profiles found.</p>
      <ProfileFilters initial={filters} />
      {/* Keyed by the filters so sort/page state resets whenever they change */}
      <ProfileTable
        key={toSearchParams(filters).toString()}
        userProfiles={userProfiles}
      />
    </>
  );
}
