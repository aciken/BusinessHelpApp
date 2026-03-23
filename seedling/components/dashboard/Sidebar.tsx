"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  BarChart3,
  Package,
  FileText,
  Megaphone,
  Rocket,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
  Check,
  X,
  Lock,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";

const steps = [
  { num: 1, name: "Market Validation", icon: BarChart3, href: "/dashboard/market", key: "market" },
  { num: 2, name: "Define Product", icon: Package, href: "/dashboard/product", key: "product" },
  { num: 3, name: "Business Plan", icon: FileText, href: "/dashboard/plan", key: "plan" },
  { num: 4, name: "Marketing Strategy", icon: Megaphone, href: "/dashboard/marketing", key: "marketing" },
  { num: 5, name: "Launch & Grow", icon: Rocket, href: "/dashboard/launch", key: "launch" },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { state, getStepCompletion, isStepUnlocked } = useDashboard();
  const projectRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = state.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-light">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onMobileClose}>
          <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
            <Sprout className="w-5 h-5 text-accent" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-xl text-accent">Seedling</span>
          )}
        </Link>
      </div>

      {/* Project Selector */}
      {state.project && (
      <div className="px-3 py-3 border-b border-border-light" ref={projectRef}>
        <button
          onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-accent">{state.project.name[0]?.toUpperCase()}</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {state.project.name}
                </p>
                <p className="text-xs text-text-secondary">Active project</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-text-secondary transition-transform ${
                  projectDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>
        <AnimatePresence>
          {projectDropdownOpen && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
            >
              <div className="p-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent-muted">
                  <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-accent">{state.project.name[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{state.project.name}</span>
                  <Check className="w-4 h-4 text-accent ml-auto" />
                </div>
                <div className="my-1 border-t border-border-light" />
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-text-secondary" />
                  </div>
                  <span className="text-sm text-text-secondary">New Project</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* Steps Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-3 mb-3 text-[11px] font-semibold tracking-wider text-text-secondary/70 uppercase">
            Business Steps
          </p>
        )}
        <nav className="space-y-1 relative">
          {/* Progress track line */}
          {!collapsed && (
            <div className="absolute left-[26px] top-4 bottom-4 w-[2px] bg-border-light rounded-full" />
          )}
          {steps.map((step) => {
            const unlocked = isStepUnlocked(step.num);
            const isActive = pathname === step.href;
            const isCompleted = state.completedSteps.includes(step.num);
            const isCurrent = state.project?.currentStep === step.num && unlocked;
            const completion = getStepCompletion(step.key as "idea" | "market" | "product" | "plan" | "marketing" | "launch");
            const Icon = step.icon;

            if (!unlocked) {
              return (
                <div
                  key={step.num}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-40 cursor-not-allowed ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border-2 border-border-light text-text-secondary">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-text-secondary">{step.name}</p>
                      <p className="text-[11px] text-text-secondary">Locked</p>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={step.num}
                href={step.href}
                onClick={onMobileClose}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-accent-muted border-l-[3px] border-accent text-accent-dark"
                    : "hover:bg-gray-50 text-text-secondary hover:text-text-primary"
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                {/* Step circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-accent text-white"
                      : isCurrent || isActive
                      ? "bg-white border-2 border-accent text-accent"
                      : "bg-white border-2 border-border text-text-secondary group-hover:border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isActive ? "text-accent-dark" : ""
                        }`}
                      >
                        {step.name}
                      </p>
                      {(isCurrent || isCompleted) && (
                        <p className="text-[11px] text-text-secondary">
                          {isCompleted ? "Completed" : `${completion}% complete`}
                        </p>
                      )}
                    </div>
                    {isCompleted && (
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="border-t border-border-light px-3 py-3 space-y-2">
        {/* Account */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {state.user.name}
                </p>
                <p className="text-xs text-text-secondary truncate">{state.user.email}</p>
              </div>
            )}
          </button>
          <AnimatePresence>
            {accountDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={`absolute bottom-full mb-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50 ${
                  collapsed ? "left-0 w-48" : "left-0 right-0"
                }`}
              >
                <div className="p-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      onMobileClose();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-primary">Settings</span>
                  </Link>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full">
                    <HelpCircle className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm text-text-primary">Help</span>
                  </button>
                  <div className="my-1 border-t border-border-light" />
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">Sign Out</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-text-secondary hover:text-text-primary"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-white border-r border-border h-screen fixed left-0 top-0 z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-[280px] h-screen bg-white z-50 lg:hidden shadow-2xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
