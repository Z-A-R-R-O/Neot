"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorState } from "@/components/ui/error-state";
import { SectionBuilder } from "@/components/admin/pages/section-builder";
import { usePageBuilderStore, type SectionType } from "@/stores/pageBuilderStore";
import { DevModeToggle } from "@/components/dev-mode/DevModeToggle";
import { ResponsiveBar } from "@/components/dev-mode/ResponsiveBar";
import { HistoryPanel } from "@/components/dev-mode/HistoryPanel";
import { PublishButton } from "@/components/dev-mode/PublishButton";
import { DevModeProvider } from "@/components/dev-mode/DevModeProvider";
import { useDevModeStore } from "@/stores/devModeStore";

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

  const { setSections, setLoading, sections, isDirty } = usePageBuilderStore();
  const enabled = useDevModeStore((s) => s.enabled);

  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const handlePublish = async () => {
    setLoading(true);
    try {
      for (const section of sections) {
        const isNew = !section.id.includes("-");
        if (isNew) {
          await fetch(`/api/admin/pages/${pageData!.id}/sections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blockType: section.blockType,
              sortOrder: section.sortOrder,
              content: JSON.stringify(section.content),
              settings: JSON.stringify(section.settings),
            }),
          });
        } else {
          await fetch(`/api/admin/pages/${pageData!.id}/sections/${section.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sortOrder: section.sortOrder,
              content: JSON.stringify(section.content),
              settings: JSON.stringify(section.settings),
            }),
          });
        }
      }
      const res = await fetch(`/api/admin/pages/${pageData!.id}/sections`);
      const serverSections = await res.json();
      setSections(
        serverSections.map((s: { id: string; pageId: string; blockType: string; sortOrder: number; content: string; settings: string }) => ({
          id: s.id,
          pageId: s.pageId,
          blockType: s.blockType as SectionType,
          sortOrder: s.sortOrder,
          content: JSON.parse(s.content),
          settings: JSON.parse(s.settings),
        })),
      );
      useDevModeStore.getState().disable();
      setToast({ message: "Published!", variant: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Failed to publish", err);
      setToast({ message: "Failed to publish", variant: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

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
    <DevModeProvider>
      {toast && (
        <div
          className={`fixed right-4 top-20 z-[100] rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.variant === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        {/* Top Toolbar */}
        <div className="z-50 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50"
              onClick={() => router.push("/admin/pages")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Pages /
              </span>
              <h1 className="text-xs font-semibold text-foreground">
                {pageData.title}
              </h1>
              <span className="ml-2 rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-medium text-primary-400 ring-1 ring-inset ring-primary-500/20">
                {pageData.status}
              </span>
            </div>
          </div>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
            <ResponsiveBar />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <HistoryPanel />
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <DevModeToggle />
            <PublishButton
              onPublish={handlePublish}
              isDirty={isDirty}
            />
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 overflow-hidden">
          <SectionBuilder pageId={pageData.id} />
        </div>
      </div>
    </DevModeProvider>
  );
}
