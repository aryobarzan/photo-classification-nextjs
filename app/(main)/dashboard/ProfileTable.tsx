"use client";
// Client Component as we rely on useState and useMemo.
import { COUNTRIES } from "@/app/lib/data/countries";
import { UserProfile } from "@/app/lib/schemas/user";
import { useMemo, useState } from "react";
import styles from "./Dashboard.module.css";

type SortKey = keyof Pick<
  UserProfile,
  | "first_name"
  | "last_name"
  | "age"
  | "gender"
  | "country_of_origin"
  | "place_of_residence"
>;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "country_of_origin", label: "Country" },
  { key: "place_of_residence", label: "Place of Residence" },
];

// Number of profiles to show per page
const pageSize = 10;

// Helper function to retrieve the full country name by country code
function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export default function ProfileTable({
  userProfiles,
}: {
  userProfiles: UserProfile[];
}) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("last_name");
  const [sortAscending, setSortAscending] = useState(true);

  // User profiles sorted according to `sortKey` and `sortAscending`
  const sorted = useMemo(() => {
    const asc = sortAscending ? 1 : -1;
    return [...userProfiles].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return av < bv ? -asc : av > bv ? asc : 0;
    });
  }, [userProfiles, sortKey, sortAscending]);

  // The profiles to show on the current page after sorting
  const paged = useMemo(() => {
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [page, sorted]);

  const totalPages = Math.max(1, Math.ceil(userProfiles.length / pageSize));

  // Toggle sorting by a specific key, and reset to the first page
  function sortBy(key: SortKey) {
    if (sortKey === key) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
    setPage(0);
  }

  function gotoPreviousPage() {
    if (page > 0) setPage(page - 1);
  }
  function gotoNextPage() {
    if (page < totalPages - 1) setPage(page + 1);
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                className={styles.sortable}
                onClick={() => sortBy(key)}
              >
                {label}
                <span className={styles.sortIcon}>
                  {sortKey === key ? (sortAscending ? "▲" : "▼") : "⇅"}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((userProfile) => (
            <tr key={userProfile.user_id} className={styles.clickableRow}>
              <td>{userProfile.first_name}</td>
              <td>{userProfile.last_name}</td>
              <td>{userProfile.age}</td>
              <td>{userProfile.gender}</td>
              <td title={countryName(userProfile.country_of_origin)}>
                {userProfile.country_of_origin}
              </td>
              <td>{userProfile.place_of_residence}</td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className="filled-button"
          onClick={gotoPreviousPage}
          disabled={page === 0}
        >
          <span className="material-symbols-outlined">arrow_left</span> Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="filled-button"
          onClick={gotoNextPage}
          disabled={page === totalPages - 1}
        >
          Next <span className="material-symbols-outlined">arrow_right</span>
        </button>
      </div>
    </div>
  );
}
