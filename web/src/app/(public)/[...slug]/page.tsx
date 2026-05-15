import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const path = "/" + slug.join("/");

  let page;
  try {
    page = await prisma.customPage.findFirst({
      where: { path, status: "published" },
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    });
  } catch {
    notFound();
  }

  if (!page) notFound();

  const sections = page.sections.map((s: { id: string; blockType: string; content: string }) => ({
    id: s.id,
    blockType: s.blockType,
    content: JSON.parse(s.content) as Record<string, unknown>,
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageRenderer sections={sections} />
    </main>
  );
}
