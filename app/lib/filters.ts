// Not `server-only`: shared by the server page (parsing), the server action (backend query)
// and the client filter form (building the URL).

export const GENDERS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDERS)[number];

export const MIN_AGE_BOUND = 18;
export const MAX_AGE_BOUND = 120;

export interface UserProfileFilters {
  genders: Gender[];
  exactAge: number | null;
  minAge: number | null;
  maxAge: number | null;
  placeOfResidence: string | null;
  countryOfOrigin: string | null;
}

export const NO_FILTERS: UserProfileFilters = {
  genders: [],
  exactAge: null,
  minAge: null,
  maxAge: null,
  placeOfResidence: null,
  countryOfOrigin: null,
};

// Query parameters used both in the page URL and in the backend request.
export function toSearchParams(filters: UserProfileFilters): URLSearchParams {
  const params = new URLSearchParams();
  filters.genders.forEach((g) => params.append("genders", g));
  if (filters.exactAge !== null) params.set("exact_age", `${filters.exactAge}`);
  if (filters.minAge !== null) params.set("min_age", `${filters.minAge}`);
  if (filters.maxAge !== null) params.set("max_age", `${filters.maxAge}`);
  if (filters.placeOfResidence)
    params.set("place_of_residence", filters.placeOfResidence);
  if (filters.countryOfOrigin)
    params.set("country_of_origin", filters.countryOfOrigin);
  return params;
}

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseAge(value: string | string[] | undefined): number | null {
  const raw = first(value);
  if (!raw || !/^\d+$/.test(raw)) return null;
  const age = Number(raw);
  return age >= MIN_AGE_BOUND && age <= MAX_AGE_BOUND ? age : null;
}

// Parses untrusted URL search params into a valid filters object.
export function parseFilters(raw: RawParams): UserProfileFilters {
  const genders = ([] as string[])
    .concat(raw.genders ?? [])
    .filter((g): g is Gender => (GENDERS as readonly string[]).includes(g));
  return {
    genders: [...new Set(genders)],
    exactAge: parseAge(raw.exact_age),
    minAge: parseAge(raw.min_age),
    maxAge: parseAge(raw.max_age),
    placeOfResidence: first(raw.place_of_residence)?.trim().slice(0, 100) || null,
    countryOfOrigin: first(raw.country_of_origin) || null,
  };
}
