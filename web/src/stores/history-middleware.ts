import { usePageBuilderStore, type PageSection } from "./pageBuilderStore";
import { useHistoryStore } from "./historyStore";

let initialized = false;
let undoing = false;
let previousSections: PageSection[] | null = null;

export function setUndoing(value: boolean) {
  undoing = value;
}

export function setInitialized(value: boolean) {
  initialized = value;
}

export function initHistoryMiddleware() {
  usePageBuilderStore.subscribe((state) => {
    if (previousSections === null) {
      previousSections = state.sections;
      return;
    }

    const prev = previousSections;
    previousSections = state.sections;

    if (!initialized || undoing) return;

    const snapshot = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      label: "Auto-save",
      data: JSON.stringify(prev),
    };

    useHistoryStore.getState().pushSnapshot(snapshot);
  });
}
