# Phase 2.5: Dev Mode — Visual Experience Engine

> **Goal:** Transform the admin page builder into a dual-mode Visual Experience Engine. Admins edit the **live frontend directly** via an overlay (Dev Mode), not a separate CMS panel.

**Prerequisites:** Phase 1.75 (Dynamic Renderer — block registry, PageRenderer, schema-driven pages)
**Concept spec:** `Vision - Core/16-visual-experience-engine.md`

---

## Core Architecture

```
Dev Mode Architecture:

┌─────────────────────────────────────────────────────────────┐
│  ProvisionProvider (context + state)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  pageStore (Zustand) — full block tree + schema      │   │
│  │  selectionStore — currently selected element path     │   │
│  │  historyStore — undo/redo stack with snapshots        │   │
│  │  devModeStore — overlay UI state                      │   │
│  │  clipboardStore — copy/paste buffer                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  DevModeToggle → enables/disables editing overlay     │   │
│  │  OverlaySystem → hover outlines + label overlays      │   │
│  │  SelectionEngine → click-to-select + path tracking    │   │
│  │  InlineEditor → contentEditable for text blocks       │   │
│  │  PropertiesPanel → contextual style/effect editor     │   │
│  │  StructureTree → layer hierarchy (Figma-style)        │   │
│  │  HistoryPanel → undo/redo UI + snapshots              │   │
│  │  ResponsiveBar → device breakpoint switcher           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Task 2.5.1 — Dev Mode Core (Store + Toggle + Provider)

```
Files to create:
  web/src/stores/pageStore.ts          ← Full page block tree (extend existing)
  web/src/stores/selectionStore.ts     ← Selected element tracking
  web/src/stores/historyStore.ts       ← Undo/redo stack
  web/src/stores/devModeStore.ts       ← Dev Mode UI state
  web/src/components/dev-mode/DevModeProvider.tsx  ← Context + keyboard shortcuts
  web/src/components/dev-mode/DevModeToggle.tsx    ← Toggle button in admin topbar
```

**Store architecture:**

```typescript
// pageStore.ts — manages the full block tree of the page being edited
interface PageStore {
  blocks: BlockNode[];            // Tree of blocks
  selectedId: string | null;      // Currently selected block
  expandedIds: Set<string>;       // Expanded nodes in structure tree

  selectBlock: (id: string | null) => void;
  updateBlock: (id: string, patch: Partial<BlockNode>) => void;
  addBlock: (parentId: string | null, type: string, index?: number) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, newParentId: string, newIndex: number) => void;
  duplicateBlock: (id: string) => void;
  reorderBlock: (id: string, newIndex: number) => void;

  // Persistence
  save: () => Promise<void>;
  load: (pageId: string) => Promise<void>;
  getSchema: () => PageSchema;
}
```

```typescript
// historyStore.ts — undo/redo
interface HistoryStore {
  past: Snapshot[];
  future: Snapshot[];
  canUndo: boolean;
  canRedo: boolean;

  pushSnapshot: (snapshot: Snapshot) => void;
  undo: () => Snapshot | null;
  redo: () => Snapshot | null;
  clear: () => void;
}
```

```typescript
// devModeStore.ts — overlay state
interface DevModeStore {
  enabled: boolean;
  hoveredId: string | null;
  deviceMode: "desktop" | "tablet" | "mobile";
  showGuides: boolean;
  showLabels: boolean;

  toggle: () => void;
  enable: () => void;
  disable: () => void;
  setDeviceMode: (mode: string) => void;
}
```

**Write:** Stores exist. DevModeProvider wraps the admin page editor. Toggle enables/disables Dev Mode.
**Test:** Click Dev Mode toggle → `devModeStore.enabled` flips. `Ctrl+Z` triggers undo.

---

## Task 2.5.2 — Overlay System (Hover + Selection Outlines)

```
Files to create:
  web/src/components/dev-mode/OverlaySystem.tsx   ← Renders outlines on top of canvas
  web/src/components/dev-mode/BlockOverlay.tsx    ← Individual block overlay (label + outline)
  web/src/components/dev-mode/SelectionGlow.tsx   ← Active selection highlight
