"use client";

import { useCallback } from "react";
import { Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionPalette } from "@/components/admin/pages/section-palette";
import { SectionWrapper } from "@/components/admin/pages/section-wrapper";
import { HeroEditor } from "@/components/admin/pages/section-editors/hero-editor";
import { FeatureGridEditor } from "@/components/admin/pages/section-editors/feature-grid-editor";
import { StatsBarEditor } from "@/components/admin/pages/section-editors/stats-bar-editor";
import { CtaEditor } from "@/components/admin/pages/section-editors/cta-editor";
import { FaqEditor } from "@/components/admin/pages/section-editors/faq-editor";
import { PricingEditor } from "@/components/admin/pages/section-editors/pricing-editor";
import { LivePreview } from "@/components/admin/pages/live-preview";
import {
  usePageBuilderStore,
  type SectionType,
  type PageSection,
} from "@/stores/pageBuilderStore";

const defaultContent: Record<SectionType, Record<string, unknown>> = {
  hero: { title: "", subtitle: "", ctaText: "Get Started", ctaLink: "/signup", background: "color" },
  "feature-grid": { columns: 3, cards: [] },
  "course-carousel": { heading: "Popular Courses", count: 6 },
  "stats-bar": { items: [] },
  testimonials: { items: [] },
  "cta-banner": { text: "", buttonText: "Get Started", buttonLink: "/signup", background: "primary" },
  faq: { items: [] },
  "pricing-table": { plans: [] },
  "custom-html": { html: "" },
};

interface SectionBuilderProps {
  pageId: string;
  onSave?: () => void;
}

export function SectionBuilder({ pageId, onSave }: SectionBuilderProps) {
  const {
    sections,
    selectedId,
    isDirty,
    isLoading,
    addSection,
    updateSection,
    setSections,
    setLoading,
    markClean,
  } = usePageBuilderStore();

  function handleAddSection(blockType: SectionType) {
    const newSection: PageSection = {
      id: crypto.randomUUID(),
      pageId,
      blockType,
      sortOrder: sections.length,
      content: { ...defaultContent[blockType] },
      settings: {},
    };
    addSection(newSection);
  }

  function handleContentChange(id: string, content: Record<string, unknown>) {
    updateSection(id, { content });
  }

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      for (const section of usePageBuilderStore.getState().sections) {
        const isNew = !section.id.includes("-");
        if (isNew) {
          await fetch(`/api/admin/pages/${pageId}/sections`, {
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
          await fetch(`/api/admin/pages/${pageId}/sections/${section.id}`, {
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

      const res = await fetch(`/api/admin/pages/${pageId}/sections`);
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
      markClean();
      onSave?.();
    } catch (err) {
      console.error("Failed to save sections", err);
    } finally {
      setLoading(false);
    }
  }, [pageId, onSave, setLoading, setSections, markClean]);

  const selectedSection = sections.find((s) => s.id === selectedId);

  function renderEditor() {
    if (!selectedSection) {
      return (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Select a section to edit its content
        </div>
      );
    }

    const editorProps = {
      content: selectedSection.content,
      onChange: (content: Record<string, unknown>) =>
        handleContentChange(selectedSection.id, content),
    };

    switch (selectedSection.blockType) {
      case "hero":
        return <HeroEditor {...editorProps} />;
      case "feature-grid":
        return <FeatureGridEditor {...editorProps} />;
      case "stats-bar":
        return <StatsBarEditor {...editorProps} />;
      case "cta-banner":
        return <CtaEditor {...editorProps} />;
      case "faq":
        return <FaqEditor {...editorProps} />;
      case "pricing-table":
        return <PricingEditor {...editorProps} />;
      default:
        return (
          <div className="text-sm text-gray-500">
            No editor available for {selectedSection.blockType} yet.
          </div>
        );
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50 p-4">
        <SectionPalette onAdd={handleAddSection} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Sections</h2>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>

        <div className="flex flex-1">
          <div className="flex-1 overflow-y-auto p-6">
            {sections.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                Click a section type from the palette to add it
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, idx) => (
                  <SectionWrapper
                    key={section.id}
                    sectionId={section.id}
                    blockType={section.blockType}
                    isFirst={idx === 0}
                    isLast={idx === sections.length - 1}
                  >
                    {renderEditor()}
                  </SectionWrapper>
                ))}
              </div>
            )}
          </div>

          <div className="w-96 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
              {selectedSection
                ? `Edit: ${selectedSection.blockType}`
                : "Properties"}
            </h3>
            {renderEditor()}
          </div>
        </div>
      </div>

      <div className="w-96 shrink-0 overflow-y-auto">
        <LivePreview />
      </div>
    </div>
  );
}
