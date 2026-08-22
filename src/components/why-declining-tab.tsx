"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/company";
import { PipelineIndicator } from "@/components/pipeline-indicator";
import { MarkdownContent } from "@/components/markdown-content";

interface Props {
  company: Company;
}

function StatusDot({ isLoading, isComplete }: { isLoading: boolean; isComplete: boolean }) {
  if (isComplete) {
    return <span className="h-2 w-2 rounded-full bg-emerald-400" />;
  }
  return (
    <span className="relative flex h-2 w-2">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
        animate={isLoading ? { scale: [1, 2.2], opacity: [0.6, 0] } : { scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.6, repeat: isLoading ? Infinity : 0, ease: "easeInOut" }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block w-[2px] h-[1em] align-middle bg-emerald-400 ml-0.5"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

export function WhyDecliningTab({ company }: Props) {
  const [hasStarted, setHasStarted] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/analyze",
    streamProtocol: "text",
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
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center shadow-sm shadow-black/10 transition-shadow duration-200 hover:shadow-md hover:shadow-black/20">
        <Sparkles className="h-6 w-6 text-emerald-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-zinc-100 mb-2">AI ICS Analysis</h4>
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

  const isComplete = !isLoading && !!completion;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm shadow-black/10 transition-shadow duration-200 hover:shadow-md hover:shadow-black/20">
      {/* Pipeline Step Indicator */}
      <PipelineIndicator isActive={isLoading} isComplete={isComplete} />

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <h4 className="text-sm font-semibold text-zinc-300">AI Analysis</h4>
        <StatusDot isLoading={isLoading} isComplete={isComplete} />
        <AnimatePresence>
          {isComplete && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="inline-flex items-center gap-1 text-xs text-emerald-400 tracking-wide"
            >
              <CheckCircle2 className="h-4 w-4" />
              Analysis complete
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-none"
      >
        {completion ? (
          <>
            <MarkdownContent content={completion} />
            {isLoading && <BlinkingCursor />}
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            Analyzing governance signals across 7 constructs...
            {isLoading && <BlinkingCursor />}
          </div>
        )}
      </motion.div>
    </div>
  );
}
