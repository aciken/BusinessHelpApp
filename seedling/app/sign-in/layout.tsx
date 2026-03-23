import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Seedling",
  description: "Sign in to your Seedling account and continue building your business.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
