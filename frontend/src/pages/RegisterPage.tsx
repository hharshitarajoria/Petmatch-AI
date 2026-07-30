import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  Loader2,
  HeartHandshake,
  Home,
} from "lucide-react";
import { useRegisterMutation } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/api/apiError";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/user.types";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["ADOPTER", "SHELTER"] as const),
    shelterName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "SHELTER") {
        return Boolean(data.shelterName && data.shelterName.trim().length >= 2);
      }
      return true;
    },
    {
      message: "Shelter name is required (min 2 characters)",
      path: ["shelterName"],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADOPTER",
      shelterName: "",
    },
  });

  const selectedRole = watch("role");

  function onSubmit(values: RegisterFormValues) {
    const payload = {
      name: values.role === "SHELTER" && values.shelterName ? values.shelterName.trim() : values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: values.role as UserRole,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        navigate(ROUTES.DASHBOARD, { replace: true });
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white/80 p-8 shadow-soft ring-1 ring-line backdrop-blur-md sm:p-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Create your account
        </h1>
        <p className="text-sm text-ink-soft">
          Join PetMatch AI to find your dream companion or list pets for adoption.
        </p>
      </div>

      {registerMutation.isError ? (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{getApiErrorMessage(registerMutation.error)}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Role Selection Tabs */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            I am joining as an
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "ADOPTER")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition-all ${
                selectedRole === "ADOPTER"
                  ? "border-moss bg-moss/10 text-moss-dark ring-2 ring-moss/20"
                  : "border-line bg-white/70 text-ink-soft hover:bg-white"
              }`}
            >
              <HeartHandshake className="h-4 w-4" />
              Pet Adopter
            </button>

            <button
              type="button"
              onClick={() => setValue("role", "SHELTER")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition-all ${
                selectedRole === "SHELTER"
                  ? "border-moss bg-moss/10 text-moss-dark ring-2 ring-moss/20"
                  : "border-line bg-white/70 text-ink-soft hover:bg-white"
              }`}
            >
              <Home className="h-4 w-4" />
              Shelter / Rescue
            </button>
          </div>
        </div>

        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            {selectedRole === "SHELTER" ? "Contact Person Name" : "Full Name"}
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-4 w-4 text-ink-soft" />
            <input
              id="name"
              type="text"
              placeholder={selectedRole === "SHELTER" ? "John Doe (Manager)" : "Jane Doe"}
              autoComplete="name"
              {...register("name")}
              className={`w-full rounded-xl border bg-white/90 pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:ring-2 ${
                errors.name
                  ? "border-rose-300 focus:ring-rose-200"
                  : "border-line focus:border-moss/40 focus:ring-moss/20"
              }`}
            />
          </div>
          {errors.name ? (
            <span className="text-xs text-rose-600 font-medium">{errors.name.message}</span>
          ) : null}
        </div>

        {/* Extra Shelter Name Field if Shelter is selected */}
        {selectedRole === "SHELTER" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shelterName" className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
              Shelter / Rescue Organization Name
            </label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-3.5 h-4 w-4 text-ink-soft" />
              <input
                id="shelterName"
                type="text"
                placeholder="Happy Paws Animal Shelter"
                {...register("shelterName")}
                className={`w-full rounded-xl border bg-white/90 pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:ring-2 ${
                  errors.shelterName
                    ? "border-rose-300 focus:ring-rose-200"
                    : "border-line focus:border-moss/40 focus:ring-moss/20"
                }`}
              />
            </div>
            {errors.shelterName ? (
              <span className="text-xs text-rose-600 font-medium">{errors.shelterName.message}</span>
            ) : null}
          </div>
        ) : null}

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
          <label htmlFor="password" className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-ink-soft" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-ink-soft" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`w-full rounded-xl border bg-white/90 pl-10 pr-11 py-2.5 text-sm text-ink outline-none transition-all focus:ring-2 ${
                errors.confirmPassword
                  ? "border-rose-300 focus:ring-rose-200"
                  : "border-line focus:border-moss/40 focus:ring-moss/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft transition-colors hover:text-ink"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? (
            <span className="text-xs text-rose-600 font-medium">{errors.confirmPassword.message}</span>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-moss py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-paper shadow-lifted transition-all hover:bg-moss-dark disabled:opacity-60"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-ink-soft">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-semibold text-moss hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
