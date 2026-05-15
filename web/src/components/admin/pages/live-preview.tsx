"use client";

import { blockRegistry } from "@/lib/block-registry";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

function renderSectionFallback(
  blockType: string,
  content: Record<string, unknown>,
) {
  const SectionComponent = blockRegistry.getComponent(blockType);
  if (!SectionComponent) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        Unknown section type: {blockType}
      </div>
    );
  }
  return <SectionComponent content={content} />;
}

export function LivePreview() {
  const { sections, selectedId, selectSection } = usePageBuilderStore();

  return (
    <div className="min-h-full border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
      </div>
      <div className="space-y-0">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`cursor-pointer border-b border-gray-100 px-6 transition-colors hover:bg-gray-50 ${
              selectedId === section.id ? "bg-primary-50" : ""
            }`}
            onClick={() => selectSection(section.id)}
          >
            {renderSectionFallback(
              section.blockType,
              section.content as Record<string, unknown>,
            )}
          </div>
        ))}
        {sections.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            Add sections from the palette to preview
          </div>
        )}
      </div>
    </div>
  );
}
