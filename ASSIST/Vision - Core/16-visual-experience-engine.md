# Visual Experience Engine — Product Specification

> The NEOT platform is not a page editor. It is a **Visual Experience Engine** — a dual-mode system where every section, component, text, color, radius, spacing, animation, media, layout, and interaction is editable visually in real time.

---

## 1. Core Concept — Dual Mode System

### Viewer Mode
The normal website. Clean, production experience. No overlays, no editing chrome. This is what end users (students, parents, visitors) see.

### Dev Mode
A visual editing layer appears **on top of the frontend**. The admin toggles Dev Mode and the page transforms into an editable canvas — like Figma inspect, Framer editor, Chrome DevTools, and Webflow designer combined.

```
┌─────────────────────────────────────────────────────────┐
│  [🔌 Dev Mode Toggle]  [💻 ▰▰▰📱]  [↩ Undo] [↪ Redo] │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────┐  ┌──────────┐  │
│  │  Layers   │  │   Live Canvas        │  │ Properties│  │
│  │           │  │                      │  │           │  │
│  │  Page     │  │  ┌────────────────┐  │  │ Typography│  │
│  │  ├─Hero   │  │  │  Click to edit │  │  │ Spacing   │  │
│  │  ├─Feat.  │  │  │                │  │  │ Effects   │  │
│  │  ├─Stats  │  │  │  [blue outline]│  │  │ Animation │  │
│  │  ├─CTA    │  │  └────────────────┘  │  │ Responsive│  │
│  │  └─Footer │  │                      │  └──────────┘  │
│  └──────────┘  └──────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Dev Mode Experience

### 2.1 Toggle
- **Location**: Admin topbar, prominent toggle button
- **State**: Disabled by default (Viewer Mode)
- **When enabled**: The frontend overlays transform into editable canvas
- **Visual feedback**: Subtle glow border around the viewport indicates Dev Mode is active

### 2.2 Dev Mode UI Layout

| Zone | Content |
|------|---------|
| **Topbar** | Dev Mode toggle, device preview (desktop/tablet/mobile), undo/redo, publish, history |
| **Left Sidebar** | Structure tree / layers panel (like Figma layers) — click to select, drag to reorder |
| **Center (Canvas)** | Live website — fully interactive + editable overlays |
| **Right Sidebar** | Properties panel — contextual editor for selected element |

### 2.3 Overlay System

When hovering any element in Dev Mode:

```
┌──────────────────────────────────────────────┐
│  [blue outline]                               │
│  ┌──────────────────────────────────────┐    │
│  │  Label: "Hero > CTA Button"         │    │
│  │  Dimensions: 180px × 48px           │    │
│  │  Spacing guides (padding/margin)    │    │
│  │  Z-index: 10                        │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

Like Chrome DevTools element inspector + Figma design tool combined.

### 2.4 Click-to-Select

Click an element → it becomes the active selection:
- Element gets a highlighted glow border
- Right sidebar populates with that element's properties
- Structure tree highlights the node
- Properties panel shows editable controls

---

## 3. Editable Layers

### LEVEL 1 — Content (Inline Editing)

Every text element is click-to-edit inline (like Notion).

| Editable | Method |
|----------|--------|
| Text | Click → type directly |
| Headings | Click → type → font size selector |
| Paragraphs | Click → type → rich text toolbar |
| Buttons | Click → type label → link picker |
| Labels | Click → type |
| Lists | Click → add/remove items |
| Icons | Click → icon picker dropdown |

### LEVEL 2 — Styling (Properties Panel)

| Category | Editable Properties |
|----------|-------------------|
| **Typography** | Font family, weight, size, letter spacing, line height, text transform, gradients |
| **Colors** | Text, background, borders, hover states, gradients, opacity |
| **Layout** | Width, height, gap, padding, margin, alignment, flex/grid, position |
| **Effects** | Shadows, blur, glass, glow, border radius, backdrop blur, clip path |
| **Motion** | Hover animation, scroll reveal, fade, stagger, spring physics, duration, easing |

### LEVEL 3 — Structure (Structure Tree)

