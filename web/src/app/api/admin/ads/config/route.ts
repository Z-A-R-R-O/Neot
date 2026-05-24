import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

const placementSchema = z.object({
  id: z.string().optional(),
  page: z.string(),
  location: z.string(),
  slotName: z.string(),
  adUnit: z.string().nullable().optional(),
  enabled: z.boolean().optional().default(true),
  priority: z.number().optional().default(0),
});

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

  const placements = await prisma.adPlacement.findMany({ orderBy: [{ page: "asc" }, { priority: "desc" }] });
  const sponsors = await prisma.sponsoredPath.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({ placements, sponsors });
}

export async function POST(request: Request) {
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

  const body = await request.json();
  const parsed = placementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { id, ...data } = parsed.data;
  const placement = id
    ? await prisma.adPlacement.update({ where: { id }, data })
    : await prisma.adPlacement.create({ data });

  return NextResponse.json(placement, { status: 201 });
}
