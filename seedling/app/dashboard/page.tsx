"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  FileText,
  Megaphone,
  Rocket,
  ArrowRight,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  Lock,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";

const steps = [
  { num: 1, name: "Market Validation", icon: BarChart3, href: "/dashboard/market", key: "market", desc: "Research your market opportunity" },
  { num: 2, name: "Define Product", icon: Package, href: "/dashboard/product", key: "product", desc: "Detail what you're building" },
  { num: 3, name: "Business Plan", icon: FileText, href: "/dashboard/plan", key: "plan", desc: "Create your business blueprint" },
  { num: 4, name: "Marketing Strategy", icon: Megaphone, href: "/dashboard/marketing", key: "marketing", desc: "Plan how to reach customers" },
  { num: 5, name: "Launch & Grow", icon: Rocket, href: "/dashboard/launch", key: "launch", desc: "Plan your launch and scale" },
];

const quickStats = [
  { label: "Target Market", value: "$2.4M", icon: Target, color: "text-accent" },
  { label: "Year 1 Revenue", value: "$180K", icon: DollarSign, color: "text-accent" },
  { label: "Growth Rate", value: "15%", icon: TrendingUp, color: "text-accent" },
  { label: "Launch Target", value: "Q3 2025", icon: Calendar, color: "text-accent" },
];

export default function DashboardOverview() {
  const router = useRouter();
  const { state, getStepCompletion, isStepUnlocked } = useDashboard();

  useEffect(() => {
    if (!state.loading && !state.project) {
      router.replace("/dashboard/new-project");
    }
  }, [state.loading, state.project, router]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.project) return null;

  const completedCount = state.completedSteps.filter((s) => s >= 1 && s <= 5).length;
  const overallPercent = Math.round((completedCount / 5) * 100);

  return (
    <div>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Welcome back, {state.user.name.split(" ")[0]}
        </h1>
        <p className="text-text-secondary mt-1">
          Continue building <span className="font-medium text-text-primary">{state.project?.name}</span>
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-white rounded-2xl border border-border-light shadow-sm p-6 lg:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Progress ring */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#F3F4F6" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#22C55E"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallPercent / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-text-primary">{overallPercent}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              {completedCount} of 5 steps completed
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              {completedCount === 0
                ? "Start your first step to begin building your business."
                : completedCount === 5
                ? "Congratulations! You've completed all steps."
                : "Keep going! You're making great progress on your business plan."}
            </p>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-border-light shadow-sm p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-text-secondary">{stat.label}</span>
              </div>
              <p className="text-xl font-heading font-bold text-text-primary">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const unlocked = isStepUnlocked(step.num);
          const isCompleted = state.completedSteps.includes(step.num);
          const isCurrent = state.project?.currentStep === step.num && unlocked;
          const completion = getStepCompletion(step.key as "idea" | "market" | "product" | "plan" | "marketing" | "launch");

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            >
              {unlocked ? (
                <Link
                  href={step.href}
                  className={`block bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-all duration-200 group ${
                    isCurrent
                      ? "border-accent/40 ring-1 ring-accent/10"
                      : "border-border-light hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCompleted
                          ? "bg-accent text-white"
                          : isCurrent
                          ? "bg-accent-muted text-accent"
                          : "bg-gray-100 text-text-secondary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{step.name}</p>
                      <p className="text-xs text-text-secondary">Step {step.num}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">{step.desc}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isCompleted
                          ? "bg-accent/10 text-accent"
                          : isCurrent
                          ? "bg-amber-50 text-amber-600"
                          : "bg-gray-100 text-text-secondary"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : isCurrent
                        ? `In Progress — ${completion}%`
                        : "Not Started"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ) : (
                <div className="block bg-white/60 rounded-2xl border border-border-light p-6 opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-text-secondary">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-secondary">{step.name}</p>
                      <p className="text-xs text-text-secondary">Step {step.num}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">{step.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-text-secondary">
                      Locked — Create a project first
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
