"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Zap, Lock, Sparkles, BadgeCheck } from "lucide-react";

const easing = [0.16, 1, 0.3, 1] as const;

interface AchievementItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  xpReward: number;
}

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: string;
  xpReward: number;
}

interface Props {
  achievements: AchievementItem[];
  earnedAchievementIds: Set<string>;
  badges: BadgeItem[];
  earnedBadgeIds: Set<string>;
  totalXp: number;
}

const BADGE_ICONS: Record<string, string> = {
  progress: "📈",
  quiz: "🧠",
  streak: "🔥",
  mastery: "👑",
  social: "🤝",
};

export function DashboardAchievementsContent({ achievements, earnedAchievementIds, badges, earnedBadgeIds, totalXp }: Props) {
  const [tab, setTab] = useState<"achievements" | "badges">("achievements");

  const earned = achievements.filter((a) => earnedAchievementIds.has(a.id));
  const locked = achievements.filter((a) => !earnedAchievementIds.has(a.id));
  const earnedBadges = badges.filter((b) => earnedBadgeIds.has(b.id));
  const lockedBadges = badges.filter((b) => !earnedBadgeIds.has(b.id));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easing }}
      >
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Achievements & Badges
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your milestones and earn rewards.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        className="grid gap-4 sm:grid-cols-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Achievements</p>
              <p className="text-2xl font-bold text-foreground">{earned.length}/{achievements.length}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Badges</p>
              <p className="text-2xl font-bold text-foreground">{earnedBadges.length}/{badges.length}</p>
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
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Locked</p>
              <p className="text-2xl font-bold text-foreground">{locked.length + lockedBadges.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("achievements")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "achievements"
              ? "bg-primary-500/20 text-primary-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setTab("badges")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "badges"
              ? "bg-yellow-500/20 text-yellow-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Badges
        </button>
      </div>

      {tab === "achievements" && (
        <>
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
        </>
      )}

      {tab === "badges" && (
        <>
          {earnedBadges.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground mb-4">
                Earned
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {earnedBadges.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: easing }}
                    whileHover={{ y: -3, transition: { duration: 0.3 } }}
                    className="group relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 shadow-xl transition-all duration-500 hover:border-yellow-500/30 hover:shadow-yellow-500/10"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-yellow-500/10 blur-[50px]" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/20 text-xl">
                        {b.iconUrl ?? BADGE_ICONS[b.category] ?? "🏅"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{b.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-yellow-400">+{b.xpReward} XP</span>
                          <span className="text-[10px] rounded-full bg-yellow-500/10 px-2 py-0.5 text-yellow-400/70 capitalize">
                            {b.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground mb-4">
                Locked
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lockedBadges.map((b, i) => (
                  <motion.div
                    key={b.id}
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
                        <p className="font-semibold text-muted-foreground">{b.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">{b.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground/40">+{b.xpReward} XP</span>
                          <span className="text-[10px] rounded-full bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-muted-foreground/30 capitalize">
                            {b.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {achievements.length === 0 && badges.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          className="glass-card flex items-center justify-center py-20"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Award className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="text-base font-medium text-muted-foreground">No achievements or badges yet</p>
              <p className="mt-1 text-sm text-muted-foreground/60">Complete lessons to earn rewards</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
