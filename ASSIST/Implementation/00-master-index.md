# Implementation Master Index

> Structured build plan for NEOT Learning Platform.
> Every phase produces deployable, testable output.

---

## Phase Map

| # | Phase | Primary Output | Status |
|--:|-------|----------------|--------|
| 0 | **Foundation** | Deployed Next.js + Prisma/SQLite + Auth UI | ✅ Complete |
| 1 | **Core Learning** | Course player + Teacher builder + Quiz | ✅ Complete |
| 1.5 | **Admin CMS** | Page builder + Theme engine + User mgmt | ✅ Complete |
| 1.75 | **Dynamic Renderer** | Component registry + PageRenderer + schema-driven homepage | ✅ Complete |
| UI | **UI Transformation** | Premium dark palette, cinematic hero, glass design system | ✅ Complete |
| 2 | **Adaptive + Gamification** | Adaptive engine + XP/Streaks + Recs | 🔲 Not started |
| 2.5 | **Dev Mode — Visual Experience Engine** | Dual-mode overlay editor, inline editing, properties panel, structure tree, responsive system | 🚧 In Progress |
| 3 | **AI + Mobile** | AI Tutor + Content Gen + Flutter app | 🔲 Not started |
| 4 | **Parent + School** | Parent dash + Classroom + Hardening | 🔲 Not started |
| 5 | **Scale + Marketplace** | Marketplace + Launch + Full blocks | 🔲 Not started |

---

## Quick Reference

```
ASSIST/
├── Implementation/
│   ├── 00-master-index.md
│   ├── 01-phase-0-foundation.md
│   ├── 02-phase-1-core-learning.md
│   ├── 03-phase-1.5-admin-cms.md
│   ├── 04-phase-1.75-dynamic-renderer.md
│   ├── 05-phase-2-adaptive-gamification.md
│   ├── 06-phase-2.5-dev-mode.md
│   ├── 07-phase-3-ai-mobile.md
│   ├── 08-phase-4-parent-school.md
│   ├── 09-phase-5-scale-marketplace.md
│   ├── 10-engineering-standards.md
│   └── 11-phase-ui-transformation.md
├── Log/
├── Tools/
└── Vision - Core/
    ├── 01-vision-overview.md
    ├── ...
    └── 16-visual-experience-engine.md   ← NEW: Dev Mode / Visual Experience Engine
```

---

## Build Pattern — Every Task Block Follows:

```
┌──────────────────────────────────────────┐
│ TASK: <name>                              │
│ Files: <specific files to create/modify>  │
│ Write: <acceptance criteria>              │
│ Test: <how to validate>                   │
└──────────────────────────────────────────┘
```

---

## Dependency Graph

```
Phase 0 ──► Phase 1 ──► Phase 1.5 ──► Phase 1.75 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
                                                           │
                    Phase 1.75 ──► Phase 2.5 (Dev Mode) ───┘
                                        │
                                        └──► Phase 3 AI
```

- Phase 1.5 requires Phase 1 course/lesson CRUD stable
- **Phase 1.75 requires Phase 1.5** (page builder + theme engine + block definitions exist)
- Phase 2 requires Phase 1.75 (dynamic renderer enables adaptive lesson mutation)
- **Phase 2.5 requires Phase 1.75** (block registry, PageRenderer, schema-driven pages)
- Phase 2.5 can run **in parallel** with Phase 2 — they share no file conflicts
- Phase 3 requires Phase 2 adaptive profiles + Phase 1.5 settings
- Phase 4 requires Phase 1 student/teacher data
- Phase 5 requires everything prior

---

## Architecture Decisions Log

