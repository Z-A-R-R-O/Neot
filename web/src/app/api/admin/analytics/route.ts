import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    roleCounts,
    totalCourses,
    statusCounts,
    totalEnrollments,
    totalCompletedLessons,
    recentProfiles,
    recentXpTransactions,
    topCourses,
    mauUsers,
    lastMonthUsers,
    retainedUsers,
    totalTimeSpent,
    weeklyActiveUsers,
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.profile.groupBy({ by: ["role"], _count: { id: true } }),
    prisma.course.count(),
    prisma.course.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.enrollment.count(),
    prisma.lessonProgress.count({ where: { status: "completed" } }),
    prisma.profile.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    }),
    prisma.xPTransaction.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true, userId: true },
    }),
    prisma.course.findMany({
      orderBy: { enrollments: { _count: "desc" } },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        teacher: { select: { fullName: true } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.xPTransaction.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.profile.count({
      where: { createdAt: { lt: thirtyDaysAgo } },
    }),
    prisma.xPTransaction.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.lessonProgress.aggregate({
      where: { updatedAt: { gte: thirtyDaysAgo } },
      _sum: { timeSpent: true },
    }),
    prisma.xPTransaction.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      select: { userId: true },
      distinct: ["userId"],
    }),
  ]);

  const roleDist = roleCounts.map((r) => ({ role: r.role, count: r._count.id }));
  const statusDist = statusCounts.map((s) => ({ status: s.status, count: s._count.id }));

  const dayMap: Record<string, { signups: number; activeUsers: Set<string> }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = { signups: 0, activeUsers: new Set() };
  }

  for (const p of recentProfiles) {
    const key = new Date(p.createdAt).toISOString().slice(0, 10);
    if (dayMap[key]) dayMap[key].signups++;
  }

  for (const tx of recentXpTransactions) {
    const key = new Date(tx.createdAt).toISOString().slice(0, 10);
    if (dayMap[key]) dayMap[key].activeUsers.add(tx.userId);
  }

  const dailyStats = Object.entries(dayMap).map(([date, data]) => ({
    date,
    signups: data.signups,
    dau: data.activeUsers.size,
  }));

  const mau = mauUsers.length;
  const retentionRate = lastMonthUsers > 0
    ? Math.round((retainedUsers.length / lastMonthUsers) * 100)
    : 0;

  const totalTime = totalTimeSpent._sum.timeSpent ?? 0;
  const avgDailyLessons = Math.round((totalCompletedLessons / 30) * 10) / 10;

  const dau = new Set(recentXpTransactions.map((tx) => tx.userId)).size;
  const mauRatio = totalUsers > 0 ? Math.round((mau / totalUsers) * 100) : 0;

  return NextResponse.json({
    overview: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalCompletedLessons,
    },
    engagement: {
      dau,
      mau,
      wau: weeklyActiveUsers.length,
      mauRatio,
      retentionRate,
      totalTimeSpent: totalTime,
      avgDailyLessons,
    },
    roleDistribution: roleDist,
    statusDistribution: statusDist,
    dailyStats,
    topCourses: topCourses.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      teacher: c.teacher.fullName ?? "Unknown",
      enrollments: c._count.enrollments,
    })),
  });
}
