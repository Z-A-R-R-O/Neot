import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardAchievementsContent } from "@/components/dashboard/achievements-content";

export default async function DashboardAchievementsPage() {
  const user = await getUser();
  if (!user) return null;

  let achievements: { id: string; name: string; description: string; iconUrl: string | null; xpReward: number }[] = [];
  let earnedIds: Set<string> = new Set();
  let totalXp = 0;

  try {
    [achievements, earnedIds, totalXp] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.userAchievement.findMany({ where: { userId: user.id } }).then((u) => new Set(u.map((ua) => ua.achievementId))),
      prisma.xPTransaction.aggregate({ where: { userId: user.id }, _sum: { amount: true } }).then((r: { _sum: { amount: number | null } }) => r._sum.amount ?? 0),
    ]);
  } catch {
    // Not available
  }

  return <DashboardAchievementsContent achievements={achievements} earnedIds={earnedIds} totalXp={totalXp} />;
}
