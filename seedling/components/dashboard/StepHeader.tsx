"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
  completionPercent: number;
  estimatedTime?: string;
}

export default function StepHeader({
  stepNumber,
  title,
  description,
  completionPercent,
  estimatedTime = "~10 minutes",
}: StepHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
            <span className="text-lg font-bold text-white">{stepNumber}</span>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">{title}</h1>
            <p className="text-text-secondary mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4" />
          <span>{estimatedTime}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Step Progress</span>
          <span className="text-sm font-semibold text-accent">{completionPercent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
