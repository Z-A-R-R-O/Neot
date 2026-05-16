import { prisma } from "@/lib/db";

export async function getRecommendations(userId: string, limit = 4) {
  const enrolled = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true },
  });
  const enrolledIds = new Set(enrolled.map((e) => e.courseId));

  const userEnrollments = await prisma.enrollment.findMany({
    where: { userId, archived: false },
    include: { course: { select: { categoryId: true } } },
  });

  const categoryCounts = new Map<string, number>();
  for (const e of userEnrollments) {
    if (e.course.categoryId) {
      categoryCounts.set(e.course.categoryId, (categoryCounts.get(e.course.categoryId) ?? 0) + 1);
    }
  }

  let topCategory: string | null = null;
  let maxCount = 0;
  for (const [catId, count] of categoryCounts) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = catId;
    }
  }

  let sameCategory: typeof popular = [];
  if (topCategory) {
    sameCategory = await prisma.course.findMany({
      where: {
        status: "published",
        categoryId: topCategory,
        id: { notIn: Array.from(enrolledIds) },
      },
      include: { category: true, teacher: { select: { fullName: true } } },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    if (sameCategory.length >= limit) return sameCategory;
  }

  const popular = await prisma.course.findMany({
    where: {
      status: "published",
      id: { notIn: Array.from(enrolledIds) },
      ...(topCategory ? { categoryId: { not: topCategory } } : {}),
    },
    include: { category: true, teacher: { select: { fullName: true } } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return [...sameCategory, ...popular].slice(0, limit);
}
