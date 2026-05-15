"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useDevModeStore } from "@/stores/devModeStore";
import { useHistoryStore } from "@/stores/historyStore";

interface DevModeProviderProps {
  children: ReactNode;
}

export function DevModeProvider({ children }: DevModeProviderProps) {
  const enabled = useDevModeStore((s) => s.enabled);
  const toggle = useDevModeStore((s) => s.toggle);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        useDevModeStore.getState().select(null);
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedId = useDevModeStore.getState().selectedId;
        if (selectedId) {
          // Will be handled by pageStore when implemented
        }
      }
    },
    [enabled, undo, redo],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return <>{children}</>;
}
