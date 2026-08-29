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

    const CONSTRUCT_LABELS: Record<string, string> = {
      bl_score: "Board Leadership",
      sv_score: "Strategic Vision",
      ei_score: "Ethical Integrity",
      rm_score: "Risk Management",
      rt_score: "Remuneration Transparency",
      se_score: "Stakeholder Engagement",
      so_score: "Sustainability Orientation",
    };
    const constructScores = constructs ? Object.entries(CONSTRUCT_LABELS).map(([key, label]) => ({ label, value: score(constructs[key]) ?? 0 })) : [];
    const constructContext = constructScores.length ? constructScores.map((c) => `${c.label}: ${c.value}/100`).join("; ") : "Unavailable";
    const weakest = constructScores.length ? [...constructScores].sort((a, b) => a.value - b.value)[0] : null;

    const result = streamText({
      model: groq(ADVISOR_MODEL),
      maxOutputTokens: 220,
      temperature: 0.2,
      system: "You are GovernIQ Advisor, a governance intelligence assistant. Answer one governance question at a time using the supplied company signals. Format the entire response as markdown: a single `## ` headline line, then 2-4 concise bullet points (`- `) with the most decision-relevant guidance, then one italicized disclaimer line (`_..._`) noting this is illustrative decision support, not certification, legal, or investment advice. Be direct and practical, under 130 words total. Prioritize the weakest signal when it is relevant to the question. If evidence is incomplete, say so in a bullet and suggest one useful follow-up question.",
      prompt: `Question: ${question}\nCompany: ${companyName} (${code}), ${sector || "sector not specified"}. Overall score: ${overallScore}/100. 30-day trend: ${trend} points.\nConstructs: ${constructContext}\nWeakest signal: ${weakest ? `${weakest.label} at ${weakest.value}/100` : "Unavailable"}\nEvidence timeline: ${events.join(" | ") || "Unavailable"}\nInterventions: ${interventions.join(" | ") || "Unavailable"}`,
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
