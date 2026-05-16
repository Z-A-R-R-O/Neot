import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getLevelInfo } from "@/lib/gamification/xp-calculator";
import { getLevelTitle } from "@/lib/gamification/level-system";
import { getRecommendations } from "@/lib/courses/recommendations";

export default async function DashboardPage() {
  const user = await getUser();
  const name = user?.email ? user.email.split("@")[0] : "there";

  let stats = { courses: 0, lessons: 0, xp: 0, streak: 0, level: 1, levelTitle: "Beginner", levelProgress: 0, certificates: 0 };
  let enrollments: {
    id: string;
    progress: number;
    course: {
      id: string;
      title: string;
      description: string | null;
      thumbnailUrl: string | null;
      difficulty: string;
      estimatedMinutes: number | null;
      category: { name: string } | null;
    };
  }[] = [];
  let continueLesson: {
    id: string;
    title: string;
    courseId: string;
    courseTitle: string;
    estimatedMinutes: number | null;
  } | null = null;

  let recommendations: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    difficulty: string;
    category: { name: string } | null;
    teacher: { fullName: string | null } | null;
  }[] = [];

  try {
    const [profile, courseCount, lessonCount, enrolled, lastProgress, certCount, recs] = await Promise.all([
      prisma.profile.findUnique({
        where: { id: user!.id },
        select: { xp: true, level: true, currentStreak: true },
      }),
      prisma.enrollment.count({ where: { userId: user!.id, archived: false } }),
      prisma.lessonProgress.count({ where: { userId: user!.id, status: "completed" } }),
      prisma.enrollment.findMany({
        where: { userId: user!.id, archived: false },
        include: {
          course: { include: { category: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
      prisma.enrollment.findFirst({
        where: { userId: user!.id, lastLessonId: { not: null } },
        orderBy: { lastAccessedAt: "desc" },
        select: {
          lastLessonId: true,
          courseId: true,
          course: { select: { title: true } },
        },
      }),
      prisma.certificate.count({ where: { userId: user!.id } }),
      getRecommendations(user!.id),
    ]);
    recommendations = recs;

    const xp = profile?.xp ?? 0;
    const level = profile?.level ?? 1;
    const levelInfo = getLevelInfo(xp);

    stats = {
      courses: courseCount,
      lessons: lessonCount,
      xp,
      streak: profile?.currentStreak ?? 0,
      level,
      levelTitle: getLevelTitle(level),
      levelProgress: levelInfo.progress,
      certificates: certCount,
    };
    enrollments = enrolled;

    if (lastProgress?.lastLessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lastProgress.lastLessonId },
        select: { id: true, title: true, estimatedMinutes: true },
      });
      if (lesson) {
        continueLesson = {
          id: lesson.id,
          title: lesson.title,
          courseId: lastProgress.courseId,
          courseTitle: lastProgress.course.title,
          estimatedMinutes: lesson.estimatedMinutes,
        };
      }
    }
  } catch {
    // Dashboard data not available
  }

  return <DashboardContent name={name} stats={stats} enrollments={enrollments} continueLesson={continueLesson} recommendations={recommendations} />;
}
