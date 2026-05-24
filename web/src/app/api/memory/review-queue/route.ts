import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getReviewQueue, getReviewSummary } from "@/lib/gamification/memory-optimizer";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "list";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "20") || 20, 1), 100);

  if (type === "summary") {
    const summary = await getReviewSummary(userId);
    return NextResponse.json(summary);
  }

  const reviews = await getReviewQueue(userId, limit);
  return NextResponse.json({ reviews });
}
