"use client";

import { cn } from "@/lib/utils";
import { Book, Target, Flame, Zap, Code, RefreshCw, Globe, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  book: Book,
  target: Target,
  flame: Flame,
  zap: Zap,
  code: Code,
  refresh: RefreshCw,
  globe: Globe,
  trophy: Trophy,
};

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string | null;
  color: string | null;
  status: string;
  progress: number;
  target: number;
  claimedAt: string | null;
  onClaim?: (id: string) => void;
}

export function QuestCard({
  id,
  title,
  description,
  xpReward,
  icon,
  color,
  status,
  progress,
  target,
  claimedAt,
  onClaim,
}: QuestCardProps) {
  const Icon = iconMap[icon ?? ""] ?? Trophy;
  const isCompleted = status === "completed";
  const isClaimed = !!claimedAt;
  const pct = Math.min((progress / target) * 100, 100);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all",
        isClaimed
          ? "border-green-500/20 bg-green-500/5 opacity-60"
          : isCompleted
            ? "border-yellow-500/30 bg-yellow-500/10"
            : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)]",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: color ? `${color}20` : "rgba(139,92,246,0.1)" }}
        >
          <Icon className="h-5 w-5" style={{ color: color ?? "#8b5cf6" }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <span className="shrink-0 text-xs font-medium" style={{ color: color ?? "#8b5cf6" }}>
              +{xpReward} XP
            </span>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {description.replace("{target}", String(target))}
          </p>

          <div className="mt-3 space-y-1.5">
            <div className="flex h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isClaimed ? "bg-green-500" : isCompleted ? "bg-yellow-500" : "bg-primary-500",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {Math.round(progress)} / {target}
              </span>
              {isClaimed ? (
                <span className="text-green-400">Claimed</span>
              ) : isCompleted ? (
                <button
                  onClick={() => onClaim?.(id)}
                  className="font-medium text-yellow-400 transition-colors hover:text-yellow-300"
                >
                  Claim Reward
                </button>
              ) : (
                <span>{Math.round(pct)}%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
