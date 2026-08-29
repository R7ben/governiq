"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ConstructScores, CONSTRUCT_LABELS, CONSTRUCT_CODES } from "@/types/company";

interface Props { constructs: ConstructScores; }

const marketAverages: Record<string, number> = { bl_score: 60, sv_score: 60, ei_score: 63, rm_score: 59, rt_score: 48, se_score: 61, so_score: 57 };
const constructDetails: Record<string, { meaning: string; impact: string }> = {
  bl_score: { meaning: "Board Leadership", impact: "Shows how well the board provides direction, challenge, independence, and accountability." },
  sv_score: { meaning: "Strategic Vision", impact: "Shows whether long-term goals are clear, measurable, and connected to resources and risks." },
  ei_score: { meaning: "Ethical Integrity", impact: "Shows how consistently the company handles conduct, conflicts of interest, and speak-up responsibilities." },
  rm_score: { meaning: "Risk Management", impact: "Shows how well the company identifies, controls, owns, and escalates material risks." },
  rt_score: { meaning: "Remuneration Transparency", impact: "Shows whether executive pay is explained clearly and aligned with strategy, risk, and sustainable results." },
  se_score: { meaning: "Stakeholder Engagement", impact: "Shows how effectively the company listens to investors, employees, customers, and communities." },
  so_score: { meaning: "Sustainability Orientation", impact: "Shows whether sustainability is built into strategy, governance, targets, and everyday decisions." },
};
const constructBarColors: Record<string, { bar: string; text: string }> = {
  bl_score: { bar: "bg-blue-500", text: "text-blue-400" }, sv_score: { bar: "bg-purple-500", text: "text-purple-400" }, ei_score: { bar: "bg-amber-500", text: "text-amber-400" }, rm_score: { bar: "bg-rose-500", text: "text-rose-400" }, rt_score: { bar: "bg-cyan-500", text: "text-cyan-400" }, se_score: { bar: "bg-emerald-500", text: "text-emerald-400" }, so_score: { bar: "bg-teal-500", text: "text-teal-400" },
};
function scoreLabel(score: number) { return score >= 75 ? "Strong" : score >= 50 ? "Watch" : "Critical"; }

export function ScoreBreakdown({ constructs }: Props) {
  const reduced = useReducedMotion();
  const keys = Object.keys(constructs) as (keyof ConstructScores)[];
  return <section className="glass-card rounded-2xl p-5" aria-labelledby="ics-breakdown-title">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5"><div><h3 id="ics-breakdown-title" className="text-sm font-semibold text-zinc-100">ICS Score Breakdown — 7-Construct Model</h3><p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">ICS is the company’s Investor Confidence Score. Each construct is scored from 0–100 and compared with the illustrative market average. A higher score means stronger reported governance practice in that area.</p></div><span className="inline-flex items-center gap-1.5 text-xs text-zinc-500"><span className="inline-block h-0.5 w-4 bg-zinc-400" /> Market average</span></div>
    <div className="space-y-4">{keys.map((key, i) => { const score = constructs[key]; const avg = marketAverages[key] || 60; const colors = constructBarColors[key]; const detail = constructDetails[key]; const difference = score - avg; return <motion.div key={key} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: i * 0.035 }} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 w-7 shrink-0 font-mono text-xs ${colors.text}`}>{CONSTRUCT_CODES[key]}</span><div className="min-w-0"><p className="text-sm font-medium text-zinc-100">{detail?.meaning || CONSTRUCT_LABELS[key]}</p><p className="mt-1 text-xs leading-relaxed text-zinc-500">{detail?.impact}</p></div></div><div className="shrink-0 text-right"><p className={`text-sm font-bold tabular-nums ${colors.text}`}>{score}/100</p><p className="mt-1 text-[10px] text-zinc-500">{scoreLabel(score)} · {difference >= 0 ? "+" : ""}{difference} vs avg</p></div></div>
      <div className="mt-3 flex items-center gap-3"><div className="relative h-2 flex-1 overflow-hidden rounded-full bg-zinc-800"><motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: reduced ? 0 : 0.45, delay: 0.08 + i * 0.035 }} className={`h-full rounded-full ${colors.bar}`} /><div className="absolute top-0 h-full w-px bg-zinc-300" style={{ left: `${avg}%` }} title={`Illustrative market average: ${avg}/100`} /></div><span className="w-12 shrink-0 text-right text-[10px] text-zinc-500">avg {avg}</span></div>
    </motion.div>; })}</div>
    <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-zinc-500"><span className="font-medium text-zinc-300">How to read this:</span> compare the company score with the grey market-average marker. The biggest negative differences are the clearest areas for investigation, but the score is a decision-support signal—not proof of compliance, performance, or investment value.</p>
  </section>;
}
