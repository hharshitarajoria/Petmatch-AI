import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/apiError";
import { ROUTES } from "@/constants/routes";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white/80 p-8 shadow-soft ring-1 ring-line backdrop-blur-md sm:p-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-ink-soft">
          Sign in to access your saved pets, matches, and adoption requests.
        </p>
      </div>

      {loginMutation.isError ? (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{getApiErrorMessage(loginMutation.error)}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            Email address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-ink-soft" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              className={`w-full rounded-xl border bg-white/90 pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:ring-2 ${
                errors.email
                  ? "border-rose-300 focus:ring-rose-200"
                  : "border-line focus:border-moss/40 focus:ring-moss/20"
              }`}
            />
          </div>
          {errors.email ? (
            <span className="text-xs text-rose-600 font-medium">{errors.email.message}</span>
          ) : null}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
              Password
            </label>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-ink-soft" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              className={`w-full rounded-xl border bg-white/90 pl-10 pr-11 py-2.5 text-sm text-ink outline-none transition-all focus:ring-2 ${
                errors.password
                  ? "border-rose-300 focus:ring-rose-200"
                  : "border-line focus:border-moss/40 focus:ring-moss/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft transition-colors hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <span className="text-xs text-rose-600 font-medium">{errors.password.message}</span>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-moss py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-paper shadow-lifted transition-all hover:bg-moss-dark disabled:opacity-60"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link to={ROUTES.REGISTER} className="font-semibold text-moss hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}
