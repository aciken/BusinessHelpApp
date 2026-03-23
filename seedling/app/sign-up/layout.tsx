import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — Seedling",
  description: "Create your Seedling account and start turning your idea into a business.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
