"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, AlertCircle, Calendar, ChevronRight, Brain, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MicroReview } from "./micro-review";

interface ReviewItem {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  skillName: string;
  masteryScore: number;
  daysSinceLastReview: number;
  nextReviewDate: string;
  urgency: "due" | "overdue" | "upcoming";
  interval: number;
  predictedRetention: number;
  reviewCount: number;
}

interface ReviewSummary {
  total: number;
  overdue: number;
  due: number;
  upcoming: number;
  nextReview: ReviewItem | null;
  averageRetention: number;
  reviewStreak: number;
}

const urgencyConfig = {
  overdue: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "Overdue" },
  due: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Due" },
  upcoming: { icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Upcoming" },
};

export function ReviewDashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery<ReviewSummary>({
    queryKey: ["memory", "review-summary"],
    queryFn: async () => {
      const res = await fetch("/api/memory/review-queue?type=summary");
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    },
  });

  const { data, isLoading, error, refetch, isRefetching } = useQuery<{ reviews: ReviewItem[] }>({
    queryKey: ["memory", "review-queue"],
    queryFn: async () => {
      const res = await fetch("/api/memory/review-queue?limit=50");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const { data: forecast } = useQuery({
    queryKey: ["memory", "forecast"],
    queryFn: async () => {
      const res = await fetch("/api/memory/forecast");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading || summaryLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;

  const reviews = data?.reviews ?? [];

  return (
    <div className="space-y-8">
      <MicroReview />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Strengthen your memory with spaced repetition
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isRefetching} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Overdue", value: summary.overdue, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
            { label: "Due Today", value: summary.due, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Upcoming", value: summary.upcoming, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Retention", value: `${summary.averageRetention}%`, icon: Brain, color: "text-green-400", bg: "bg-green-500/10" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5"
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="All caught up!"
          description="You have no reviews due. Great job staying on top of your learning!"
        />
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Review Queue</h2>
          <div className="space-y-2">
            {reviews.map((review, i) => {
              const config = urgencyConfig[review.urgency];
              const Icon = config.icon;
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/courses/${review.courseId}/lessons/${review.lessonId}`}
                    className="block"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-[rgba(255,255,255,0.04)]",
                        "border-[rgba(255,255,255,0.06)]",
                      )}
                    >
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-foreground">{review.lessonTitle}</span>
                          <Badge variant="outline" className={cn("text-[10px]", config.color)}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{review.skillName}</span>
                          <span>·</span>
                          <span>{review.masteryScore}% mastery</span>
                          <span>·</span>
                          <span>{review.daysSinceLastReview}d since review</span>
                          <span>·</span>
                          <span className={review.predictedRetention < 50 ? "text-red-400" : "text-green-400"}>
                            {review.predictedRetention}% retention
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {forecast && forecast.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Mastery Forecast</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {forecast.slice(0, 6).map((f: { skillId: string; skillName: string; currentScore: number; sessionsToMastery: number; estimatedDaysToMastery: number; nextMilestone: string; trend: string }, i: number) => (
              <motion.div
                key={f.skillId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.skillName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Current: {f.currentScore}%</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    f.trend === "improving" ? "bg-green-500/10 text-green-400" :
                    f.trend === "declining" ? "bg-red-500/10 text-red-400" :
                    "bg-blue-500/10 text-blue-400",
                  )}>
                    <TrendingUp className="h-3 w-3" />
                    {f.trend}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{f.sessionsToMastery} sessions to mastery</span>
                  <span>·</span>
                  <span>~{f.estimatedDaysToMastery} days</span>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Next: {f.nextMilestone}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
