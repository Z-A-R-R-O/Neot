# Implementation Master Index

> Structured build plan for NEOT Learning Platform.
> Every phase produces deployable, testable output.
>
> **⚠️ MASTER PLAN ADAPTATION:** The old phase-based system is now superseded by two comprehensive master plans:
> - **Z-01 (LMS Flow):** Full LMS role architecture — student, teacher, parent, gamification, courses, lessons, certificates
> - **Z-02 (Admin Flow):** Full admin dashboard + Developer Mode visual experience engine
>
> See `15-adaptation-bridge.md` for the mapping & gap analysis.
> Detailed checklists in `Full LMS Flow/Z-01-- Checklist.md` and `Full LMS Flow/Z-02-- Checklist.md`.

---

## Phase Map (Legacy Reference — See Z Checklists for True Status)

| # | Phase | Primary Output | Status | Z-01/Z-02 Coverage |
|--:|-------|----------------|--------|--------------------|
| 0 | **Foundation** | Next.js 16 + Prisma/SQLite + Local auth (bcrypt sessions) | ✅ Complete | Z-01: Auth + RBAC + DB |
| 1 | **Core Learning** | Course player + Teacher builder + Quiz engine | ✅ Complete | Z-01: Course + Lesson + Quiz |
| 1.5 | **Admin CMS** | Page builder + Theme engine + User/Media mgmt | ✅ Complete | Z-02: Admin Pages + CMS |
| 1.75 | **Dynamic Renderer** | Component registry + PageRenderer + 17 schema-driven sections | ✅ Complete | Z-02: Registry + Rendering |
| UI | **UI Transformation** | Premium dark palette, cinematic hero, glass design system | ✅ Complete | Z-02: Theme System |
| 2.5 | **Dev Mode — Visual Experience Engine** | Full overlay system, responsive engine, drag-reorder, animation timeline, interaction engine, alignment guides, resize handles, toast system, accessibility tools, preview environments | ✅ Complete | Z-02: Dev Mode (complete) |
| D | **Dashboard Completion** | All dashboards fully functional, gamification UI, Dev Mode gaps closed | ✅ Complete | Z-01: Dashboards + Z-02: Dev Mode |
| 2 | **Adaptive + Gamification** | Adaptive engine + XP/Streaks/Recs | 🔲 Not started | Z-01: Gamification |
| 3 | **AI + Mobile** | AI Tutor + Content Gen | 🔲 Not started | Z-01: AI Features |
| 4 | **Parent + School** | Parent dash + Classroom + Hardening | 🔲 Not started | Z-01: Parent System |
| 5 | **Scale + Marketplace** | Marketplace + Launch + Full blocks | 🔲 Not started | Z-01: Monetization + Community |

---

## Quick Reference

```
ASSIST/
├── Implementation/
│   ├── 00-master-index.md                         ← THIS FILE — entry point
│   ├── 15-adaptation-bridge.md                    ← Phase → Z-01/Z-02 mapping + gap priorities
│   ├── Full LMS Flow/                             ← Master plan checklists (NEW PRIMARY REFERENCE)
│   │   ├── Z-01-- Checklist.md                    ← 209-item LMS flow checklist (51.7% complete)
│   │   └── Z-02-- Checklist.md                    ← 265-item admin flow checklist (22.6% complete)
│   ├── 01-phase-0-foundation.md                   ← Legacy
│   ├── 02-phase-1-core-learning.md                ← Legacy
│   ├── 03-phase-1.5-admin-cms.md                  ← Legacy
│   ├── 04-phase-1.75-dynamic-renderer.md          ← Legacy
│   ├── 05-phase-2-adaptive-gamification.md        ← Legacy
│   ├── 06-phase-3-ai-mobile.md                    ← Legacy
│   ├── 07-phase-4-parent-school.md                ← Legacy
│   ├── 08-phase-5-scale-marketplace.md            ← Legacy
│   ├── 10-engineering-standards.md                ← Still valid
│   ├── 11-phase-ui-transformation.md              ← Legacy
│   ├── 12-phase-2.5-dev-mode.md                   ← Legacy
│   └── 13-phase-dev-mode-e2e.md                   ← Legacy
├── S-IMPL/
├── Log/
├── Tools/
└── Vision - Core/
    ├── Master LMS Flow.md                         ← Z-01 source document
    ├── Master Admin Flow.md                       ← Z-02 source document
    ├── 01-vision-overview.md
    ├── ...
    └── 16-visual-experience-engine.md
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
Phase 0 ──► Phase 1 ──► Phase 1.5 ──► Phase 1.75 ──► Phase D ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
                                                            │
                     Phase 1.75 ──► Phase 2.5 (Dev Mode) ───┤
                                         │                   │
                                         └──► Phase D task D.11 (close Dev Mode gaps)
```

