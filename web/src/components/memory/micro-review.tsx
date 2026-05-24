"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MicroReviewData {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  skillName: string;
  concept: string;
}

export function MicroReview() {
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery<MicroReviewData>({
    queryKey: ["memory", "micro-review"],
    queryFn: async () => {
      const res = await fetch("/api/memory/micro-review");
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  async function handleAnswer(knewIt: boolean) {
    if (!data) return;
    setAnswered(knewIt);
    setSubmitting(true);
    try {
      await fetch("/api/memory/review-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: data.lessonId, score: knewIt ? 0.9 : 0.3 }),
      });
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    setAnswered(null);
    refetch();
  }

  if (isLoading) return null;
  if (!data) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wider text-primary">Quick Review</span>
      </div>

      <AnimatePresence mode="wait">
        {answered === null ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm text-foreground">
              Do you remember <span className="font-semibold">{data.skillName}</span>?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              From: {data.lessonTitle} · {data.courseTitle}
            </p>

            <div className="mt-4 flex gap-3">
              <Button
                onClick={() => handleAnswer(true)}
                disabled={submitting}
                variant="outline"
                size="sm"
                className="gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                <CheckCircle2 className="h-4 w-4" />
                Got it!
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                disabled={submitting}
                variant="outline"
                size="sm"
                className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="h-4 w-4" />
                Need review
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-2">
              {answered ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={cn("text-sm font-medium", answered ? "text-green-400" : "text-red-400")}>
                {answered ? "Great job!" : "Added back to your review queue."}
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={isRefetching}
              variant="ghost"
              size="sm"
              className="mt-3 gap-2"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefetching && "animate-spin")} />
              Next review
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
