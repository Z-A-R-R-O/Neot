# Track B — Pages (Dev B) ✅ COMPLETE

> Catch-all route, homepage rewrite, LivePreview refactor, editor registry.

---

## B.1 — Public Catch-All Route

**Files:** `web/src/app/(public)/[...slug]/page.tsx`

```
[x] [slug]/page.tsx:
    - Server component, fetches CustomPage by path + published status
    - Converts PageSection[] → sections array → <PageRenderer />
    - Fallback 404 (notFound()) if missing
[x] npm run typecheck passes
```

---

## B.2 — Homepage to Schema-Driven

**Files:** `web/src/app/page.tsx` (rewrite)

```
[x] Removed all hardcoded JSX (link cards, etc.)
[x] Fetches CustomPage where slug="home" from Prisma
[x] Converts sections array → <PageRenderer />
[x] Minimal fallback if no home page configured yet
[x] npm run typecheck passes
```

---

## B.3 — LivePreview Uses BlockRegistry

**Files:** `web/src/components/admin/pages/live-preview.tsx` (rewrite)

```
[x] DELETED renderSectionContent() function (~150 lines, full of switch/case)
[x] Imports blockRegistry, uses getComponent() for each section
[x] Keeps layout chrome (header, selection borders)
[x] npm run typecheck passes
```

---

## B.4 — Section Editors Registry

**Files:** `web/src/lib/editor-registry.ts` (new), `web/src/components/admin/pages/section-builder.tsx` (modify)

```
[x] editor-registry.ts: Map<string, ComponentType<EditorProps>> singleton
[x] section-builder.tsx: DELETED switch/case in renderEditor(), uses editorRegistry.get()
[x] Registered all 6 editors in central registrations.ts:
    [x] hero → HeroEditor
    [x] feature-grid → FeatureGridEditor
    [x] stats-bar → StatsBarEditor
    [x] cta-banner → CtaEditor
    [x] faq → FaqEditor
    [x] pricing-table → PricingEditor
[x] npm run typecheck passes
```

---

## B — Final Checks

```
[x] All B.1–B.4 complete
[x] npm run typecheck — zero errors
[x] npm run build — succeeds
```
