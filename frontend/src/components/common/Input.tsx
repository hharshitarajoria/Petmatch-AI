import type { InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
}

/**
 * Reusable labeled input — used by the age-range filter fields and
 * available for any future form in the app.
 */
export default function Input({ label, ...inputProps }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </span>
      <input
        {...inputProps}
        className="rounded-xl border border-line bg-white/70 px-3 py-2.5 text-sm text-ink outline-none transition-shadow focus:shadow-soft focus:ring-2 focus:ring-gold/40"
      />
    </label>
  );
}
