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
  construct: string; // e.g. "BL", "SV", "EI", "RM", "RT", "SE", "SO"
}

export interface ConstructScores {
  bl_score: number; // Board Leadership
  sv_score: number; // Strategic Vision
  ei_score: number; // Ethical Integrity
  rm_score: number; // Risk Management
  rt_score: number; // Remuneration Transparency
  se_score: number; // Stakeholder Engagement
  so_score: number; // Sustainability Orientation
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
