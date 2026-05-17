import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type");

  if (!q || q.length < 2) {
    return NextResponse.json({ courses: [], lessons: [], teachers: [], categories: [], tags: [] });
  }

  const isAll = !type || type === "all";

  const tasks: Promise<unknown>[] = [];
  const keys: string[] = [];

  if (isAll || type === "course") {
    tasks.push(
      prisma.course.findMany({
        where: {
          status: "published",
          deletedAt: null,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { subject: { contains: q } },
            { tags: { some: { tag: { name: { contains: q } } } } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailUrl: true,
          difficulty: true,
          subject: true,
          teacher: { select: { fullName: true } },
          tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        },
        take: 20,
      })
    );
    keys.push("courses");
  }

  if (isAll || type === "teacher") {
    tasks.push(
      prisma.profile.findMany({
        where: {
          role: "teacher",
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
          ],
        },
        select: { id: true, fullName: true, email: true },
        take: 5,
      })
    );
    keys.push("teachers");
  }

  if (isAll || type === "lesson") {
    tasks.push(
      prisma.lesson.findMany({
        where: {
          status: "published",
          deletedAt: null,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: {
          id: true,
          title: true,
          module: {
            select: {
              title: true,
              course: {
                select: { title: true },
              },
            },
          },
        },
        take: 10,
      })
    );
    keys.push("lessons");
  }

  if (isAll || type === "category") {
    tasks.push(
      prisma.category.findMany({
        where: {
          name: { contains: q },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
      })
    );
    keys.push("categories");
  }

  if (isAll || type === "tag") {
    tasks.push(
      prisma.tag.findMany({
        where: {
          name: { contains: q },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
      })
    );
    keys.push("tags");
  }

  const results = await Promise.all(tasks);

  const response: Record<string, unknown[]> = {
    courses: [],
    lessons: [],
    teachers: [],
    categories: [],
    tags: [],
  };

  for (let i = 0; i < keys.length; i++) {
    response[keys[i]] = results[i] as unknown[];
  }

  if (response.courses.length > 0) {
    const lq = q.toLowerCase();
    response.courses.sort((a: unknown, b: unknown) => {
      const ca = a as Record<string, unknown>;
      const cb = b as Record<string, unknown>;
      const aTitle = (ca.title as string).toLowerCase().includes(lq);
      const bTitle = (cb.title as string).toLowerCase().includes(lq);
      const aDesc = ((ca.description as string) ?? "").toLowerCase().includes(lq);
      const bDesc = ((cb.description as string) ?? "").toLowerCase().includes(lq);
      const aTag = (ca.tags as { tag: { name: string } }[]).some(
        (t) => t.tag.name.toLowerCase().includes(lq),
      );
      const bTag = (cb.tags as { tag: { name: string } }[]).some(
        (t) => t.tag.name.toLowerCase().includes(lq),
      );
      const scoreA = (aTitle ? 3 : 0) + (aDesc ? 2 : 0) + (aTag ? 1 : 0);
      const scoreB = (bTitle ? 3 : 0) + (bDesc ? 2 : 0) + (bTag ? 1 : 0);
      return scoreB - scoreA;
    });
  }

  return NextResponse.json(response);
}