```

The overlay system renders a transparent layer **on top of the page canvas** that shows:

- **On hover**: Blue outline around the block + label (type name + path)
- **On select**: Highlighted glow border + resize handles
- **Spacing guides**: Padding/margin indicators (like Chrome DevTools)
- **Dimension labels**: Width × height in the corner

```typescript
// BlockOverlay.tsx
export function BlockOverlay({ block, isSelected, isHovered }: BlockOverlayProps) {
  const rect = useElementRect(block.id);  // Get DOM rect from block element ID

  if (!rect) return null;

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
    >
      {/* Outline */}
      <div className={`absolute inset-0 border-2 transition-colors ${
        isSelected ? "border-primary-500" : isHovered ? "border-primary-500/50" : "border-transparent"
      }`} />

      {/* Label */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-6 left-0 rounded-t bg-primary-500 px-2 py-0.5 text-[10px] font-medium text-white whitespace-nowrap">
          {block.type}
        </div>
      )}

      {/* Dimensions */}
      {isSelected && (
        <div className="absolute -bottom-5 right-0 rounded bg-[#1a1a2e] px-1.5 py-0.5 text-[10px] text-white/70">
          {rect.width} × {rect.height}
        </div>
      )}
    </div>
  );
}
```

**Write:** Hovering a block in the page canvas shows a blue outline + type label. Selecting shows glow + dimensions.
**Test:** Hover over hero heading → blue outline appears with "heading" label. Click → glow persists.

---

## Task 2.5.3 — Structure Tree (Layer Panel)

```
Files to create:
  web/src/components/dev-mode/StructureTree.tsx     ← Left sidebar layer panel
  web/src/components/dev-mode/TreeNode.tsx          ← Individual tree node
```

Figma-style layers panel on the left side:

```
Page
├─ ► Hero Section
│    ├─ Heading
│    ├─ Subtitle
│    └─ CTA Button
├─ ► Features Grid
│    ├─ Feature Card
│    ├─ Feature Card
│    └─ Feature Card
├─ ► Stats Bar
└─ ► Footer
```

**Features:**
- Click to select (syncs with canvas selection)
- Drag to reorder (within parent)
- Drag to reparent (move block to different container)
- Right-click context menu (duplicate, delete, copy, paste)
- Toggle child visibility (expand/collapse sections)
- Shows block type icon + label
- Highlights active selection

**Write:** Structure tree mirrors the block hierarchy. Selecting in tree selects on canvas. Drag reorders blocks.
**Test:** Add 3 feature cards → structure tree shows 3 children under Features Grid. Drag to reorder → canvas updates.

---

## Task 2.5.4 — Inline Text Editor

```
Files to create:
  web/src/components/dev-mode/InlineEditor.tsx   ← contentEditable wrapper
```

Click any text block → it becomes editable inline (like Notion).

```typescript
export function InlineEditor({ blockId, value, onChange }: InlineEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  function handleDoubleClick() {
    setEditing(true);
    // Focus + select all text
    setTimeout(() => {
      ref.current?.focus();
      window.getSelection()?.selectAllChildren(ref.current!);
    }, 0);
  }

  function handleBlur() {
    setEditing(false);
    onChange(ref.current?.textContent ?? "");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      ref.current?.blur();
    }
  }

  return (
    <div
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={editing ? "outline-2 outline-primary-500/50 outline cursor-text" : "cursor-pointer"}
    >
      {value}
    </div>
  );
}
```

**Write:** Double-click any text → inline editor activates. Enter saves. Escape cancels. Changes sync to store.
**Test:** Double-click hero heading → text becomes editable. Type new text → blur → heading updates.

---

## Task 2.5.5 — Properties Panel

```
Files to create:
  web/src/components/dev-mode/PropertiesPanel.tsx     ← Right sidebar panel
  web/src/components/dev-mode/TypographyEditor.tsx    ← Font props
  web/src/components/dev-mode/ColorEditor.tsx         ← Color picker
  web/src/components/dev-mode/SpacingEditor.tsx       ← Padding/margin sliders
  web/src/components/dev-mode/EffectsEditor.tsx        ← Shadow/blur/radius
  web/src/components/dev-mode/AnimationEditor.tsx      ← Motion config
  web/src/components/dev-mode/ResponsiveEditor.tsx    ← Per-breakpoint overrides
