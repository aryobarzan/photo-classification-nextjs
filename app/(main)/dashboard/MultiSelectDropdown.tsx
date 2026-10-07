"use client";
// Client Component as we rely on useState.
import { useState } from "react";
import styles from "./MultiSelectDropdown.module.css";

export interface DropdownOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: DropdownOption[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  placeholder?: string;
  // If true, only one option can be selected at a time. Selecting a new option will deselect the previous one.
  singleSelect?: boolean;
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  singleSelect = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleOption(value: string) {
    if (singleSelect) {
      onChange(new Set(selected.has(value) ? [] : [value]));
      setIsOpen(false);
    } else {
      const next = new Set(selected);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      onChange(next);
    }
  }

  const label =
    selected.size === 0
      ? placeholder
      : options
          .filter((o) => selected.has(o.value))
          .map((o) => o.label)
          .join(", ");

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropdownToggle}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <span className="material-symbols-outlined">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>
      {isOpen && (
        <>
          <div
            className={styles.dropdownBackdrop}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.dropdownPanel}>
            {options.map((option) => (
              // In the case of radio, `change` is not fired when a selected option is clicked again,
              // so radios use `click` instead. We don't call `preventDefault()` there (unlike in Angular):
              // on a controlled input React re-renders `checked` during the event, and the browser
              // then reverts the prevented click, leaving the checkbox visually stale.
              <label key={option.value} className={styles.dropdownOption}>
                <input
                  type={singleSelect ? "radio" : "checkbox"}
                  checked={selected.has(option.value)}
                  onClick={singleSelect ? () => toggleOption(option.value) : undefined}
                  // Radios are handled in `onClick`; the no-op only silences React's controlled-input warning.
                  onChange={singleSelect ? () => {} : () => toggleOption(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
