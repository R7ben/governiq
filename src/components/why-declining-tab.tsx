"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/company";
import { PipelineIndicator } from "@/components/pipeline-indicator";

interface Props {
  company: Company;
}

export function WhyDecliningTab({ company }: Props) {
  const [hasStarted, setHasStarted] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/analyze",
  });

  const handleAnalyze = async () => {
    setHasStarted(true);
    await complete("", {
      body: {
        companyName: company.name,
        code: company.code,
        sector: company.sector,
        score: company.score,
        trend: company.trend,
        events: company.events,
        constructs: company.constructs,
      },
    });
  };

  if (!hasStarted) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <Sparkles className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-zinc-100 mb-2">AI ICS Analysis</h4>
        <p className="text-sm text-zinc-400 mb-6">
          Get an AI-powered explanation of why {company.name}&apos;s Investor Confidence Score is
          {company.trend < 0 ? " declining" : " changing"}, using the validated 7-construct model.
        </p>
        <Button
          onClick={handleAnalyze}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Analyze with AI
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      {/* Pipeline Step Indicator */}
      <PipelineIndicator isActive={isLoading} isComplete={!isLoading && !!completion} />

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <h4 className="text-sm font-medium text-zinc-300">AI Analysis</h4>
        {isLoading && <Loader2 className="h-3.5 w-3.5 text-zinc-500 animate-spin" />}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="prose prose-invert prose-sm max-w-none"
      >
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {completion || (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing ICS data across 7 constructs...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