```

**Properties Panel** is contextual — it shows editors for the selected block's type.

```
┌──────────────────────────────┐
│  Properties — Hero Heading   │
│                              │
│  📝 Content                  │
│  [Learn Anything, Anywhere]  │
│                              │
│  ░░░ Typography ░░░░░░░░░    │
│  Font:  [Inter ▼]            │
│  Size:  [72px ───●────]      │
│  Weight:[800 ──●─────]       │
│  L-height:[1.05 ─●───]       │
│  Track: [─2 ───●────]        │
│                              │
│  ░░░ Colors ░░░░░░░░░░░░░    │
│  Text:  [#F5F7FA ■]          │
│  Hover: [#4F7CFF ■]          │
│                              │
│  ░░░ Spacing ░░░░░░░░░░░░    │
│  Padding: [12px ────●──]     │
│  Margin:  [0px ●───────]     │
│                              │
│  ░░░ Effects ░░░░░░░░░░░░    │
│  Shadow: [None ▼]            │
│  Radius: [8px ───●────]      │
│  Glass:  [OFF ●──────]       │
│                              │
│  ░░░ Animation ░░░░░░░░░     │
│  Hover: [Scale 1.05 ▼]       │
│  Enter: [Fade Up ▼]          │
│                              │
│  📱 Responsive               │
│  Tablet: [edit separately]   │
│  Mobile: [edit separately]   │
└──────────────────────────────┘
```

**Write:** Selecting a block populates the right sidebar with contextual editors. Every change updates instant.
**Test:** Select heading → change font size in slider → heading size updates on canvas immediately.

---

## Task 2.5.6 — Responsive Breakpoint System

```
Files to create:
  web/src/components/dev-mode/ResponsiveBar.tsx     ← Topbar device switcher
  web/src/lib/responsive-engine.ts                   ← Breakpoint logic
```

**ResponsiveBar** sits at the top of the canvas:

```
[💻 Desktop] [📱 Tablet] [📱 Mobile]
```

- Switching breakpoints resizes the canvas viewport (visual preview)
- Each breakpoint stores separate style overrides per block
- Changes in one breakpoint don't affect others (opt-in "apply all")
- Visual indicators show which breakpoint has custom overrides

```typescript
// responsive-engine.ts
export const BREAKPOINTS = {
  desktop: { minWidth: 1025, label: "Desktop", icon: "Monitor" },
  tablet: { minWidth: 768, maxWidth: 1024, label: "Tablet", icon: "Tablet" },
  mobile: { minWidth: 320, maxWidth: 767, label: "Mobile", icon: "Smartphone" },
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function resolveStyle(
  baseStyles: StyleDeclaration,
  responsiveStyles: ResponsiveConfig | undefined,
  breakpoint: Breakpoint
): StyleDeclaration {
  if (!responsiveStyles?.[breakpoint]) return baseStyles;
  return mergeStyles(baseStyles, responsiveStyles[breakpoint]!);
}
```

**Write:** Toggle between desktop/tablet/mobile. Canvas resizes. Breakpoint-specific styles apply.
**Test:** Set desktop heading to 72px, mobile to 32px → toggle → canvas renders correct size per breakpoint.

---

## Task 2.5.7 — Block Drag-Drop Reorder (Canvas)

```
Files to modify:
  web/src/components/dev-mode/StructureTree.tsx  ← Add drag-drop via dnd-kit
  web/src/components/dev-mode/OverlaySystem.tsx  ← Add drag handle on canvas
```

Use `@dnd-kit/core` for drag-and-drop:

- Drag blocks in structure tree to reorder
- Drag handle overlay on canvas blocks (appears on hover in Dev Mode)
- Drop zone indicators (blue line between blocks)
- Animate reorder transitions

**Write:** Drag blocks in structure tree → canvas reorders. Drag handle on canvas → drop zone indicators.
**Test:** Drag Feature Card from position 3 to position 1 → canvas and tree both update.

---

## Task 2.5.8 — Component Preset Swapper

```
Files to create:
  web/src/lib/block-presets.ts                    ← Preset definitions
  web/src/components/dev-mode/PresetPicker.tsx    ← Preset dropdown/panel
```

Pre-built configurations for each block type:

```typescript
// block-presets.ts
export const HERO_PRESETS: Preset[] = [
  {
    id: "hero-classic",
    name: "Classic",
    description: "Centered text with CTA",
    preview: "/presets/hero-classic.png",
    schema: {
      type: "hero",
      props: { title: "Learn Anything", ... },
      styles: { typography: { fontSize: "72px" }, ... },
    },
  },
  {
    id: "hero-split",
    name: "Split Layout",
    description: "Text left, visual right",
    preview: "/presets/hero-split.png",
    schema: { ... },
  },
  {
    id: "hero-glass",
    name: "Glass",
    description: "Glassmorphism hero",
    schema: { ... },
  },
];
```

**Write:** Selecting a block shows preset options. Clicking a preset replaces the block's entire config.
**Test:** Select hero → click "Glass" preset → hero transforms to glass style instantly.

---

## Task 2.5.9 — Version History UI

```
Files to create:
  web/src/components/dev-mode/HistoryPanel.tsx    ← Undo/redo + snapshots
  web/src/components/dev-mode/SnapshotDialog.tsx  ← Named snapshot management
```

**HistoryPanel** (bottom or slide-out):
- Shows undo/redo stack as a list
- Click any point in history to restore
- Keyboard shortcuts: `Ctrl+Z` undo, `Ctrl+Shift+Z` redo
- Auto-save indicator (shows last saved time)

**SnapshotDialog:**
- "Save Snapshot" button with name input
- Gallery of snapshots with timestamp
- Preview snapshot on hover
- "Restore" button with confirmation

**Write:** Undo/redo works via Ctrl+Z. Snapshots persist to DB. Gallery shows version history.
**Test:** Make 5 edits → Ctrl+Z 3 times → 3 edits undone. Save snapshot → reload page → restore snapshot.

---

## Task 2.5.10 — Publish Workflow

```
Files to create:
  web/src/components/dev-mode/PublishButton.tsx      ← Publish with validation
```

- "Publish" button in Dev Mode topbar
- Pre-publish validation checklist:
  - No empty blocks
  - All images have alt text
  - All links are valid
  - Responsive breaks checked
- Summary of changes since last publish
- Publish confirmation dialog
- Post-publish success toast with "View Live" link

**Write:** Publish validates, confirms, saves published schema to DB.
**Test:** Make changes → click Publish → validation passes → page live at production URL.

---

## Phase 2.5 Validation Gate

- [ ] Dev Mode toggle activates overlay system on the page canvas
- [ ] Hovering blocks shows blue outline + label overlay
- [ ] Clicking a block selects it (glow border + populates properties panel)
- [ ] Structure tree mirrors block hierarchy — click to select, drag to reorder
- [ ] Inline editing: double-click text → type → blur saves
- [ ] Properties panel: contextual editors for typography, colors, spacing, effects, animation
- [ ] Responsive bar: toggle desktop/tablet/mobile → canvas resizes + breakpoint styles apply
- [ ] Undo/redo via Ctrl+Z/Ctrl+Shift+Z
- [ ] Block presets: swap hero/footer/etc between visual variants
- [ ] Snapshots: save named versions, browse gallery, restore
- [ ] Publish: validation → confirmation → live deployment
- [ ] `typecheck` + `next build` pass with zero errors

---

## Dependency Graph

```
Phase 1.75 (Dynamic Renderer)
    │
    ▼
Phase 2 (Adaptive + Gamification) ──► Phase 2.5 (Dev Mode)
    │                                         │
    ▼                                         ▼
Phase 3 (AI + Mobile) ◄──────────────────── Phase 3 AI
```

Phase 2.5 can run **in parallel** with Phase 2. It depends only on Phase 1.75 (block registry, PageRenderer, schema-driven pages).
