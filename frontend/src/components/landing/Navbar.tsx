import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, PawPrint, X, LogOut, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { ROUTES } from "@/constants/routes";
import { NAV_LINKS } from "@/constants/landingContent";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    dispatch(logout());
    toast.success("Signed out successfully");
    setIsMenuOpen(false);
    navigate(ROUTES.LOGIN);
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-paper/80 shadow-soft backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex h-18 items-center justify-between py-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss text-paper">
              <PawPrint className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg font-semibold text-ink">
              PetMatch <span className="text-moss">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <RouterNavLink
                key={link.label}
                to={link.href}
                className="font-display text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </RouterNavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-4 py-2 text-xs font-mono font-medium uppercase tracking-[0.12em] text-ink-soft shadow-soft transition-colors hover:bg-white hover:text-ink"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2.5 pl-2 border-l border-line">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-moss/15 font-display text-xs font-bold text-moss-dark ring-2 ring-moss/20">
                    {userInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-ink leading-tight max-w-[100px] truncate">
                      {user?.name ?? "User"}
                    </span>
                    <span className="text-[10px] text-ink-soft font-mono uppercase">
                      {user?.role ?? "ADOPTER"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="font-display text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  Login
                </Link>
                <Button to={ROUTES.REGISTER} size="md">
                  Register
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden bg-paper/95 backdrop-blur-lg md:hidden"
          >
            <Container className="flex flex-col gap-4 pb-6">
              {NAV_LINKS.map((link) => (
                <RouterNavLink
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-base font-medium text-ink-soft"
                >
                  {link.label}
                </RouterNavLink>
              ))}

              <div className="mt-2 flex flex-col gap-3 pt-3 border-t border-line">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-moss/15 font-display text-sm font-bold text-moss-dark">
                        {userInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-sm font-semibold text-ink">
                          {user?.name}
                        </span>
                        <span className="text-xs font-mono text-ink-soft">
                          {user?.email}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={ROUTES.DASHBOARD}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 font-display text-base font-medium text-ink"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 font-display text-base font-medium text-rose-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-display text-base font-medium text-ink-soft"
                    >
                      Login
                    </Link>
                    <Button to={ROUTES.REGISTER} className="w-full">
                      Register
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

