"use client";

import { useState } from "react";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

interface PropertiesPanelProps {
  selectedBlock: {
    id: string;
    type: string;
    label: string;
    content: Record<string, unknown>;
    styles?: Record<string, unknown>;
  } | null;
  onContentChange?: (id: string, content: Record<string, unknown>) => void;
  onStyleChange?: (id: string, styles: Record<string, unknown>) => void;
}

export function PropertiesPanel({ selectedBlock, onContentChange, onStyleChange }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");
  const enabled = useDevModeStore((s) => s.enabled);
  const updateSection = usePageBuilderStore((s) => s.updateSection);

  if (!enabled) return null;

  if (!selectedBlock) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50">
          <span className="text-lg">🎨</span>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Select an element</p>
      </div>
    );
  }

  const handleStyleChange = (key: string, value: any) => {
    if (!selectedBlock) return;
    const newStyles = { ...(selectedBlock.styles || {}), [key]: value };
    // In our store, styles are inside settings.styles
    const section = usePageBuilderStore.getState().sections.find(s => s.id === selectedBlock.id);
    if (section) {
      updateSection(selectedBlock.id, {
        settings: {
          ...section.settings,
          styles: newStyles
        }
      });
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-500/10 text-[10px] font-bold text-primary-400 ring-1 ring-primary-500/20">
            {selectedBlock.type[0].toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {selectedBlock.type}
            </p>
            <p className="text-xs font-semibold text-foreground">{selectedBlock.label}</p>
          </div>
        </div>

        <div className="flex rounded-lg bg-muted/30 p-1">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 rounded-md py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === "content" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex-1 rounded-md py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === "style" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Style
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "content" ? (
          <div className="space-y-6">
            <Section title="Basic Content">
              {Object.entries(selectedBlock.content).map(([key, val]) => (
                <PropertyRow key={key} label={key}>
                  {typeof val === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => {
                        onContentChange?.(selectedBlock.id, {
                          ...selectedBlock.content,
                          [key]: e.target.checked,
                        });
                      }}
                      className="h-4 w-4 rounded border-border bg-muted/30 text-primary-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(val ?? "")}
                      onChange={(e) => {
                        onContentChange?.(selectedBlock.id, {
                          ...selectedBlock.content,
                          [key]: e.target.value,
                        });
                      }}
                      className="w-full rounded-md bg-muted/30 px-2 py-1 text-[11px] text-foreground outline-none ring-1 ring-border transition-all focus:ring-primary-500/40"
                    />
                  )}
                </PropertyRow>
              ))}
            </Section>
          </div>
        ) : (
          <div className="space-y-6">
            <Section title="Layout & Spacing">
              <PropertyRow label="Padding Y">
                <Slider
                  value={String(selectedBlock.styles?.paddingY || "64px")}
                  onChange={(v) => handleStyleChange("paddingY", v)}
                />
              </PropertyRow>
              <PropertyRow label="Max Width">
                <select
                  value={String(selectedBlock.styles?.maxWidth || "max-w-6xl")}
                  onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
                  className="w-full rounded-md bg-muted/30 px-2 py-1 text-[11px] text-foreground outline-none ring-1 ring-border"
                >
                  <option value="max-w-4xl">4xl</option>
                  <option value="max-w-5xl">5xl</option>
                  <option value="max-w-6xl">6xl</option>
                  <option value="max-w-7xl">7xl</option>
                  <option value="max-w-full">Full</option>
                </select>
              </PropertyRow>
            </Section>

            <Section title="Appearance">
              <PropertyRow label="Background">
                <input
                  type="color"
                  value={String(selectedBlock.styles?.backgroundColor || "#0B0D10")}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="h-6 w-full cursor-pointer rounded border-0 bg-transparent"
                />
              </PropertyRow>
              <PropertyRow label="Opacity">
                <Slider
                  value={String(selectedBlock.styles?.opacity || "100%")}
                  onChange={(v) => handleStyleChange("opacity", v)}
                />
              </PropertyRow>
            </Section>

            <Section title="Typography">
              <PropertyRow label="Text Align">
                <div className="flex rounded-md bg-muted/30 p-0.5">
                  {["left", "center", "right"].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleStyleChange("textAlign", align)}
                      className={`flex-1 rounded py-1 text-[9px] uppercase font-bold ${
                        (selectedBlock.styles?.textAlign || "left") === align
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </PropertyRow>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground min-w-[72px]">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Slider({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const numValue = parseInt(value) || 0;
  const unit = value.replace(/[0-9]/g, "") || "px";

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min="0"
        max={unit === "%" ? 100 : 200}
        value={numValue}
        onChange={(e) => onChange(`${e.target.value}${unit}`)}
        className="h-1 w-full appearance-none rounded-full bg-muted accent-primary-500 cursor-pointer"
      />
      <span className="w-10 text-right text-[10px] text-muted-foreground">{value}</span>
    </div>
  );
}
