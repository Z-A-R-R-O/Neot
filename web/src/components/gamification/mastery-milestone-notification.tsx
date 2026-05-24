"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Target, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneData {
  title: string;
  icon: typeof Trophy;
  color: string;
  message: string;
}

const MILESTONES: Record<string, MilestoneData> = {
  first_island: { title: "First Steps", icon: Star, color: "#22c55e", message: "You completed your first island!" },
  half_world: { title: "Halfway There", icon: Target, color: "#eab308", message: "You're halfway through a world!" },
  world_complete: { title: "World Master", icon: Trophy, color: "#8b5cf6", message: "You mastered an entire world!" },
  all_islands: { title: "Island Hopper", icon: Zap, color: "#3b82f6", message: "You completed all available islands!" },
};

export function MasteryMilestoneNotification() {
  const [milestone, setMilestone] = useState<MilestoneData | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const { data: worlds } = useQuery({
    queryKey: ["worlds", "map"],
    queryFn: async () => {
      const res = await fetch("/api/worlds/map");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: true,
  });

  useEffect(() => {
    if (!worlds?.length) return;

    const masteredCount = worlds.filter((w: { status: string }) => w.status === "mastered").length;
    const hasExplored = worlds.some((w: { status: string }) => w.status !== "locked");
    const allMasters = worlds.length > 0 && worlds.every((w: { status: string }) => w.status === "mastered");

    let key: string | null = null;

    if (allMasters && !dismissed.has("all_islands")) {
      key = "all_islands";
    } else if (masteredCount > 0 && !dismissed.has("world_complete")) {
      key = "world_complete";
    } else if (hasExplored && !dismissed.has("first_island")) {
      key = "first_island";
    }

    if (key) {
      const m = MILESTONES[key];
      setMilestone(m);
      setShow(true);
    }
  }, [worlds, dismissed]);

  function handleDismiss() {
    if (milestone) {
      const key = Object.entries(MILESTONES).find(([, v]) => v.title === milestone.title)?.[0];
      if (key) {
        setDismissed((prev) => new Set(prev).add(key));
      }
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && milestone && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
        >
          <div
            className={cn(
              "flex items-center gap-4 rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-xl",
              "bg-black/90 border-[rgba(255,255,255,0.1)]",
            )}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <milestone.icon className="h-8 w-8" style={{ color: milestone.color }} />
            </motion.div>

            <div>
              <p className="text-sm font-bold text-foreground">{milestone.title}</p>
              <p className="text-xs text-muted-foreground">{milestone.message}</p>
            </div>

            <button
              onClick={handleDismiss}
              className="ml-2 rounded-full p-1 text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
