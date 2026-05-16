import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";
import { PublicLayout } from "@/components/layout/public-layout";
import { HeroSection } from "@/components/blocks/sections/hero-section";
import { StatsBarSection } from "@/components/blocks/sections/stats-bar-section";
import { FeatureGridSection } from "@/components/blocks/sections/feature-grid-section";
import { HowItWorksSection } from "@/components/blocks/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/blocks/sections/testimonials-section";
import { CtaBannerSection } from "@/components/blocks/sections/cta-banner-section";

const defaultContent = {
  features: {
    cards: [
      {
        title: "Adaptive Learning Engine",
        description: "Our AI analyzes your knowledge gaps and learning pace in real time, creating a personalized curriculum that evolves as you progress.",
        icon: "brain",
      },
      {
        title: "Real-Time Progress Analytics",
        description: "Track your improvement with detailed insights, performance trends, and adaptive recommendations.",
        icon: "chart",
      },
      {
        title: "Interactive Practice Modules",
        description: "Hands-on exercises, quizzes, and challenges that adapt to your skill level. Every question is calibrated to maximize retention.",
        icon: "target",
      },
      {
        title: "AI-Powered Insights",
        description: "Identify weak spots before they become problems with predictive analysis and proactive recommendations.",
        icon: "lightning",
      },
    ],
  },
  stats: {
    items: [
      { number: "50000", label: "Active Learners", suffix: "+" },
      { number: "98", label: "Retention Rate", suffix: "%" },
      { number: "1500", label: "Courses", suffix: "+" },
      { number: "94", label: "Satisfaction", suffix: "%" },
    ],
  },
  testimonials: {
    items: [
      { name: "Sarah Chen", role: "Computer Science Student", text: "The adaptive curriculum adjusted to my pace instantly. I finished my course in half the expected time." },
      { name: "Marcus Johnson", role: "Data Analyst", text: "Finally, a platform that actually adapts to how I learn. The AI recommendations are uncannily accurate." },
      { name: "Elena Rodriguez", role: "Medical Student", text: "The practice modules are incredible. They identify exactly where I need to focus before exams." },
    ],
  },
  cta: {
    text: "Ready to transform how you learn?",
    buttonText: "Get Started Free",
    buttonLink: "/signup",
  },
};

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
        {/* Global atmospheric background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          {/* Giant gradient orbs across the page */}
          <div className="absolute left-[10%] top-[15%] h-[700px] w-[700px] rounded-full bg-blue-200/10 dark:bg-blue-500/5 blur-[180px] animate-ambient-float" />
          <div className="absolute right-[5%] top-[35%] h-[600px] w-[600px] rounded-full bg-purple-200/8 dark:bg-purple-500/4 blur-[160px] animate-ambient-float" style={{ animationDelay: "-5s" }} />
          <div className="absolute left-[30%] top-[55%] h-[500px] w-[500px] rounded-full bg-cyan-200/6 dark:bg-cyan-500/3 blur-[140px] animate-ambient-float" style={{ animationDelay: "-10s" }} />
          <div className="absolute right-[25%] top-[75%] h-[450px] w-[450px] rounded-full bg-pink-200/5 dark:bg-pink-500/3 blur-[120px] animate-ambient-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute left-[40%] top-[90%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-primary-200/8 dark:bg-primary-500/4 blur-[160px] animate-ambient-float" style={{ animationDelay: "-14s" }} />

          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }} />

          {/* Ultra-light grid pattern */}
          <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
        </div>

        {/* Section bridge transition */}
        <div className="section-bridge" />

        {sections && sections.length > 0 ? (
          <PageRenderer sections={sections} />
        ) : (
          <>
            <HeroSection content={{}} />

            <div className="section-bridge -mt-20" />

            <StatsBarSection
              content={defaultContent.stats}
              blockId="fallback-stats"
            />

            <div className="section-bridge -mt-16" />

            <FeatureGridSection
              content={defaultContent.features}
              blockId="fallback-features"
            />

            <div className="section-bridge -mt-16" />

            <HowItWorksSection />

            <div className="section-bridge -mt-16" />

            <TestimonialsSection
              content={defaultContent.testimonials}
              blockId="fallback-testimonials"
            />

            <div className="section-bridge -mt-16" />

            <CtaBannerSection
              content={defaultContent.cta}
              blockId="fallback-cta"
            />
          </>
        )}
      </main>
    </PublicLayout>
  );
}
