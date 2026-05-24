import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { simplifyConcept, simplifyFallback } from "@/lib/ai/concept-simplifier";

const schema = z.object({
  conceptTitle: z.string().min(1),
  conceptDescription: z.string().nullable().optional(),
  level: z.enum(["eli5", "kid", "teen", "normal", "detailed"]).optional().default("teen"),
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

  const { conceptTitle, conceptDescription, level } = parsed.data;

  try {
    const result = await simplifyConcept(conceptTitle, conceptDescription ?? null, level, userId);
    return NextResponse.json(result);
  } catch {
    const fallback = simplifyFallback(conceptTitle, conceptDescription ?? null, level);
    return NextResponse.json(fallback);
  }
}
