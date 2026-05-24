"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdBlockerDetector() {
  const [blockerDetected, setBlockerDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const test = document.createElement("div");
    test.className = "adsbygoogle";
    test.style.height = "1px";
    document.body.appendChild(test);
    const check = () => {
      if (test.offsetHeight === 0 || test.offsetHeight === undefined) {
        setBlockerDetected(true);
      }
      document.body.removeChild(test);
    };
    setTimeout(check, 100);
  }, []);

  if (dismissed || !blockerDetected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4"
    >
      <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-300">Ad blocker detected</p>
        <p className="text-xs text-amber-400/70">
          NEOT is free thanks to ads. Please consider whitelisting us to support free education.
        </p>
      </div>
      <Button
        onClick={() => setDismissed(true)}
        variant="ghost"
        size="sm"
        className="shrink-0 text-amber-400/50 hover:text-amber-300"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
