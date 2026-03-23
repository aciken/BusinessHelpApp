"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Crown } from "lucide-react";
import { useDashboard } from "./DashboardContext";

const stepNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/new-project": "New Project",
  "/dashboard/market": "Market Validation",
  "/dashboard/product": "Define Product",
  "/dashboard/plan": "Business Plan",
  "/dashboard/marketing": "Marketing Strategy",
  "/dashboard/launch": "Launch & Grow",
  "/dashboard/settings": "Settings",
};

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { state } = useDashboard();

  const currentPage = stepNames[pathname] || "Dashboard";
  const initials = state.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Dashboard</span>
          {currentPage !== "Overview" && (
            <>
              <span className="text-text-secondary">/</span>
              <span className="font-medium text-text-primary">{currentPage}</span>
            </>
          )}
        </nav>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 text-accent text-sm font-medium hover:bg-accent-muted transition-colors">
          <Crown className="w-3.5 h-3.5" />
          <span>Upgrade to Pro</span>
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center ml-1">
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
      </div>
    </header>
  );
}
