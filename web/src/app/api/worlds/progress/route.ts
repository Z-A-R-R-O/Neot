import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { XP_REWARDS } from "@/lib/gamification/xp-calculator";

const updateProgressSchema = z.object({
  islandId: z.string(),
  worldId: z.string().optional(),
  status: z.enum(["locked", "unlocked", "in_progress", "completed"]),
  progress: z.number().min(0).max(1).optional(),
});

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProgressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { islandId, worldId, status, progress } = parsed.data;
  const wasCompleted = status === "completed";

  const result = await prisma.worldProgress.upsert({
    where: { userId_islandId: { userId, islandId } },
    update: {
      status,
      ...(progress !== undefined ? { progress } : {}),
      ...(wasCompleted ? { xpEarned: XP_REWARDS.ISLAND_COMPLETE, completedAt: new Date(), worldId: worldId ?? undefined } : {}),
    },
    create: {
      userId,
      islandId,
      worldId: worldId ?? undefined,
      status,
      progress: progress ?? 0,
      xpEarned: wasCompleted ? XP_REWARDS.ISLAND_COMPLETE : 0,
      startedAt: status === "in_progress" ? new Date() : undefined,
      completedAt: wasCompleted ? new Date() : undefined,
    },
  });

  let xpAwarded = 0;
  let worldCompleted = false;
  let worldXpAwarded = 0;

  if (wasCompleted) {
    xpAwarded = XP_REWARDS.ISLAND_COMPLETE;

    await prisma.xPTransaction.create({
      data: {
        userId,
        amount: XP_REWARDS.ISLAND_COMPLETE,
        reason: "island_complete",
        referenceId: islandId,
      },
    });

    if (worldId) {
      const allIslands = await prisma.island.findMany({
        where: { worldId },
        select: { id: true },
      });
      const islandIds = allIslands.map((i) => i.id);

      const completedProgress = await prisma.worldProgress.findMany({
        where: { userId, islandId: { in: islandIds }, status: "completed" },
      });

      if (completedProgress.length === islandIds.length) {
        worldCompleted = true;
        worldXpAwarded = XP_REWARDS.WORLD_COMPLETE;

        await prisma.xPTransaction.create({
          data: {
            userId,
            amount: XP_REWARDS.WORLD_COMPLETE,
            reason: "world_complete",
            referenceId: worldId,
          },
        });
      }
    }
  }

  return NextResponse.json({
    result,
    xpAwarded,
    worldCompleted,
    worldXpAwarded,
  }, { status: 201 });
}