| Decision | Rationale |
|----------|-----------|
| **Prisma + SQLite** instead of Supabase Postgres for local dev | Zero-config DB, fast iteration, typing via Prisma Client |
| **Local auth (Prisma sessions + bcrypt)** instead of Supabase Auth | Zero external dependencies, fully offline, full control |
| **Password hash in dedicated column** (`passwordHash`) | Security: avoids metadata corruption, clear schema intent |
| **`content_schema` stored as JSON string in `Lesson.content`** | Keeps Prisma SQLite schema simple; JSONB would require Postgres |
| **Zustand for UI state** + **TanStack Query for server state** | Clear separation: local UI state vs. async data caching |
| **shadcn/ui components** (Radix Nova preset) | Accessible, styled, registry-managed; replaces hand-rolled Radix wrappers |
| **In-memory rate limiter** (no Redis) | Simple for single-process dev; swap to Redis when scaling |
| **Dev Mode as overlay (not iframe)** | Instant editing on real DOM, no sync issues, WYSIWYG is the actual page |
| **Block tree in Zustand + undo/redo via temporal middleware** | Full history stack, no external dependency, targeted re-renders |

---

## Shipped Inventory

### Phase 0 — Foundation (✅ Complete)
- Next.js 16 + TypeScript + Tailwind scaffolding
- Prisma/SQLite with 14 models (Profile → Session → CustomPage)
- **Local auth**: bcrypt password hashing, session tokens in SQLite, HTTP-only cookies
- Auth UI: login, signup (age-gated), forgot-password, onboarding
- Role management: student, teacher, parent, admin
- Auth API routes: `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/logout`, `GET /api/auth/me`
- Rate limiting on login (5 req/min per IP)
- CSRF origin validation on mutation endpoints
- 14 shadcn/ui components (button, card, dialog, dropdown-menu, input, label, select, skeleton, tabs, tooltip, avatar, badge, progress, textarea)
- Layout shell: role-based sidebar, header, mobile nav
- Auth proxy (`src/proxy.ts`) — session-based route protection
- Error/loading/empty/offline states
- TanStack Query + Zustand stores
- Vitest test runner + 3 passing tests
- Prisma Client generated at `src/generated/prisma/`

### Phase 1 — Core Learning (✅ Complete)
- Course CRUD API + listing/detail pages
- Module management (add/reorder/delete)
- Lesson CRUD API + progress tracking (auto-save, resume)
- Block renderers: Text (markdown), Video (YouTube/Vimeo/upload), Quiz
- Quiz engine: MCQ, MSQ, True/False, Fill-blank with scoring + feedback
- Lesson player shell with sidebar nav + progress bar
- Teacher area: courses, module manager, drag-drop lesson builder
- Teacher block editors: text, video, quiz, quiz-question
- Teacher dashboard: stats, quick actions, full analytics (Recharts)
- Enrollment: API + hooks + duplicate prevention
- Publish workflow: checklist before going live

### Phase 1.5 — Admin CMS (✅ Complete)
- Admin route group (`/admin`, `/admin/pages`, `/admin/themes`, `/admin/blocks`, `/admin/users`, `/admin/media`, `/admin/settings`)
- Page builder: drag-drop section editor with 6 section types, live preview, Zustand store
- Theme engine: CSS variable provider, token converter, inheritance chain resolver
- Theme editor: split-pane UI with color pickers, font selector, animation config, live preview
- Block library: 10 block type definitions with field schemas
- User management: list/search/filter, role change, delete with confirmation
- Media library: drag-drop upload, grid view, copy URL, delete
- Platform settings: key-value store with General/Auth/Email tabs
- All API routes admin-protected with `getUser()` + role check
- 4 Prisma models: `CustomPage`, `PageSection`, `SiteTheme`, `Media`, `PlatformSetting`

### Phase 1.75 — Dynamic Renderer (✅ Complete)
- `BlockRegistry` singleton at `lib/block-registry.ts` with `register()`/`getComponent()`/`getEditor()`/`getByScope()`
- `EditorRegistry` singleton at `lib/editor-registry.ts` for admin section editors
- Shared types at `types/registry.ts`: `BlockComponentProps`, `EditorComponentProps`, `RegistryEntry`
- Central `registrations.ts` — single import in `providers.tsx` registers all blocks + editors
- `PageRenderer` component — render any array of sections via registry lookup
- `BlockRenderer` rewritten — zero `switch/case`, uses `blockRegistry.getComponent()`
- 9 page section render components (hero, feature-grid, stats-bar, cta-banner, faq, pricing, course-carousel, testimonials, custom-html)
- 6 page section editors registered in `editorRegistry`
- Homepage (`/`) — schema-driven: fetches `CustomPage` where `slug="home"`, falls back to welcome Hero
- Catch-all `[...slug]` route — renders any published `CustomPage` by path
- `LivePreview` — uses `blockRegistry.getComponent()` instead of 150-line inline `switch/case`
- `BlockDefinition` model added to Prisma schema
- `typecheck` + `next build` — both pass with zero errors

