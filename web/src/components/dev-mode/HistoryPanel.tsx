"use client";

import { useState } from "react";
import { Undo2, Redo2, History, Camera, Trash2, Clock } from "lucide-react";
import { useHistoryStore } from "@/stores/historyStore";
import { useDevModeStore } from "@/stores/devModeStore";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";
import { setUndoing } from "@/stores/history-middleware";

export function HistoryPanel() {
  const [open, setOpen] = useState(false);
  const enabled = useDevModeStore((s) => s.enabled);

  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const snapshots = useHistoryStore((s) => s.snapshots);
  const saveSnapshot = useHistoryStore((s) => s.saveSnapshot);
  const restoreSnapshot = useHistoryStore((s) => s.restoreSnapshot);
  const deleteSnapshot = useHistoryStore((s) => s.deleteSnapshot);
  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  if (!enabled) return null;

  function handleSaveSnapshot() {
    const label = prompt("Name this snapshot:");
    if (label) {
      const sections = usePageBuilderStore.getState().sections;
      saveSnapshot(label, JSON.stringify(sections));
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => {
          setUndoing(true);
          const snapshot = undo();
          if (snapshot) {
            const sections = JSON.parse(snapshot.data);
            usePageBuilderStore.getState().setSections(sections);
          }
          setUndoing(false);
        }}
        disabled={!canUndo()}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-glass hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => {
          setUndoing(true);
          const snapshot = redo();
          if (snapshot) {
            const sections = JSON.parse(snapshot.data);
            usePageBuilderStore.getState().setSections(sections);
          }
          setUndoing(false);
        }}
        disabled={!canRedo()}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-glass hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-3.5 w-3.5" />
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-glass hover:text-foreground"
          title="History"
        >
          <History className="h-3.5 w-3.5" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(11,13,16,0.98)] p-3 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-foreground">Version History</p>
                <button
                  onClick={handleSaveSnapshot}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-primary-400 hover:bg-primary-500/10 transition-colors"
                >
                  <Camera className="h-3 w-3" />
                  Snapshot
                </button>
              </div>

              {snapshots.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Clock className="h-6 w-6 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">No snapshots yet</p>
                  <button
                    onClick={handleSaveSnapshot}
                    className="text-[10px] text-primary-400 hover:text-primary-300"
                  >
                    Save your first snapshot
                  </button>
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className="group flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-glass"
                    >
                      <button
                        onClick={() => {
                          if (confirm("Restore this version?")) {
                            const restored = restoreSnapshot(snapshot.id);
                            if (restored) {
                              const sections = JSON.parse(restored.data);
                              usePageBuilderStore.getState().setSections(sections);
                            }
                          }
                        }}
                        className="flex-1 text-left"
                      >
                        <p className="text-xs font-medium text-foreground">{snapshot.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(snapshot.timestamp).toLocaleString()}
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this snapshot?")) {
                            deleteSnapshot(snapshot.id);
                          }
                        }}
                        className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
