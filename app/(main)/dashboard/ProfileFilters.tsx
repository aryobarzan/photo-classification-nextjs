"use client";
// Client Component as we rely on useState and the router.
import { COUNTRIES } from "@/app/lib/data/countries";
import {
  Gender,
  GENDERS,
  MAX_AGE_BOUND,
  MIN_AGE_BOUND,
  toSearchParams,
  UserProfileFilters,
} from "@/app/lib/filters";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Dashboard.module.css";
import MultiSelectDropdown, { DropdownOption } from "./MultiSelectDropdown";

const genderOptions: DropdownOption[] = GENDERS.map((g) => ({
  label: g.charAt(0).toUpperCase() + g.slice(1),
  value: g,
}));

const countryOptions: DropdownOption[] = COUNTRIES.map((c) => ({
  label: c.name,
  value: c.code,
}));

export default function ProfileFilters({
  initial,
}: {
  initial: UserProfileFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // The filters currently entered in the form (not yet applied)
  const [pendingGenders, setPendingGenders] = useState<Set<string>>(
    new Set(initial.genders),
  );
  const [pendingCountry, setPendingCountry] = useState<Set<string>>(
    new Set(initial.countryOfOrigin ? [initial.countryOfOrigin] : []),
  );
  const [placeOfResidence, setPlaceOfResidence] = useState(
    initial.placeOfResidence ?? "",
  );
  const [exactAgeText, setExactAgeText] = useState(
    initial.exactAge !== null ? `${initial.exactAge}` : "",
  );
  const [minAge, setMinAge] = useState(initial.minAge ?? MIN_AGE_BOUND);
  const [maxAge, setMaxAge] = useState(initial.maxAge ?? MAX_AGE_BOUND);

  // --- Validation
  const exactAgeIsNumber = /^\d*$/.test(exactAgeText);
  const exactAge =
    exactAgeText !== "" && exactAgeIsNumber ? Number(exactAgeText) : null;
  const exactAgeOutOfRange =
    exactAge !== null && (exactAge < MIN_AGE_BOUND || exactAge > MAX_AGE_BOUND);
  const placeTooLong = placeOfResidence.length > 100;
  const hasErrors = !exactAgeIsNumber || exactAgeOutOfRange || placeTooLong;

  function navigate(filters: UserProfileFilters) {
    const query = toSearchParams(filters).toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function applyFilters() {
    const place = placeOfResidence.trim();
    navigate({
      genders: [...pendingGenders] as Gender[],
      exactAge,
      minAge: minAge !== MIN_AGE_BOUND ? minAge : null,
      maxAge: maxAge !== MAX_AGE_BOUND ? maxAge : null,
      placeOfResidence: place !== "" ? place : null,
      countryOfOrigin: [...pendingCountry][0] ?? null,
    });
  }

  function clearFilters() {
    setPendingGenders(new Set());
    setPendingCountry(new Set());
    setPlaceOfResidence("");
    setExactAgeText("");
    setMinAge(MIN_AGE_BOUND);
    setMaxAge(MAX_AGE_BOUND);
    router.push(pathname);
  }

  return (
    <div className={styles.filters}>
      <div className={styles.filtersRow}>
        <MultiSelectDropdown
          options={genderOptions}
          placeholder="All genders"
          selected={pendingGenders}
          onChange={setPendingGenders}
        />
        <MultiSelectDropdown
          options={countryOptions}
          placeholder="All countries"
          singleSelect
          selected={pendingCountry}
          onChange={setPendingCountry}
        />
        <div className={styles.floatingLabelWrapper}>
          <input
            type="text"
            placeholder=" "
            className={`input-field ${styles.inputField}`}
            value={placeOfResidence}
            onChange={(e) => setPlaceOfResidence(e.target.value)}
          />
          <label>Place of residence</label>
        </div>
      </div>
      <div className={styles.filtersRow}>
        <div
          className={`${styles.floatingLabelWrapper} ${styles.exactAgeInputField}`}
        >
          {/* Placeholder is set to a single space to trigger the floating label effect */}
          <input
            type="text"
            placeholder=" "
            className={`input-field ${styles.inputField}`}
            value={exactAgeText}
            onChange={(e) => setExactAgeText(e.target.value)}
          />
          <label>Exact age</label>
        </div>
        {/* If an exact age is entered, the age range sliders are disabled */}
        <div
          className={`${styles.ageRangeSliders} ${exactAge !== null ? styles.disabled : ""}`}
        >
          <div className={styles.ageSliderRow}>
            <label>Min age: {minAge}</label>
            <input
              type="range"
              min={MIN_AGE_BOUND}
              max={MAX_AGE_BOUND}
              value={minAge}
              disabled={exactAge !== null}
              onChange={(e) => setMinAge(Math.min(+e.target.value, maxAge))}
            />
          </div>
          <div className={styles.ageSliderRow}>
            <label>Max age: {maxAge}</label>
            <input
              type="range"
              min={MIN_AGE_BOUND}
              max={MAX_AGE_BOUND}
              value={maxAge}
              disabled={exactAge !== null}
              onChange={(e) => setMaxAge(Math.max(+e.target.value, minAge))}
            />
          </div>
        </div>
        {/* `margin-left: auto` is used to push the clear filters button to the right */}
        <button
          type="button"
          className="icon-button"
          style={{ marginLeft: "auto" }}
          title="Clear filters"
          onClick={clearFilters}
        >
          <span className="material-symbols-outlined">filter_alt_off</span>
        </button>
        <button
          type="button"
          className="filled-button"
          disabled={hasErrors}
          onClick={applyFilters}
        >
          <span className="material-symbols-outlined">filter_alt</span> Apply
        </button>
      </div>
      <div className={styles.filterErrors}>
        {exactAgeIsNumber && exactAgeOutOfRange && (
          <span className={styles.filterError}>
            Exact age must be between {MIN_AGE_BOUND} and {MAX_AGE_BOUND}.
          </span>
        )}
        {!exactAgeIsNumber && (
          <span className={styles.filterError}>
            Exact age must be a whole number.
          </span>
        )}
        {placeTooLong && (
          <span className={styles.filterError}>
            Place of residence must be at most 100 characters.
          </span>
        )}
      </div>
    </div>
  );
}
