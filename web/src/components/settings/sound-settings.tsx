"use client";

import { useState, useEffect } from "react";
import { Volume2, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

const easing = [0.16, 1, 0.3, 1] as const;

export function SoundSettings() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("neot-sound-enabled");
    if (stored !== null) setEnabled(stored === "true");
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("neot-sound-enabled", String(next));
  }

  if (!mounted) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easing }}
      className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10">
            <Volume2 className="h-5 w-5 text-primary-400" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">Sound Effects</h2>
        </div>
      </div>

      <div className="space-y-1">
        <label className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.03)]">
          <div>
            <p className="text-sm font-medium text-foreground">Enable sound effects</p>
            <p className="text-xs text-muted-foreground">Play sounds for XP earned, quests completed, and level ups</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={enabled}
              onChange={toggle}
            />
            <div
              className={`h-6 w-11 rounded-full transition-colors ${
                enabled ? "bg-primary-500" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  enabled ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </div>
          </div>
        </label>
      </div>
    </motion.section>
  );
}
