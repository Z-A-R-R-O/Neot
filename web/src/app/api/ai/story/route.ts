import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { generateStory, generateStoryFallback } from "@/lib/ai/story-generator";

const schema = z.object({
  conceptTitle: z.string().min(1),
  conceptDescription: z.string().nullable().optional(),
  difficulty: z.enum(["simple", "normal", "advanced"]).optional().default("normal"),
  studentLevel: z.string().optional().default("teen"),
  interests: z.array(z.string()).optional().default([]),
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

  const { conceptTitle, conceptDescription, difficulty, studentLevel, interests } = parsed.data;

  try {
    const result = await generateStory(conceptTitle, conceptDescription ?? null, difficulty, studentLevel, interests, userId);
    return NextResponse.json(result);
  } catch {
    const fallback = await generateStoryFallback(conceptTitle, conceptDescription ?? null);
    return NextResponse.json(fallback);
  }
}
