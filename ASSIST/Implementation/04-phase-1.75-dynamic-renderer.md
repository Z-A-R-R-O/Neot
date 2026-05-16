# Phase 1.75: Dynamic Renderer & Component Registry

> **Goal:** Frontend is no longer hardcoded. UI renders dynamically from backend schemas. This unlocks the "platform engine" vision.

---

## Core Philosophy

Replace this pattern everywhere:
```tsx
// OLD: hardcoded switch/case
switch (block.type) {
  case "text": return <TextBlock ... />;
  case "video": return <VideoBlock ... />;
  default: return "Unknown";
}
```

With this:
```tsx
// NEW: registry-based dynamic lookup
const Component = registry.get(block.type);
return Component ? <Component {...block.props} /> : <FallbackBlock />;
```

**Note:** The implementation grew beyond the original 9-section plan. There are now **17 registered section types** + 5 additional section files, plus `block-presets.ts`, `responsive-engine.ts`, and 7 registered editors.

---

## Task 1.75.1 — Component Registry

```
Files to create:
  web/src/lib/block-registry.ts       ← Shared registry singleton
  web/src/types/registry.ts           ← Registry types
```

```typescript
// block-registry.ts
import type { ComponentType } from "react";

export interface BlockComponentProps {
  id: string;
  props: Record<string, unknown>;
  children?: BlockSchema[];
}

export interface BlockSchema {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: BlockSchema[];
}

export interface PageSchema {
  page: string;
  title?: string;
  blocks: BlockSchema[];
}

type BlockComponent = ComponentType<BlockComponentProps>;

class ComponentRegistry {
  private blocks = new Map<string, BlockComponent>();

  register(type: string, component: BlockComponent): void {
    this.blocks.set(type, component);
  }

  get(type: string): BlockComponent | undefined {
    return this.blocks.get(type);
  }

  getAll(): [string, BlockComponent][] {
    return Array.from(this.blocks.entries());
  }

  has(type: string): boolean {
    return this.blocks.has(type);
  }
}

export const blockRegistry = new ComponentRegistry();
```

**Write:** Registry singleton exists. Blocks register themselves at import time.
**Test:** `blockRegistry.get("text")` returns TextBlock component.

---

## Task 1.75.2 — Register All Existing Blocks

```
Files to modify:
  web/src/components/blocks/text-block.tsx     ← add self-registration
  web/src/components/blocks/video-block.tsx    ← add self-registration
  web/src/components/blocks/quiz-block.tsx     ← add self-registration
  web/src/components/blocks/index.ts           ← NEW barrel export that runs all registrations
```

Each block file adds at the bottom:
```typescript
import { blockRegistry } from "@/lib/block-registry";

// In same file or separate register call:
blockRegistry.register("text", TextBlock as BlockComponent);
blockRegistry.register("video", VideoBlock as BlockComponent);
```

Create barrel:
```typescript
// components/blocks/index.ts
import "./text-block";
import "./video-block";
import "./quiz-block";
// All blocks register themselves via side-effect import
```

Import barrel once in layout or providers:
```typescript
// In providers.tsx or layout.tsx:
import "@/components/blocks";
```

**Write:** Every existing block registers itself. New blocks only need to add a register() call.
**Test:** Import blocks barrel → registry has 3 entries → `registry.get("text")` returns component.

---

## Task 1.75.3 — Build PageRenderer

```
Files to create:
  web/src/components/blocks/page-renderer.tsx  ← Top-level schema renderer
  web/src/components/blocks/block-renderer.tsx  ← REWRITE: remove switch/case
  web/src/components/blocks/fallback-block.tsx  ← Fallback for unknown block types
```

```typescript
// page-renderer.tsx
"use client";

import { blockRegistry, type PageSchema, type BlockComponentProps } from "@/lib/block-registry";

function DynamicBlock({ block }: { block: BlockComponentProps }) {
  const Component = blockRegistry.get(block.type);
  if (!Component) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
        Unknown block: <code>{block.type}</code>
      </div>
    );
  }
  return <Component id={block.id} props={block.props} children={block.children} />;
}

export function PageRenderer({ schema }: { schema: PageSchema }) {
  return (
    <div className="page-renderer">
      {schema.blocks.map((block) => (
        <DynamicBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
```