| Action | Implementation |
|--------|---------------|
| Drag sections | Drag from structure tree or click-and-hold on canvas |
| Reorder blocks | Drag handle overlay on hover |
| Duplicate | Right-click menu or keyboard shortcut |
| Nest blocks | Drag block into container in structure tree |
| Delete | Select → press Delete or right-click menu |
| Add new | Click "+" between blocks or at section end |
| Responsive | Toggle device size — edit separately per breakpoint |

---

## 4. Block System Architecture

### 4.1 Everything is a Block

```
Page
├── Hero Section
│    ├── Heading (block)
│    ├── Subtitle (block)
│    ├── CTA Button (block)
│    └── Hero Visual (block)
├── Features Grid (container block)
│    ├── Feature Card (block)
│    │    ├── Icon
│    │    ├── Title
│    │    └── Description
│    ├── Feature Card
│    └── Feature Card
├── Stats Bar
├── CTA Banner
└── Footer
```

### 4.2 Block Data Schema

```typescript
interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;     // Content properties
  styles: StyleDeclaration;           // Visual styles
  children: Block[];                  // Nested blocks
  animations: AnimationConfig[];       // Motion config
  responsive: ResponsiveConfig;       // Per-breakpoint overrides
  visibility: VisibilityConfig;       // Conditional display
}

interface StyleDeclaration {
  // All CSS properties as tokenized values
  typography: { fontFamily?: string; fontSize?: string; fontWeight?: string; ... };
  colors: { text?: string; background?: string; border?: string; ... };
  spacing: { padding?: string; margin?: string; gap?: string; ... };
  effects: { shadow?: string; borderRadius?: string; backdropBlur?: string; ... };
  layout: { display?: string; width?: string; height?: string; ... };
}

interface AnimationConfig {
  trigger: "hover" | "entrance" | "scroll" | "click";
  type: "fade" | "slide" | "scale" | "rotate" | "custom";
  duration: number;
  easing: string;
  delay: number;
  spring?: { stiffness: number; damping: number; mass: number };
}

interface ResponsiveConfig {
  desktop?: Partial<StyleDeclaration>;
  tablet?: Partial<StyleDeclaration>;
  mobile?: Partial<StyleDeclaration>;
}
```

### 4.3 Block Types

**Basic Layout**
- `Section` — full-width page section with background
- `Container` — centered width-limited wrapper
- `Grid` — CSS grid with configurable columns/rows
- `Stack` — flexbox column with gap control
- `Flex` — flexbox row with alignment
- `Columns` — multi-column layout

**Content**
- `Text` — Rich text / markdown
- `Heading` — H1-H6 with level selector
- `Image` — Upload / URL with alt text, object-fit
- `Video` — Upload / embed (YouTube, Vimeo)
- `Icon` — Icon picker from library
- `Button` — Label, link, variant, size, icon

**Interactive**
- `Accordion` — Expandable panel group
- `Tabs` — Tabbed content switcher
- `Carousel` — Sliding item showcase
- `Modal` — Overlay dialog trigger
- `Tooltip` — Hover tooltip

**NEOT Special**
- `Hero` — Cinematic hero with all variants
- `FeatureGrid` — Feature card grid
- `StatsBar` — Animated counters
- `Testimonials` — Review cards
- `PricingTable` — Pricing plan cards
- `FAQ` — Accordion FAQ
- `CourseCarousel` — Course showcase
- `CTA` — Call-to-action banner
- `CustomHTML` — Raw HTML/embed

---

## 5. Real-Time Frontend Editing

### 5.1 Architecture

```
Admin Panel (Dev Mode)
    │
    ▼
State Store (Zustand)
    │
    ├──► Block Tree (full page schema)
    ├──► Selection State (selected element)
    ├──► History Stack (undo/redo)
    ├──► Clipboard (copy/paste blocks)
    └──► Dirty Flag (unsaved changes)
    │
    ▼
Live Renderer (PageRenderer)
    │
    ▼
Frontend Updates Instantly
```

### 5.2 Instant Sync

- Change a property in the right sidebar → **frontend updates immediately**
- No page reload, no save button, no debounce lag
- Every property change flows: `PropertyEditor → Zustand Store → PageRenderer → DOM`
- The store holds the complete page schema — mutations trigger re-render of only the affected block

