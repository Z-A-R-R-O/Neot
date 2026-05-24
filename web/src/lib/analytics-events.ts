"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

type V3Event =
  | { type: "world_viewed"; worldId: string; worldTitle: string }
  | { type: "island_entered"; islandId: string; islandTitle: string; worldId: string }
  | { type: "concept_mastered"; conceptId: string; conceptTitle: string }
  | { type: "learning_style_detected"; style: string }
  | { type: "learning_style_overridden"; style: string }
  | { type: "path_generated"; worldId: string }
  | { type: "path_followed"; nodeId: string }
  | { type: "quest_completed"; questId: string; questType: string; xpReward: number }
  | { type: "streak_milestone"; streak: number }
  | { type: "story_viewed"; conceptId: string; difficulty: string }
  | { type: "simplify_used"; conceptId: string; level: string }
  | { type: "ad_impression"; slotName: string; page: string }
  | { type: "ad_clicked"; slotName: string; sponsorId: string | null };

export function useAnalytics() {
  const queryClient = useQueryClient();

  const track = useCallback((event: V3Event) => {
    try {
      const entries = JSON.parse(sessionStorage.getItem("neot-analytics-queue") ?? "[]");
      entries.push({ ...event, timestamp: new Date().toISOString() });
      sessionStorage.setItem("neot-analytics-queue", JSON.stringify(entries));

      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", event.type, event as Record<string, unknown>);
      }
    } catch {}
  }, []);

  const flush = useCallback(async () => {
    try {
      const entries = JSON.parse(sessionStorage.getItem("neot-analytics-queue") ?? "[]");
      if (entries.length === 0) return;

      await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: entries }),
      });

      sessionStorage.setItem("neot-analytics-queue", "[]");
    } catch {}
  }, []);

  return { track, flush };
}

export function SoundEffect() {
  const isEnabled = typeof window !== "undefined"
    ? localStorage.getItem("neot-sound-enabled") !== "false"
    : true;

  const play = useCallback((sound: "xp" | "quest" | "levelup" | "click") => {
    if (!isEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      switch (sound) {
        case "xp":
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.15);
          break;
        case "quest":
          osc.frequency.setValueAtTime(523, ctx.currentTime);
          osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.35);
          break;
        case "levelup":
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.2);
          osc.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
          break;
        case "click":
          osc.frequency.setValueAtTime(1000, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.05);
          break;
      }
    } catch {}
  }, [isEnabled]);

  return { play };
}
