import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Readiness Review | GovernIQ",
  description: "Answer 20 plain-language governance questions and get a private maturity readout with strengths, gaps, and 90-day next actions.",
};

export default function ReadinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
