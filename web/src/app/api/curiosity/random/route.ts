import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getRandomCuriosity } from "@/lib/curiosity/curiosity-recommender";

export async function GET() {
  const userId = await getUserId();
  const recommendation = await getRandomCuriosity(userId);
  if (!recommendation) {
    return NextResponse.json({ error: "No curiosities found" }, { status: 404 });
  }
  return NextResponse.json(recommendation);
}
