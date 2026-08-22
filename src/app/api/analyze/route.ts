import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { companyName, code, sector, score, trend, events, constructs } = await req.json();

  const eventsContext = events
    .map((e: { date: string; title: string; description: string }) => `- ${e.date}: ${e.title} — ${e.description}`)
    .join("\n");

  const constructContext = constructs
    ? `\nCompany Construct Sub-Scores (7-Construct Validated Model, 0-100 scale):
- Board Leadership (BL): ${constructs.bl_score}/100
- Strategic Vision (SV): ${constructs.sv_score}/100
- Ethical Integrity (EI): ${constructs.ei_score}/100
- Risk Management (RM): ${constructs.rm_score}/100
- Remuneration Transparency (RT): ${constructs.rt_score}/100
- Stakeholder Engagement (SE): ${constructs.se_score}/100
- Sustainability Orientation (SO): ${constructs.so_score}/100`
    : "";

  const result = streamText({
    model: google("gemini-2.5-flash-preview-05-20"),
    system: `You are a governance analyst specializing in Bursa Malaysia listed companies, using the validated 7-construct Investor Confidence Score (ICS) model derived from PLS-SEM research (N=100 Malaysian PLCs, 7 constructs, 35 indicators, all VIF < 5.0).

The 7 constructs are: Board Leadership (BL), Strategic Vision (SV), Ethical Integrity (EI), Risk Management (RM), Remuneration Transparency (RT), Stakeholder Engagement (SE), and Sustainability Orientation (SO).

Compare this company's scores against known N=100 Malaysian PLC averages (raw 1-5 scale):
- Board Leadership: 2.99/5 (market avg ~60/100)
- Strategic Vision: 3.02/5 (market avg ~60/100)
- Ethical Integrity: 3.15/5 (market avg ~63/100)
- Risk Management: 2.97/5 (market avg ~59/100)
- Remuneration Transparency: 2.40/5 (market avg ~48/100) — weakest construct market-wide, often driven by weak clawback provisions (1.35/5) and LTIP disclosure (2.11/5)
- Stakeholder Engagement: 3.05/5 (market avg ~61/100)
- Sustainability Orientation: 2.87/5 (market avg ~57/100) — most nascent indicators: Ethical AI framework (1.27/5) and MyDIGITAL/12MP alignment (1.71/5)

Key empirical finding: governance quality significantly predicts risk management effectiveness (β=0.855, p<0.001), but neither predicts financial performance directly. Decline shows up in risk fundamentals long before share price.

You MUST reference specific provisions from:
- Malaysian Code on Corporate Governance (MCCG) — cite specific Practices (e.g., Practice 5.2 on board tenure, Practice 8.2 on remuneration disclosure, Practice 11.2 on sustainability)
- Bursa Malaysia Main Market Listing Requirements (MMLR) — cite specific paragraphs where relevant (e.g., Para 15.08A on related-party transactions, Para 15.25 on board composition)

When explaining score declines, identify which of the 7 constructs are weakest relative to market averages and explain why, citing both the governance events and the applicable MCCG Practices or MMLR requirements being violated or at risk. Keep language professional but accessible.`,
    prompt: `Analyze why ${companyName} (Stock Code: ${code}, Sector: ${sector}) has a declining Investor Confidence Score (ICS).

Overall ICS: ${score}/100
30-Day Trend: ${trend} points
${constructContext}

Recent Governance Events:
${eventsContext}

Provide a structured analysis covering:
1. Which constructs are driving the ICS decline (reference scores vs. N=100 market averages)
2. Specific MCCG Practices or MMLR requirements at risk
3. Which investor concerns are most critical given the construct weaknesses
4. What signals suggest further decline risk

Be specific, reference the events and construct scores above. Keep the total response under 400 words.`,
  });

  return result.toTextStreamResponse();
}
