import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, PawPrint, X } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
import { NAV_LINKS } from "@/constants/landingContent";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Link
              to={ROUTES.LOGIN}
              className="font-display text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Login
            </Link>
            <Button to={ROUTES.REGISTER} size="md">
              Register
            </Button>
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
              <div className="mt-2 flex flex-col gap-3">
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
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
