"use client";

import { useState } from "react";
import { getPresets, type Preset } from "@/lib/block-presets";

interface PresetPickerProps {
  blockType: string;
  onApply: (preset: Preset) => void;
}

export function PresetPicker({ blockType, onApply }: PresetPickerProps) {
  const [open, setOpen] = useState(false);
  const presets = getPresets(blockType);

  if (presets.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Presets
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(11,13,16,0.98)] p-2 shadow-xl backdrop-blur-xl">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Presets
            </p>
            <div className="mt-1 space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onApply(preset);
                    setOpen(false);
                  }}
                  className="w-full rounded-lg px-2 py-2 text-left transition-colors hover:bg-glass"
                >
                  <p className="text-xs font-medium text-foreground">{preset.name}</p>
                  <p className="text-[10px] text-muted-foreground">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