- Phase 1.5 requires Phase 1 course/lesson CRUD stable
- **Phase 1.75 requires Phase 1.5** (page builder + theme engine + block definitions exist)
- Phase 2 requires Phase 1.75 (dynamic renderer enables adaptive lesson mutation)
- **Phase 2.5 requires Phase 1.75** (block registry, PageRenderer, schema-driven pages)
- **Phase D (Dashboard)** requires Phase 1.75 + closes remaining Phase 2.5 gaps
- Phase 3 requires Phase 2 adaptive profiles + Phase 1.5 settings
- Phase 4 requires Phase 1 student/teacher data
- Phase 5 requires everything prior
- **Z-01 and Z-02 checklists supersede all phase docs** — see `15-adaptation-bridge.md` for migration guidance

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
- Prisma/SQLite with **17 models** (Profile → Session → CustomPage → BlockDefinition → Media → PlatformSetting)
- **Local auth**: bcrypt password hashing (bcryptjs), session tokens in SQLite, HTTP-only cookies — **NOT Supabase**
- Auth UI: login, signup (age-gated), forgot-password, onboarding
- Role management: student, teacher, parent, admin
- Auth API routes: `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/role`
- Rate limiting on login (5 req/min per IP)
- CSRF origin validation on mutation endpoints
- 14 shadcn/ui components (button, card, dialog, dropdown-menu, input, label, select, skeleton, tabs, tooltip, avatar, badge, progress, textarea)
- Layout shell: role-based sidebar, header, mobile nav
- Auth proxy (`src/proxy.ts`) — session-based route protection
- Error/loading/empty/offline states
- TanStack Query + 5 Zustand stores (auth, dev-mode, history, lesson, page-builder)
- Vitest test runner + passing tests
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
- `BlockRegistry` singleton at `lib/block-registry.ts` with `register()`/`getComponent()`/`getEditor()`/`getByScope()`/`getKeys()`/`getAll()`
- `EditorRegistry` singleton at `lib/editor-registry.ts` for admin section editors
- Shared types at `types/registry.ts`: `BlockComponentProps`, `EditorComponentProps`, `RegistryEntry`
- Central `registrations.ts` — single import in `providers.tsx` registers all blocks + editors
- `PageRenderer` component — render any array of sections via registry lookup
- `BlockRenderer` rewritten — zero `switch/case`, uses `blockRegistry.getComponent()`
- **17 page section render components** registered (hero, adaptive-stream, feature-grid, stats-bar, how-it-works, cta-banner, faq, pricing-table, course-carousel, testimonials, custom-html, knowledge-constellation, adaptive-timeline, live-ecosystem, future-self, achievement-ecosystem, learning-dna) + 6 additional files (future-self-dna-section, ai-mentor-presence, breathing-interlude, intelligence-corridor, invisible-continuity)
- **7 page section editors** registered in `editorRegistry` (hero, feature-grid, stats-bar, cta-banner, faq, pricing-table, testimonials)
- `block-presets.ts` — preset definitions for hero, feature-grid, cta-banner
- `responsive-engine.ts` — breakpoint system (desktop 1025+, tablet 768-1024, mobile 320-767)
- Homepage (`/`) — schema-driven: fetches `CustomPage` where `slug="home"`, falls back to 6-section cinematic arc (Hero → Adaptive Journey → Adaptive Stream → Live Ecosystem → FutureSelf+DNA → CTA)
- Catch-all `(public)/[...slug]` route — renders any published `CustomPage` by path
- `LivePreview` — uses `blockRegistry.getComponent()` instead of 150-line inline `switch/case`
- `BlockDefinition` model added to Prisma schema (+ 10 block type definitions in `block-definitions.ts`)
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

