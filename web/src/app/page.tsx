import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";
import { PublicLayout } from "@/components/layout/public-layout";

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
      <main className="bg-background text-foreground">
        {sections && sections.length > 0 ? (
          <PageRenderer sections={sections} />
        ) : (
          <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24">
            <div className="aurora pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,124,255,0.08)_0%,transparent_60%)]" />
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">
                Adaptive Learning Platform
              </p>
              <h1 className="font-heading text-hero font-bold tracking-tight sm:text-hero-xl">
                NEOT
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Learning should adapt to humans. Humans should not adapt to systems.
              </p>
            </div>
          </section>
        )}
      </main>
    </PublicLayout>
  );
}
