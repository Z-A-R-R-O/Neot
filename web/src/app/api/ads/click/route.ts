import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { logAdInteraction } from "@/lib/ads/ad-manager";

const schema = z.object({
  page: z.string(),
  location: z.string(),
  adUnit: z.string().optional(),
  sponsorId: z.string().optional(),
});

export async function POST(request: Request) {
  const userId = await getUserId();
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { page, location, sponsorId } = parsed.data;
  await logAdInteraction(userId ?? null, `${page}_${location}`, page, location, "click", sponsorId);

  return NextResponse.json({ success: true });
}
