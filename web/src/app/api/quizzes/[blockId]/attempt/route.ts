import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { saveQuizAttempt } from "@/lib/supabase/queries/quizzes";

const attemptSchema = z.object({
  lessonId: z.string().uuid(),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.record(z.string(), z.unknown()),
  timeSpent: z.number().int().min(0),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ blockId: string }> },
) {
  const { blockId } = await params;

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
  const parsed = attemptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const attempt = await saveQuizAttempt(userId, parsed.data.lessonId, blockId, {
    score: parsed.data.score,
    total: parsed.data.total,
    answers: parsed.data.answers,
    timeSpent: parsed.data.timeSpent,
  });

  return NextResponse.json(attempt, { status: 201 });
}
