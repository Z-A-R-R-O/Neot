"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

interface BlockOverlayProps {
  blockId: string;
  type: string;
  label: string;
  path: string;
  children: React.ReactNode;
}

export function BlockOverlay({ blockId, type, label, path, children }: BlockOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const enabled = useDevModeStore((s) => s.enabled);
  const hoveredId = useDevModeStore((s) => s.hoveredId);
  const selectedId = useDevModeStore((s) => s.selectedId);
  const setHovered = useDevModeStore((s) => s.setHovered);
  const select = useDevModeStore((s) => s.select);
  const showLabels = useDevModeStore((s) => s.showLabels);
  const showGuides = useDevModeStore((s) => s.showGuides);

  const isHovered = hoveredId === blockId;
  const isSelected = selectedId === blockId;

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const updateRect = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    };

    updateRect();

    const observer = new ResizeObserver(updateRect);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [enabled, children]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`relative transition-all duration-150 ${
          isHovered && !isSelected ? "ring-2 ring-primary-500/50" : ""
        } ${isSelected ? "ring-2 ring-primary-500 shadow-glow-sm" : ""}`}
        onMouseEnter={() => setHovered(blockId)}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => {
          e.stopPropagation();
          select(blockId);
          usePageBuilderStore.getState().selectSection(blockId);
        }}
      >
        {children}
      </div>

      {isSelected && rect && (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }}
        >
          <div className="absolute inset-0 border-2 border-primary-500/60 rounded-[inherit]" />
          <div className="absolute -inset-[3px] border border-primary-500/20 rounded-[inherit]" />

          <div className="absolute -top-7 left-0 flex items-center gap-1.5 rounded-t-md bg-primary-500 px-2 py-1 text-[10px] font-medium text-white whitespace-nowrap shadow-lg">
            <span className="opacity-70">{path}</span>
            <span>{label}</span>
            <span className="ml-1 opacity-60">({type})</span>
            <div className="ml-3 flex items-center gap-1 border-l border-white/20 pl-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const sections = usePageBuilderStore.getState().sections;
                  const idx = sections.findIndex((s) => s.id === blockId);
                  if (idx > 0) {
                    const newSections = [...sections];
                    [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
                    usePageBuilderStore.getState().reorderSections(newSections);
                  }
                }}
                className="hover:text-white/80"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const sections = usePageBuilderStore.getState().sections;
                  const idx = sections.findIndex((s) => s.id === blockId);
                  if (idx < sections.length - 1) {
                    const newSections = [...sections];
                    [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
                    usePageBuilderStore.getState().reorderSections(newSections);
                  }
                }}
                className="hover:text-white/80"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  usePageBuilderStore.getState().removeSection(blockId);
                  useDevModeStore.getState().select(null);
                }}
                className="ml-1 text-white/60 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="absolute -bottom-5 right-0 rounded-md bg-[#1a1a2e]/90 px-1.5 py-0.5 text-[10px] text-white/60 whitespace-nowrap">
            {Math.round(rect.width)} × {Math.round(rect.height)}
          </div>

          {/* Resize Handles */}
          <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full border border-primary-500 bg-white" />
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-primary-500 bg-white" />
          <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full border border-primary-500 bg-white" />
          <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-primary-500 bg-white" />
        </div>
      )}

      {isHovered && !isSelected && rect && showLabels && (
        <div
          className="pointer-events-none fixed z-[9998]"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }}
        >
          <div className="absolute -top-5 left-0 rounded-t-md bg-primary-500/80 px-1.5 py-0.5 text-[10px] text-white">
            {label}
          </div>
        </div>
      )}

      {isSelected && showGuides && rect && (
        <>
          <div
            className="pointer-events-none fixed z-[9997] border-l border-dashed border-primary-400/30"
            style={{ left: rect.left, top: 0, height: rect.top }}
          />
          <div
            className="pointer-events-none fixed z-[9997] border-l border-dashed border-primary-400/30"
            style={{ left: rect.left, top: rect.bottom, height: `calc(100vh - ${rect.bottom}px)` }}
          />
          <div
            className="pointer-events-none fixed z-[9997] border-t border-dashed border-primary-400/30"
            style={{ top: rect.top, left: 0, width: rect.left }}
          />
          <div
            className="pointer-events-none fixed z-[9997] border-t border-dashed border-primary-400/30"
            style={{ top: rect.top, left: rect.right, width: `calc(100vw - ${rect.right}px)` }}
          />
        </>
      )}
    </div>
  );
}
