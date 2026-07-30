import { Link, NavLink } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { DASHBOARD_NAV_LINKS } from "@/constants/dashboardContent";
import { ROUTES } from "@/constants/routes";

export default function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r border-line bg-white/60 px-5 py-8 lg:flex">
      <Link to={ROUTES.HOME} className="flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss text-paper">
          <PawPrint className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <span className="font-display text-lg font-semibold text-ink">
          PetMatch <span className="text-moss">AI</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {DASHBOARD_NAV_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-moss text-paper shadow-soft"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <Link
        to={ROUTES.PETS}
        className="rounded-2xl bg-gold/10 px-4 py-3 text-xs font-medium leading-relaxed text-ink-soft transition-colors hover:bg-gold/15"
      >
        Looking for a new companion?{" "}
        <span className="font-semibold text-moss-dark">Browse pets →</span>
      </Link>
    </aside>
  );
}
