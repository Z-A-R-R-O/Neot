"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  "Coding", "Design", "Science", "Math", "Languages",
  "Music", "Business", "History", "AI", "Data",
];

interface AdPreferencesData {
  interests: string[];
  maxAdsPerPage: number;
  allowSponsored: boolean;
  allowPersonalized: boolean;
}

export function AdPreferences() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<AdPreferencesData>({
    interests: [], maxAdsPerPage: 2, allowSponsored: true, allowPersonalized: false,
  });
  const [saving, setSaving] = useState(false);

  async function loadPrefs() {
    try {
      const res = await fetch("/api/ads/config");
      if (res.ok) {
        const data = await res.json();
        if (data.preferences) setPrefs(data.preferences);
      }
    } catch { /* ignore */ }
  }

  async function savePrefs() {
    setSaving(true);
    try {
      await fetch("/api/ads/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
    } catch { /* ignore */ }
    setSaving(false);
    setOpen(false);
  }

  function toggleInterest(interest: string) {
    setPrefs((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  }

  if (!open) {
    return (
      <Button onClick={() => { loadPrefs(); setOpen(true); }} variant="ghost" size="sm" className="gap-2 text-xs">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Ad Preferences
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">Ad Preferences</h4>
        <button onClick={() => setOpen(false)} className="text-muted-foreground/50 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-foreground mb-2">Topics you're interested in</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  prefs.interests.includes(interest)
                    ? "bg-primary/20 text-primary"
                    : "bg-[rgba(255,255,255,0.04)] text-muted-foreground hover:text-foreground",
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Sponsored content</p>
            <p className="text-[10px] text-muted-foreground">Show sponsored learning paths</p>
          </div>
          <Switch
            checked={prefs.allowSponsored}
            onCheckedChange={(v) => setPrefs((p) => ({ ...p, allowSponsored: v }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Personalized ads</p>
            <p className="text-[10px] text-muted-foreground">Ads based on your learning topics</p>
          </div>
          <Switch
            checked={prefs.allowPersonalized}
            onCheckedChange={(v) => setPrefs((p) => ({ ...p, allowPersonalized: v }))}
          />
        </div>

        <Button onClick={savePrefs} disabled={saving} size="sm" className="w-full gap-2">
          <Check className="h-4 w-4" />
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </motion.div>
  );
}
