"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { AxiosError } from "axios";
import { AuthLayout } from "@/components/AuthLayout";
import { SeedlingLogo } from "@/components/SeedlingLogo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { signUp } from "@/lib/api";

function getPasswordStrength(password: string): {
  label: string;
  level: number;
  color: string;
  textColor: string;
} {
  if (!password)
    return { label: "", level: 0, color: "", textColor: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2)
    return { label: "Weak — add numbers & symbols", level: 1, color: "bg-red-400", textColor: "text-red-500" };
  if (score <= 3)
    return { label: "Medium — getting there", level: 2, color: "bg-amber-400", textColor: "text-amber-500" };
  return { label: "Strong — nice!", level: 3, color: "bg-accent", textColor: "text-accent" };
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && JSON.parse(stored)._id) router.replace("/dashboard");
    } catch { /* ignore */ }
  }, [router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "Full name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const user = await signUp({ name, email, password });
      // Store verification code for the verify page (email sending is disabled in dev)
      sessionStorage.setItem("pendingVerification", JSON.stringify({
        email,
        code: String(user.verification),
      }));
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setApiError(
        axiosErr.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stagger = (i: number) => ({ delay: 0.1 + i * 0.05 });

  return (
    <AuthLayout
      quote="The secret of getting ahead is getting started."
      quoteAuthor="Mark Twain"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(0)}
        >
          <SeedlingLogo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(1)}
          className="mt-10 mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Start your journey
          </h1>
          <p className="text-text-secondary mt-2 text-base">
            Create your account and build something amazing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(2)}
        >
          <SocialAuthButtons />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(3)}
          className="my-8 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(4)}
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <Input
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            error={errors.name}
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            error={errors.email}
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              error={errors.password}
              autoComplete="new-password"
            />
            {/* Password strength indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="mt-2.5"
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <motion.div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                        level <= strength.level ? strength.color : "bg-gray-100"
                      }`}
                      initial={false}
                      animate={
                        level <= strength.level
                          ? { scaleX: 1 }
                          : { scaleX: 1 }
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Shield className={`h-3 w-3 ${strength.textColor}`} />
                  <p className={`text-xs font-medium ${strength.textColor}`}>
                    {strength.label}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <Input
            label="Confirm password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError("confirmPassword");
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          {/* Terms checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    clearError("terms");
                  }}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-gray-300 peer-checked:border-accent peer-checked:bg-accent transition-all duration-200 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30">
                  {agreedToTerms && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-text-secondary leading-snug">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-accent hover:text-accent-dark font-medium transition-colors underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-accent hover:text-accent-dark font-medium transition-colors underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-sm text-red-500 ml-8">
                {errors.terms}
              </p>
            )}
          </div>

          {apiError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            className="mt-2 gap-2 group"
          >
            Create Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>

          <p className="text-center text-xs text-text-secondary/60 mt-3">
            By creating an account you agree to receive product updates.
            <br />
            You can unsubscribe at any time.
          </p>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center text-sm text-text-secondary"
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-accent hover:text-accent-dark font-semibold transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  );
}
