"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useDevModeStore } from "@/stores/devModeStore";
import { useHistoryStore } from "@/stores/historyStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";
import { initHistoryMiddleware, setUndoing, setInitialized } from "@/stores/history-middleware";

interface DevModeProviderProps {
  children: ReactNode;
}

export function DevModeProvider({ children }: DevModeProviderProps) {
  const enabled = useDevModeStore((s) => s.enabled);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  useEffect(() => {
    initHistoryMiddleware();
    setInitialized(false);
    return () => {
      setInitialized(false);
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      setTimeout(() => setInitialized(true), 100);
    } else {
      setInitialized(false);
    }
  }, [enabled]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        setUndoing(true);
        const snapshot = undo();
        if (snapshot) {
          const sections = JSON.parse(snapshot.data);
          usePageBuilderStore.getState().setSections(sections);
        }
        setUndoing(false);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        setUndoing(true);
        const snapshot = redo();
        if (snapshot) {
          const sections = JSON.parse(snapshot.data);
          usePageBuilderStore.getState().setSections(sections);
        }
        setUndoing(false);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        const selectedId = useDevModeStore.getState().selectedId;
        useDevModeStore.getState().select(null);
        usePageBuilderStore.getState().selectSection(null);
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedId = useDevModeStore.getState().selectedId;
        if (selectedId) {
          e.preventDefault();
          usePageBuilderStore.getState().removeSection(selectedId);
          useDevModeStore.getState().select(null);
          usePageBuilderStore.getState().selectSection(null);
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
