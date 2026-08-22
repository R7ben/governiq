import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { companyName, code, intervention, score, trend } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-preview-05-20"),
    system: `You are a senior investor relations consultant drafting board memos for Bursa Malaysia listed companies. Write in formal but clear language suitable for board-level communication. Be specific about timelines, responsibilities, and expected outcomes.`,
    prompt: `Draft a board memo for ${companyName} (${code}) regarding the following governance intervention:

Intervention: ${intervention.title}
Priority: ${intervention.priority}
Rationale: ${intervention.explanation}
Expected Impact: ${intervention.impact} governance score improvement

Current Governance Score: ${score}/100
Recent Trend: ${trend} points (30 days)

Structure the memo as follows:
1. SUBJECT LINE (one line)
2. EXECUTIVE SUMMARY (2-3 sentences)
3. BACKGROUND & URGENCY (brief context on why this matters now)
4. RECOMMENDED ACTIONS (3-4 specific steps with owners and timelines)
5. EXPECTED OUTCOMES (quantified where possible)
6. RISK OF INACTION (what happens if the board does not act)

Keep the memo professional, concise (under 350 words), and action-oriented.`,
  });

  return result.toTextStreamResponse();
}
