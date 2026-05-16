# Phase 2.5 E2E: Real-Time Dev Mode — End-to-End Integration

> **Goal:** Make Dev Mode fully functional. Click a block → edit properties → see instant live preview updates → undo → publish. All without page reload.

---

## Architecture — Data Flow

```
User clicks block on canvas
    │
    ▼
BlockOverlay.onClick → devModeStore.select(id)
    │
    ▼
SectionBuilder syncs → pageBuilderStore.selectSection(id)
    │
    ▼
PropertiesPanel reads selectedSection.content → renders inputs
    │
User types new value
    │
    ▼
PropertiesPanel.onChange → pageBuilderStore.updateSection(id, {content})
    │
    ▼
Zustand re-renders LivePreview + PropertiesPanel (instant)
    │
    ▼
historyStore.pushSnapshot() records the change
    │
    ▼
User presses Ctrl+Z → historyStore.undo() → pageBuilderStore.setSections(prev)
```

---

## Task E2E.1 — Bidirectional Selection Sync

**Problem:** `devModeStore` and `pageBuilderStore` both track `selectedId` independently. Clicking on canvas selects in devModeStore but not in pageBuilderStore, so PropertiesPanel doesn't update.

**Solution:** Wire selection sync between the two stores.

```
Files to modify:
  web/src/components/dev-mode/BlockOverlay.tsx    — onClick also calls pageBuilderStore.selectSection
  web/src/components/dev-mode/StructureTree.tsx   — onSelect also calls pageBuilderStore.selectSection  
  web/src/components/admin/pages/section-builder.tsx — react to devModeStore.selectedId changes
  web/src/app/(admin)/admin/pages/[slug]/edit/page.tsx — sync on Dev Mode toggle
```

**Acceptance:** Click a block on canvas → it's selected in tree + properties panel populates. Click in tree → canvas selection glows.

---

## Task E2E.2 — Undo/Redo History Wiring

**Problem:** `historyStore.pushSnapshot()` is never called. Undo/redo does nothing.

**Solution:** Subscribe to `pageBuilderStore` mutations → push snapshots to `historyStore`. Wire `undo`/`redo` to actually restore previous section state.

```
Files to create:
  web/src/stores/history-middleware.ts  ← Subscribe to pageBuilderStore changes

Files to modify:
  web/src/stores/historyStore.ts        ← undo/redo returns full section arrays
  web/src/components/dev-mode/DevModeProvider.tsx — undo/redo restores sections
```

**Acceptance:** Make 3 edits → Ctrl+Z 2 times → 2 edits undone → Ctrl+Shift+Z → 1 re-applied.

---

## Task E2E.3 — Inline Text Editing in Section Components

**Problem:** `InlineEditor` exists but no section component uses it. Double-clicking text on canvas does nothing.

**Solution:** Wrap text content fields in section components with `<InlineEditor>` so double-click activates inline editing.

```
Files to modify:
  web/src/components/blocks/sections/hero-section.tsx       — title, subtitle, ctaText
  web/src/components/blocks/sections/feature-grid-section.tsx — card titles, descriptions
  web/src/components/blocks/sections/cta-banner-section.tsx  — text, buttonText
  web/src/components/blocks/sections/faq-section.tsx         — questions, answers
  web/src/components/blocks/sections/pricing-table-section.tsx — plan names, prices
  web/src/components/blocks/sections/stats-bar-section.tsx   — numbers, labels
  web/src/components/blocks/sections/testimonials-section.tsx — names, texts
```

**Acceptance:** In Dev Mode, double-click hero title → text becomes editable. Type new text → blur → title updates live. Press Escape → reverts.

---

## Task E2E.4 — InlineEditor Content Sync with Store

**Problem:** `InlineEditor` currently calls `onChange(text)` on blur, but the section components render `content.xxx` directly. The section needs to propagate the edit up to the store.

**Solution:** Pass a `blockId` to section components so they can call `pageBuilderStore.updateSection()` directly when inline editing fires.

```
Files to modify:
  web/src/types/registry.ts              — Add blockId to BlockComponentProps
  web/src/components/blocks/sections/hero-section.tsx — use blockId + updateSection
  web/src/components/blocks/section/...   — same pattern
  web/src/components/admin/pages/live-preview.tsx — pass blockId to sections
```

**Acceptance:** Inline editing text in a section → change propagates to store → canvas updates instantly.

---

## Task E2E.5 — Responsive Canvas Resize

**Problem:** `ResponsiveBar` toggles `devModeStore.deviceMode` but nothing resizes the preview canvas.

**Solution:** Wrap the live preview in a container that constrains its width based on the selected breakpoint. Show a "frame" around the canvas.

```
Files to modify:
  web/src/components/admin/pages/live-preview.tsx — add max-width container per breakpoint
  web/src/components/dev-mode/ResponsiveBar.tsx — already works, just needs visual feedback
```

**Desktop:** 100% width (no constraint)
**Tablet:** 768px max-width, centered
**Mobile:** 375px max-width, centered

**Acceptance:** Switch to "tablet" in ResponsiveBar → canvas resizes to 768px. Switch to "mobile" → 375px.

---

## Task E2E.6 — Structure Tree Delete + Add Wiring

**Problem:** StructureTree has delete/duplicate buttons but they're stubs (no-ops). Tree's `onAddBlock` is also empty.

**Solution:** Wire tree actions to `pageBuilderStore`.

```
Files to modify:
  web/src/components/dev-mode/StructureTree.tsx — wire onDelete, onDuplicate, onAdd
  web/src/components/admin/pages/section-builder.tsx — pass handlers to tree
```

**Acceptance:** Click delete on tree node → section removed from canvas. Click duplicate → section copied.

---

## Task E2E.7 — Publish → Dev Mode Exit

**Problem:** After publishing, Dev Mode stays on and user needs to manually toggle off.

**Solution:** After publish succeeds, disable Dev Mode automatically and show a success toast.

```
Files to modify:
  web/src/app/(admin)/admin/pages/[slug]/edit/page.tsx — disable dev mode + toast after publish
```

**Acceptance:** Click Publish → save succeeds → Dev Mode toggles off → "Published!" toast appears.

---

## Validation Gate

- [x] Click block on canvas → selected in tree + properties panel populates
- [x] Click block in tree → canvas selection glows
- [x] Edit content in PropertiesPanel → canvas updates instantly (no reload)
- [x] Double-click text on canvas → inline editor activates → type → blur saves
- [x] Ctrl+Z undoes last edit → Ctrl+Shift+Z redoes
- [x] Save named snapshot → restore it → blocks revert
- [x] Switch to tablet/mobile → canvas resizes preview
- [x] Delete block from tree → removed from canvas
- [x] Publish → saves to DB → exits Dev Mode → shows "Published!" toast
- [x] `typecheck` + `next build` pass with zero errors