### Phase 2.5 — Dev Mode / Visual Experience Engine (✅ Complete)
- 21 components: `BlockOverlay`, `DevModeProvider`, `DevModeShell`, `DevModeToggle`, `HistoryPanel`, `InlineEditor`, `OverlaySystem`, `PresetPicker`, `PropertiesPanel`, `PublishButton`, `ResponsiveBar`, `StructureTree`, `TreeNode`, `sortable-tree-node`, `animation-timeline`, `resize-handle`, `alignment-guides`, `accessibility-tools`, `preview-toggle`, `interactions-tab`, `motion-tab`
- `devModeStore` — handles overlay state, device mode, hovered/selected IDs
- `historyStore` — undo/redo stack with snapshots and persistence
- `history-middleware` — automatic snapshot capture on `pageBuilderStore` changes
- `pageBuilderStore` — manages section tree (add, remove, reorder, duplicate, update)
- `DevModeProvider` — keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, Del, Esc) and history initialization
- `BlockOverlay` — hover/selection outlines, type labels, dimension indicators, corner handles, guide lines
- `StructureTree` + `TreeNode` — layer hierarchy with search/filter, delete, duplicate, add actions, **full drag-to-reorder via @dnd-kit**
- `sortable-tree-node` — SortableContext + useSortable integration for drag-and-drop
- `PropertiesPanel` — 4-tab property editor (Content, Style, Motion, Effects) with sliders, color pickers; **typed section editors wired** (HeroEditor, FeatureGridEditor, StatsBarEditor, etc.)
- `InlineEditor` — contentEditable wrapper for real-time text editing on canvas
- `ResponsiveBar` — breakpoint switcher with canvas resize (Desktop/Tablet/Mobile); **responsive engine wired into LivePreview**
- `DevModeToggle` — global switch to enter/exit visual editing mode
- `PublishButton` — saves all changes to DB and exits Dev Mode (with confirmation modal)
- `DevModeShell` — full 3-panel editor layout with **top toolbar** (ResponsiveBar, HistoryPanel, DevModeToggle)
- `PresetPicker` — visual preset swapper for block types; **Save as Preset** with localStorage persistence and user preset management
- `OverlaySystem` — full overlay manager with ResizeObserver tracking, hover/click delegation via `data-block-id`, dimension display, device mode label
- `animation-timeline` — visual timeline with track lanes, play/pause/stop, frame-by-frame preview, color-coded animation types
- `interaction-engine` (lib) — 6 interaction action types + `executeInteraction()` dispatcher
- `interactions-tab` — PropertiesPanel tab for click/hover/scroll interactions
- `motion-tab` — dedicated motion/animation tab in PropertiesPanel
- `resize-handle` — visual block resize handles on canvas
- `alignment-guides` — snap-to-guide alignment visualization
- `accessibility-tools` — contrast checker, ARIA label editor, heading hierarchy validator
- `preview-toggle` — draft/preview environment switching
- `toast.tsx` (ui) — Radix Toast-based system with default/success/error/warning variants
- `interaction-wrapper.tsx` (blocks) — wraps blocks with interaction event handlers
- Bidirectional selection sync between `devModeStore` and `pageBuilderStore`
- Inline editing wired in 7 section types (hero, feature-grid, cta-banner, faq, pricing, stats-bar, testimonials)
- Undo/redo keyboard shortcuts with snapshot restore
- Publish flow auto-exits Dev Mode with success toast
- **All 6 known gaps closed** ✅

### Phase D — Dashboard Completion (✅ Complete)
- **D.1** — Active Courses on Student Dashboard: real enrolled course cards with progress bars
- **D.2** — Learning Streak Tracking: daily activity streak, real count on dashboard via `streak-tracker.ts`
- **D.3** — XP Popup + Level Progress: animated "+100 XP" popup, circular/bar level progress with 50-level system
- **D.4** — Streak Flame in Header: fire icon with streak count, color-coded (gray/orange/red)
- **D.5** — Continue Learning Recommendations: most recently accessed incomplete lesson via `Enrollment.lastLessonId`
- **D.6** — Teacher Dashboard: connected `overview-stats.tsx` and `quick-actions.tsx` components
- **D.7** — Teacher Students Page: real enrolled students with search/filter, student table
- **D.8** — Parent Dashboard Scaffold: route group, layout with auth guard, children-overview component
- **D.9** — XP Awarded on Lesson Complete: auto-create `XPTransaction` (+100 per lesson, +50 bonus for quiz pass)
- **D.10** — Loading & Error States: skeletons and error+retry on all dashboard pages
- **D.11** — Dev Mode Remaining Gaps: All 6 gaps closed (OverlaySystem, responsive engine wiring, drag-to-reorder, toast system, presets connection, style merging)

### Master Plan Completion Status

