# Track A — Core (Dev A) ✅ COMPLETE

> Create the registry foundation, register blocks, build PageRenderer, move block defs to DB.

---

## A.1 — Component Registry Singleton

**Files:** `web/src/lib/block-registry.ts`, `web/src/types/registry.ts`

```
[x] Created block-registry.ts with:
    - BlockRegistry class (Map<string, RegistryEntry>)
    - register(), getComponent(), getEditor(), has(), getAll(), getByScope() methods
    - Types: BlockComponentProps, EditorComponentProps, RegistryEntry
    - Exported singleton: blockRegistry
[x] Created types/registry.ts with shared types
[x] npm run typecheck passes
```

---

## A.2 — Register Existing Blocks

**Files:** `web/src/components/blocks/text-block.tsx`, `video-block.tsx`, `quiz-block.tsx`, `index.ts`
**Modify:** `web/src/app/providers.tsx`

```
[x] Blocks registered via central registrations.ts (self-registration at import)
[x] Created index.ts barrel exporting all block components
[x] providers.tsx: added import "@/lib/registrations"
[x] npm run typecheck passes
```

---

## A.3 — PageRenderer + BlockRenderer Rewrite

**Files:** `web/src/components/blocks/page-renderer.tsx` (new), `block-renderer.tsx` (rewrite)

```
[x] page-renderer.tsx: PageRenderer renders section array via blockRegistry
[x] block-renderer.tsx: DELETED switch/case, uses blockRegistry.getComponent()
[x] npm run typecheck passes
```

---

## A.4 — DB-Backed Block Definitions

**Files:** `web/prisma/schema.prisma` (modify)

```
[x] schema.prisma: added BlockDefinition model (id, type, label, desc, scope, icon, category, schema JSON, timestamps)
[x] npm run typecheck passes
```

---

## A — Final Checks

```
[x] All A.1–A.4 complete
[x] npm run typecheck — zero errors
[x] npm run build — succeeds
```
