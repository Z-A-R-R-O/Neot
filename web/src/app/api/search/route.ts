import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ courses: [], lessons: [], teachers: [] });
  }

  const [courses, teachers] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { subject: { contains: q } },
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
      },
      take: 10,
    }),
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
    }),
  ]);

  return NextResponse.json({ courses, teachers });
}
