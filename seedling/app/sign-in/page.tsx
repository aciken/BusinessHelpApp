"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AxiosError } from "axios";
import { AuthLayout } from "@/components/AuthLayout";
import { SeedlingLogo } from "@/components/SeedlingLogo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { signIn } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && JSON.parse(stored)._id) router.replace("/dashboard");
    } catch { /* ignore */ }
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
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
      const user = await signIn({ email, password });
      localStorage.setItem("user", JSON.stringify({ _id: user._id, name: user.name, email: user.email }));
      router.push("/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setApiError(
        axiosErr.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      quote="Every expert was once a beginner. Every pro was once an amateur."
      quoteAuthor="Robin Sharma"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SeedlingLogo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Welcome back
          </h1>
          <p className="text-text-secondary mt-2 text-base">
            Sign in to continue building your business
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SocialAuthButtons />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.35 }}
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              autoComplete="current-password"
            />
            <div className="mt-2 text-right">
              <a
                href="#"
                className="text-sm text-accent hover:text-accent-dark transition-colors font-medium"
              >
                Forgot password?
              </a>
            </div>
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
            Sign In
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-text-secondary"
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-accent hover:text-accent-dark font-semibold transition-colors"
          >
            Create one free
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  );
}
