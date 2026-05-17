"use client";

import { blockRegistry } from "@/lib/block-registry";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";
import { useDevModeStore, type DeviceMode } from "@/stores/devModeStore";
import { BlockOverlay } from "@/components/dev-mode/BlockOverlay";
import { PublicHeader } from "@/components/layout/public-header";

const deviceWidths: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

function renderSectionFallback(
  blockType: string,
  content: Record<string, unknown>,
  blockId?: string,
) {
  const SectionComponent = blockRegistry.getComponent(blockType);
  if (!SectionComponent) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Unknown section type: {blockType}
      </div>
    );
  }
  return <SectionComponent content={content} blockId={blockId} />;
}

export function LivePreview() {
  const { sections } = usePageBuilderStore();
  const deviceMode = useDevModeStore((s) => s.deviceMode);

  return (
    <div className="flex min-h-full justify-center bg-background text-foreground">
      <div
        className="relative w-full"
        style={{ maxWidth: deviceWidths[deviceMode] }}
      >
        <PublicHeader />
        {deviceMode !== "desktop" && (
          <div className="sticky top-[80px] z-[100] flex items-center justify-center border-b border-border bg-background py-1">
            <span className="text-[10px] text-muted-foreground">
              {deviceMode === "tablet" ? "768px — Tablet" : "375px — Mobile"}
            </span>
          </div>
        )}
        <div className="pt-[100px]">
          {sections
            .filter((section) => !section.settings.hidden)
            .map((section) => (
            <BlockOverlay
              key={section.id}
              blockId={section.id}
              label={section.blockType}
              path={`Page > ${section.blockType}`}
            >
              {renderSectionFallback(
                section.blockType,
                section.content as Record<string, unknown>,
                section.id,
              )}
            </BlockOverlay>
          ))}
          {sections.length === 0 && (
            <div className="flex items-center justify-center py-32 text-sm text-muted-foreground">
              Add sections to start building
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
