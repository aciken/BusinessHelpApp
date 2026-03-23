"use client";

import { Suspense, useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { Mail, ArrowRight, CheckCircle2, Sprout } from "lucide-react";
import { Button } from "@/components/Button";
import { verifyEmail } from "@/lib/api";

const CODE_LENGTH = 6;

function CodeInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;

    const newValue = [...value];
    newValue[index] = char.slice(-1);
    onChange(newValue);

    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newValue = [...value];
      newValue[index - 1] = "";
      onChange(newValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newValue = [...value];
    for (let i = 0; i < pasted.length; i++) {
      newValue[i] = pasted[i];
    }
    onChange(newValue);

    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05 }}
        >
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={value[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-heading font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 ${
              value[i]
                ? "border-accent bg-accent-light/30 text-text-primary"
                : "border-border bg-white text-text-primary hover:border-gray-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyPageInner />
    </Suspense>
  );
}

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [devCode, setDevCode] = useState("");

  // Read the verification code from sessionStorage (email sending is disabled in dev)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("pendingVerification");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email === email && parsed.code) {
          setDevCode(parsed.code);
        }
      }
    } catch {
      // ignore
    }
  }, [email]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== CODE_LENGTH) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await verifyEmail({ email, verificationCode });
      localStorage.setItem("user", JSON.stringify({ _id: user._id, name: user.name, email: user.email }));
      sessionStorage.removeItem("pendingVerification");
      setVerified(true);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (code.every((c) => c !== "") && !isLoading && !verified) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.15]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] green-orb pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] green-orb pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 bg-accent-light rounded-3xl flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight"
          >
            You&apos;re verified!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-text-secondary text-lg"
          >
            Your account is ready. Let&apos;s start building your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.15]" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] green-orb pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] green-orb pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="flex justify-center mb-10"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center">
              <Sprout className="h-5 w-5 text-accent" />
            </div>
            <span className="font-heading font-bold text-xl text-text-primary">
              Seedling
            </span>
          </Link>
        </motion.div>

        {/* Mail icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-8"
        >
          <Mail className="h-8 w-8 text-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight"
        >
          Check your email
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-text-secondary text-base max-w-sm mx-auto"
        >
          We sent a 6-digit verification code to{" "}
          <span className="font-semibold text-text-primary">{email || "your email"}</span>
        </motion.p>

        {devCode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-4 mx-auto max-w-sm p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700"
          >
            <span className="font-semibold">Dev mode:</span> Your code is{" "}
            <span className="font-mono font-bold text-amber-900">{devCode}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-10">
          <CodeInput value={code} onChange={setCode} disabled={isLoading} />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-red-500 font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="gap-2 group"
              disabled={code.some((c) => c === "")}
            >
              Verify Email
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-text-secondary"
        >
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            className="text-accent hover:text-accent-dark font-semibold transition-colors"
          >
            Resend
          </button>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-4 text-xs text-text-secondary/60"
        >
          <Link href="/sign-up" className="hover:text-text-secondary transition-colors">
            &larr; Back to sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
