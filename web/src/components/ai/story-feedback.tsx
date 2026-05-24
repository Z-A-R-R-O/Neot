"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryFeedbackProps {
  conceptTitle: string;
  onFeedback?: (type: string) => void;
}

export function StoryFeedback({ conceptTitle, onFeedback }: StoryFeedbackProps) {
  const [submitted, setSubmitted] = useState<string | null>(null);

  async function handleFeedback(type: string) {
    setSubmitted(type);
    onFeedback?.(type);
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptTitle, feedbackType: type, feature: "story" }),
      });
    } catch {
      // silently fail
    }
  }

  if (submitted) {
    return (
      <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
        <MessageSquare className="h-3.5 w-3.5" />
        Thanks for your feedback!
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground">Was this helpful?</span>
      {[
        { type: "helpful", icon: ThumbsUp, label: "Helpful" },
        { type: "too_simple", icon: ThumbsDown, label: "Too simple" },
        { type: "too_complex", icon: ThumbsDown, label: "Too complex" },
      ].map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => handleFeedback(type)}
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-colors",
            "bg-[rgba(255,255,255,0.04)] text-muted-foreground hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground",
          )}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
