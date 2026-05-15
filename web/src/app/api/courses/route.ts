import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const status = searchParams.get("status") ?? "published";
  const teacherId = searchParams.get("teacherId");

  const where: Record<string, unknown> = {};

  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;
  if (teacherId) where.teacherId = teacherId;

  const courses = await prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      teacher: { select: { id: true, fullName: true, avatarUrl: true } },
      _count: { select: { modules: true, enrollments: true } },
    },
  });

  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  let userId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Supabase not configured
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createCourseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const course = await prisma.course.create({
    data: {
      ...parsed.data,
      teacherId: userId,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
