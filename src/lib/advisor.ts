import { BENCHMARK_AVERAGES, CONSTRUCT_LABELS, CONSTRUCT_KEYS, Company } from "@/types/company";

export type AdvisorAnswer = {
  headline: string;
  points: string[];
  evidence: string[];
  disclaimer: string;
};

const normalized = (question: string) => question.trim().toLowerCase();

function weakestConstructs(company: Company) {
  return [...CONSTRUCT_KEYS]
    .sort((a, b) => company.constructs[a] - company.constructs[b])
    .slice(0, 2);
}

export function generateFallbackAdvisor(question: string, company: Company): AdvisorAnswer {
  const q = normalized(question);
  const weak = weakestConstructs(company);
  const weakLabels = weak.map((key) => `${CONSTRUCT_LABELS[key]} (${company.constructs[key]}/100; market ${BENCHMARK_AVERAGES[key]}/100)`);
  const evidence = company.events.slice(0, 2).map((event) => `${event.title}: ${event.description}`);
  const recommendations = company.interventions.slice(0, 3).map((item) => `${item.title} — ${item.explanation} (${item.impact})`);

  if (q.includes("needs attention") || q.includes("first")) {
    return {
      headline: `Start with ${CONSTRUCT_LABELS[weak[0]]}`,
      points: [
        `Prioritise ${weakLabels[0]} because it is the largest available construct gap.`,
        `Review ${weakLabels[1]} next and assign one accountable owner for the first 30 days.`,
        "Use the evidence timeline to confirm whether the gap reflects disclosure, process maturity, or an unresolved governance issue.",
      ],
      evidence,
      disclaimer: "Decision support only—not investment, legal, or compliance advice.",
    };
  }

  if (q.includes("explains") || q.includes("score")) {
    return {
      headline: `${company.name}'s score is ${company.score}/100`,
      points: [
        `The strongest available signals are ${CONSTRUCT_LABELS[CONSTRUCT_KEYS.reduce((best, key) => company.constructs[key] > company.constructs[best] ? key : best, CONSTRUCT_KEYS[0])]} and the overall seven-construct profile.`,
        `The main downward pressure comes from ${weakLabels.join(" and ")}.`,
        `The recent change is ${company.trend > 0 ? "+" : ""}${company.trend} points; treat it as a simulated trajectory in this preview, not a verified time series.`,
      ],
      evidence,
      disclaimer: "Decision support only—not investment, legal, or compliance advice.",
    };
  }

  if (q.includes("action") || q.includes("next")) {
    return {
      headline: "Take the highest-impact governance action next",
      points: [
        ...(recommendations.length ? recommendations : ["Review the lowest construct with the board or management team and define a measurable 30-day owner and outcome."]),
        "Assign an accountable owner and set a 30-day evidence checkpoint to confirm whether the intervention is improving the signal.",
      ],
      evidence,
      disclaimer: "Decision support only—not investment, legal, or compliance advice.",
    };
  }

  return {
    headline: "A focused governance starting point",
    points: [
      `Investigate ${weakLabels[0]} first, then compare the result with the evidence timeline.`,
      "Ask which primary document, owner, or control would validate the signal.",
      "Choose one intervention with a measurable 30-day outcome before expanding the review.",
    ],
    evidence,
    disclaimer: "Decision support only—not investment, legal, or compliance advice.",
  };
}

export function formatAdvisorAnswer(answer: AdvisorAnswer) {
  return `## ${answer.headline}\n\n${answer.points.map((point) => `- ${point}`).join("\n")}\n\n**Company evidence**\n${answer.evidence.length ? answer.evidence.map((item) => `- ${item}`).join("\n") : "- No evidence timeline is available."}\n\n_${answer.disclaimer}_`;
}
