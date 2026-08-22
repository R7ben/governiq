"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, TrendingDown, TrendingUp, Shield, ArrowRight,
  Building2, BarChart3, AlertTriangle, Clock, Info, SearchX,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import companiesData from "@/data/companies.json";
import { Company } from "@/types/company";

const companies = companiesData as Company[];

const riskColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const scoreColors = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-emerald-400",
};

function getScoreRating(score: number): "high" | "medium" | "low" {
  if (score >= 75) return "low";
  if (score >= 65) return "medium";
  return "high";
}

// Generate sparkline data from trend value
function generateSparkline(trend: number): { v: number }[] {
  const points = 8;
  const data: { v: number }[] = [];
  let val = 50;
  for (let i = 0; i < points; i++) {
    val += (trend / points) + (Math.random() - 0.5) * 2;
    data.push({ v: Math.max(0, Math.min(100, val)) });
  }
  return data;
}

// Animated counter component
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * progress * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{Number.isInteger(value) ? Math.round(display) : display.toFixed(1)}{suffix}</>;
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search) ||
        c.sector.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = !riskFilter || c.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [search, riskFilter]);

  const avgScore = useMemo(() => {
    return Math.round((companies.reduce((sum, c) => sum + c.score, 0) / companies.length) * 10) / 10;
  }, []);

  const avgTrend = useMemo(() => {
    return Math.round((companies.reduce((sum, c) => sum + c.trend, 0) / companies.length) * 10) / 10;
  }, []);

  const highRiskCount = useMemo(() => {
    return companies.filter((c) => c.riskLevel === "high").length;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-xl font-bold text-zinc-50">GovernIQ</h1>
              <p className="text-xs text-zinc-400">ESG & Governance Intelligence for Bursa Malaysia</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              PLC Tier · Investor Confidence Engine
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Coverage</span>
                </div>
                <div className="text-2xl font-bold text-zinc-100">
                  <AnimatedNumber value={companies.length} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Bursa PLCs</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Avg ICS</span>
                </div>
                <div className="text-2xl font-bold text-zinc-100">
                  <AnimatedNumber value={avgScore} />
                </div>
                <p className={`text-xs mt-1 ${avgTrend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {avgTrend > 0 ? "+" : ""}{avgTrend} avg trend
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-zinc-500">Open Alerts</span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  <AnimatedNumber value={highRiskCount} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">High risk</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Last Refresh</span>
                </div>
                <div className="text-2xl font-bold text-zinc-100">2h</div>
                <p className="text-xs text-zinc-500 mt-1">ago</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by company, code, or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["high", "medium", "low"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(riskFilter === level ? null : level)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  riskFilter === level
                    ? riskColors[level]
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)} Risk
              </button>
            ))}
          </div>
        </div>

        {/* Company Table */}
        <div className="rounded-lg border border-zinc-800 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:table-cell">Sector</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">ICS</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    30d Trend
                    <span className="relative group">
                      <Info className="h-3 w-3 text-zinc-600 cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Simulated trajectory for demonstration — based on real 2024 governance scores
                      </span>
                    </span>
                  </span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Trend</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">Risk</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((company, i) => {
                const sparkData = generateSparkline(company.trend);
                return (
                  <motion.tr
                    key={company.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="bg-zinc-950 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <span className="font-medium text-zinc-100">{company.name}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-400 font-mono hidden sm:table-cell">{company.code}</td>
                    <td className="px-4 py-4 text-sm text-zinc-400 hidden md:table-cell">{company.sector}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-sm font-bold ${scoreColors[getScoreRating(company.score)]}`}>
                        {company.score}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-sm ${
                        company.trend >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {company.trend >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        {company.trend > 0 ? "+" : ""}{company.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <div className="w-[60px] h-[24px] mx-auto">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparkData}>
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke={company.trend >= 0 ? "#34d399" : "#f87171"}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge className={`${riskColors[company.riskLevel]} text-xs`}>
                        {company.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/company/${company.code}`}
                        className="inline-flex items-center gap-1 text-sm text-zinc-500 group-hover:text-emerald-400 transition-colors"
                      >
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="px-4 py-16 text-center">
              <SearchX className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">No companies match your filters</h3>
              <p className="text-sm text-zinc-500 mb-4">Try adjusting your search term or risk-level filter.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearch(""); setRiskFilter(null); }}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Validation Badge Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-600">
            Scoring model validated via PLS-SEM structural analysis · N=100 Malaysian PLCs · VIF &lt; 5.0
          </p>
        </div>
      </main>
    </div>
  );
}
