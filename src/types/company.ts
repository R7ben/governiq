export interface GovernanceEvent {
  date: string;
  title: string;
  description: string;
}

export interface Intervention {
  priority: "high" | "medium" | "low";
  title: string;
  explanation: string;
  impact: string;
  construct: string;
}

export interface ConstructScores {
  bl_score: number;
  sv_score: number;
  ei_score: number;
  rm_score: number;
  rt_score: number;
  se_score: number;
  so_score: number;
}

export type MaturityStatus = "Critical" | "Watch" | "Strong";
export type OrganisationPathway = "Listed PLC" | "Aspiring PLC" | "SME" | "Microenterprise";

export interface EvidenceNote {
  label: string;
  detail: string;
}

export interface Company {
  code: string;
  name: string;
  sector: string;
  score: number;
  trend: number;
  riskLevel: "high" | "medium" | "low";
  constructs: ConstructScores;
  events: GovernanceEvent[];
  interventions: Intervention[];
  organisationType?: OrganisationPathway;
  evidenceNotes?: EvidenceNote[];
}

export interface ReadinessStatement {
  id: string;
  construct: string;
  statement: string;
}

export const CONSTRUCT_LABELS: Record<string, string> = {
  bl_score: "Board Leadership",
  sv_score: "Strategic Vision",
  ei_score: "Ethical Integrity",
  rm_score: "Risk Management",
  rt_score: "Remuneration Transparency",
  se_score: "Stakeholder Engagement",
  so_score: "Sustainability Orientation",
};

export const CONSTRUCT_CODES: Record<string, string> = {
  bl_score: "BL",
  sv_score: "SV",
  ei_score: "EI",
  rm_score: "RM",
  rt_score: "RT",
  se_score: "SE",
  so_score: "SO",
};

export const CONSTRUCT_KEYS = Object.keys(CONSTRUCT_LABELS) as (keyof ConstructScores)[];

export const READINESS_STATEMENTS: ReadinessStatement[] = [
  { id: "bl-1", construct: "BL", statement: "Our board has clear role separation, skills coverage, and an active succession plan." },
  { id: "bl-2", construct: "BL", statement: "Board decisions are supported by independent challenge and documented oversight." },
  { id: "bl-3", construct: "BL", statement: "The board regularly evaluates its effectiveness and acts on the findings." },
  { id: "sv-1", construct: "SV", statement: "Our organisation has a clear strategy with measurable outcomes and accountable owners." },
  { id: "sv-2", construct: "SV", statement: "Capital allocation and major decisions are connected to long-term value creation." },
  { id: "sv-3", construct: "SV", statement: "Strategic risks and opportunities are reviewed alongside performance." },
  { id: "ei-1", construct: "EI", statement: "Our code of conduct is understood, monitored, and reinforced by leadership." },
  { id: "ei-2", construct: "EI", statement: "Speak-up channels protect confidentiality and support non-retaliation." },
  { id: "ei-3", construct: "EI", statement: "Conflicts of interest and related-party matters are transparently managed." },
  { id: "rm-1", construct: "RM", statement: "Material risks have named owners, thresholds, controls, and escalation paths." },
  { id: "rm-2", construct: "RM", statement: "Internal controls are tested and improvements are tracked to closure." },
  { id: "rm-3", construct: "RM", statement: "The board receives decision-useful risk reporting at an appropriate cadence." },
  { id: "rt-1", construct: "RT", statement: "Executive pay principles are aligned with strategy, risk, and sustainable outcomes." },
  { id: "rt-2", construct: "RT", statement: "Remuneration outcomes and performance measures are clearly disclosed." },
  { id: "rt-3", construct: "RT", statement: "Clawback, malus, and incentive safeguards are understood and actionable." },
  { id: "se-1", construct: "SE", statement: "We identify material stakeholder groups and maintain meaningful engagement channels." },
  { id: "se-2", construct: "SE", statement: "Stakeholder feedback informs decisions and is reported back transparently." },
  { id: "se-3", construct: "SE", statement: "Customer, workforce, and community concerns are monitored as governance signals." },
  { id: "so-1", construct: "SO", statement: "Sustainability priorities are embedded in governance, strategy, and risk processes." },
  { id: "so-2", construct: "SO", statement: "Material sustainability metrics have owners, baselines, and improvement targets." },
];

export const BENCHMARK_AVERAGES: Record<keyof ConstructScores, number> = {
  bl_score: 60, sv_score: 60, ei_score: 63, rm_score: 59, rt_score: 48, se_score: 61, so_score: 57,
};
