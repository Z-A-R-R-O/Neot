import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";

const feedbackSchema = z.object({
  lessonId: z.string(),
  difficultyRating: z.enum(["too_easy", "just_right", "too_hard"]),
});

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { lessonId, difficultyRating } = parsed.data;

  const difficultyScore =
    difficultyRating === "too_easy" ? -1 :
    difficultyRating === "too_hard" ? 1 : 0;

  return NextResponse.json({
    success: true,
    lessonId,
    rating: difficultyRating,
    adjustment: difficultyScore,
  });
}