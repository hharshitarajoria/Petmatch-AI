import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, PawPrint, X } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/common/Container";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { ROUTES } from "@/constants/routes";
import { DASHBOARD_NAV_LINKS } from "@/constants/dashboardContent";

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  function handleLogout() {
    dispatch(logout());
    toast.success("Signed out successfully");
    setIsMenuOpen(false);
    navigate(ROUTES.LOGIN);
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-lg lg:border-none lg:bg-transparent lg:backdrop-blur-none">
      <Container className="lg:px-0">
        <div className="flex h-16 items-center justify-between px-6 lg:px-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-paper">
              <PawPrint className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
            <span className="font-display text-base font-semibold text-ink">
              PetMatch <span className="text-moss">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-moss/15 font-display text-xs font-bold text-moss-dark ring-2 ring-moss/20">
              {userInitials}
            </div>
            <div className="flex flex-col">
              <span className="max-w-[140px] truncate text-xs font-semibold leading-tight text-ink">
                {user?.name ?? "User"}
              </span>
              <span className="font-mono text-[10px] uppercase text-ink-soft">
                {user?.role ?? "ADOPTER"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden bg-paper/95 backdrop-blur-lg lg:hidden"
          >
            <Container className="flex flex-col gap-4 pb-6">
              <div className="flex items-center gap-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-moss/15 font-display text-sm font-bold text-moss-dark">
                  {userInitials}
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-sm font-semibold text-ink">
                    {user?.name}
                  </span>
                  <span className="font-mono text-xs text-ink-soft">{user?.email}</span>
                </div>
              </div>

              {DASHBOARD_NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    end={link.href === ROUTES.DASHBOARD}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 font-display text-base font-medium ${
                        isActive ? "text-moss" : "text-ink"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {link.label}
                  </NavLink>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 border-t border-line pt-4 font-display text-base font-medium text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
