import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

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

  return NextResponse.json({
    overview: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalCompletedLessons,
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
