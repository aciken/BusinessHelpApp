"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  aiButton?: ReactNode;
  delay?: number;
}

export default function FormSection({
  title,
  description,
  children,
  aiButton,
  delay = 0,
}: FormSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 + delay * 0.1 }}
      className="bg-white rounded-2xl border border-border-light shadow-sm p-6 lg:p-8"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-heading font-semibold text-text-primary">{title}</h2>
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
        {aiButton}
      </div>
      {children}
    </motion.div>
  );
}
