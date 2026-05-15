import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

const enrollSchema = z.object({
  courseId: z.string().uuid(),
});

export async function GET() {
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Supabase not configured
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          difficulty: true,
          estimatedMinutes: true,
          teacher: { select: { fullName: true } },
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(enrollments);
}

export async function POST(request: Request) {
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Supabase not configured
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = enrollSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: parsed.data.courseId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already enrolled in this course" },
      { status: 409 },
    );
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId: parsed.data.courseId,
      progress: 0,
    },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
