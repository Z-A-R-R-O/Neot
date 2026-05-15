import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacherId = user.id;

  const [courses, enrollments, lessonProgresses] = await Promise.all([
    prisma.course.findMany({
      where: { teacherId },
      include: { _count: { select: { enrollments: true, modules: true } } },
    }),
    prisma.enrollment.findMany({
      where: { course: { teacherId } },
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.lessonProgress.findMany({
      where: { lesson: { module: { course: { teacherId } } } },
      select: { status: true, score: true, timeSpent: true, lessonId: true },
    }),
  ]);

  const activeCourses = courses.filter((c) => c.status === "published").length;
  const activeStudents = new Set(enrollments.map((e) => e.userId)).size;

  const completed = lessonProgresses.filter((lp) => lp.status === "completed").length;
  const total = lessonProgresses.length;
  const avgCompletion = total > 0 ? Math.round((completed / total) * 100) : 0;

  const scored = lessonProgresses.filter((lp) => lp.score != null);
  const avgScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, lp) => sum + (lp.score ?? 0), 0) / scored.length)
      : 0;

  const enrollmentsByMonth: Record<string, number> = {};
  for (const e of enrollments) {
    const key = e.createdAt.toISOString().slice(0, 7);
    enrollmentsByMonth[key] = (enrollmentsByMonth[key] ?? 0) + 1;
  }
  const enrollmentTrend = Object.entries(enrollmentsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const funnel = {
    enrolled: enrollments.length,
    started: lessonProgresses.filter((lp) => lp.status !== "not_started").length,
    inProgress: lessonProgresses.filter((lp) => lp.status === "in_progress").length,
    completed,
  };

  const scoreRanges = [0, 0, 0, 0, 0];
  for (const lp of scored) {
    const score = lp.score ?? 0;
    if (score < 20) scoreRanges[0]++;
    else if (score < 40) scoreRanges[1]++;
    else if (score < 60) scoreRanges[2]++;
    else if (score < 80) scoreRanges[3]++;
    else scoreRanges[4]++;
  }
  const scoreDistribution = [
    { range: "0-20%", count: scoreRanges[0] },
    { range: "20-40%", count: scoreRanges[1] },
    { range: "40-60%", count: scoreRanges[2] },
    { range: "60-80%", count: scoreRanges[3] },
    { range: "80-100%", count: scoreRanges[4] },
  ];

  const dropoffCounts: Record<string, number> = {};
  for (const lp of lessonProgresses) {
    dropoffCounts[lp.lessonId] = (dropoffCounts[lp.lessonId] ?? 0) + 1;
  }
  const dropOffPoints = Object.entries(dropoffCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([lessonId, count]) => ({ lessonId, count }));

  return NextResponse.json({
    overview: { activeCourses, activeStudents, avgCompletion, avgScore, totalCourses: courses.length },
    enrollmentTrend,
    funnel: [funnel],
    scoreDistribution,
    dropOffPoints,
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      enrollments: c._count.enrollments,
      modules: c._count.modules,
    })),
  });
}

export type AnalyticsData = {
  overview: {
    activeCourses: number;
    activeStudents: number;
    avgCompletion: number;
    avgScore: number;
    totalCourses: number;
  };
  enrollmentTrend: { month: string; count: number }[];
  funnel: { enrolled: number; started: number; inProgress: number; completed: number }[];
  scoreDistribution: { range: string; count: number }[];
  dropOffPoints: { lessonId: string; count: number }[];
  courses: { id: string; title: string; status: string; enrollments: number; modules: number }[];
};
