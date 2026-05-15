"use client";

import { blockRegistry } from "@/lib/block-registry";

interface Section {
  id: string;
  blockType: string;
  content: Record<string, unknown>;
}

interface PageRendererProps {
  sections: Section[];
}

export function PageRenderer({ sections }: PageRendererProps) {
  if (!sections.length) return null;

  return (
    <>
      {sections.map((section) => {
        const Component = blockRegistry.getComponent(section.blockType);
        if (!Component) {
          return (
            <div
              key={section.id}
              className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400"
            >
              Unknown section type: <code className="text-sm">{section.blockType}</code>
            </div>
          );
        }
        return <Component key={section.id} content={section.content} />;
      })}
    </>
  );
}
