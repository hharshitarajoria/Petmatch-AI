import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  options: SelectOption[];
}

/**
 * Reusable labeled select — used across the filter panel (species, breed,
 * gender, sort) and available for any future form in the app.
 */
export default function Select({ label, options, ...selectProps }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </span>
      <select
        {...selectProps}
        className="rounded-xl border border-line bg-white/70 px-3 py-2.5 text-sm text-ink outline-none transition-shadow focus:shadow-soft focus:ring-2 focus:ring-gold/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
