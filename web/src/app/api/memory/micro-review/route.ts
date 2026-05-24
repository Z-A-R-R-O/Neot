import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getMicroReview } from "@/lib/gamification/memory-optimizer";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const review = await getMicroReview(userId);
  if (!review) {
    return NextResponse.json({ error: "No reviews due" }, { status: 404 });
  }

  return NextResponse.json(review);
}
