import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

const upsertProgressSchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]).optional(),
  timeSpent: z.number().int().min(0).optional(),
  score: z.number().min(0).max(100).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: id } },
  });

  return NextResponse.json(progress ?? { status: "not_started", timeSpent: 0 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
  const parsed = upsertProgressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: id } },
  });

  const progress = existing
    ? await prisma.lessonProgress.update({
        where: { id: existing.id },
        data: {
          ...(parsed.data.status && { status: parsed.data.status }),
          ...(parsed.data.timeSpent !== undefined && { timeSpent: parsed.data.timeSpent }),
          ...(parsed.data.score !== undefined && { score: parsed.data.score }),
          ...(parsed.data.metadata && { metadata: JSON.stringify(parsed.data.metadata) }),
        },
      })
    : await prisma.lessonProgress.create({
        data: {
          userId,
          lessonId: id,
          status: parsed.data.status ?? "in_progress",
          timeSpent: parsed.data.timeSpent ?? 0,
          score: parsed.data.score,
          metadata: parsed.data.metadata ? JSON.stringify(parsed.data.metadata) : "{}",
        },
      });

  return NextResponse.json(progress);
}
