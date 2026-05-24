"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CuriosityCard } from "./curiosity-card";
import type { CuriosityRecommendation } from "@/lib/curiosity/curiosity-recommender";

export function FeelingCuriousButton() {
  const [curiosity, setCuriosity] = useState<CuriosityRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const fetchRandom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/curiosity/random");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCuriosity(data);
      setShowPanel(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Button
        onClick={fetchRandom}
        disabled={loading}
        variant="outline"
        className="group relative gap-2 overflow-hidden"
      >
        <motion.div
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
        >
          <Shuffle className="h-4 w-4" />
        </motion.div>
        <span>{loading ? "Finding something..." : "I'm Feeling Curious"}</span>
        <Sparkles className="h-3.5 w-3.5 text-yellow-500 opacity-0 transition-opacity group-hover:opacity-100" />
      </Button>

      <AnimatePresence>
        {showPanel && curiosity && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-40 w-80"
          >
            <div className="relative rounded-xl border border-[rgba(255,255,255,0.1)] bg-black/90 p-1 backdrop-blur-xl shadow-2xl">
              <button
                onClick={() => setShowPanel(false)}
                className="absolute right-2 top-2 z-10 rounded-full p-1 text-muted-foreground/50 transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="px-3 pt-3 pb-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-yellow-500/70">
                  <Sparkles className="h-3 w-3" />
                  Curiosity Pick
                </div>
              </div>
              <CuriosityCard {...curiosity} />
              <div className="p-3 pt-2">
                <Button
                  onClick={fetchRandom}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-xs"
                >
                  <Shuffle className="h-3 w-3" />
                  Try another
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
