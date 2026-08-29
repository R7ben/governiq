import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

const MAX_TEXT = 180;
const ADVISOR_MODEL = process.env.GROQ_ADVISOR_MODEL || "llama-3.1-8b-instant";

const text = (value: unknown) => typeof value === "string" ? value.trim().slice(0, MAX_TEXT) : "";
const score = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
const trendScore = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? Math.max(-100, Math.min(100, value)) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = text(body.question);
    const companyName = text(body.companyName);
    const code = text(body.code);
    const sector = text(body.sector);
    const overallScore = score(body.score);
    const trend = trendScore(body.trend);
    const constructs = body.constructs && typeof body.constructs === "object" ? body.constructs as Record<string, unknown> : null;
    const events = Array.isArray(body.events) ? body.events.slice(0, 6).map((event: unknown) => {
      const item = event && typeof event === "object" ? event as Record<string, unknown> : {};
      return `${text(item.title)}: ${text(item.description)}`;
    }).filter(Boolean) : [];
    const interventions = Array.isArray(body.interventions) ? body.interventions.slice(0, 3).map((item: unknown) => {
      const intervention = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return `${text(intervention.title)} (${text(intervention.impact)}): ${text(intervention.explanation)}`;
    }).filter(Boolean) : [];

    if (!question || !companyName || !code || overallScore === null || trend === null) {
      return Response.json({ error: "Please provide a focused question and valid company context." }, { status: 400 });
    }

    const constructContext = constructs ? Object.entries({
      bl_score: "Board Leadership",
      sv_score: "Strategic Vision",
      ei_score: "Ethical Integrity",
      rm_score: "Risk Management",
      rt_score: "Remuneration Transparency",
      se_score: "Stakeholder Engagement",
      so_score: "Sustainability Orientation",
    }).map(([key, label]) => `${label}: ${score(constructs[key]) ?? 0}/100`).join("; ") : "Unavailable";

    const result = streamText({
      model: groq(ADVISOR_MODEL),
      maxOutputTokens: 160,
      temperature: 0.2,
      system: "You are GovernIQ Advisor. Answer one governance question at a time. Be direct, practical, and concise (under 120 words). Use the supplied metrics only as illustrative signals, never as certification, legal advice, or investment advice. If evidence is incomplete, say so and ask one useful follow-up question.",
      prompt: `Question: ${question}\nCompany: ${companyName} (${code}), ${sector || "sector not specified"}. Overall score: ${overallScore}/100. 30-day trend: ${trend} points. Constructs: ${constructContext}\nEvidence timeline: ${events.join(" | ") || "Unavailable"}\nInterventions: ${interventions.join(" | ") || "Unavailable"}`,
    });

    const response = result.toTextStreamResponse();
    response.headers.set("Cache-Control", "no-cache, no-transform");
    response.headers.set("X-Accel-Buffering", "no");
    return response;
  } catch (error) {
    console.error("advisor route failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "The advisor is unavailable right now." }, { status: 500 });
  }
}
