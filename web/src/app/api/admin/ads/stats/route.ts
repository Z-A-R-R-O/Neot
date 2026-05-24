import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.profile.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [impressions, clicks, sponsored, placements] = await Promise.all([
    prisma.adImpression.count({ where: { type: "impression" } }),
    prisma.adImpression.count({ where: { type: "click" } }),
    prisma.sponsoredPath.count({ where: { isActive: true } }),
    prisma.adPlacement.count({ where: { enabled: true } }),
  ]);

  return NextResponse.json({
    impressions,
    clicks,
    clickRate: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + "%" : "0%",
    activeSponsors: sponsored,
    activePlacements: placements,
    recentImpressions: await prisma.adImpression.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  });
}
