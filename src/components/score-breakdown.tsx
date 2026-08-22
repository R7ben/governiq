"use client";

import { motion } from "framer-motion";
import { ConstructScores, CONSTRUCT_LABELS, CONSTRUCT_CODES } from "@/types/company";

interface Props {
  constructs: ConstructScores;
}

// Real N=100 market averages (raw 1-5 scale * 20 = 0-100)
const marketAverages: Record<string, number> = {
  bl_score: 60, // 2.99 * 20
  sv_score: 60, // 3.02 * 20
  ei_score: 63, // 3.15 * 20
  rm_score: 59, // 2.97 * 20
  rt_score: 48, // 2.40 * 20 — weakest market-wide
  se_score: 61, // 3.05 * 20
  so_score: 57, // 2.87 * 20
};

const constructBarColors: Record<string, { bar: string; text: string }> = {
  bl_score: { bar: "bg-blue-500", text: "text-blue-400" },
  sv_score: { bar: "bg-purple-500", text: "text-purple-400" },
  ei_score: { bar: "bg-amber-500", text: "text-amber-400" },
  rm_score: { bar: "bg-rose-500", text: "text-rose-400" },
  rt_score: { bar: "bg-cyan-500", text: "text-cyan-400" },
  se_score: { bar: "bg-emerald-500", text: "text-emerald-400" },
  so_score: { bar: "bg-teal-500", text: "text-teal-400" },
};

function getOpacity(score: number): string {
  if (score < 60) return "opacity-100";
  if (score <= 75) return "opacity-80";
  return "opacity-70";
}

export function ScoreBreakdown({ constructs }: Props) {
  const keys = Object.keys(constructs) as (keyof ConstructScores)[];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-200">
          ICS Score Breakdown — 7-Construct Model
        </h3>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-0.5 bg-zinc-400 inline-block" />
            N=100 avg
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {keys.map((key, i) => {
          const score = constructs[key];
          const avg = marketAverages[key] || 60;
          const colors = constructBarColors[key];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className={`w-6 text-xs font-mono shrink-0 ${colors.text}`}>
                {CONSTRUCT_CODES[key]}
              </div>
              <div className="w-44 text-xs text-zinc-400 shrink-0 truncate">
                {CONSTRUCT_LABELS[key]}
              </div>
              <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className={`h-full rounded-full ${colors.bar} ${getOpacity(score)}`}
                />
                {/* Market average marker */}
                <div
                  className="absolute top-0 h-full w-px bg-zinc-400"
                  style={{ left: `${avg}%` }}
                  title={`Market avg: ${avg}`}
                />
              </div>
              <div className={`w-8 text-xs font-bold text-right ${colors.text}`}>
                {score}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
