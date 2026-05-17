import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardAchievementsContent } from "@/components/dashboard/achievements-content";

export default async function DashboardAchievementsPage() {
  const user = await getUser();
  if (!user) return null;

  let achievements: { id: string; name: string; description: string; iconUrl: string | null; xpReward: number }[] = [];
  let earnedAchievementIds: Set<string> = new Set();
  let badges: { id: string; name: string; description: string; iconUrl: string | null; category: string; xpReward: number }[] = [];
  let earnedBadgeIds: Set<string> = new Set();
  let totalXp = 0;

  try {
    [achievements, earnedAchievementIds, badges, earnedBadgeIds, totalXp] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.userAchievement.findMany({ where: { userId: user.id } }).then((u) => new Set(u.map((ua) => ua.achievementId))),
      prisma.badge.findMany({ orderBy: [{ category: "asc" }, { createdAt: "asc" }] }),
      prisma.userBadge.findMany({ where: { userId: user.id } }).then((u) => new Set(u.map((ub) => ub.badgeId))),
      prisma.xPTransaction.aggregate({ where: { userId: user.id }, _sum: { amount: true } }).then((r: { _sum: { amount: number | null } }) => r._sum.amount ?? 0),
    ]);
  } catch {
    // Not available
  }

  return <DashboardAchievementsContent achievements={achievements} earnedAchievementIds={earnedAchievementIds} badges={badges} earnedBadgeIds={earnedBadgeIds} totalXp={totalXp} />;
}
