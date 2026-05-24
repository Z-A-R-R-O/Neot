"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Lock,
  Globe,
  CheckCircle2,
  Compass,
  Sparkles,
  ChevronRight,
  Trophy,
} from "lucide-react";

interface WorldNode {
  id: string;
  title: string;
  description: string | null;
  theme: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  islandCount: number;
  status: string;
  completed: number;
  total: number;
  progress: number;
}

function WorldNodeCard({ world, index }: { world: WorldNode; index: number }) {
  const isLocked = world.status === "locked";
  const isMastered = world.status === "mastered";
  const isExploring = world.status === "exploring";
  const isUnlocked = world.status === "unlocked";
  const nodeColor = world.color ?? "#3b82f6";

  return (
    <Link href={isLocked ? "#" : `/worlds/${world.id}`} className={cn("block", isLocked && "pointer-events-none")}>
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "group relative rounded-xl border p-5 transition-all duration-300",
          "bg-[rgba(255,255,255,0.02)]",
          isLocked
            ? "border-[rgba(255,255,255,0.04)] opacity-40"
            : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)] hover:shadow-lg hover:shadow-[rgba(0,0,0,0.2)]",
        )}
        style={!isLocked ? { borderColor: `${nodeColor}30`, boxShadow: `0 0 20px ${nodeColor}08` } : undefined}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform duration-300",
              !isLocked && "group-hover:scale-110",
            )}
            style={{ backgroundColor: `${nodeColor}18` }}
          >
            {isLocked ? <Lock className="h-6 w-6 text-muted-foreground" /> : world.icon ?? "🌍"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={cn("text-lg font-semibold", isLocked ? "text-muted-foreground" : "text-foreground")}>
                {world.title}
              </h3>
              {isMastered && (
                <Badge variant="default" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                  <Trophy className="mr-1 h-3 w-3" /> Mastered
                </Badge>
              )}
              {isExploring && (
                <Badge variant="default" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                  <Compass className="mr-1 h-3 w-3" /> Exploring
                </Badge>
              )}
              {isUnlocked && (
                <Badge variant="outline" className="text-muted-foreground">
                  Unlocked
                </Badge>
              )}
            </div>

            {world.description && (
              <p className={cn("mt-1 text-sm line-clamp-1", isLocked ? "text-muted-foreground/50" : "text-muted-foreground")}>
                {world.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{world.islandCount} {world.islandCount === 1 ? "island" : "islands"}</span>
              {world.total > 0 && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span>{world.completed}/{world.total} completed</span>
                </>
              )}
            </div>

            {world.total > 0 && (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: nodeColor }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${world.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLocked && (
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-1" />
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export function WorldMapView() {
  const { data: worlds, isLoading, error } = useQuery<WorldNode[]>({
    queryKey: ["worlds", "map"],
    queryFn: async () => {
      const res = await fetch("/api/worlds/map");
      if (!res.ok) throw new Error("Failed to load world map");
      return res.json();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!worlds?.length) {
    return (
      <EmptyState
        icon={Globe}
        title="No worlds available"
        description="Learning worlds are being created. Check back soon!"
      />
    );
  }

  return (
    <TooltipProvider>
      <div>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-foreground">World Map</h1>
          <p className="mt-2 text-muted-foreground">
            Your learning journey across themed worlds
          </p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted" />

          <div className="relative space-y-6">
            {worlds.map((world, i) => (
              <div key={world.id} className={cn("relative pl-16", i === worlds.length - 1 && "pb-0")}>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.1 }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-all duration-300",
                          world.status === "mastered" ? "border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]" :
                          world.status === "exploring" ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]" :
                          world.status === "unlocked" ? "border-muted-foreground" :
                          "border-muted",
                        )}
                      >
                        {world.status === "mastered" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : world.status === "exploring" ? (
                          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        ) : world.status === "unlocked" ? (
                          <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span className="capitalize">{world.status}</span>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <WorldNodeCard world={world} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
