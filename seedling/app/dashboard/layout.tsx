"use client";

import { useState } from "react";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { ToastProvider } from "@/components/dashboard/Toast";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <DashboardProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-warm-gray">
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
          <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
            <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
            <main className="flex-1 p-4 sm:p-6 lg:p-10">
              <div className="max-w-[960px] mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </DashboardProvider>
  );
}
