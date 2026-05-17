import { NextResponse } from "next/server";

import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const course = await prisma.course.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      teacher: { select: { id: true, fullName: true, avatarUrl: true } },
      modules: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" },
            select: { id: true, title: true, sortOrder: true, estimatedMinutes: true },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.course.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (existing.teacherId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const wasDraft = existing.status !== "published";
  const course = await prisma.course.update({
    where: { id },
    data: body,
  });

  if (wasDraft && course.status === "published") {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: id },
      select: { userId: true },
    });
    if (enrollments.length > 0) {
      await prisma.notification.createMany({
        data: enrollments.map((e) => ({
          userId: e.userId,
          type: "course_publish",
          title: `Course Published: ${course.title}`,
          message: `${course.title} is now available. Start learning!`,
          link: `/courses/${id}`,
        })),
      });
    }
  }

  return NextResponse.json(course);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.course.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (existing.teacherId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.course.update({
    where: { id },
    data: { status: "archived" },
  });

  return NextResponse.json({ success: true });
}
