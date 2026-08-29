"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, HelpCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/company";
import { formatAdvisorAnswer, generateFallbackAdvisor } from "@/lib/advisor";
import { MarkdownContent } from "@/components/markdown-content";

interface Props {
  company: Company;
}

export const QUICK_QUESTIONS = [
  "What needs attention first?",
  "What explains this score?",
  "What action should we take next?",
] as const;

const FAQS = [
  ["What can the Advisor help with?", "It turns the company’s available governance signals into concise priorities, questions, and practical next steps."],
  ["What data does it use?", "It uses the company name, sector, stock code, score, recent change, seven construct scores, evidence timeline, and intervention recommendations shown on this profile."],
  ["Is this compliance or investment advice?", "No. GovernIQ is decision support. Advisor responses are illustrative and should be checked against primary evidence and professional guidance."],
  ["How should I ask a good question?", "Ask one specific question at a time, such as which construct to investigate first or what evidence would validate a concern."],
];

const REQUEST_TIMEOUT_MS = 15000;

type AiState = "idle" | "streaming" | "ready" | "unavailable";

export function AiAdvisorTab({ company }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [aiState, setAiState] = useState<AiState>("idle");
  const submissionLock = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const busy = isSubmitting;
  const canAsk = question.trim().length > 0 && !busy;

  useEffect(() => () => abortRef.current?.abort(), []);

  const selectQuickQuestion = (value: string) => {
    setQuestion(value);
    setErrorMessage("");
    inputRef.current?.focus();
  };

  const streamLiveAnswer = async (trimmed: string, controller: AbortController) => {
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question: trimmed,
          companyName: company.name,
          code: company.code,
          sector: company.sector,
          score: company.score,
          trend: company.trend,
          constructs: company.constructs,
          events: company.events,
          interventions: company.interventions,
        }),
      });
      if (!response.ok || !response.body) throw new Error("advisor unavailable");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let started = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        if (!started) {
          started = true;
          text = "";
          setAiState("streaming");
          setFallbackNotice("");
        }
        text += chunk;
        setAnswer(text);
      }
      if (controller.signal.aborted) return;
      if (!text.trim()) throw new Error("empty advisor response");
      setAiState("ready");
    } catch {
      if (controller.signal.aborted) return;
      setAiState("unavailable");
      setFallbackNotice("Instant local guidance based on this company profile.");
    } finally {
      clearTimeout(timeout);
    }
  };

  const askAdvisor = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || busy || submissionLock.current) return;
    submissionLock.current = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuestion(trimmed);
    setAskedQuestion(trimmed);
    setAnswer("");
    setFallbackNotice("");
    setErrorMessage("");
    setAiState("idle");
    setIsSubmitting(true);

    const localAnswer = formatAdvisorAnswer(generateFallbackAdvisor(trimmed, company));
    setAnswer(localAnswer);
    setFallbackNotice("Instant local guidance based on this company profile.");
    queueMicrotask(() => { submissionLock.current = false; setIsSubmitting(false); });

    void streamLiveAnswer(trimmed, controller);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askAdvisor(question);
  };

  const statusLabel = aiState === "streaming" ? "Live AI · responding" : aiState === "ready" ? "Live AI response" : "Fast guidance";
  const liveMessage = busy ? "Advisor is preparing a response." : aiState === "streaming" ? "Advisor is streaming a live response." : errorMessage ? errorMessage : fallbackNotice ? fallbackNotice : answer ? "Advisor response ready." : "";

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2.5"><Sparkles className="h-5 w-5 text-emerald-400" /></div>
        <div>
          <div className="flex items-center gap-2"><h4 className="text-base font-semibold text-zinc-100">AI Advisor</h4><span className="text-[10px] uppercase tracking-wider text-emerald-400">{statusLabel}</span></div>
          <p className="mt-1 text-sm text-zinc-400">Ask one focused question and get concise, evidence-aware guidance for {company.name}.</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Suggested Advisor questions">
        {QUICK_QUESTIONS.map((item) => (
          <button key={item} type="button" onClick={() => selectQuickQuestion(item)} disabled={busy} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">{item}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <label htmlFor="advisor-question" className="text-xs font-medium text-zinc-300">Ask the Advisor</label>
        <div className="flex gap-2">
          <input ref={inputRef} id="advisor-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a governance question…" maxLength={180} disabled={busy} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-60" />
          <Button type="submit" disabled={!canAsk} className="min-w-[112px] bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" aria-label={busy ? "Advisor is responding" : "Ask Advisor"}>{busy ? "Thinking…" : <><Send className="mr-1.5 h-4 w-4" />Ask Advisor</>}</Button>
        </div>
        <p className="text-[11px] text-zinc-600">Press Enter to submit. Keep questions focused for the fastest answer.</p>
      </form>

      <div className="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</div>
      {(busy || answer || fallbackNotice || errorMessage) && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="glass-card mt-5 rounded-xl p-4" aria-live="polite">
          {askedQuestion && <p className="mb-3 text-xs font-medium text-emerald-400">{askedQuestion}</p>}
          {busy && !answer && <p className="text-sm text-zinc-400">Reviewing the available company signals…</p>}
          {aiState === "streaming" && <p className="mb-2 flex items-center gap-1.5 text-[11px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Streaming a live AI response…</p>}
          {answer && <MarkdownContent content={answer} />}
          {fallbackNotice && <p className="mt-3 text-xs text-amber-300">{fallbackNotice}</p>}
          {aiState === "ready" && <p className="mt-3 text-xs text-emerald-300">Live AI response grounded in this company’s current signals.</p>}
          {errorMessage && <p className="mt-3 text-sm text-red-400">{errorMessage}</p>}
          {!busy && aiState !== "streaming" && answer && <CheckCircle2 className="mt-3 h-4 w-4 text-emerald-400" aria-label="Advisor response complete" />}
        </motion.div>
      )}

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200"><HelpCircle className="h-4 w-4 text-zinc-400" />Advisor FAQ</div>
        <div className="space-y-2">
          {FAQS.map(([title, content]) => <details key={title} className="group rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"><summary className="cursor-pointer list-none pr-4 text-xs font-medium text-zinc-300 outline-none group-open:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400">{title}</summary><p className="pt-2 text-xs leading-relaxed text-zinc-500">{content}</p></details>)}
        </div>
      </div>
    </div>
  );
}
