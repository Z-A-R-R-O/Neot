import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  conceptTitle: z.string(),
  feedbackType: z.enum(["helpful", "too_simple", "too_complex"]),
  feature: z.enum(["story", "simplify"]),
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

  const { conceptTitle, feedbackType, feature } = parsed.data;

  await prisma.xPTransaction.create({
    data: {
      userId,
      amount: 5,
      reason: `ai_feedback_${feature}`,
      referenceId: `${feature}_${conceptTitle}`,
    },
  });

  return NextResponse.json({ success: true });
}
