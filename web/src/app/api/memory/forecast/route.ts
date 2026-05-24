import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getMasteryForecast } from "@/lib/gamification/memory-optimizer";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const forecast = await getMasteryForecast(userId);
  return NextResponse.json(forecast);
}
