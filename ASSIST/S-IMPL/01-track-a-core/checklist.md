# Track A — Core (Dev A)

> Create the registry foundation, register blocks, build PageRenderer, move block defs to DB.

---

## A.1 — Component Registry Singleton

**Files:** `web/src/lib/block-registry.ts`, `web/src/types/registry.ts`

```
[ ] Created block-registry.ts with:
    - ComponentRegistry class (Map<string, ComponentType>)
    - register(), get(), has(), getAll() methods
    - Types: BlockComponentProps, BlockSchema, PageSchema
    - Exported singleton: blockRegistry
[ ] Created types/registry.ts re-exporting types
[ ] npm run typecheck passes
```

**Commit:** `S-IMPL: Create shared ComponentRegistry singleton`

---

## A.2 — Register Existing Blocks

**Files:** `web/src/components/blocks/text-block.tsx`, `video-block.tsx`, `quiz-block.tsx`, `index.ts`
**Modify:** `web/src/app/providers.tsx`

```
[ ] text-block.tsx: added blockRegistry.register("text", ...) at bottom
[ ] video-block.tsx: added blockRegistry.register("video", ...) at bottom
[ ] quiz-block.tsx: added blockRegistry.register("quiz", ...) at bottom
[ ] Created index.ts barrel: import "./text-block" etc.
[ ] providers.tsx: added import "@/components/blocks"
[ ] npm run typecheck passes
```

**Test:** `blockRegistry.get("text")` returns TextBlock component.

**Commit:** `S-IMPL: Register text, video, quiz blocks in registry`

---

## A.3 — PageRenderer + BlockRenderer Rewrite

**Files:** `web/src/components/blocks/page-renderer.tsx` (new), `block-renderer.tsx` (rewrite), `fallback-block.tsx` (new)

```
[ ] page-renderer.tsx:
    - DynamicBlock: looks up blockRegistry, renders component or fallback
    - PageRenderer: iterates PageSchema.blocks, renders each
[ ] block-renderer.tsx: DELETED switch/case, uses blockRegistry.get()
[ ] fallback-block.tsx: styled "Unknown block" placeholder
[ ] npm run typecheck passes
```

**Test:** `<PageRenderer schema={{blocks:[{id:"1",type:"text",props:{markdown:"Hi"}}]}} />` renders TextBlock.

**Commit:** `S-IMPL: Build PageRenderer, rewrite BlockRenderer with registry`

---

## A.4 — DB-Backed Block Definitions

**Files:** `web/prisma/schema.prisma` (modify), `web/src/lib/block-definitions-db.ts` (new), `web/src/app/api/admin/block-definitions/route.ts` (new)

```
[ ] schema.prisma: added BlockDefinition model (id, name, desc, icon, fields JSON, timestamps)
[ ] Ran: npx prisma db push && npx prisma generate
[ ] block-definitions-db.ts: getBlockDefinitions() reads DB, falls back to hardcoded
[ ] API route: GET list, POST create (admin-only, Zod validated)
[ ] npm run typecheck passes
```

**Test:** `POST /api/admin/block-definitions {name:"Audio",fields:[...]}` → GET returns it.

**Commit:** `S-IMPL: Move block definitions to DB with CRUD API`

---

## A — Final Checks

```
[ ] All A.1–A.4 complete
[ ] npm run typecheck — zero errors
[ ] npm run build — succeeds
```
