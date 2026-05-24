import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { logReview } from "@/lib/gamification/memory-optimizer";

const schema = z.object({
  lessonId: z.string(),
  score: z.number().min(0).max(1),
});

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { lessonId, score } = parsed.data;
  await logReview(userId, lessonId, score);

  return NextResponse.json({ success: true });
}
