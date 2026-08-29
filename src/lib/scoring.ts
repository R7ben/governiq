import { BENCHMARK_AVERAGES, CONSTRUCT_CODES, CONSTRUCT_KEYS, CONSTRUCT_LABELS, Company, ConstructScores, MaturityStatus } from "@/types/company";

export function maturityFromResponse(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value)));
}

export function maturityToScore(value: number): number {
  return Math.round(((maturityFromResponse(value) - 1) / 4) * 100);
}

export function scoreToStatus(score: number): MaturityStatus {
  if (score < 50) return "Critical";
  if (score < 75) return "Watch";
  return "Strong";
}

export function overallScore(scores: ConstructScores): number {
  return Math.round(CONSTRUCT_KEYS.reduce((sum, key) => sum + scores[key], 0) / CONSTRUCT_KEYS.length);
}

export function weakestConstruct(scores: ConstructScores): { key: keyof ConstructScores; label: string; score: number } {
  const key = CONSTRUCT_KEYS.reduce((weakest, current) => scores[current] < scores[weakest] ? current : weakest, CONSTRUCT_KEYS[0]);
  return { key, label: CONSTRUCT_LABELS[key], score: scores[key] };
}

export function rankedGaps(scores: ConstructScores) {
  return CONSTRUCT_KEYS.map((key) => ({
    key,
    code: key.slice(0, 2).toUpperCase(),
    label: CONSTRUCT_LABELS[key],
    score: scores[key],
    benchmark: BENCHMARK_AVERAGES[key],
    gap: Math.max(0, BENCHMARK_AVERAGES[key] - scores[key]),
  })).sort((a, b) => b.gap - a.gap);
}

export function rankedMarketGaps(companies: Pick<Company, "constructs">[]) {
  return CONSTRUCT_KEYS.map((key) => {
    const marketAverage = companies.length ? companies.reduce((sum, company) => sum + company.constructs[key], 0) / companies.length : 0;
    return {
      key,
      code: CONSTRUCT_CODES[key],
      label: CONSTRUCT_LABELS[key],
      score: Math.round(marketAverage * 10) / 10,
      benchmark: BENCHMARK_AVERAGES[key],
      gap: Math.round((marketAverage - BENCHMARK_AVERAGES[key]) * 10) / 10,
    };
  }).sort((a, b) => a.gap - b.gap);
}

export function constructScoresFromResponses(responses: Record<string, number>, statements: { id: string; construct: string }[]) {
  const groups: Record<string, number[]> = {};
  for (const statement of statements) {
    const value = responses[statement.id];
    if (typeof value === "number") (groups[statement.construct] ??= []).push(maturityToScore(value));
  }
  const result = {} as ConstructScores;
  for (const [key, code] of Object.entries({ bl_score: "BL", sv_score: "SV", ei_score: "EI", rm_score: "RM", rt_score: "RT", se_score: "SE", so_score: "SO" })) {
    const values = groups[code] ?? [];
    result[key as keyof ConstructScores] = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  }
  return result;
}