Rewrite existing `block-renderer.tsx` to use registry:
```typescript
// block-renderer.tsx (rewritten)
"use client";

import { blockRegistry } from "@/lib/block-registry";

interface BlockRendererProps {
  block: { id: string; type: string; content?: Record<string, unknown> };
  lessonId?: string;
}

export function BlockRenderer({ block, lessonId }: BlockRendererProps) {
  const Component = blockRegistry.get(block.type);
  if (!Component) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
        Unknown block type: <code className="text-sm">{block.type}</code>
      </div>
    );
  }
  return (
    <Component
      id={block.id}
      props={{ ...block.content, lessonId } as Record<string, unknown>}
    />
  );
}
```

**Write:** `PageRenderer` takes any JSON schema and renders it. No switch/case anywhere.
**Test:** Pass `{ page: "test", blocks: [{ id: "1", type: "text", props: { markdown: "Hello" } }] }` → renders TextBlock with "Hello".

---

## Task 1.75.4 — Public Catch-All Page Route

```
Files to create:
  web/src/app/\[slug\]/page.tsx           ← Dynamic route: renders any page from DB
  web/src/app/api/pages/\[slug\]/route.ts  ← Public API: fetch page schema by slug
```

```typescript
// app/[slug]/page.tsx
import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await prisma.customPage.findUnique({
    where: { slug: params.slug, status: "published" },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!page) return <div className="p-8 text-center text-gray-500">Page not found</div>;

  const schema = {
    page: page.slug,
    title: page.title,
    blocks: page.sections.map((s) => ({
      id: s.id,
      type: s.blockType,
      props: JSON.parse(s.content),
    })),
  };

  return (
    <main className="min-h-screen">
      <PageRenderer schema={schema} />
    </main>
  );
}
```

**Write:** Any page created in admin at `/admin/pages` with status "published" is publicly accessible at `/{slug}`.
**Test:** Create page "about" in admin → publish → visit `/about` → renders hero + sections from DB.

---

## Task 1.75.5 — Convert Homepage to Schema-Driven

```
Files to modify:
  web/src/app/page.tsx  ← Rewrite: fetch schema from DB instead of hardcoded JSX
```

```typescript
// app/page.tsx — rewritten
import { prisma } from "@/lib/db";
import { PageRenderer } from "@/components/blocks/page-renderer";

export default async function HomePage() {
  const page = await prisma.customPage.findUnique({
    where: { slug: "home", status: "published" },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!page) {
    // Fallback: render minimal default if no home page configured yet
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold">NEOT</h1>
        <p className="mt-2 text-gray-500">Learning should adapt to humans.</p>
      </main>
    );
  }

  const schema = {
    page: "home",
    title: page.title,
    blocks: page.sections.map((s) => ({
      id: s.id,
      type: s.blockType,
      props: JSON.parse(s.content),
    })),
  };

  return (
    <main className="min-h-screen">
      <PageRenderer schema={schema} />
    </main>
  );
}
```

**Write:** Homepage content comes from DB. Admin edits homepage sections → homepage updates instantly.
**Test:** Change hero title in admin → refresh homepage → new title rendered.

---

## Task 1.75.6 — Update LivePreview to Use PageRenderer

```
Files to modify:
  web/src/components/admin/pages/live-preview.tsx  ← Replace inline JSX with PageRenderer
```

The `LivePreview` currently has ~150 lines of `switch/case` rendering each section type. Replace with:

```typescript
import { PageRenderer } from "@/components/blocks/page-renderer";
import { usePageBuilderStore } from "@/stores/pageBuilderStore";

export function LivePreview() {
  const { sections } = usePageBuilderStore();

  const schema = {
    page: "preview",
    blocks: sections.map((s) => ({
      id: s.id,
      type: s.blockType,
      props: s.content as Record<string, unknown>,
    })),
  };

  return (
    <div className="min-h-full border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
      </div>
      {sections.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Add sections from the palette to preview
        </div>
      ) : (
        <PageRenderer schema={schema} />
      )}
    </div>
  );
}
```

This eliminates the entire `renderSectionContent()` function (~100 lines) and makes the preview render exactly what the public page will render.

