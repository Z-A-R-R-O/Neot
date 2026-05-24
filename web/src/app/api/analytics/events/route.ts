import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const events = body.events ?? [body];

    await prisma.analyticsEvent.createMany({
      data: events.map((e: Record<string, unknown>) => ({
        userId: userId ?? (e.userId as string) ?? null,
        type: e.type as string,
        metadata: JSON.stringify(e),
        timestamp: new Date((e.timestamp as string) ?? Date.now()),
      })),
    });

    return NextResponse.json({ success: true, count: events.length });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
