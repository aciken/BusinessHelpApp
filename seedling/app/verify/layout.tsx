import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Email — Seedling",
  description: "Enter the verification code sent to your email to activate your Seedling account.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
