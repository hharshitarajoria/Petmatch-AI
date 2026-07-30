import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Debounces typing before pushing the value up, so we don't refetch on every keystroke. */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search pets by name",
}: SearchBarProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, 400);
    return () => clearTimeout(timeout);
  }, [draft, value, onChange]);

  return (
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        aria-hidden
      />
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label="Search pets by name"
        className="w-full rounded-full border border-line bg-white/70 py-3 pl-11 pr-4 text-sm text-ink shadow-soft outline-none transition-shadow placeholder:text-ink-soft/70 focus:shadow-lifted focus:ring-2 focus:ring-gold/40"
      />
    </div>
  );
}
