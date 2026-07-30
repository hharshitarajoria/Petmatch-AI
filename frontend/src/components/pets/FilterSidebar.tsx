import { SlidersHorizontal } from "lucide-react";
import FiltersPanel, { type FiltersPanelProps } from "@/components/pets/FiltersPanel";

export default function FilterSidebar(props: FiltersPanelProps) {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-24 flex flex-col gap-6 rounded-3xl bg-white/60 p-6 shadow-soft ring-1 ring-line">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-moss" aria-hidden />
          <h2 className="font-display text-base font-semibold text-ink">Filters</h2>
        </div>
        <FiltersPanel {...props} />
      </div>
    </aside>
  );
}