### Phase UI Transformation — Premium Redesign (✅ Complete)
- Dark premium palette (`#0B0D10` base, `#4F7CFF` accent)
- Glass design system (glass-card, glow-border, gradient-text utilities)
- Framer Motion animation system (FadeIn, Stagger, Counter, GlowOnHover wrappers)
- Premium floating glass navbar (scroll-reactive, backdrop-blur)
- Cinematic hero section (split layout, gradient headline, aurora background)
- Asymmetric feature grid (glass cards, staggered entrance, glow hover)
- Animated stats bar (glass container, gradient text)
- Premium CTA banner, testimonials, FAQ, pricing (all glass-based)
- Admin editors updated for new fields (secondary CTA, prefix/suffix, testimonials)
- `typecheck` + `next build` — zero errors

### Phase 2.5 — Dev Mode (🚧 In Progress)
- `devModeStore` — handles overlay state, device mode, hovered/selected IDs
- `historyStore` — undo/redo stack with snapshots and persistence
- `history-middleware` — automatic snapshot capture on `pageBuilderStore` changes
- `DevModeProvider` — keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, Del, Esc) and history initialization
- `BlockOverlay` — hover/selection outlines, type labels, dimension indicators, and distance guides
- `StructureTree` — layer hierarchy with selection sync (partially wired for delete/duplicate)
- `PropertiesPanel` — contextual property editors for content and styles
- `InlineEditor` — contentEditable wrapper for real-time text editing on canvas
- `ResponsiveBar` — breakpoint switcher (Desktop, Tablet, Mobile)
- `DevModeToggle` — global switch to enter/exit visual editing mode
- `PublishButton` — saves all changes to DB and exits Dev Mode

### Gaps / Next Up
- **Phase 13 E2E Integration** — Full wiring of delete/duplicate/add in tree, inline editor sync with store, responsive canvas resizing
- **Phase 2 — Adaptive + Gamification** — XP/streaks/badges UI, adaptive engine, recs
- **Password reset** — needs email service integration

---

## File Naming Convention

```
src/
├── app/                     ← Next.js App Router pages
│   ├── (auth)/              ← Route group: login, signup
│   ├── (dashboard)/         ← Route group: student dash
│   ├── (teacher)/           ← Route group: teacher tools
│   ├── (admin)/             ← Route group: admin panel
│   ├── courses/             ← Course listing + detail
│   ├── lessons/             ← Lesson player
│   └── api/                 ← Route handlers / server actions
├── components/
│   ├── ui/                  ← Primitive UI (button, card, dialog)
│   ├── blocks/              ← Learning block renderers
│   ├── dev-mode/            ← Dev Mode overlay system (NEW)
│   ├── layout/              ← Shell: header, sidebar, footer
│   ├── gamification/        ← XP display, streak, badges
│   └── ai/                  ← AI tutor, content generator
├── hooks/                   ← Custom React hooks
├── lib/                     ← Core logic, clients, utils
│   ├── db.ts                ← Prisma client singleton
│   ├── block-registry.ts    ← Component registry
│   ├── editor-registry.ts   ← Editor registry
│   ├── block-presets.ts     ← Component presets (NEW)
│   ├── responsive-engine.ts ← Breakpoint logic (NEW)
│   ├── api/                 ← External API integrations
│   └── ai/                  ← AI service wrappers
├── generated/prisma/        ← Prisma generated client (gitignored)
├── stores/                  ← Zustand state stores
│   ├── pageStore.ts         ← Block tree (NEW)
│   ├── selectionStore.ts    ← Selection state (NEW)
│   ├── historyStore.ts      ← Undo/redo (NEW)
│   └── devModeStore.ts      ← Dev Mode UI (NEW)
└── types/                   ← TypeScript type definitions
```
