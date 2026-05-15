"use client";

import { blockRegistry } from "@/lib/block-registry";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";
import { useDevModeStore, type DeviceMode } from "@/stores/devModeStore";
import { BlockOverlay } from "@/components/dev-mode/BlockOverlay";

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
  const { sections, selectedId, selectSection } = usePageBuilderStore();
  const devModeEnabled = useDevModeStore((s) => s.enabled);
  const select = useDevModeStore((s) => s.select);
  const deviceMode = useDevModeStore((s) => s.deviceMode);

  return (
    <div
      className={`min-h-full ${
        devModeEnabled
          ? "flex justify-center bg-background text-foreground"
          : "border-l border-border bg-background text-foreground"
      }`}
    >
      {devModeEnabled ? (
        <div
          className="w-full"
          style={{ maxWidth: deviceWidths[deviceMode] }}
        >
          {deviceMode !== "desktop" && (
            <div className="sticky top-0 z-10 flex items-center justify-center border-b border-border bg-background py-1">
              <span className="text-[10px] text-muted-foreground">
                {deviceMode === "tablet" ? "768px — Tablet" : "375px — Mobile"}
              </span>
            </div>
          )}
          {sections.map((section) => (
            <BlockOverlay
              key={section.id}
              blockId={section.id}
              type={section.blockType}
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
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              Add sections to start building
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
          </div>
          <div className="space-y-0">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`cursor-pointer border-b border-border px-6 transition-colors hover:bg-muted/50 ${
                  selectedId === section.id ? "bg-primary-500/10" : ""
                }`}
                onClick={() => {
                  selectSection(section.id);
                  select(section.id);
                }}
              >
                {renderSectionFallback(
                  section.blockType,
                  section.content as Record<string, unknown>,
                )}
              </div>
            ))}
            {sections.length === 0 && (
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                Add sections from the palette to preview
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
