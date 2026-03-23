"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIGenerateButtonProps {
  onGenerate: () => void;
  label?: string;
}

export default function AIGenerateButton({
  onGenerate,
  label = "Generate with AI",
}: AIGenerateButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = () => {
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => {
      onGenerate();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 1500);
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${
        status === "done"
          ? "bg-accent/10 text-accent border border-accent/30"
          : status === "loading"
          ? "bg-gray-50 text-text-secondary border border-border cursor-wait"
          : "bg-accent-muted text-accent-dark border border-accent/20 hover:bg-accent-light hover:border-accent/40 hover:shadow-sm"
      }`}
    >
      <AnimatePresence mode="wait">
        {status === "loading" ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.span>
        ) : status === "done" ? (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Check className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
      <span>
        {status === "loading"
          ? "Generating..."
          : status === "done"
          ? "Generated!"
          : label}
      </span>
    </button>
  );
}
