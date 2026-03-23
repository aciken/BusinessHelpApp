"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertTriangle, X } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useToast } from "@/components/dashboard/Toast";

export default function SettingsPage() {
  const { state } = useDashboard();
  const { showToast } = useToast();

  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [progressNotifs, setProgressNotifs] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-white rounded-2xl border border-border-light shadow-sm p-6 lg:p-8"
      >
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-6">Profile</h2>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <button className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <button
              onClick={() => showToast("Profile updated")}
              className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-heading font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl border border-border-light shadow-sm p-6 lg:p-8"
      >
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-6">Password</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <button
            onClick={() => showToast("Password updated")}
            className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-heading font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Update Password
          </button>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded-2xl border border-border-light shadow-sm p-6 lg:p-8"
      >
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-6">Preferences</h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Dark Mode</p>
              <p className="text-xs text-text-secondary">Switch to dark theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                darkMode ? "bg-accent" : "bg-gray-200"
              }`}
            >
              <motion.div
                animate={{ x: darkMode ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
              />
            </button>
          </div>
          <div className="border-t border-border-light" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Email Notifications</p>
              <p className="text-xs text-text-secondary">Receive updates via email</p>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                emailNotifs ? "bg-accent" : "bg-gray-200"
              }`}
            >
              <motion.div
                animate={{ x: emailNotifs ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
              />
            </button>
          </div>
          <div className="border-t border-border-light" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Progress Reminders</p>
              <p className="text-xs text-text-secondary">Get nudged to continue building</p>
            </div>
            <button
              onClick={() => setProgressNotifs(!progressNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                progressNotifs ? "bg-accent" : "bg-gray-200"
              }`}
            >
              <motion.div
                animate={{ x: progressNotifs ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 lg:p-8"
      >
        <h2 className="text-lg font-heading font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-text-secondary mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-2.5 rounded-full border-2 border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition-all"
        >
          Delete Account
        </button>
      </motion.div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Delete Account?
                  </h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                This action cannot be undone. All your data, projects, and progress will be
                permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    showToast("Account deletion is not available in demo mode", "error");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
