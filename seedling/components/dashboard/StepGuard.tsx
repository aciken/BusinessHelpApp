"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboard } from "./DashboardContext";

interface StepGuardProps {
  stepNumber: number;
  children: React.ReactNode;
}

export default function StepGuard({ stepNumber, children }: StepGuardProps) {
  const { isStepUnlocked } = useDashboard();
  const router = useRouter();
  const unlocked = isStepUnlocked(stepNumber);

  if (unlocked) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Lock className="w-7 h-7 text-text-secondary" />
      </div>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
        Step Locked
      </h2>
      <p className="text-text-secondary max-w-sm mb-6">
        Create a project first to unlock all steps.
      </p>
      <button
        onClick={() => router.push("/dashboard/new-project")}
        className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-heading font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Create Project
      </button>
    </motion.div>
  );
}
