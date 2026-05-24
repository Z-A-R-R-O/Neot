import { prisma } from "@/lib/db";

export interface AdSlotConfig {
  page: string;
  location: string;
  slotName: string;
  adUnit: string | null;
  enabled: boolean;
}

export interface AdPreferencesData {
  interests: string[];
  maxAdsPerPage: number;
  allowSponsored: boolean;
  allowPersonalized: boolean;
}

export type AdSize = "sidebar" | "banner" | "in-feed" | "leaderboard";

const PLACEMENT_STRATEGY: Record<string, { location: string; size: AdSize; priority: number }[]> = {
  "lesson": [
    { location: "sidebar", size: "sidebar", priority: 10 },
    { location: "between-sections", size: "in-feed", priority: 5 },
  ],
  "worlds": [
    { location: "between-cards", size: "in-feed", priority: 5 },
    { location: "footer", size: "banner", priority: 1 },
  ],
  "dashboard": [
    { location: "footer", size: "banner", priority: 1 },
  ],
  "default": [
    { location: "footer", size: "banner", priority: 1 },
  ],
};

export async function getActiveSlots(page: string): Promise<AdSlotConfig[]> {
  const fromDb = await prisma.adPlacement.findMany({
    where: { page, enabled: true },
    orderBy: { priority: "desc" },
  });

  if (fromDb.length > 0) {
    return fromDb.map((p) => ({
      page: p.page,
      location: p.location,
      slotName: p.slotName,
      adUnit: p.adUnit,
      enabled: p.enabled,
    }));
  }

  const strategy = PLACEMENT_STRATEGY[page] ?? PLACEMENT_STRATEGY["default"];
  return strategy.map((s) => ({
    page,
    location: s.location,
    slotName: `${page}_${s.location}`,
    adUnit: null,
    enabled: true,
  }));
}

export async function getAdPreferences(userId: string): Promise<AdPreferencesData> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { metadata: true },
  });

  if (profile?.metadata) {
    try {
      const parsed = JSON.parse(profile.metadata);
      if (parsed.adPreferences) return parsed.adPreferences as AdPreferencesData;
    } catch {
      // fall through
    }
  }

  return { interests: [], maxAdsPerPage: 2, allowSponsored: true, allowPersonalized: false };
}

export async function saveAdPreferences(userId: string, prefs: AdPreferencesData): Promise<void> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { metadata: true },
  });

  const metadata = profile?.metadata ? JSON.parse(profile.metadata) : {};
  metadata.adPreferences = prefs;

  await prisma.profile.update({
    where: { id: userId },
    data: { metadata: JSON.stringify(metadata) },
  });
}

export async function logAdInteraction(
  userId: string | null,
  slotName: string,
  page: string,
  location: string,
  type: "impression" | "click",
  sponsorId?: string,
): Promise<void> {
  await prisma.adImpression.create({
    data: {
      userId: userId ?? undefined,
      slotName,
      page,
      location,
      type,
      sponsorId,
    },
  });

  if (type === "impression" && sponsorId) {
    await prisma.sponsoredPath.update({
      where: { id: sponsorId },
      data: { currentImpressions: { increment: 1 } },
    });
  }
}

export function shouldShowAd(adsSeen: number, maxAds: number): boolean {
  return adsSeen < maxAds;
}
