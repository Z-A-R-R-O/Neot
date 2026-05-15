import { prisma } from "@/lib/db";

export async function getLessonWithModule(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          courseId: true,
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  return lesson;
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  return progress ?? { status: "not_started", timeSpent: 0, score: null };
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  data: {
    status?: string;
    timeSpent?: number;
    score?: number | null;
    metadata?: Record<string, unknown>;
  },
) {
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  if (existing) {
    return prisma.lessonProgress.update({
      where: { id: existing.id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.timeSpent !== undefined && { timeSpent: data.timeSpent }),
        ...(data.score !== undefined && { score: data.score }),
        ...(data.metadata && { metadata: JSON.stringify(data.metadata) }),
      },
    });
  }

  return prisma.lessonProgress.create({
    data: {
      userId,
      lessonId,
      status: data.status ?? "in_progress",
      timeSpent: data.timeSpent ?? 0,
      score: data.score ?? null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : "{}",
    },
  });
}

export async function getCourseProgress(userId: string, courseId: string) {
  const modules = await prisma.module.findMany({
    where: { courseId },
    select: {
      id: true,
      lessons: {
        select: { id: true },
      },
    },
  });

  const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
  if (lessonIds.length === 0) return 0;

  const completed = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: lessonIds },
      status: "completed",
    },
  });

  return Math.round((completed / lessonIds.length) * 100);
}
