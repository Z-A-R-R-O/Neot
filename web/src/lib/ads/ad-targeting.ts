import { prisma } from "@/lib/db";

export interface AdTarget {
  keyword: string;
  relevanceScore: number;
  adUnit: string | null;
}

const AD_TARGETS: Record<string, { keywords: string[]; adUnit: string }> = {
  python: { keywords: ["python", "coding", "programming"], adUnit: "python_course_ad" },
  javascript: { keywords: ["javascript", "web", "frontend"], adUnit: "js_course_ad" },
  ai: { keywords: ["ai", "machine learning", "neural", "deep learning"], adUnit: "ai_course_ad" },
  data: { keywords: ["data", "analytics", "sql", "database"], adUnit: "data_course_ad" },
  design: { keywords: ["design", "ui", "ux", "figma"], adUnit: "design_tool_ad" },
  math: { keywords: ["math", "algebra", "calculus", "statistics"], adUnit: "math_course_ad" },
};

export async function getRelevantAds(
  page: string,
  conceptTitle?: string,
  domain?: string,
): Promise<AdTarget[]> {
  const results: AdTarget[] = [];

  const searchText = [page, conceptTitle, domain].filter(Boolean).join(" ").toLowerCase();

  for (const [key, config] of Object.entries(AD_TARGETS)) {
    const matches = config.keywords.filter((kw) => searchText.includes(kw)).length;
    if (matches > 0) {
      results.push({
        keyword: key,
        relevanceScore: matches / config.keywords.length,
        adUnit: config.adUnit,
      });
    }
  }

  const sponsored = await prisma.sponsoredPath.findMany({
    where: { isActive: true },
  });

  for (const sponsor of sponsored) {
    try {
      const conceptIds: string[] = JSON.parse(sponsor.conceptIds);
      if (conceptTitle && conceptIds.some((c) => c.toLowerCase() === conceptTitle?.toLowerCase())) {
        results.push({
          keyword: sponsor.sponsorName,
          relevanceScore: 0.9,
          adUnit: `sponsored_${sponsor.id}`,
        });
      }
    } catch {
      // skip malformed conceptIds
    }
  }

  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results.slice(0, 3);
}

export function computeRelevanceScore(
  conceptDomain: string,
  adKeywords: string[],
  userInterests: string[],
): number {
  let score = 0;

  for (const kw of adKeywords) {
    if (conceptDomain.toLowerCase().includes(kw)) score += 0.4;
    if (userInterests.some((i) => i.toLowerCase().includes(kw))) score += 0.3;
  }

  return Math.min(score, 1);
}
