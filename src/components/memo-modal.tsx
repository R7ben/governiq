"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Check, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company, Intervention } from "@/types/company";
import { generateInstantMemo } from "@/lib/memo";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; company: Company; intervention: Intervention; }

export function MemoModal({ open, onOpenChange, company, intervention }: Props) {
  const [copied, setCopied] = useState(false);
  const [memo, setMemo] = useState("");

  useEffect(() => { if (open) { setMemo(generateInstantMemo(company, intervention)); setCopied(false); } }, [open, company, intervention]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(memo); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="glass-panel max-w-2xl border-white/10"><DialogHeader><DialogTitle className="flex items-center gap-2 text-zinc-100"><FileText className="h-5 w-5 text-emerald-400" /> IR Board Memo</DialogTitle><DialogDescription className="text-zinc-400">An instant copy-ready draft for: {intervention.title}</DialogDescription></DialogHeader><motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 max-h-[60vh] overflow-auto rounded-xl border border-white/10 bg-zinc-950/70 p-5"><pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">{memo}</pre></motion.div><div className="mt-4 flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Memo ready to copy</span><Button size="sm" variant="outline" onClick={handleCopy} disabled={!memo} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">{copied ? <><Check className="mr-1.5 h-4 w-4 text-emerald-400" />Copied</> : <><Copy className="mr-1.5 h-4 w-4" />Copy Memo</>}</Button></div></DialogContent></Dialog>;
}
