import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userId = await getUserId();

  const worlds = await prisma.learningWorld.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { islands: true } },
    },
  });

  let islandProgressMap: Record<string, { completed: number; total: number; status: string }> = {};
  if (userId) {
    const progress = await prisma.worldProgress.findMany({
      where: { userId },
      include: { island: { select: { worldId: true } } },
    });
    for (const p of progress) {
      const wid = p.island?.worldId;
      if (!wid) continue;
      if (!islandProgressMap[wid]) {
        islandProgressMap[wid] = { completed: 0, total: 0, status: "locked" };
      }
      islandProgressMap[wid].total++;
      if (p.status === "completed") islandProgressMap[wid].completed++;
      if (p.status === "in_progress") islandProgressMap[wid].status = "exploring";
    }
    for (const wid of Object.keys(islandProgressMap)) {
      const ip = islandProgressMap[wid];
      if (ip.completed > 0 && ip.completed === ip.total) {
        ip.status = "mastered";
      } else if (ip.status === "exploring") {
        ip.status = "exploring";
      } else if (ip.completed > 0) {
        ip.status = "exploring";
      } else {
        ip.status = "unlocked";
      }
    }
  }

  let previousMastered = true;
  const result = worlds.map((w, i) => {
    const progress = islandProgressMap[w.id] ?? { completed: 0, total: 0, status: i === 0 ? "unlocked" : previousMastered ? "unlocked" : "locked" };
    const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

    if (progress.status === "mastered") previousMastered = true;

    return {
      id: w.id,
      title: w.title,
      description: w.description,
      theme: w.theme,
      icon: w.icon,
      color: w.color,
      order: w.order,
      islandCount: w._count.islands,
      status: progress.status,
      completed: progress.completed,
      total: progress.total,
      progress: pct,
    };
  });

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}
