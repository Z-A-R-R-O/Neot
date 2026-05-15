import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLeaderboardContent } from "@/components/dashboard/leaderboard-content";

export default async function DashboardLeaderboardPage() {
  const user = await getUser();
  if (!user) return null;

  let leaderboard: { id: string; fullName: string | null; avatarUrl: string | null; totalXp: number }[] = [];
  let userRank = 0;

  try {
    const xpData = await prisma.xPTransaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 50,
    });

    const userIds = xpData.map((x: { userId: string }) => x.userId);
    const profiles = await prisma.profile.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, avatarUrl: true },
    });

    const profileMap = new Map(profiles.map((p: { id: string; fullName: string | null; avatarUrl: string | null }) => [p.id, p]));

    leaderboard = xpData.map((x: { userId: string; _sum: { amount: number | null } }) => ({
      id: x.userId,
      fullName: profileMap.get(x.userId)?.fullName ?? null,
      avatarUrl: profileMap.get(x.userId)?.avatarUrl ?? null,
      totalXp: x._sum.amount ?? 0,
    }));

    userRank = leaderboard.findIndex((e) => e.id === user.id) + 1;
  } catch {
    // Not available
  }

  return <DashboardLeaderboardContent leaderboard={leaderboard} currentUserId={user.id} userRank={userRank} />;
}
