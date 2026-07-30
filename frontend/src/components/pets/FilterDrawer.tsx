import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import FiltersPanel, { type FiltersPanelProps } from "@/components/pets/FiltersPanel";
import Button from "@/components/common/Button";

interface FilterDrawerProps extends FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount?: number;
}

export default function FilterDrawer({ isOpen, onClose, resultCount, ...panelProps }: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            aria-hidden
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-6 overflow-y-auto bg-paper p-6 shadow-lifted"
            role="dialog"
            aria-modal="true"
            aria-label="Filter pets"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Filters</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <FiltersPanel {...panelProps} />

            <Button onClick={onClose} className="mt-auto w-full">
              {resultCount !== undefined ? `Show ${resultCount} pets` : "Apply filters"}
            </Button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
