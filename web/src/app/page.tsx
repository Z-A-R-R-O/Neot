import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";

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

  if (sections && sections.length > 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <PageRenderer sections={sections} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
          Adaptive Learning Platform
        </p>
        <h1 className="font-heading text-5xl font-bold sm:text-7xl">NEOT</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Learning should adapt to humans. Humans should not adapt to systems.
        </p>
      </section>
    </main>
  );
}
