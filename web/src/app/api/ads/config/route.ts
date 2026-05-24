import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getActiveSlots, getAdPreferences, saveAdPreferences } from "@/lib/ads/ad-manager";

export async function GET(request: Request) {
  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "default";
  const location = searchParams.get("location");

  const slots = await getActiveSlots(page);
  const slot = location ? slots.find((s) => s.location === location) ?? slots[0] : slots[0];

  const prefs = userId ? await getAdPreferences(userId) : null;

  return NextResponse.json({
    enabled: slot?.enabled ?? false,
    slotName: slot?.slotName ?? null,
    adUnit: slot?.adUnit ?? null,
    preferences: prefs,
    slots,
  });
}

export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await saveAdPreferences(userId, body);
  return NextResponse.json({ success: true });
}
