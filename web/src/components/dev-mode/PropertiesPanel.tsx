"use client";

import { useDevModeStore } from "@/stores/devModeStore";

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
  const enabled = useDevModeStore((s) => s.enabled);
  const selectedId = useDevModeStore((s) => s.selectedId);

  if (!enabled) return null;

  if (!selectedBlock) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 h-10 w-10 rounded-xl bg-glass flex items-center justify-center">
          <span className="text-lg">🎨</span>
        </div>
        <p className="text-xs text-muted-foreground">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-primary-400">{selectedBlock.type}</span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-foreground">{selectedBlock.label}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <Section title="Content">
            {Object.entries(selectedBlock.content).map(([key, val]) => (
              <PropertyRow key={key} label={key}>
                <input
                  type="text"
                  value={String(val ?? "")}
                  onChange={(e) => {
                    onContentChange?.(selectedBlock.id, {
                      ...selectedBlock.content,
                      [key]: e.target.value,
                    });
                  }}
                  className="w-full rounded-lg bg-[rgba(255,255,255,0.04)] px-2.5 py-1.5 text-xs text-foreground outline-none ring-1 ring-[rgba(255,255,255,0.06)] transition-all focus:ring-primary-500/40"
                />
              </PropertyRow>
            ))}
          </Section>

          {selectedBlock.styles && (
            <>
              <Section title="Typography">
                <PropertyRow label="Font Size">
                  <Slider value="16px" onChange={() => {}} />
                </PropertyRow>
                <PropertyRow label="Font Weight">
                  <select className="w-full rounded-lg bg-[rgba(255,255,255,0.04)] px-2.5 py-1.5 text-xs text-foreground outline-none ring-1 ring-[rgba(255,255,255,0.06)]">
                    <option>400</option>
                    <option>500</option>
                    <option>600</option>
                    <option>700</option>
                    <option>800</option>
                  </select>
                </PropertyRow>
                <PropertyRow label="Letter Spacing">
                  <Slider value="0" onChange={() => {}} />
                </PropertyRow>
              </Section>

              <Section title="Colors">
                <PropertyRow label="Text">
                  <input type="color" value="#F5F7FA" className="h-8 w-full rounded-lg cursor-pointer" />
                </PropertyRow>
                <PropertyRow label="Background">
                  <input type="color" value="#0B0D10" className="h-8 w-full rounded-lg cursor-pointer" />
                </PropertyRow>
              </Section>

              <Section title="Spacing">
                <PropertyRow label="Padding">
                  <Slider value="16px" onChange={() => {}} />
                </PropertyRow>
                <PropertyRow label="Margin">
                  <Slider value="0" onChange={() => {}} />
                </PropertyRow>
              </Section>

              <Section title="Effects">
                <PropertyRow label="Border Radius">
                  <Slider value="8px" onChange={() => {}} />
                </PropertyRow>
                <PropertyRow label="Opacity">
                  <Slider value="100%" onChange={() => {}} />
                </PropertyRow>
              </Section>
            </>
          )}
        </div>
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
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min="0"
        max="100"
        className="h-1 w-full appearance-none rounded-full bg-[rgba(255,255,255,0.08)] accent-primary-500 cursor-pointer"
      />
      <span className="w-10 text-right text-[10px] text-muted-foreground">{value}</span>
    </div>
  );
}
