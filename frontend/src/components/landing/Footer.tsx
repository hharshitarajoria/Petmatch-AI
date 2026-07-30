import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import Container from "@/components/common/Container";
import { ROUTES } from "@/constants/routes";

const PRODUCT_LINKS = [
  { label: "Browse pets", href: ROUTES.PETS },
  { label: "Saved pets", href: ROUTES.SAVED_PETS },
  { label: "Recommendations", href: ROUTES.RECOMMENDATIONS },
];

const COMPANY_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Login", href: ROUTES.LOGIN },
  { label: "Register", href: ROUTES.REGISTER },
];

export default function Footer() {
  return (
    <footer className="bg-moss-deep pt-16">
      <Container className="flex flex-col gap-12 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink">
                <PawPrint className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="font-display text-lg font-semibold text-paper">
                PetMatch <span className="text-gold-soft">AI</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              Matching adopters with verified shelters, ranked by real compatibility — not just
              listing date.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-paper/40">
              Product
            </span>
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-paper/40">
              Company
            </span>
            {COMPANY_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PetMatch AI. All rights reserved.</span>
          <span>Built for adopters and shelters alike.</span>
        </div>
      </Container>
    </footer>
  );
}
