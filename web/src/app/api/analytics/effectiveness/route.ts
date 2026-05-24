import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalStudents, activeStudents, totalEvents, recentEvents, questCompletions, storiesViewed, worldsStarted, worldsCompleted] = await Promise.all([
      prisma.profile.count({ where: { role: "student" } }),
      prisma.profile.count({ where: { role: "student", lastActivityDate: { gte: sevenDaysAgo } } }),
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({ where: { timestamp: { gte: sevenDaysAgo } } }),
      prisma.analyticsEvent.count({ where: { type: "quest_completed", timestamp: { gte: thirtyDaysAgo } } }),
      prisma.analyticsEvent.count({ where: { type: "story_viewed", timestamp: { gte: thirtyDaysAgo } } }),
      prisma.worldProgress.count({ where: { status: "exploring" } }),
      prisma.worldProgress.count({ where: { status: "completed" } }),
    ]);

    return NextResponse.json({
      totalStudents,
      activeStudents,
      engagementRate: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0,
      totalEvents,
      recentEvents,
      questCompletions,
      storiesViewed,
      worldsStarted,
      worldsCompleted,
      period: { from: sevenDaysAgo.toISOString(), to: new Date().toISOString() },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
