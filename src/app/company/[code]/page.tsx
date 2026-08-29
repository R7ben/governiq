"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown, TrendingUp, Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import companiesData from "@/data/companies.json";
import { Company, CONSTRUCT_KEYS, CONSTRUCT_LABELS } from "@/types/company";
import { weakestConstruct } from "@/lib/scoring";
import { AiAdvisorTab } from "@/components/ai-advisor-tab";
import { InterventionsTab } from "@/components/interventions-tab";
import { ScoreBreakdown } from "@/components/score-breakdown";

const companies = companiesData as Company[];

const riskColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function CompanyDetailPage() {
  const params = useParams();
  const code = params.code as string;
  const company = companies.find((c) => c.code === code);

  if (!company) {
    return (
      <div className="app-shell min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Company Not Found</h1>
          <p className="text-zinc-400 mb-4">
            We couldn&apos;t find a company with code &quot;{code}&quot; — it may have been delisted or the code mistyped.
          </p>
          <Link
            href="/"
            className="text-emerald-400 hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/55 px-4 sm:px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-50">GovernIQ</h1>
              <p className="text-xs text-zinc-400 tracking-wide">Operational Sustainability & ESG Intelligence for Bursa Malaysia</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors rounded-sm px-1 -mx-1 py-1 min-h-[44px] sm:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Company Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-bold text-zinc-50">{company.name}</h2>
                <Badge className={`${riskColors[company.riskLevel]} text-xs`}>
                  {company.riskLevel} risk
                </Badge>
              </div>
              <p className="text-sm text-zinc-400">
                {company.sector} &middot; Stock Code: {company.code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1 tracking-wide">Investor Confidence Score</p>
              <div className="text-4xl font-bold text-zinc-100 tabular-nums">{company.score}</div>
              <div className={`inline-flex items-center gap-1 text-sm tabular-nums ${
                company.trend >= 0 ? "text-emerald-400" : "text-red-400"
              }`}>
                {company.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {company.trend > 0 ? "+" : ""}{company.trend} pts (30d)
              </div>
              <p className="text-xs text-zinc-600 mt-1 tracking-wide">Simulated trajectory · 2024 snapshot context</p>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-8"
        >
          <ScoreBreakdown constructs={company.constructs} />
        </motion.div>

        {(() => { const weakest = weakestConstruct(company.constructs); const strongestKey = CONSTRUCT_KEYS.reduce((best, key) => company.constructs[key] > company.constructs[best] ? key : best, CONSTRUCT_KEYS[0]); const cue = company.interventions[0]; return <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2"><div className="glass-panel rounded-2xl border-amber-400/20 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Decision cue</p><h3 className="mt-3 text-xl font-semibold text-zinc-100">{weakest.label} needs the first board conversation.</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">{cue?.explanation || "Review the evidence behind this construct and assign an accountable owner."}</p><p className="mt-4 text-xs text-zinc-500">Composite score: <span className="font-semibold text-zinc-200">{company.score}/100</span></p></div><div className="glass-card rounded-2xl p-5"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Relative strength</p><h3 className="mt-3 text-xl font-semibold text-zinc-100">{CONSTRUCT_LABELS[strongestKey]} is your strongest signal.</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">Use this existing capability as a model for improving {weakest.label}, while validating both signals against the evidence timeline.</p><p className="mt-4 text-xs text-zinc-500">Construct score: <span className="font-semibold text-emerald-300">{company.constructs[strongestKey]}/100</span></p></div></div>; })()}
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Events Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Evidence Timeline
            </h3>
            <div className="relative pl-6 border-l border-zinc-800">
              {company.events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                  className="mb-6 relative"
                >
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-600" />
                  <p className="text-xs text-zinc-500 mb-1 tracking-wide tabular-nums">
                    {new Date(event.date).toLocaleDateString("en-MY", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h4 className="text-sm font-medium text-zinc-200 mb-1">{event.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{event.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: AI Panel with Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Tabs defaultValue="advisor" className="w-full">
              <TabsList className="glass-panel w-full">
                <TabsTrigger value="advisor" className="flex-1">AI Advisor</TabsTrigger>
                <TabsTrigger value="interventions" className="flex-1">Interventions</TabsTrigger>
              </TabsList>
              <TabsContent value="advisor" className="mt-4">
                <AiAdvisorTab company={company} />
              </TabsContent>
              <TabsContent value="interventions" className="mt-4">
                <InterventionsTab company={company} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
