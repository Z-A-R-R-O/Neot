"use client";

import { useCallback, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionPalette } from "@/components/admin/pages/section-palette";
import { SectionWrapper } from "@/components/admin/pages/section-wrapper";
import { LivePreview } from "@/components/admin/pages/live-preview";
import { editorRegistry } from "@/lib/editor-registry";
import {
  usePageBuilderStore,
  type SectionType,
  type PageSection,
} from "@/stores/pageBuilderStore";
import { useDevModeStore } from "@/stores/devModeStore";
import { StructureTree } from "@/components/dev-mode/StructureTree";
import { PropertiesPanel } from "@/components/dev-mode/PropertiesPanel";
import { PresetPicker } from "@/components/dev-mode/PresetPicker";
import { getPresets } from "@/lib/block-presets";

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
    removeSection,
    selectSection,
  } = usePageBuilderStore();
  const devModeEnabled = useDevModeStore((s) => s.enabled);
  const devSelectedId = useDevModeStore((s) => s.selectedId);

  // Sync devModeStore selection → pageBuilderStore selection
  useEffect(() => {
    if (devModeEnabled && devSelectedId !== selectedId) {
      selectSection(devSelectedId);
    }
  }, [devSelectedId, devModeEnabled, selectedId, selectSection]);

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
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          Select a section to edit its content
        </div>
      );
    }

    const Editor = editorRegistry.get(selectedSection.blockType);

    if (!Editor) {
      return (
        <div className="text-sm text-muted-foreground">
          No editor available for {selectedSection.blockType} yet.
        </div>
      );
    }

    return (
      <Editor
        content={selectedSection.content}
        onChange={(content: Record<string, unknown>) =>
          handleContentChange(selectedSection.id, content)
        }
      />
    );
  }

  const treeNodes = sections.map((s) => ({
    id: s.id,
    type: s.blockType,
    label: s.blockType,
    children: [] as { id: string; type: string; label: string }[],
  }));

  function handleApplyPreset(preset: { type: string; schema: { content: Record<string, unknown> } }) {
    if (!selectedSection) return;
    updateSection(selectedSection.id, { content: preset.schema.content });
  }

  if (devModeEnabled) {
    return (
      <div className="flex h-full dark">
        <div className="flex w-64 shrink-0 flex-col border-r border-border bg-background">
          <StructureTree
            blocks={treeNodes}
            onAddBlock={() => handleAddSection("hero")}
            onSelect={(id) => selectSection(id)}
            onDelete={(id) => removeSection(id)}
            onDuplicate={(id) => {
              const source = sections.find((s) => s.id === id);
              if (!source) return;
              const copy: PageSection = {
                ...source,
                id: crypto.randomUUID(),
                sortOrder: sections.length,
              };
              addSection(copy);
            }}
          />
        </div>

        <div className="flex flex-1 flex-col bg-background">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-background/50">
              <LivePreview />
            </div>

            <div className="w-80 shrink-0 overflow-y-auto border-l border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-xs font-semibold text-foreground">
                  {selectedSection ? selectedSection.blockType : "Properties"}
                </span>
                {selectedSection && (
                  <PresetPicker
                    blockType={selectedSection.blockType}
                    onApply={handleApplyPreset}
                  />
                )}
              </div>
              <PropertiesPanel
                selectedBlock={
                  selectedSection
                    ? {
                        id: selectedSection.id,
                        type: selectedSection.blockType,
                        label: selectedSection.blockType,
                        content: selectedSection.content,
                        styles: selectedSection.settings.styles,
                      }
                    : null
                }
                onContentChange={(id, content) => handleContentChange(id, content)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-muted/30 p-4">
        <SectionPalette onAdd={handleAddSection} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <h2 className="text-sm font-semibold text-foreground">Sections</h2>
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
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
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

          <div className="w-96 shrink-0 overflow-y-auto border-l border-border bg-background p-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
