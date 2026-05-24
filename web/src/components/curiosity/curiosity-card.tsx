"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles, Lightbulb, Code, Palette, Brain, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const domainIcons: Record<string, LucideIcon> = {
  coding: Code,
  design: Palette,
  science: Brain,
  language: Globe,
  math: BookOpen,
};

const difficultyColors: Record<number, string> = {
  1: "text-green-400 bg-green-500/10",
  2: "text-blue-400 bg-blue-500/10",
  3: "text-yellow-400 bg-yellow-500/10",
  4: "text-orange-400 bg-orange-500/10",
  5: "text-red-400 bg-red-500/10",
};

interface CuriosityCardProps {
  title: string;
  description: string | null;
  difficulty: number;
  difficultyLabel: string;
  domain: string;
  icon: string | null;
  color: string | null;
  islandTitle: string | null;
  worldTitle: string | null;
  worldId: string | null;
}

export function CuriosityCard({
  title,
  description,
  difficulty,
  difficultyLabel: diffLabel,
  domain,
  icon,
  color,
  islandTitle,
  worldTitle,
}: CuriosityCardProps) {
  const DomainIcon = domainIcons[domain] ?? Lightbulb;
  const diffColor = difficultyColors[difficulty] ?? difficultyColors[1];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group cursor-pointer rounded-xl border border-[rgba(255,255,255,0.06)] p-5 transition-all duration-300",
        "bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)]",
        "hover:shadow-lg hover:shadow-[rgba(0,0,0,0.15)]",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: color ? `${color}20` : "rgba(139,92,246,0.1)" }}
        >
          {icon ?? <DomainIcon className="h-6 w-6" style={{ color: color ?? "#8b5cf6" }} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <Sparkles className="h-3.5 w-3.5 text-yellow-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", diffColor)}>
              {diffLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,255,255,0.04)] px-2 py-0.5 text-[10px] text-muted-foreground">
              <DomainIcon className="h-3 w-3" />
              {domain}
            </span>
            {(worldTitle || islandTitle) && (
              <span className="text-[10px] text-muted-foreground/60">
                {islandTitle ?? worldTitle}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
