"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  getProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  Project,
} from "@/lib/api";

export interface StepData {
  [key: string]: unknown;
}

export interface ProjectData {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
  currentStep: number;
}

export interface DashboardState {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  project: ProjectData | null;
  steps: {
    idea: StepData;
    market: StepData;
    product: StepData;
    plan: StepData;
    marketing: StepData;
    launch: StepData;
  };
  completedSteps: number[];
  loading: boolean;
}

interface DashboardContextType {
  state: DashboardState;
  updateStepData: (step: keyof DashboardState["steps"], data: StepData) => void;
  markStepCompleted: (stepNumber: number) => void;
  getStepCompletion: (step: keyof DashboardState["steps"]) => number;
  isStepUnlocked: (stepNumber: number) => boolean;
  createProject: (name: string, icon: string, description: string) => Promise<void>;
}

const initialState: DashboardState = {
  user: {
    _id: "",
    name: "",
    email: "",
    avatar: null,
  },
  project: null,
  steps: {
    idea: {},
    market: {},
    product: {},
    plan: {},
    marketing: {},
    launch: {},
  },
  completedSteps: [],
  loading: true,
};

const DashboardContext = createContext<DashboardContextType | null>(null);

function loadProjectFromApi(p: Project): {
  project: ProjectData;
  steps: DashboardState["steps"];
  completedSteps: number[];
} {
  return {
    project: {
      _id: p._id,
      name: p.name,
      icon: p.icon,
      createdAt: p.createdAt,
      currentStep: p.currentStep,
    },
    steps: {
      idea: (p.steps?.idea as StepData) || {},
      market: (p.steps?.market as StepData) || {},
      product: (p.steps?.product as StepData) || {},
      plan: (p.steps?.plan as StepData) || {},
      marketing: (p.steps?.marketing as StepData) || {},
      launch: (p.steps?.launch as StepData) || {},
    },
    completedSteps: p.completedSteps || [],
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);

  // Load user from localStorage and fetch their projects
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      const user = JSON.parse(stored);
      setState((prev) => ({
        ...prev,
        user: { _id: user._id, name: user.name, email: user.email, avatar: null },
      }));

      getProjects(user._id)
        .then((projects) => {
          if (projects.length > 0) {
            const p = projects[0]; // use most recent project
            const loaded = loadProjectFromApi(p);
            setState((prev) => ({
              ...prev,
              project: loaded.project,
              steps: loaded.steps,
              completedSteps: loaded.completedSteps,
              loading: false,
            }));
          } else {
            setState((prev) => ({ ...prev, loading: false }));
          }
        })
        .catch(() => {
          setState((prev) => ({ ...prev, loading: false }));
        });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const updateStepData = useCallback(
    (step: keyof DashboardState["steps"], data: StepData) => {
      setState((prev) => {
        const newState = {
          ...prev,
          steps: {
            ...prev.steps,
            [step]: { ...prev.steps[step], ...data },
          },
        };

        // Persist to backend
        if (prev.project?._id) {
          apiUpdateProject({ projectId: prev.project._id, step, data }).catch(console.error);
        }

        return newState;
      });
    },
    []
  );

  const markStepCompleted = useCallback((stepNumber: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        completedSteps: prev.completedSteps.includes(stepNumber)
          ? prev.completedSteps
          : [...prev.completedSteps, stepNumber],
        project: prev.project
          ? { ...prev.project, currentStep: Math.max(prev.project.currentStep, stepNumber + 1) }
          : prev.project,
      };

      // Persist to backend
      if (prev.project?._id) {
        apiUpdateProject({ projectId: prev.project._id, completedStep: stepNumber }).catch(console.error);
      }

      return newState;
    });
  }, []);

  const getStepCompletion = useCallback(
    (step: keyof DashboardState["steps"]) => {
      const data = state.steps[step];
      const fields = Object.values(data);
      if (fields.length === 0) return 0;
      const filled = fields.filter((v) => {
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "string") return v.trim().length > 0;
        if (typeof v === "number") return v > 0;
        return !!v;
      });
      return Math.round((filled.length / fields.length) * 100);
    },
    [state.steps]
  );

  const isStepUnlocked = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (stepNumber: number) => {
      return state.project !== null;
    },
    [state.project]
  );

  const createProject = useCallback(
    async (name: string, icon: string, description: string) => {
      let userId = state.user._id;

      // Fallback: read from localStorage if state hasn't hydrated yet
      if (!userId) {
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            userId = JSON.parse(stored)._id;
          }
        } catch {
          // ignore
        }
      }

      if (!userId) throw new Error("No user ID found. Please sign in again.");

      const project = await apiCreateProject({ userId, name, description, icon });
      const loaded = loadProjectFromApi(project);

      setState((prev) => ({
        ...prev,
        project: loaded.project,
        steps: loaded.steps,
        completedSteps: loaded.completedSteps,
      }));
    },
    [state.user._id]
  );

  return (
    <DashboardContext.Provider
      value={{ state, updateStepData, markStepCompleted, getStepCompletion, isStepUnlocked, createProject }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