### 5.3 Live Preview

- The editing canvas **is** the actual frontend (not an iframe, not a mock)
- Selected element glows
- Changes render instantly with animation preview
- Creates the "magic feeling" of direct manipulation

---

## 6. Element Inspector

When an element is selected on the canvas:

```
╔══════════════════════════════════════════════╗
║  Element Inspector                           ║
║                                              ║
║  Path: Hero > CTA Button                     ║
║  ─────────────────────────────────────────── ║
║                                              ║
║  📝 Text: "Start Learning Free"              ║
║  🔗 Link: /signup                            ║
║  🎨 Style: [Open Typography Panel]           ║
║  ✨ Animations: [Pulse on Hover]             ║
║  📱 Responsive: [Edit Mobile]                ║
║  👁️ Visibility: [Always shown]              ║
║                                              ║
║  [Duplicate] [Delete] [Copy] [Paste Styles]  ║
╚══════════════════════════════════════════════╝
```

---

## 7. Responsive System

Editing respects three breakpoints independently:

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Desktop | > 1024px | Full layout, large typography |
| Tablet | 768px - 1024px | Adjusted spacing, 2-column grids |
| Mobile | < 768px | Single column, condensed spacing |

- Toggle between breakpoints in the topbar
- Changes made in one breakpoint do NOT cascade to others by default (opt-in "apply to all")
- Example: Desktop heading = 72px, Tablet = 48px, Mobile = 32px — each set independently

---

## 8. Theming System (Global Design Tokens)

### 8.1 Centralized Token Editor

Admin edits these globally — the entire platform updates instantly:

```css
/* Visual token editor in admin */
:root {
  --color-primary:    /* color picker */;
  --color-secondary:  /* color picker */;
  --color-accent:     /* color picker */;
  --font-heading:     /* font selector */;
  --font-body:        /* font selector */;
  --radius-sm:        /* slider */;
  --radius-md:        /* slider */;
  --radius-lg:        /* slider */;
  --shadow-sm:        /* shadow editor */;
  --shadow-md:        /* shadow editor */;
  --shadow-lg:        /* shadow editor */;
  --spacing-scale:    /* slider */;
}
```

Change primary color from blue to purple → entire website updates instantly.

### 8.2 Component Presets

Pre-built block configurations that users can swap instantly:

```
Hero V1 (Classic)    Hero V2 (Split)    Hero V3 (Glass)
Hero V4 (AI)         Hero V5 (Minimal)  Hero V6 (Video BG)
```

Each preset is a JSON schema of block props + styles + animations.

### 8.3 Section Marketplace (Future)

```
Install premium blocks:
├── Hero Pack Pro ($19)
├── Dashboard Starter ($29)
├── AI Widgets Bundle ($49)
├── E-commerce Sections ($39)
└── Animation Library ($14)
```

Like Shopify themes, Framer marketplace. This becomes a revenue stream.

---

## 9. Version History

| Feature | Implementation |
|---------|---------------|
| Undo/Redo | Zustand temporal middleware — full history stack |
| Auto-save | Debounced (2s) save to local IndexedDB |
| Snapshots | Manual named snapshots stored in DB |
| Restore | Browse snapshot gallery, preview, restore |
| Diff view | Side-by-side compare of any two versions |

---

## 10. Animation Editor

Visual animation configuration without code:

```
╔══════════════════════════════════════════════╗
║  Animation Editor  [Preview Animation]       ║
║                                              ║
║  Trigger: [On Scroll ▼]                      ║
║  Type:    [Fade Up ▼]                        ║
║  Duration: [0.6s ─────●──────]               ║
║  Delay:   [0.1s ──●────────]                 ║
║  Easing:  [Spring ▼]  Stiffness: [300]      ║
║           Damping: [20]  Mass: [1]            ║
║                                              ║
║  [Custom CSS]                                ║
║  @keyframes myAnim { ... }                   ║
╚══════════════════════════════════════════════╝
```

---

## 11. Media System

