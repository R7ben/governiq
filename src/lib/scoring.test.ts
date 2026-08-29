import { describe, expect, it } from "vitest";
import { constructScoresFromResponses, maturityToScore, overallScore, rankedGaps, rankedMarketGaps, scoreToStatus, weakestConstruct } from "@/lib/scoring";

describe("benchmark scoring", () => {
  it("maps maturity responses from 1–5 to 0–100", () => {
    expect(maturityToScore(1)).toBe(0);
    expect(maturityToScore(3)).toBe(50);
    expect(maturityToScore(5)).toBe(100);
  });
  it("classifies status at documented thresholds", () => {
    expect(scoreToStatus(49)).toBe("Critical");
    expect(scoreToStatus(50)).toBe("Watch");
    expect(scoreToStatus(75)).toBe("Strong");
  });
  it("averages seven constructs into an overall score", () => {
    const scores = { bl_score: 80, sv_score: 80, ei_score: 80, rm_score: 80, rt_score: 80, se_score: 80, so_score: 80 };
    expect(overallScore(scores)).toBe(80);
    expect(weakestConstruct({ ...scores, rt_score: 20 }).label).toBe("Remuneration Transparency");
  });
  it("ranks benchmark gaps from largest to smallest", () => {
    const gaps = rankedGaps({ bl_score: 60, sv_score: 60, ei_score: 63, rm_score: 59, rt_score: 20, se_score: 61, so_score: 57 });
    expect(gaps[0].key).toBe("rt_score");
  });
  it("calculates signed market gaps and sorts the largest shortfall first", () => {
    const gaps = rankedMarketGaps([
      { constructs: { bl_score: 50, sv_score: 60, ei_score: 63, rm_score: 59, rt_score: 40, se_score: 61, so_score: 57 } },
      { constructs: { bl_score: 70, sv_score: 60, ei_score: 63, rm_score: 59, rt_score: 50, se_score: 61, so_score: 57 } },
    ]);
    expect(gaps[0]).toMatchObject({ key: "rt_score", gap: -3 });
    expect(gaps.find((gap) => gap.key === "bl_score")?.gap).toBe(0);
  });
  it("aggregates readiness responses by construct", () => {
    const scores = constructScoresFromResponses({ a: 1, b: 5 }, [{ id: "a", construct: "BL" }, { id: "b", construct: "BL" }]);
    expect(scores.bl_score).toBe(50);
  });
});
