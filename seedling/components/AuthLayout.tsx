"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sprout, TrendingUp, Users, Target } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  quote?: string;
  quoteAuthor?: string;
}

function FloatingCard({
  icon: Icon,
  label,
  value,
  delay,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/5 border border-white/50 px-4 py-3 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-xs text-text-secondary font-medium">{label}</p>
          <p className="text-sm font-bold text-text-primary font-heading">{value}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedOrb({
  size,
  delay,
  className,
}: {
  size: number;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.05) 60%, transparent 80%)`,
      }}
    />
  );
}

export function AuthLayout({
  children,
  quote = "The best time to plant a tree was 20 years ago. The second best time is now.",
  quoteAuthor = "Chinese Proverb",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Decorative panel — desktop only */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden items-center justify-center">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-muted via-white to-accent-light/30" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-transparent" />
        <div className="absolute inset-0 dot-grid opacity-[0.15]" />

        {/* Animated orbs */}
        <AnimatedOrb size={400} delay={0} className="-top-20 -left-20" />
        <AnimatedOrb size={300} delay={2} className="bottom-10 right-10" />
        <AnimatedOrb size={200} delay={4} className="top-1/3 right-1/4" />

        {/* Central content */}
        <div className="relative z-10 px-12 w-full max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-accent/10 border border-accent/10">
              <Sprout className="h-10 w-10 text-accent" />
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <blockquote className="font-heading text-3xl font-bold text-text-primary leading-snug tracking-tight">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <p className="mt-5 text-sm text-text-secondary font-medium">
              — {quoteAuthor}
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex gap-8"
          >
            {[
              { value: "2,000+", label: "Founders" },
              { value: "500+", label: "Launched" },
              { value: "4.9/5", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl font-extrabold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating metric cards */}
        <FloatingCard
          icon={TrendingUp}
          label="Revenue Growth"
          value="+127% avg"
          delay={0.6}
          className="top-[12%] right-[8%]"
        />
        <FloatingCard
          icon={Users}
          label="Users Onboarded"
          value="2,847 today"
          delay={0.9}
          className="bottom-[20%] left-[6%]"
        />
        <FloatingCard
          icon={Target}
          label="Goals Completed"
          value="94% success"
          delay={1.2}
          className="bottom-[8%] right-[12%]"
        />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white relative">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] green-orb pointer-events-none opacity-20" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[440px] relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
