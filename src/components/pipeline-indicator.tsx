"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, BarChart3, MessageSquareText, Lightbulb } from "lucide-react";

interface Props {
  isActive: boolean;
  isComplete: boolean;
}

const steps = [
  { label: "Extract", icon: FileSearch },
  { label: "Benchmark", icon: BarChart3 },
  { label: "Explain", icon: MessageSquareText },
  { label: "Recommend", icon: Lightbulb },
];

export function PipelineIndicator({ isActive, isComplete }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (isComplete) {
      setActiveStep(steps.length - 1);
    }
  }, [isComplete]);

  if (!isActive && !isComplete) return null;

  return (
    <div className="flex items-center gap-1 mb-4 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isStepActive = i <= activeStep;
        return (
          <div key={step.label} className="flex items-center">
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: isStepActive ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isStepActive ? 1 : 0.8 }}
                transition={{ duration: 0.2 }}
                className={`p-1.5 rounded ${
                  isStepActive ? "bg-emerald-500/20" : "bg-zinc-800"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${
                  isStepActive ? "text-emerald-400" : "text-zinc-600"
                }`} />
              </motion.div>
              <span className={`text-xs font-medium ${
                isStepActive ? "text-zinc-200" : "text-zinc-600"
              }`}>
                {step.label}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i < activeStep ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-4 h-px bg-emerald-500/50 mx-1 origin-left"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
