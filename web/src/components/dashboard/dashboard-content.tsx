"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Zap, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const easing = [0.16, 1, 0.3, 1] as const;

interface DashboardContentProps {
  name: string;
  stats: { courses: number; lessons: number; xp: number };
}

interface StatCard {
  label: string;
  value: number;
  icon: typeof BookOpen;
  gradient: string;
  delay: number;
}

export function DashboardContent({ name, stats }: DashboardContentProps) {
  return (
    <div className="space-y-10">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easing }}
      >
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome back, <span className="gradient-text-accent">{name}</span>!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your learning journey.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {([
          { label: "Enrolled Courses", value: stats.courses, icon: BookOpen, gradient: "from-primary-500/20 via-primary-500/5 to-transparent", delay: 0 },
          { label: "Completed Lessons", value: stats.lessons, icon: CheckCircle, gradient: "from-accent-500/20 via-accent-500/5 to-transparent", delay: 0.1 },
          { label: "XP Points", value: stats.xp, icon: Zap, gradient: "from-secondary-500/20 via-secondary-500/5 to-transparent", delay: 0.2 },
        ] as StatCard[]).map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: card.delay, ease: easing }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6 shadow-xl transition-all duration-500 hover:border-[rgba(255,255,255,0.12)] hover:shadow-primary-500/10"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-500/5 blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-primary-400">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Courses Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easing }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Active Courses
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue where you left off
            </p>
          </div>
          <Link
            href="/courses"
            className="group flex items-center gap-1 text-sm font-medium text-primary-400 transition-colors hover:text-primary-300"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="glass-card flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">No active courses yet</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Enroll in a course to get started</p>
            </div>
            <Link
              href="/courses"
              className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-xl bg-foreground px-6 text-sm font-semibold text-background transition-all hover:shadow-glow-sm"
            >
              Browse Courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: easing }}
      >
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground mb-6">
          Insights
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6 shadow-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-500/10 blur-[60px]" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Learning Streak</p>
                <p className="mt-1 text-2xl font-bold text-foreground">0 days</p>
                <p className="mt-1 text-xs text-muted-foreground">Start a streak by completing a lesson today</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6 shadow-xl">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-500/10 blur-[60px]" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Total XP</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats.xp}</p>
                <p className="mt-1 text-xs text-muted-foreground">Complete lessons to earn more XP</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
