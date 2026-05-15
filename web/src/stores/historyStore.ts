import { create } from "zustand";

export interface Snapshot {
  id: string;
  timestamp: number;
  label: string;
  data: string; // JSON stringified block tree
}

const MAX_HISTORY = 50;

interface HistoryState {
  past: Snapshot[];
  future: Snapshot[];
  snapshots: Snapshot[];

  pushSnapshot: (snapshot: Snapshot) => void;
  undo: () => Snapshot | null;
  redo: () => Snapshot | null;
  saveSnapshot: (label: string, data: string) => void;
  restoreSnapshot: (id: string) => Snapshot | undefined;
  deleteSnapshot: (id: string) => void;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  snapshots: [],

  pushSnapshot: (snapshot) =>
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
      future: [],
    })),

  undo: () => {
    const state = get();
    if (state.past.length === 0) return null;
    const current = state.past[state.past.length - 1];
    const previous = state.past.length > 1
      ? state.past[state.past.length - 2]
      : null;

    if (previous) {
      set({
        past: state.past.slice(0, -1),
        future: [current, ...state.future],
      });
    }

    return previous ?? current;
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return null;
    const next = state.future[0];

    set({
      past: [...state.past, next],
      future: state.future.slice(1),
    });

    return next;
  },

  saveSnapshot: (label, data) =>
    set((state) => ({
      snapshots: [
        ...state.snapshots,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          label,
          data,
        },
      ],
    })),

  restoreSnapshot: (id) => {
    const state = get();
    const snapshot = state.snapshots.find((s) => s.id === id);
    if (!snapshot) return undefined;

    set((s) => ({
      past: [...s.past, snapshot],
      future: [],
    }));

    return snapshot;
  },

  deleteSnapshot: (id) =>
    set((state) => ({
      snapshots: state.snapshots.filter((s) => s.id !== id),
    })),

  clear: () => set({ past: [], future: [] }),

  canUndo: () => get().past.length > 1,

  canRedo: () => get().future.length > 0,
}));
