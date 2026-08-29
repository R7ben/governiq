"use client";

import { AiAdvisorTab } from "@/components/ai-advisor-tab";
import type { Company, ConstructScores } from "@/types/company";

type ReadinessAdvisorProps = {
  organisation: string;
  industry: string;
  score: number;
  constructs: ConstructScores;
  gaps: Array<{ label: string; score: number; gap: number }>;
};

export function ReadinessAdvisor({ organisation, industry, score, constructs, gaps }: ReadinessAdvisorProps) {
  const company: Company = {
    code: "SESSION",
    name: organisation || "Your organisation",
    sector: industry || "Organisation",
    score,
    trend: 0,
    riskLevel: score < 50 ? "high" : score < 75 ? "medium" : "low",
    constructs,
    events: [],
    interventions: gaps.slice(0, 3).map((gap) => ({
      priority: gap.gap >= 25 ? "high" : gap.gap >= 10 ? "medium" : "low",
      title: `Strengthen ${gap.label}`,
      explanation: `Define one accountable owner and a measurable improvement checkpoint for ${gap.label.toLowerCase()}.`,
      impact: `${Math.max(1, Math.round(gap.gap / 10))} pts`,
      construct: gap.label.slice(0, 2).toUpperCase(),
    })),
  };

  return <section className="mt-6" aria-labelledby="readiness-advisor-heading">
    <div className="mb-3"><p className="text-xs uppercase tracking-[0.18em] text-emerald-400">Session companion</p><h2 id="readiness-advisor-heading" className="mt-1 text-xl font-semibold">Ask your AI Advisor</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">Use your readiness answers to ask one focused question and get an immediate, session-only starting point for the next governance conversation.</p></div>
    <AiAdvisorTab company={company} />
  </section>;
}
