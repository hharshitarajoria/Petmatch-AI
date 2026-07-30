import { Link, Outlet } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-12">
      {/* Subtle Background Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-leaf/30 via-moss/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8">
        {/* Header Logo */}
        <div className="flex justify-center">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss text-paper shadow-soft">
              <PawPrint className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="font-display text-2xl font-bold text-ink">
              PetMatch <span className="text-moss">AI</span>
            </span>
          </Link>
        </div>

        {/* Auth Card Outlet */}
        <Outlet />
      </div>
    </div>
  );
}

