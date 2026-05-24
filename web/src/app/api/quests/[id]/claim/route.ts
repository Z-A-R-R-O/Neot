import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { claimQuestReward } from "@/lib/quests/quest-generator";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await claimQuestReward(userId, id);
    return NextResponse.json({ success: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to claim reward" },
      { status: 400 },
    );
  }
}
