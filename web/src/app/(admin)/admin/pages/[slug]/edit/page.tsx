"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { SectionBuilder } from "@/components/admin/pages/section-builder";
import { usePageBuilderStore, type SectionType } from "@/stores/pageBuilderStore";

interface PageData {
  id: string;
  title: string;
  slug: string;
  path: string;
  status: string;
  layout: string;
}

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setSections, setLoading } = usePageBuilderStore();

  useEffect(() => {
    async function load() {
      try {
        const pageRes = await fetch(`/api/admin/pages/${slug}`);
        if (!pageRes.ok) throw new Error("Page not found");
        const page: PageData & { sections: { id: string; pageId: string; blockType: string; sortOrder: number; content: string; settings: string }[] } = await pageRes.json();

        setPageData({ id: page.id, title: page.title, slug: page.slug, path: page.path, status: page.status, layout: page.layout });

        const sections = (page.sections ?? []).map((s) => ({
          id: s.id,
          pageId: s.pageId,
          blockType: s.blockType as SectionType,
          sortOrder: s.sortOrder,
          content: JSON.parse(s.content),
          settings: JSON.parse(s.settings),
        }));
        setSections(sections);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      setSections([]);
    };
  }, [slug, setSections]);

  if (isLoading) {
    return <LoadingScreen message="Loading page..." />;
  }

  if (error || !pageData) {
    return (
      <div className="p-6">
        <ErrorState message={error ?? "Page not found"} onRetry={() => router.refresh()} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center gap-4 border-b border-gray-200 px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/pages")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {pageData.title}
          </h1>
          <p className="text-xs text-gray-500">
            /admin/pages/{pageData.slug}/edit
          </p>
        </div>
        <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {pageData.status}
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        <SectionBuilder pageId={pageData.id} />
      </div>
    </div>
  );
}
