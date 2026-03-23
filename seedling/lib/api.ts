import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface User {
  _id: string;
  name: string;
  email: string;
  verification: number | string;
  accountType?: string;
  dateCreated: string;
}

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.put<User>("/signup", {
    ...data,
    accountType: "standard",
  });
  return res.data;
}

export async function signIn(data: { email: string; password: string }) {
  const res = await api.post<User>("/signin", data);
  return res.data;
}

export async function verifyEmail(data: {
  email: string;
  verificationCode: string;
}) {
  const res = await api.put<User>("/verify", data);
  return res.data;
}

// Projects

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  currentStep: number;
  completedSteps: number[];
  steps: {
    idea: Record<string, unknown>;
    market: Record<string, unknown>;
    product: Record<string, unknown>;
    plan: Record<string, unknown>;
    marketing: Record<string, unknown>;
    launch: Record<string, unknown>;
  };
  createdAt: string;
}

export async function createProject(data: {
  userId: string;
  name: string;
  description: string;
  icon: string;
}) {
  const res = await api.post<Project>("/projects/create", data);
  return res.data;
}

export async function getProjects(userId: string) {
  const res = await api.get<Project[]>("/projects", { params: { userId } });
  return res.data;
}

export async function updateProject(data: {
  projectId: string;
  step?: string;
  data?: Record<string, unknown>;
  completedStep?: number;
}) {
  const res = await api.put<Project>("/projects/update", data);
  return res.data;
}

export default api;