**Write:** Admin live preview uses same PageRenderer as public site. WYSIWYG parity achieved.
**Test:** Add hero section in admin → preview shows hero. Public page at /slug shows same hero.

---

## Task 1.75.7 — Move Block Definitions to DB

```
Files to create:
  web/src/app/api/admin/block-definitions/route.ts  ← CRUD for block definitions
  web/src/lib/block-definitions-db.ts                 ← DB-backed block definition loader
```

Currently `block-definitions.ts` is hardcoded. Move it to DB so the admin block builder UI can create/edit block types at runtime.

```prisma
// Add to schema.prisma
model BlockDefinition {
  id          String   @id @default(uuid())
  name        String
  description String?
  icon        String?
  fields      String   @default("[]")   // JSON array of BlockFieldDef
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("block_definitions")
}
```

```typescript
// block-definitions-db.ts
import { prisma } from "@/lib/db";
import type { BlockDefinition } from "@/lib/block-definitions";

export async function getBlockDefinitions(): Promise<BlockDefinition[]> {
  const records = await prisma.blockDefinition.findMany({
    orderBy: { name: "asc" },
  });
  return records.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    icon: r.icon ?? "FileText",
    fields: JSON.parse(r.fields),
  }));
}
```

Fallback to hardcoded definitions if DB is empty (graceful migration).

**Write:** Admin "Block Library" page reads from DB. Admin can create new block types with custom fields.
**Test:** Create block "Audio" via admin API → GET /api/admin/block-definitions returns it → appears in block palette.

---

## Task 1.75.8 — Section Editors Use PageRenderer

```
Files to modify:
  web/src/components/admin/pages/section-builder.tsx  ← Replace switch/case with registry
```

The `renderEditor()` function in `section-builder.tsx` currently has a switch/case for 6 editor types. Replace with a similar `editorRegistry` pattern:

```typescript
// Simple editor registry parallel to block registry
const editorRegistry = new Map<string, ComponentType<EditorProps>>();
editorRegistry.set("hero", HeroEditor);
editorRegistry.set("feature-grid", FeatureGridEditor);
// ... etc

function renderEditor() {
  if (!selectedSection) return <Placeholder />;
  const Editor = editorRegistry.get(selectedSection.blockType);
  if (!Editor) return <div>No editor for {selectedSection.blockType}</div>;
  return <Editor content={selectedSection.content} onChange={handleChange} />;
}
```

**Write:** Section editors register themselves. No switch/case in section-builder.
**Test:** Select hero section → HeroEditor renders. Add new editor type → just register it.

---

## Phase 1.75 Validation Gate

- [x] `blockRegistry` singleton exists with `register()` / `getComponent()` / `getEditor()` / `has()` / `getAll()` / `getKeys()` / `getByScope()`
- [x] All existing blocks (text, video, quiz) self-register via `registrations.ts`
- [x] `PageRenderer` renders any section array via registry lookup
- [x] `BlockRenderer` rewritten — zero `switch/case` statements
- [x] `editorRegistry` singleton — section editors register via `registrations.ts`
- [x] 17 page section render components registered (hero, feature-grid, stats-bar, cta-banner, faq, pricing-table, course-carousel, testimonials, custom-html, adaptive-stream, how-it-works, knowledge-constellation, adaptive-timeline, live-ecosystem, future-self, achievement-ecosystem, learning-dna)
- [x] 7 page section editors registered (hero, feature-grid, stats-bar, cta-banner, faq, pricing-table, testimonials)
- [x] Catch-all `(public)/[...slug]` route fetches and renders published pages from DB
- [x] Homepage (`/`) fetches schema from DB — admin edits update it instantly
- [x] `LivePreview` uses `blockRegistry` instead of inline switch/case
- [x] `BlockDefinition` model added to Prisma schema + 10 block type definitions in `block-definitions.ts`
- [x] `block-presets.ts` — visual presets for hero, feature-grid, cta-banner
- [x] `responsive-engine.ts` — breakpoint system (desktop/tablet/mobile)
- [x] Section editors use `editorRegistry` — no switch/case
- [x] All existing functionality preserved (`typecheck` + `next build` pass)

> **Phase 1.75 Complete** ✅ → Move to `05-phase-2-adaptive-gamification.md`
