import { prisma } from "@/lib/db";

export interface CuriosityRecommendation {
  id: string;
  title: string;
  description: string | null;
  difficulty: number;
  difficultyLabel: string;
  domain: string;
  icon: string | null;
  color: string | null;
  islandTitle: string | null;
  worldTitle: string | null;
  worldId: string | null;
  islandId: string | null;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function difficultyLabel(d: number): string {
  if (d <= 1) return "Beginner";
  if (d <= 2) return "Easy";
  if (d <= 3) return "Intermediate";
  if (d <= 4) return "Advanced";
  return "Expert";
}

export async function getCuriosityRecommendations(
  userId: string | null,
  count: number = 5,
): Promise<CuriosityRecommendation[]> {
  const concepts = await prisma.concept.findMany({
    take: 200,
    orderBy: { createdAt: "desc" },
    include: {
      world: { select: { title: true, world: { select: { id: true, title: true } } } },
    },
  });

  let scored = concepts.map((c) => {
    let score = Math.random();
    if (c.description) score += 0.3;
    if (c.icon) score += 0.2;
    score += (c.difficulty / 5) * 0.2;
    return { concept: c, score };
  });

  if (userId) {
    const masteredSkills = await prisma.skillMastery.findMany({
      where: { userId, score: { gte: 0.8 } },
      select: { skillId: true },
    });
    const masteredIds = new Set(masteredSkills.map((m) => m.skillId));

    const skillMap = await prisma.skill.findMany({
      where: { id: { in: [...masteredIds] } },
      select: { id: true, name: true },
    });
    const masteredConceptNames = new Set(skillMap.map((s) => s.name.toLowerCase()));

    scored = scored.filter((s) => !masteredConceptNames.has(s.concept.title.toLowerCase()));
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(count * 3, scored.length));
  const picks = pickRandom(top, count);

  return picks.map((p) => ({
    id: p.concept.id,
    title: p.concept.title,
    description: p.concept.description,
    difficulty: p.concept.difficulty,
    domain: p.concept.domain,
    icon: p.concept.icon,
    color: p.concept.color,
    islandTitle: p.concept.world?.title ?? null,
    worldTitle: p.concept.world?.world?.title ?? null,
    worldId: p.concept.world?.world?.id ?? null,
    islandId: p.concept.islandId,
    difficultyLabel: difficultyLabel(p.concept.difficulty),
  }));
}

export async function getRandomCuriosity(
  userId: string | null,
): Promise<CuriosityRecommendation | null> {
  const recs = await getCuriosityRecommendations(userId, 1);
  return recs[0] ?? null;
}
