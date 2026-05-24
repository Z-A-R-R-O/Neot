import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getDailyQuests, assignDailyQuests } from "@/lib/quests/quest-generator";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let quests = await getDailyQuests(userId);
  if (quests.length === 0) {
    await assignDailyQuests(userId);
    quests = await getDailyQuests(userId);
  }

  return NextResponse.json({ quests });
}
