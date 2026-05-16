import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";
import { PublicLayout } from "@/components/layout/public-layout";
import { HeroSection } from "@/components/blocks/sections/hero-section";
import { AdaptiveStreamSection } from "@/components/blocks/sections/adaptive-stream-section";
import { CtaBannerSection } from "@/components/blocks/sections/cta-banner-section";
import { KnowledgeConstellationSection } from "@/components/blocks/sections/knowledge-constellation-section";
import { AdaptiveTimelineSection } from "@/components/blocks/sections/adaptive-timeline-section";
import { LiveEcosystemSection } from "@/components/blocks/sections/live-ecosystem-section";
import { FutureSelfSection } from "@/components/blocks/sections/future-self-section";
import { AchievementEcosystemSection } from "@/components/blocks/sections/achievement-ecosystem-section";
import { LearningDnaSection } from "@/components/blocks/sections/learning-dna-section";
import { IntelligenceCorridor } from "@/components/blocks/sections/intelligence-corridor";
import { AiMentorPresence } from "@/components/blocks/sections/ai-mentor-presence";
import { BreathingInterlude } from "@/components/blocks/sections/breathing-interlude";
import { InvisibleContinuity } from "@/components/blocks/sections/invisible-continuity";

async function getHomepageSections() {
  try {
    const page = await prisma.customPage.findFirst({
      where: { slug: "home", status: "published" },
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    });
    if (!page) return null;
    return page.sections.map((s: { id: string; blockType: string; content: string }) => ({
      id: s.id,
      blockType: s.blockType,
      content: JSON.parse(s.content) as Record<string, unknown>,
    }));
  } catch {
    return null;
  }
}

export default async function Home() {
  const sections = await getHomepageSections();

  return (
    <PublicLayout>
      <main className="relative bg-background text-foreground">
        {/* Global atmospheric background — persists across all sections */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-[10%] top-[15%] h-[700px] w-[700px] rounded-full bg-blue-200/10 dark:bg-blue-500/5 blur-[180px] animate-ambient-float" />
          <div className="absolute right-[5%] top-[35%] h-[600px] w-[600px] rounded-full bg-purple-200/8 dark:bg-purple-500/4 blur-[160px] animate-ambient-float" style={{ animationDelay: "-5s" }} />
          <div className="absolute left-[30%] top-[55%] h-[500px] w-[500px] rounded-full bg-cyan-200/6 dark:bg-cyan-500/3 blur-[140px] animate-ambient-float" style={{ animationDelay: "-10s" }} />
          <div className="absolute right-[25%] top-[75%] h-[450px] w-[450px] rounded-full bg-pink-200/5 dark:bg-pink-500/3 blur-[120px] animate-ambient-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute left-[40%] top-[90%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-primary-200/8 dark:bg-primary-500/4 blur-[160px] animate-ambient-float" style={{ animationDelay: "-14s" }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }} />
          <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
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

            {/* 1. HERO — Adaptive intelligence awakens */}
            <HeroSection content={{}} />

            <IntelligenceCorridor scene="cosmic" variant="default" />

            {/* 2. KNOWLEDGE CONSTELLATION — Explore the universe
                  Motion: orbital/network. Layout: left-heavy */}
            <KnowledgeConstellationSection />

            <IntelligenceCorridor scene="system" variant="dense" />

            {/* ════════════════════════════════════════
                ACT II: INTELLIGENCE
                Emotional tone: Comprehension, power
                ════════════════════════════════════════ */}

            {/* 3. AI LEARNING ENGINE — System intelligence visualization
                  Motion: pulse/data transfer. Layout: centered */}
            <AdaptiveStreamSection />

            <IntelligenceCorridor scene="system" variant="light" />

            {/* 4. ADAPTIVE JOURNEY — Path evolves dynamically
                  Motion: flowing directional energy. Layout: right-heavy */}
            <AdaptiveTimelineSection />

            {/* BREATHING INTERLUDE — Pause. Minimal. Atmospheric.
                Creates rhythm after the dense journey section */}
            <BreathingInterlude
              line="Intelligence is not static. Neither are you."
              variant="cosmic"
            />

            {/* 5. ACHIEVEMENT ECOSYSTEM — Growth visualization
                  Motion: progressive unlocks. Layout: asymmetric */}
            <AchievementEcosystemSection />

            <IntelligenceCorridor scene="growth" variant="dense" />

            {/* ════════════════════════════════════════
                ACT III: COLLECTIVE
                Emotional tone: Connection, energy
                ════════════════════════════════════════ */}

            {/* 6. LIVE ECOSYSTEM — Collective learning alive in real time
                  Motion: live feed energy. Layout: full-width */}
            <LiveEcosystemSection />

            <IntelligenceCorridor scene="identity" variant="light" />

            {/* ════════════════════════════════════════
                ACT IV: IDENTITY
                Emotional tone: Self-discovery, personalization
                ════════════════════════════════════════ */}

            {/* 7. COGNITIVE FINGERPRINT — Personalized intelligence identity
                  Motion: organic morphing. Layout: left-heavy with organic visuals */}
            <LearningDnaSection />

            <IntelligenceCorridor scene="cosmic" variant="default" />

            {/* 8. FUTURE SELF PROJECTION — Transformation visualized
                  Motion: evolving identity. Layout: timeline */}
            <FutureSelfSection />

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

            {/* 9. EMOTIONAL CLIMAX CTA — Not a card. An environment.
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
