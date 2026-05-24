import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCached, setCache } from "@/lib/api-cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cacheKey = `skill-tree:${id}`;
  const cached = getCached<{ nodes: unknown[]; edges: unknown[] }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=120", "X-Cache": "HIT" },
    });
  }

  const world = await prisma.learningWorld.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!world) {
    return NextResponse.json({ error: "World not found" }, { status: 404 });
  }

  const islandIds = await prisma.island.findMany({
    where: { worldId: id },
    select: { id: true },
  });

  const concepts = await prisma.concept.findMany({
    where: { islandId: { in: islandIds.map((i) => i.id) } },
    include: {
      prerequisites: { select: { prerequisiteId: true } },
      dependents: { select: { conceptId: true } },
    },
    orderBy: { order: "asc" },
  });

  const nodes = concepts.map((c) => ({
    id: c.id,
    title: c.title,
    difficulty: c.difficulty,
    domain: c.domain,
    icon: c.icon,
    color: c.color,
    order: c.order,
    islandId: c.islandId,
  }));

  const edges: { from: string; to: string }[] = [];
  for (const c of concepts) {
    for (const p of c.prerequisites) {
      edges.push({ from: p.prerequisiteId, to: c.id });
    }
  }

  const result = { nodes, edges };
  setCache(cacheKey, result, 120000);

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=120" },
  });
}