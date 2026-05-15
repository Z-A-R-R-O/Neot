"use client";

import { motion } from "framer-motion";
import { Award, Zap, Lock, Sparkles } from "lucide-react";

const easing = [0.16, 1, 0.3, 1] as const;

interface AchievementItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  xpReward: number;
}

interface Props {
  achievements: AchievementItem[];
  earnedIds: Set<string>;
  totalXp: number;
}

export function DashboardAchievementsContent({ achievements, earnedIds, totalXp }: Props) {
  const earned = achievements.filter((a) => earnedIds.has(a.id));
  const locked = achievements.filter((a) => !earnedIds.has(a.id));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easing }}
      >
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Achievements
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your milestones and earn rewards.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Earned</p>
              <p className="text-2xl font-bold text-foreground">{earned.length}/{achievements.length}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total XP</p>
              <p className="text-2xl font-bold text-foreground">{totalXp}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Locked</p>
              <p className="text-2xl font-bold text-foreground">{locked.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Earned */}
      {earned.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground mb-4">
            Earned
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {earned.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easing }}
                whileHover={{ y: -3, transition: { duration: 0.3 } }}
                className="group relative overflow-hidden rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 shadow-xl transition-all duration-500 hover:border-primary-500/30 hover:shadow-primary-500/10"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary-500/10 blur-[50px]" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{a.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                    <p className="mt-2 text-xs text-primary-400">+{a.xpReward} XP</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground mb-4">
            Locked
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easing }}
                className="group relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] p-5 shadow-xl opacity-60"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.03)] text-muted-foreground/40">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">{a.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">{a.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground/40">+{a.xpReward} XP</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          className="glass-card flex items-center justify-center py-20"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Award className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="text-base font-medium text-muted-foreground">No achievements yet</p>
              <p className="mt-1 text-sm text-muted-foreground/60">Complete lessons to earn achievements</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
