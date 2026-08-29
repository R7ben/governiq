import { describe, expect, it } from "vitest";
import { generateInstantMemo } from "@/lib/memo";
import { Company } from "@/types/company";

const company: Company = {
  code: "1155", name: "Maybank", sector: "Financial Services", score: 82, trend: -3.2, riskLevel: "low",
  constructs: { bl_score: 88, sv_score: 85, ei_score: 82, rm_score: 80, rt_score: 72, se_score: 84, so_score: 83 },
  events: [], interventions: [{ priority: "medium", title: "Enhance remuneration disclosure", explanation: "Publish peer benchmarking.", impact: "+1.5 pts", construct: "RT" }],
};

describe("instant IR memo", () => {
  it("creates a copy-ready board memo without a network request", () => {
    const memo = generateInstantMemo(company, company.interventions[0]);
    expect(memo).toContain("IR BOARD MEMO");
    expect(memo).toContain("Maybank (1155)");
    expect(memo).toContain("Enhance remuneration disclosure");
    expect(memo).toContain("decision support");
    expect(memo.length).toBeGreaterThan(500);
  });
});
