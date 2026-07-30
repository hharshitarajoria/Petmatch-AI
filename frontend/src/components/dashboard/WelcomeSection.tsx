import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import type { AuthUser } from "@/types/user.types";

interface WelcomeSectionProps {
  user: AuthUser | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const firstNameOf = (fullName: string) => fullName.trim().split(" ")[0];

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const name = user?.name ? firstNameOf(user.name) : "there";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-3 rounded-3xl bg-moss px-7 py-8 shadow-soft sm:px-9 sm:py-10"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-gold-soft">
        <PawPrint className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
        {getGreeting()}, {name}.
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-paper/75 sm:text-base">
        Here's what's happening with your PetMatch AI account — your saved pets, matches, and
        adoption activity, all in one place.
      </p>
    </motion.div>
  );
}
