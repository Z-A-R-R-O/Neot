import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const path = "/" + slug.join("/");

  const cookieStore = await cookies();
  const previewMode = cookieStore.get("preview_mode")?.value === "1";

  const sp = await searchParams;
  const hasPreviewParam = sp.preview === "1";

  const showDraft = previewMode || hasPreviewParam;

  let page;
  try {
    page = await prisma.customPage.findFirst({
      where: showDraft ? { path } : { path, status: "published" },
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
