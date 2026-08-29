import { describe, expect, it } from "vitest";
import { generateFallbackAdvisor } from "@/lib/advisor";
import { Company } from "@/types/company";

const company: Company = {
  code: "1155",
  name: "Maybank",
  sector: "Financial Services",
  score: 82,
  trend: -3.2,
  riskLevel: "low",
  constructs: { bl_score: 88, sv_score: 85, ei_score: 82, rm_score: 80, rt_score: 72, se_score: 84, so_score: 83 },
  events: [{ date: "2026-08-10", title: "Board review", description: "Independent director review completed." }],
  interventions: [{ priority: "medium", title: "Enhance remuneration disclosure", explanation: "Publish peer benchmarking.", impact: "+1.5 pts", construct: "RT" }],
};

describe("generateFallbackAdvisor", () => {
  it.each([
    ["What needs attention first?", "Start with Remuneration Transparency"],
    ["What explains this score?", "Maybank's score is 82/100"],
    ["What action should we take next?", "Take the highest-impact governance action next"],
  ])("answers %s locally", (question, headline) => {
    const answer = generateFallbackAdvisor(question, company);
    expect(answer.headline).toBe(headline);
    expect(answer.points.length).toBeGreaterThanOrEqual(2);
    expect(answer.disclaimer).toContain("Decision support only");
  });
});
