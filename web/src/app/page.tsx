import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";
import { PublicLayout } from "@/components/layout/public-layout";
import { HeroSection } from "@/components/blocks/sections/hero-section";
import { AdaptiveStreamSection } from "@/components/blocks/sections/adaptive-stream-section";
import { CtaBannerSection } from "@/components/blocks/sections/cta-banner-section";
import { AdaptiveTimelineSection } from "@/components/blocks/sections/adaptive-timeline-section";
import { LiveEcosystemSection } from "@/components/blocks/sections/live-ecosystem-section";
import { FutureSelfDnaSection } from "@/components/blocks/sections/future-self-dna-section";
import { IntelligenceCorridor } from "@/components/blocks/sections/intelligence-corridor";
import { AiMentorPresence } from "@/components/blocks/sections/ai-mentor-presence";
import { BreathingInterlude } from "@/components/blocks/sections/breathing-interlude";
import { InvisibleContinuity } from "@/components/blocks/sections/invisible-continuity";
import { buildPageMetadata, getGlobalSeoSettings } from "@/lib/seo";

async function getHomepageSections() {
  try {
    const page = await prisma.customPage.findFirst({
      where: { slug: "home", status: "published" },
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    });
    if (!page) return null;
    return {
      sections: page.sections.map((s: { id: string; blockType: string; content: string }) => ({
        id: s.id,
        blockType: s.blockType,
        content: JSON.parse(s.content) as Record<string, unknown>,
      })),
      seo: JSON.parse((page as { seo?: string }).seo ?? "{}") as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [result, global] = await Promise.all([
    getHomepageSections(),
    getGlobalSeoSettings(),
  ]);
  const seo = result?.seo;
  return buildPageMetadata(seo, { title: "NEOT — Learning That Adapts to You" }, global);
}

export default async function Home() {
  const result = await getHomepageSections();
  const sections = result?.sections ?? null;

  return (
    <PublicLayout>
      <main className="relative bg-background text-foreground">
        {/* Global atmospheric background — optimized for performance */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-[10%] top-[15%] h-[500px] w-[500px] rounded-full bg-blue-200/8 dark:bg-blue-500/3 blur-[100px]" />
          <div className="absolute right-[5%] top-[35%] h-[400px] w-[400px] rounded-full bg-purple-200/5 dark:bg-purple-500/2 blur-[100px]" />
          <div className="absolute left-[30%] top-[55%] h-[300px] w-[300px] rounded-full bg-cyan-200/4 dark:bg-cyan-500/2 blur-[80px]" />
        </div>

        {/* Persistent continuity energy line — scroll-reactive thread through all sections */}
        <InvisibleContinuity />

        {sections && sections.length > 0 ? (
          <PageRenderer sections={sections} />
        ) : (
          <>
            {/* ════════════════════════════════════════
                ACT I: DISCOVERY
                Emotional tone: Awe, curiosity
                ════════════════════════════════════════ */}

            {/* 1. HERO — Cinematic adaptive AI */}
            <HeroSection content={{}} />

            <IntelligenceCorridor scene="cosmic" variant="default" />

            {/* ════════════════════════════════════════
                ACT II: JOURNEY
                Emotional tone: Comprehension, direction
                ════════════════════════════════════════ */}

            {/* 2. YOUR ADAPTIVE JOURNEY — Path evolves dynamically
                  Motion: flowing directional energy. Layout: right-heavy */}
            <AdaptiveTimelineSection />

            {/* BREATHING INTERLUDE — Pause. Minimal. Atmospheric.
                Creates rhythm after the journey section */}
            <BreathingInterlude
              line="Intelligence is not static. Neither are you."
              variant="cosmic"
            />

            {/* 3. ADAPTIVE INTELLIGENCE STREAM — System intelligence visualization
                  Motion: pulse/data transfer. Layout: centered */}
            <AdaptiveStreamSection />

            <IntelligenceCorridor scene="system" variant="dense" />

            {/* ════════════════════════════════════════
                ACT III: COLLECTIVE
                Emotional tone: Connection, energy
                ════════════════════════════════════════ */}

            {/* 4. LIVE LEARNING ECOSYSTEM — Collective learning alive in real time
                  Motion: live feed energy. Layout: full-width */}
            <LiveEcosystemSection />

            <IntelligenceCorridor scene="identity" variant="light" />

            {/* ════════════════════════════════════════
                ACT IV: IDENTITY
                Emotional tone: Self-discovery, personalization
                ════════════════════════════════════════ */}

            {/* 5. FUTURE SELF + YOUR LEARNING DNA — Combined identity and transformation */}
            <FutureSelfDnaSection />

            {/* BREATHING INTERLUDE — Transition into climax
                Creates anticipation before the final CTA */}
            <BreathingInterlude
              line="This is what transformation looks like."
              variant="transformation"
            />

            <IntelligenceCorridor scene="climax" variant="dense" />

            {/* ════════════════════════════════════════
                ACT V: TRANSFORMATION
                Emotional tone: Climax, future self
                ════════════════════════════════════════ */}

            {/* 7. IMMERSIVE CTA — Final conversion moment
                  Full-width immersive. Transformation moment. */}
            <CtaBannerSection
              content={{}}
              blockId="fallback-cta"
            />
          </>
        )}

        <AiMentorPresence />
      </main>
    </PublicLayout>
  );
}
