import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getCuriosityRecommendations } from "@/lib/curiosity/curiosity-recommender";

export async function GET(request: Request) {
  const userId = await getUserId();
  const url = new URL(request.url);
  const count = Math.min(Math.max(parseInt(url.searchParams.get("count") ?? "5") || 5, 1), 20);

  const recommendations = await getCuriosityRecommendations(userId, count);
  return NextResponse.json(recommendations);
}
