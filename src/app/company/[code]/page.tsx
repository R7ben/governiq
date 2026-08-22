"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown, TrendingUp, Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import companiesData from "@/data/companies.json";
import { Company } from "@/types/company";
import { WhyDecliningTab } from "@/components/why-declining-tab";
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Company Not Found</h1>
          <p className="text-zinc-400 mb-4">No company with code &quot;{code}&quot; exists.</p>
          <Link href="/" className="text-emerald-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-xl font-bold text-zinc-50">GovernIQ</h1>
              <p className="text-xs text-zinc-400">ESG & Governance Intelligence for Bursa Malaysia</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
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
              <p className="text-zinc-400">
                {company.sector} &middot; Stock Code: {company.code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Investor Confidence Score</p>
              <div className="text-4xl font-bold text-zinc-100">{company.score}</div>
              <div className={`inline-flex items-center gap-1 text-sm ${
                company.trend >= 0 ? "text-emerald-400" : "text-red-400"
              }`}>
                {company.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {company.trend > 0 ? "+" : ""}{company.trend} pts (30d)
              </div>
              <p className="text-xs text-zinc-600 mt-1">Simulated trajectory</p>
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
              Governance Events
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
                  <p className="text-xs text-zinc-500 mb-1">
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
            <Tabs defaultValue="why" className="w-full">
              <TabsList className="w-full bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="why" className="flex-1">Why Declining</TabsTrigger>
                <TabsTrigger value="interventions" className="flex-1">Interventions</TabsTrigger>
              </TabsList>
              <TabsContent value="why" className="mt-4">
                <WhyDecliningTab company={company} />
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
