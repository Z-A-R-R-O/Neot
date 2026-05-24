"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ad_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("ad_consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("ad_consent", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(255,255,255,0.06)] bg-black/95 p-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-5xl items-start gap-4">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Privacy-Conscious Ads</p>
          <p className="mt-1 text-xs text-muted-foreground">
            NEOT uses non-intrusive ads to keep learning free. We never sell your personal data.
            Ads are based only on the topic you're currently learning, never your identity.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button onClick={reject} variant="outline" size="sm">
            Opt out
          </Button>
          <Button onClick={accept} variant="default" size="sm">
            Got it
          </Button>
        </div>
        <button onClick={reject} className="text-muted-foreground/50 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
