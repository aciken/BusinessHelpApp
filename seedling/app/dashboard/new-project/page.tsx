"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Zap,
  Heart,
  Globe,
  BookOpen,
  Camera,
  Music,
  Palette,
  Utensils,
  Dumbbell,
  Briefcase,
  Code,
  Smartphone,
  Leaf,
  Star,
  Gem,
  Flame,
  Sun,
  Moon,
  CloudSun,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";

const iconOptions = [
  { id: "shopping-bag", icon: ShoppingBag, label: "Commerce" },
  { id: "coffee", icon: Coffee, label: "Food & Drink" },
  { id: "zap", icon: Zap, label: "Energy" },
  { id: "heart", icon: Heart, label: "Health" },
  { id: "globe", icon: Globe, label: "Travel" },
  { id: "book-open", icon: BookOpen, label: "Education" },
  { id: "camera", icon: Camera, label: "Media" },
  { id: "music", icon: Music, label: "Music" },
  { id: "palette", icon: Palette, label: "Design" },
  { id: "utensils", icon: Utensils, label: "Restaurant" },
  { id: "dumbbell", icon: Dumbbell, label: "Fitness" },
  { id: "briefcase", icon: Briefcase, label: "Business" },
  { id: "code", icon: Code, label: "Tech" },
  { id: "smartphone", icon: Smartphone, label: "App" },
  { id: "leaf", icon: Leaf, label: "Eco" },
  { id: "star", icon: Star, label: "Lifestyle" },
  { id: "gem", icon: Gem, label: "Luxury" },
  { id: "flame", icon: Flame, label: "Trending" },
  { id: "sun", icon: Sun, label: "Wellness" },
  { id: "moon", icon: Moon, label: "Night" },
  { id: "cloud-sun", icon: CloudSun, label: "Weather" },
  { id: "sprout", icon: Sprout, label: "Growth" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { state, createProject } = useDashboard();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [projectName, setProjectName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Redirect to dashboard if user already has a project
  useEffect(() => {
    if (!state.loading && state.project) {
      router.replace("/dashboard");
    }
  }, [state.loading, state.project, router]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "80vh" }}>
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const goToStep2 = () => {
    if (!projectName.trim()) return;
    setStep(2);
  };

  const goToStep3 = () => {
    if (!businessDescription.trim()) return;
    setStep(3);
  };

  const handleCreate = async () => {
    if (!selectedIcon || isCreating) return;
    setIsCreating(true);
    try {
      await createProject(projectName.trim(), selectedIcon, businessDescription.trim());
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create project:", err);
      setIsCreating(false);
    }
  };

  const stepDone = (n: number) => {
    if (n === 1) return projectName.trim().length > 0;
    if (n === 2) return businessDescription.trim().length > 0;
    return false;
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: step === 2 ? "auto" : "80vh" }}>
      <div className="w-full max-w-2xl py-10">
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === n
                    ? "bg-accent text-white"
                    : stepDone(n)
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                {n}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-colors ${
                    stepDone(n) ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Project Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6">
                <Sprout className="w-8 h-8 text-accent" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
                Name your project
              </h1>
              <p className="text-text-secondary mb-8">
                Give your business idea a working name. You can always change it later.
              </p>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goToStep2()}
                placeholder="e.g., EcoBottle, FitTrack, CloudKitchen..."
                autoFocus
                className="w-full max-w-md mx-auto px-5 py-4 rounded-2xl border-2 border-border bg-white text-lg text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-center font-heading font-medium"
              />

              <div className="mt-8">
                <button
                  onClick={goToStep2}
                  disabled={!projectName.trim()}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-heading font-medium transition-all duration-200 ${
                    projectName.trim()
                      ? "bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Description */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6">
                <Sprout className="w-8 h-8 text-accent" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
                What&apos;s your business about?
              </h1>
              <p className="text-text-secondary mb-8">
                Describe <span className="font-medium text-text-primary">{projectName}</span> in a few sentences.
              </p>

              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="e.g., An eco-friendly water bottle made from recycled ocean plastic with a built-in filter..."
                rows={4}
                autoFocus
                className="w-full max-w-lg mx-auto px-5 py-4 rounded-2xl border-2 border-border bg-white text-base text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              />

              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-text-secondary hover:bg-white hover:border-gray-300 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={goToStep3}
                  disabled={!businessDescription.trim()}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-heading font-medium transition-all duration-200 ${
                    businessDescription.trim()
                      ? "bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pick Icon */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
                Pick an icon
              </h1>
              <p className="text-text-secondary mb-8">
                Choose an icon that represents <span className="font-medium text-text-primary">{projectName}</span>
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-10">
                {iconOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedIcon === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedIcon(opt.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent-muted scale-105 shadow-sm"
                          : "border-transparent bg-white hover:bg-gray-50 hover:border-border"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? "text-accent" : "text-text-secondary"}`} />
                      <span className={`text-[10px] font-medium ${isSelected ? "text-accent-dark" : "text-text-secondary"}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-text-secondary hover:bg-white hover:border-gray-300 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!selectedIcon || isCreating}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-heading font-medium transition-all duration-200 ${
                    selectedIcon && !isCreating
                      ? "bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isCreating ? "Creating..." : "Create Project"}
                  {!isCreating && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
