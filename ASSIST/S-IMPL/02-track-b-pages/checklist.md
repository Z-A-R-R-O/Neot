# Track B — Pages (Dev B)

> Catch-all route, homepage rewrite, LivePreview refactor, editor registry.
> **Wait:** Pull `block-registry.ts` & `page-renderer.tsx` from Dev A before starting.

---

## B.1 — Public Catch-All Route

**Files:** `web/src/app/\[slug\]/page.tsx` (new), `web/src/app/api/pages/\[slug\]/route.ts` (new)

```
[ ] Pulled block-registry.ts and page-renderer.tsx from Dev A
[ ] [slug]/page.tsx:
    - Server component, fetches CustomPage by slug + published status
    - Converts PageSection[] → PageSchema → <PageRenderer />
    - Fallback "Page not found" if missing
[ ] API route: GET returns page schema JSON (public, no auth)
[ ] npm run typecheck passes
```

**Test:** Create "about" page in admin → publish → visit `/about` → renders hero + sections.

**Commit:** `S-IMPL: Add catch-all [slug] route for published pages`

---

## B.2 — Homepage to Schema-Driven

**Files:** `web/src/app/page.tsx` (rewrite)

```
[ ] Removed all hardcoded JSX (link cards, hero section, etc.)
[ ] Fetches CustomPage where slug="home" from Prisma
[ ] Converts sections → PageSchema → <PageRenderer />
[ ] Minimal fallback if no home page configured yet
[ ] npm run typecheck passes
```

**Test:** Change hero title in admin → refresh `/` → new title renders.

**Commit:** `S-IMPL: Convert homepage to schema-driven from DB`

---

## B.3 — LivePreview Uses PageRenderer

**Files:** `web/src/components/admin/pages/live-preview.tsx` (rewrite)

```
[ ] DELETED renderSectionContent() function (~100 lines, full of switch/case)
[ ] Imports PageRenderer from blocks
[ ] Converts zustand store sections → PageSchema → <PageRenderer />
[ ] Keeps layout chrome (header, borders)
[ ] npm run typecheck passes
```

**Test:** Add hero section in admin → preview shows hero → public page shows same hero.

**Commit:** `S-IMPL: LivePreview uses shared PageRenderer`

---

## B.4 — Section Editors Registry

**Files:** `web/src/lib/editor-registry.ts` (new), `web/src/components/admin/pages/section-builder.tsx` (modify), all 6 section-editor files (modify)

```
[ ] editor-registry.ts: Map<string, ComponentType<EditorProps>> singleton
[ ] section-builder.tsx: DELETED switch/case in renderEditor(), uses editorRegistry.get()
[ ] Self-registered all 6 editors:
    [ ] hero-editor.tsx: editorRegistry.set("hero", HeroEditor)
    [ ] feature-grid-editor.tsx: editorRegistry.set("feature-grid", FeatureGridEditor)
    [ ] stats-bar-editor.tsx: editorRegistry.set("stats-bar", StatsBarEditor)
    [ ] cta-editor.tsx: editorRegistry.set("cta-banner", CtaEditor)
    [ ] faq-editor.tsx: editorRegistry.set("faq", FaqEditor)
    [ ] pricing-editor.tsx: editorRegistry.set("pricing-table", PricingEditor)
[ ] npm run typecheck passes
```

**Test:** Click hero section → HeroEditor renders. Click pricing → PricingEditor renders.

**Commit:** `S-IMPL: Section editors use registry, no switch/case`

---

## B — Final Checks

```
[ ] All B.1–B.4 complete
[ ] npm run typecheck — zero errors
[ ] npm run build — succeeds
```
