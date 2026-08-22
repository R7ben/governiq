"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, FileText, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Company, Intervention } from "@/types/company";
import { MemoModal } from "@/components/memo-modal";

interface Props {
  company: Company;
}

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const constructFullNames: Record<string, string> = {
  BL: "Board Leadership",
  SV: "Strategic Vision",
  EI: "Ethical Integrity",
  RM: "Risk Management",
  RT: "Remuneration Transparency",
  SE: "Stakeholder Engagement",
  SO: "Sustainability Orientation",
};

const constructColors: Record<string, string> = {
  BL: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  SV: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  EI: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  RM: "bg-rose-500/15 border-rose-500/30 text-rose-400",
  RT: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  SE: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  SO: "bg-teal-500/15 border-teal-500/30 text-teal-400",
};

export function InterventionsTab({ company }: Props) {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [memoOpen, setMemoOpen] = useState(false);

  const handleGenerateMemo = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setMemoOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {company.interventions.map((intervention, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${priorityColors[intervention.priority]} text-xs`}>
                      {intervention.priority}
                    </Badge>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      {intervention.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                    <ArrowUpRight className="h-3 w-3" />
                    {intervention.impact}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                  {intervention.explanation}
                </p>
                {/* Construct reference tag */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${constructColors[intervention.construct] || "bg-zinc-800 border-zinc-700 text-zinc-300"}`}>
                    Addresses: {constructFullNames[intervention.construct] || intervention.construct} ({intervention.construct})
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateMemo(intervention)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Generate IR Memo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Zap className="h-3.5 w-3.5" />
          Interventions ranked by estimated ICS recovery impact
        </div>
      </div>

      {selectedIntervention && (
        <MemoModal
          open={memoOpen}
          onOpenChange={setMemoOpen}
          company={company}
          intervention={selectedIntervention}
        />
      )}
    </>
  );
}