| Feature | Details |
|---------|---------|
| Upload | Drag-drop, multi-file, progress bar, 10MB limit |
| Types | Images (jpg/png/webp/avif), Video (mp4/webm), Audio, Lottie, GIF |
| Library | Grid view, search, filter by type, folder organization |
| URL copy | Click to copy URL, copy as markdown/html |
| Image editor | Crop, resize, focal point, alt text |
| Backgrounds | Image, video, gradient builder, solid color |
| 3D support | Model viewer for interactive 3D content |

---

## 12. Advanced Features (Future Phases)

### 12.1 AI Website Editing
User types: *"Make hero more futuristic"* → AI updates gradients, typography, spacing, glow, layout.

### 12.2 AI Section Generation
User types: *"Create Apple-style pricing section"* → Instant generation of full section with content, styles, responsive config.

### 12.3 Smart Design System
- Auto-spacing: visual rhythm calculators
- Harmony rules: prevent ugly color combinations
- Accessible contrast: automated contrast checking

### 12.4 Visual States
Edit styles separately for: `normal`, `hover`, `active`, `focus`, `dark mode`

### 12.5 Motion Presets
Pre-built animation configurations:
```
Apple Smooth    — 0.6s, spring(300,30,1)
Linear Fast     — 0.2s, ease-out
Framer Float    — 0.8s, spring(100,10,1)
Arc Glow        — 1.0s, ease-in-out, with glow
```

---

## 13. Technical Architecture

### 13.1 Frontend Layer
```
React / Next.js App Router
├── BlockRegistry (component lookup)
├── DevModeProvider (context + state)
├── OverlaySystem (hover/select outlines)
├── InlineEditor (contentEditable)
├── PropertiesPanel (style controls)
└── StructureTree (layer hierarchy)
```

### 13.2 Editor Engine
```
Zustand Store
├── pageStore         — Full page block tree
├── selectionStore    — Currently selected block
├── historyStore      — Undo/redo stack
├── devModeStore      — Dev Mode UI state
└── clipboardStore    — Copy/paste buffer
```

### 13.3 Renderer
```
JSON Schema → PageRenderer → BlockRegistry → Rendered DOM
                    ↓
              StyleResolver (inline styles from block.styles)
                    ↓
              AnimationEngine (Framer Motion from block.animations)
                    ↓
              ResponsiveEngine (breakpoint-aware rendering)
```

### 13.4 Data Flow
```
User edits in properties panel
    → Zustand store mutation
    → React re-render (targeted at changed block)
    → DOM updates instantly
    → History records the action
    → Auto-save triggers (2s debounce)
```

---

## 14. Priority Roadmap

| Phase | Focus | Output |
|-------|-------|--------|
| **1** | Block Architecture | Universal block types, nested block tree, block data schema, style engine |
| **2** | Dev Mode Overlay | Selection system, hover outlines, label overlays, structure tree, device preview |
| **3** | Inline Editing | ContentEditable text editing, rich text toolbar, click-to-edit pattern |
| **4** | Properties Panel | Typography editor, color picker, spacing controls, effects panel, animation config |
| **5** | Responsive System | Breakpoint toggle, per-breakpoint styles, responsive preview |
| **6** | Version History | Undo/redo stack, snapshots, auto-save, restore |
| **7** | Visual States | Hover/active/focus/dark mode state editing |
| **8** | AI Features | AI edit commands, AI section generation, smart design system |
| **9** | Marketplace | Block presets, premium sections, template marketplace |

---

## 15. Product Positioning

> **"The Apple-level AI-native visual website builder for learning platforms."**

This is NOT:
- A landing page editor
- A static CMS
- Another page builder clone

This IS:
- A visual creative engine
- A real-time design tool
- A no-code platform builder
- An AI-powered experience constructor

The key differentiator: **Dual Mode**. The admin edits the **actual live frontend**, not a separate admin panel mock. WYSIWYG is not just a preview — it IS the page.

---

## 16. Success Metrics

| Metric | Target |
|--------|--------|
| Time to create a new page | < 5 min |
| Time to edit a section | < 30 sec |
| Undo/redo reliability | 100% |
| Auto-save loss | Zero |
| Dev Mode TTL to first edit | < 3 sec |
| Properties panel render | < 50ms |
| Responsive preview accuracy | Pixel-perfect |
