"use client";

import { ReactNode } from "react";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore, type PageSection, type SectionType } from "@/stores/pageBuilderStore";
import { StructureTree } from "./StructureTree";
import { PropertiesPanel } from "./PropertiesPanel";

interface DevModeShellProps {
  children: ReactNode;
}

export function DevModeShell({ children }: DevModeShellProps) {
  const enabled = useDevModeStore((s) => s.enabled);
  const { sections, selectedId, updateSection, selectSection, removeSection, addSection } = usePageBuilderStore();

  const selectedSection = sections.find((s) => s.id === selectedId);

  const treeNodes = sections.map((s) => ({
    id: s.id,
    type: s.blockType,
    label: s.blockType,
  }));

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background dark">
      {/* Left Sidebar: Layers */}
      <div className="w-64 shrink-0 border-r border-border bg-background/50 backdrop-blur-xl">
        <StructureTree
          blocks={treeNodes}
          onSelect={(id) => selectSection(id)}
          onDelete={(id) => removeSection(id)}
          onAddBlock={() => {
            const newSection: PageSection = {
              id: crypto.randomUUID(),
              pageId: "current", // Fallback
              blockType: "hero" as SectionType,
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
        />
      </div>

      {/* Main Canvas */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0F1115]">
        {/* Canvas Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto min-h-full w-full max-w-[1440px] bg-background shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500">
            {children}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Properties */}
      <div className="w-80 shrink-0 border-l border-border bg-background/50 backdrop-blur-xl overflow-y-auto custom-scrollbar">
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
          onContentChange={(id, content) => updateSection(id, { content })}
        />
      </div>
    </div>
  );
}
