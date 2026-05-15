"use client";

import { blockRegistry } from "@/lib/block-registry";
import { BlockOverlay } from "@/components/dev-mode/BlockOverlay";
import { useDevModeStore } from "@/stores/devModeStore";

interface Section {
  id: string;
  blockType: string;
  content: Record<string, unknown>;
}

interface PageRendererProps {
  sections: Section[];
}

export function PageRenderer({ sections }: PageRendererProps) {
  const enabled = useDevModeStore((s) => s.enabled);
  if (!sections.length) return null;

  return (
    <>
      {sections.map((section) => {
        const Component = blockRegistry.getComponent(section.blockType);
        if (!Component) {
          return (
            <div
              key={section.id}
              className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground"
            >
              Unknown section type: <code className="text-sm">{section.blockType}</code>
            </div>
          );
        }

        const content = (
          <Component
            key={section.id}
            content={section.content}
            blockId={section.id}
          />
        );

        if (enabled) {
          return (
            <BlockOverlay
              key={section.id}
              blockId={section.id}
              type={section.blockType}
              label={section.blockType}
              path={`Page > ${section.blockType}`}
            >
              {content}
            </BlockOverlay>
          );
        }

        return content;
      })}
    </>
  );
}
