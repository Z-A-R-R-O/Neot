"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StoryViewerProps {
  conceptTitle: string;
  conceptDescription: string | null;
}

type Difficulty = "simple" | "normal" | "advanced";

interface StoryData {
  story: string;
  title: string;
  difficulty: string;
}

export function StoryViewer({ conceptTitle, conceptDescription }: StoryViewerProps) {
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  async function fetchStory() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptTitle, conceptDescription, difficulty }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setStory(data);
      setExpanded(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
      <button
        onClick={() => { if (!story) fetchStory(); else setExpanded(!expanded); }}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
            <BookOpen className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">Explain as a Story</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {story ? story.title : "AI-generated narrative"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          {story && (expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />)}
          {!story && <Sparkles className="h-4 w-4 text-purple-400" />}
        </div>
      </button>

      {story && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-[rgba(255,255,255,0.06)] px-4 pb-4"
        >
          <div className="mt-3 flex gap-2">
            {(["simple", "normal", "advanced"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); fetchStory(); }}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-medium transition-colors",
                  difficulty === d
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-[rgba(255,255,255,0.04)] text-muted-foreground hover:text-foreground",
                )}
              >
                {d === "simple" ? "Simple" : d === "normal" ? "Normal" : "Advanced"}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {story.story.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-sm leading-relaxed text-foreground/80"
              >
                {para}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