| Master Plan | Items | ✅ Done | 🚧 Partial | 🔲 Not Started | Progress |
|---|---|---|---|---|---|---|---|
| **Z-01 — LMS Flow** | 210 | 110 | 27 | 73 | **52.4%** |
| **Z-02 — Admin Flow** | 265 | 70 | 36 | 159 | **26.4%** |
| **Combined** | **475** | **180** | **63** | **232** | **37.9%** |

> See `Full LMS Flow/Z-01-- Checklist.md` and `Full LMS Flow/Z-02-- Checklist.md` for full itemized tracking.

### Gaps / Next Up (from Z-01/Z-02 analysis)
- ✅ **Phase D — Dashboard Completion** (complete)
- ✅ **Z-02: Dev Mode gaps** — All 6 gaps closed
- ✅ **Z-01: Achievement auto-unlock** — All 9 achievements wired with XP rewards + notifications
- ✅ **Z-01: Quiz pass bonus XP** — +50 XP awarded on quiz pass (≥80%) + perfect_quiz achievement check
- ✅ **Z-01: Certificate generation** — Auto-issued on course completion with serial + notification
- **Z-01: Notification system expansion** — XP level-up, streak reminders, course publish, grading alerts
- **Z-02: Admin pages** — 20 of 27 not started (teachers, courses, moderation, etc.) — analytics done
- **Z-01: Password reset** — needs email service integration
- **Z-02: Properties Panel expansion** — Layout, Spacing, Typography, Colors, Borders categories not started

---

## File Naming Convention

```
src/
├── app/                     ← Next.js App Router pages
│   ├── (auth)/              ← Route group: login, signup
│   ├── (dashboard)/         ← Route group: student dash
│   ├── (teacher)/           ← Route group: teacher tools
│   ├── (admin)/             ← Route group: admin panel
│   ├── (public)/            ← Route group: public pages (catch-all)
│   ├── about/               ← Static pages
│   ├── courses/             ← Course listing + detail
│   ├── features/
│   ├── lessons/             ← Lesson player
│   └── api/                 ← Route handlers / server actions
├── components/
│   ├── ui/                  ← Primitive UI (button, card, dialog)
│   ├── blocks/              ← Learning block renderers + page sections
│   │   └── sections/        ← 17+ page section render components
│   ├── dev-mode/            ← Dev Mode overlay system (13 components)
│   ├── layout/              ← Shell: header, sidebar, footer
│   ├── admin/               ← Admin panel components
│   │   ├── pages/           ← Section builder, editors, live preview
│   │   ├── themes/          ← Theme editor
│   │   ├── blocks/          ← Block library
│   │   ├── media/           ← Media library
│   │   ├── users/           ← User management
│   │   └── settings/        ← Platform settings
│   ├── auth/                ← Auth forms
│   ├── courses/             ← Course cards, detail
│   ├── dashboard/           ← Student dashboard components
│   ├── teacher/             ← Teacher tools + block editors + analytics
│   ├── player/              ← Lesson player shell
│   └── pricing/             ← Pricing components
├── hooks/                   ← Custom React hooks
├── lib/                     ← Core logic, clients, utils
│   ├── auth.ts              ← Local auth (bcrypt + sessions)
│   ├── db.ts                ← Prisma client singleton (LibSQL)
│   ├── block-registry.ts    ← Component registry (Map-based)
│   ├── editor-registry.ts   ← Section editor registry
│   ├── block-definitions.ts ← Block type definitions (10 types)
│   ├── block-presets.ts     ← Visual presets
│   ├── responsive-engine.ts ← Breakpoint logic
│   ├── registrations.ts     ← Central block/editor registration
│   ├── csrf.ts              ← CSRF origin validation
│   ├── rate-limit.ts        ← In-memory rate limiter
│   ├── quizzes.ts           ← Quiz engine logic
│   ├── utils.ts             ← cn() utility
│   ├── providers.tsx        ← React providers
│   ├── env.ts               ← Env var validation
│   └── theme/               ← Theme engine (provider, converter, resolver)
├── generated/prisma/        ← Prisma generated client (gitignored)
├── stores/                  ← Zustand state stores
│   ├── authStore.ts         ← Auth state
│   ├── pageBuilderStore.ts  ← Section tree management
│   ├── devModeStore.ts      ← Dev Mode overlay state
│   ├── historyStore.ts      ← Undo/redo
│   ├── history-middleware.ts← Snapshot middleware
│   └── lessonStore.ts       ← Lesson player state
└── types/                   ← TypeScript type definitions
```
