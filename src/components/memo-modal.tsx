"use client";

import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { FileText, Loader2, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company, Intervention } from "@/types/company";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  intervention: Intervention;
}

export function MemoModal({ open, onOpenChange, company, intervention }: Props) {
  const [copied, setCopied] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/memo",
  });

  useEffect(() => {
    if (open) {
      complete("", {
        body: {
          companyName: company.name,
          code: company.code,
          intervention,
          score: company.score,
          trend: company.trend,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            IR Board Memo
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            AI-generated memo for: {intervention.title}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-lg bg-zinc-950 border border-zinc-800 p-5 max-h-[60vh] overflow-auto">
          {completion ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono">
                {completion}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center py-12 text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Drafting board memo...
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-zinc-500">
            {isLoading ? "Generating..." : "Generation complete"}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!completion || isLoading}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy Memo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
