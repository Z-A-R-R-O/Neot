"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimplifyViewerProps {
  conceptTitle: string;
  conceptDescription: string | null;
}

type SimplifyLevel = "eli5" | "kid" | "teen" | "normal" | "detailed";

interface SimplifyData {
  simplified: string;
  analogy: string | null;
  level: string;
}

const levelLabels: Record<SimplifyLevel, string> = {
  eli5: "Like I'm 5",
  kid: "Kid (10 yr)",
  teen: "Teen",
  normal: "Normal",
  detailed: "Detailed",
};

export function SimplifyViewer({ conceptTitle, conceptDescription }: SimplifyViewerProps) {
  const [data, setData] = useState<SimplifyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [level, setLevel] = useState<SimplifyLevel>("teen");

  async function fetchSimplify() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptTitle, conceptDescription, level }),
      });
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      setData(result);
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
        onClick={() => { if (!data) fetchSimplify(); else setExpanded(!expanded); }}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">Simplify</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {levelLabels[level]} level
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          {data && (expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />)}
          {!data && <Sparkles className="h-4 w-4 text-amber-400" />}
        </div>
      </button>

      {data && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-[rgba(255,255,255,0.06)] px-4 pb-4"
        >
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.entries(levelLabels) as [SimplifyLevel, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setLevel(key); fetchSimplify(); }}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-medium transition-colors",
                  level === key
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-[rgba(255,255,255,0.04)] text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {data.simplified}
            </div>

            {data.analogy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Real-world analogy
                </div>
                <p className="mt-1 text-sm text-foreground/70 italic">
                  {data.analogy}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
