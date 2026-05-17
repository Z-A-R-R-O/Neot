"use client";

import { ReactNode, useRef, useState } from "react";
import { Timer } from "lucide-react";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore, type PageSection, type SectionType } from "@/stores/pageBuilderStore";
import { StructureTree } from "./StructureTree";
import { PropertiesPanel } from "./PropertiesPanel";
import { PresetPicker } from "./PresetPicker";
import { saveUserPreset } from "@/lib/block-presets";
import { ResponsiveBar } from "./ResponsiveBar";
import { HistoryPanel } from "./HistoryPanel";
import { DevModeToggle } from "./DevModeToggle";
import { AlignmentGuides } from "./alignment-guides";
import { PreviewToggle } from "./preview-toggle";
import { AnimationTimeline } from "./animation-timeline";

interface DevModeShellProps {
  children: ReactNode;
  pageId?: string;
  pageSlug?: string;
  pageStatus?: string;
}

export function DevModeShell({ children, pageId, pageSlug, pageStatus }: DevModeShellProps) {
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);
  const enabled = useDevModeStore((s) => s.enabled);
  const deviceMode = useDevModeStore((s) => s.deviceMode);
  const { sections, selectedId, updateSection, selectSection, removeSection, addSection, reorderSections } = usePageBuilderStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);

  const canvasMaxWidth = deviceMode === "mobile" ? "375px" : deviceMode === "tablet" ? "768px" : "1440px";

  if (!enabled) {
    return <>{children}</>;
  }

  const selectedSection = sections.find((s) => s.id === selectedId);

  function handleApplyPreset(preset: { type: string; schema: { content: Record<string, unknown> } }) {
    if (!selectedSection) return;
    updateSection(selectedSection.id, { content: preset.schema.content });
  }

  function handleSavePreset() {
    if (!selectedSection || !presetName.trim()) return;
    saveUserPreset({
      id: `user-${Date.now()}`,
      name: presetName.trim(),
      description: `Custom ${selectedSection.blockType} preset`,
      type: selectedSection.blockType,
      schema: {
        content: selectedSection.content,
      },
    });
    setPresetName("");
    setShowSavePreset(false);
  }

  const treeNodes = sections.map((s) => ({
    id: s.id,
    type: s.blockType,
    label: s.blockType,
    children: [] as { id: string; type: string; label: string }[],
  }));

  return (
    <div className="flex h-screen w-screen flex-col bg-background dark">
      {/* Top Toolbar */}
      <div className="flex h-10 shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-xl px-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Dev Mode</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveBar />
        </div>
        <div className="flex items-center gap-2">
          {pageStatus === "draft" && (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
              Draft
            </span>
          )}
          {pageId && pageSlug && <PreviewToggle pageId={pageId} pageSlug={pageSlug} />}
          <button
            onClick={() => setTimelineOpen(!timelineOpen)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
            title="Animation Timeline"
          >
            <Timer className="h-3.5 w-3.5" />
          </button>
          <AnimationTimeline open={timelineOpen} onClose={() => setTimelineOpen(false)} />
          <HistoryPanel />
          <DevModeToggle />
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Layers */}
        <div className="w-64 shrink-0 border-r border-border bg-background/50 backdrop-blur-xl">
        <StructureTree
          blocks={treeNodes}
          onSelect={(id) => selectSection(id)}
          onDelete={(id) => removeSection(id)}
          onAddBlock={(type) => {
            const newSection: PageSection = {
              id: crypto.randomUUID(),
              pageId: "current",
              blockType: type as SectionType,
              sortOrder: sections.length,
              content: {},
              settings: {},
            };
            addSection(newSection);
          }}
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
          onReorder={(activeId, overId) => {
            const ordered = [...sections];
            const activeIdx = ordered.findIndex((s) => s.id === activeId);
            const overIdx = ordered.findIndex((s) => s.id === overId);
            if (activeIdx === -1 || overIdx === -1) return;
            const [moved] = ordered.splice(activeIdx, 1);
            ordered.splice(overIdx, 0, moved);
            reorderSections(ordered.map((s, i) => ({ ...s, sortOrder: i })));
          }}
        />
      </div>

      {/* Main Canvas */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0F1115]">
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
          <div ref={canvasRef} className="mx-auto min-h-full w-full bg-background shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500" style={{ maxWidth: canvasMaxWidth }}>
            {children}
          </div>
        </div>
        <AlignmentGuides containerRef={canvasRef} activeBlockId={selectedId ?? undefined} />
      </div>

      {/* Right Sidebar: Properties */}
      <div className="flex w-80 shrink-0 flex-col border-l border-border bg-background/50 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-xs font-semibold text-foreground">
            {selectedSection ? selectedSection.blockType : "Properties"}
          </span>
          {selectedSection && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSavePreset(!showSavePreset)}
                className="rounded-lg px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-glass transition-colors"
                title="Save as preset"
              >
                +Save
              </button>
              <PresetPicker
                blockType={selectedSection.blockType}
                onApply={handleApplyPreset}
              />
            </div>
          )}
        </div>
        {showSavePreset && selectedSection && (
          <div className="border-b border-border px-4 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name..."
                className="flex-1 rounded-lg bg-muted/30 px-2 py-1.5 text-[11px] outline-none ring-1 ring-border/50 focus:ring-primary-500/40"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
              />
              <button
                onClick={handleSavePreset}
                className="rounded-lg bg-primary-500 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-primary-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <PropertiesPanel
            selectedBlock={
              selectedSection
                ? {
                    id: selectedSection.id,
                    type: selectedSection.blockType,
                    label: selectedSection.blockType,
                    content: selectedSection.content,
                    styles: selectedSection.settings.styles as Record<string, unknown> | undefined,
                  }
                : null
            }
            onContentChange={(id, content) => updateSection(id, { content })}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
