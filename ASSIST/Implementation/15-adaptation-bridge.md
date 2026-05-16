# Adaptation Bridge: Phase System → Z-01 / Z-02 Master Plans

> **Purpose:** Maps every phase in the old system to the Z-01 (LMS Flow) and Z-02 (Admin Flow) master plans, identifies structural changes, and provides clear migration guidance.
> **Date:** 2026-05-16

---

## Why This Bridge Exists

The original implementation was organized by **technical phases** (Foundation → Core Learning → Admin CMS → Dynamic Renderer → UI → Dev Mode → Dashboard). This was effective for initial build-out but created **vision drift** — work was tracked against technical checkpoints, not against full product requirements.

The two master plans (`Master LMS Flow.md` and `Master Admin Flow.md`) define the **product-complete end state**. This bridge document connects the two universes.

---

## Phase-to-Master-Plan Mapping

```
OLD SYSTEM                               NEW MASTER PLANS
─────────────────────────────────────    ─────────────────────────
Phase 0 — Foundation                    →  Z-01: Auth + RBAC + DB
Phase 1 — Core Learning                →  Z-01: Course + Lesson + Quiz
Phase 1.5 — Admin CMS                  →  Z-02: Admin Pages + CMS
Phase 1.75 — Dynamic Renderer          →  Z-02: Component Registry + Rendering
Phase UI — Premium Redesign            →  Z-02: Theme System
Phase 2.5 — Dev Mode                   →  Z-02: Developer Mode (partial)
Phase D — Dashboard Completion         →  Z-01: Dashboards (Student/Teacher/Parent)
Phase 2 — Adaptive + Gamification      →  Z-01: Gamification + Recommendations
Phase 3 — AI + Mobile                  →  Z-01: AI Features + Mobile
Phase 4 — Parent + School              →  Z-01: Parent System
Phase 5 — Scale + Marketplace          →  Z-01: Monetization + Community
```

---

## Key Architectural Shifts

### 1. Module-Based Structure (Both Plans)

Both master plans recommend `src/modules/` architecture:

```
src/modules/
├── auth/           ← Phase 0
├── courses/        ← Phase 1
├── lessons/        ← Phase 1
├── enrollments/    ← Phase 1/D
├── gamification/   ← Phase D core, Phase 2 extends
├── analytics/      ← Phase 1 (teacher) + Z-01 (admin/parent)
├── notifications/  ← Z-01 (new)
├── media/          ← Phase 1.5
├── parent/         ← Phase D scaffold, Phase 4 extends
├── teacher/        ← Phase 1
├── admin/          ← Phase 1.5 + Z-02
└── dev-mode/       ← Phase 2.5 + Z-02
```

**Migration effort:** Medium. This is structural (move files, update imports) — functional core stays the same.

### 2. Gamification Centralization

Old: Scattered across multiple phases (Phase D XP → Phase 2 streaks/achievements/badges)

New (Z-01): Single gamification system with complete lifecycle:

```
Lesson Complete → XP Awarded → Level Updated → Achievement Check → Streak Updated → Leaderboard Refresh
```

**Already aligned:** The `src/lib/gamification/` module was built with this lifecycle in mind.

**Gap:** Achievement check and leaderboard refresh are NOT wired into the progress route.

### 3. Admin → Dev Mode Transition

Old: Admin panel (Phase 1.5) and Dev Mode (Phase 2.5) were separate tracks.

New (Z-02): Dev Mode IS the admin interface. Traditional admin pages are for governance (users, settings, moderation). Everything visual flows through Dev Mode.

**Impact:** The `/admin/dev-mode` route becomes the primary editing experience. Traditional admin CMS pages become secondary.

### 4. Dashboard Builder

Old: Dashboards are hardcoded JSX in route groups.

New (Z-02 §DASHBOARD BUILDER SYSTEM): Dashboards should be built from **widget blocks** that are:
- Registered in the component registry
- Editable via Dev Mode
- Per-role configurable

**Impact:** Major refactor of all dashboards to use dynamic widget rendering. Long-term goal, not immediate.

### 5. Data Binding

Old: All page sections use static/embedded data.

New (Z-02 §DATA BINDING SYSTEM): Blocks should bind to dynamic data sources (courses, users, analytics, CMS).

**Impact:** New concept. Requires new data binding model and UI.

### 6. Version Control

Old: No versioning.

New (Z-02 §VERSION CONTROL SYSTEM): Every publish creates a version snapshot. Rollback, compare, restore.

**Impact:** New Prisma model + storage + UI.

### 7. Notification System

Old: Not implemented.

New (Z-01 §NOTIFICATION SYSTEM): In-app + email + push for XP, achievements, course publish, grading, messages.

**Impact:** New Prisma model + in-app API + email integration.

---

## Conflicting Direction Resolved

| Conflict | Old Approach | New Approach | Decision |
|---|---|---|---|
| **Streak model** | Separate `Streak` model | Profile fields | ✅ Already resolved — Profile fields used |
| **XP source of truth** | XPTransaction only | Profile.xp = denormalised cache, XPTransaction = audit | ✅ Already decided |
| **Enrollment progress** | Stored count | Recalculated from lesson completions | ✅ Already decided |
| **Continue Learning** | Random query | `Enrollment.lastLessonId` | ✅ Already decided |
| **Admin vs Dev Mode** | Separate tools | Dev Mode = primary editor | 🚧 Partial alignment |
| **Dashboard rendering** | Hardcoded | Widget blocks + registry | 🔲 Not started |
| **Database** | SQLite for dev | PostgreSQL for prod (per Z-02 tech stack) | 🚧 SQLite chosen for local dev |
| **Realtime** | Not implemented | WebSockets/Pusher/Liveblocks | 🔲 Future |

---

## Gap Prioritization (What to Build Next)

### P0 — Critical for Demo/Core Experience
| Gap | Master Plan | Current Phase |
|---|---|---|
| Dev Mode gaps closed (OverlaySystem, responsive wiring, drag-reorder, toasts) | Z-02 §3.5.1-3.5.6 | Phase D task D.11 |
| Achievement auto-unlock on XP/streak/quiz milestones | Z-01 §GAMIFICATION | Post D |
| Certificate generation on course completion | Z-01 §CERTIFICATE | Post D |
| Notification system (in-app) | Z-01 §NOTIFICATION | Post D |
| Course archive/delete from student dashboard | Z-01 §COURSE STATES | Post D |

### P1 — Platform Completeness
| Gap | Master Plan | Current Phase |
|---|---|---|
| Admin: Teacher management page | Z-02 §2 | Post D |
| Admin: Course overview/management | Z-02 §2 | Post D |
| Admin: Platform analytics | Z-02 §2 | Post D |
| Parent: Detailed child reports | Z-01 §PARENT | Phase 4 |
| Search: Full-text search across courses/lessons/teachers | Z-01 §SEARCH | Post D |
| Module-based project structure | Both §PROJECT STRUCTURE | Refactor |

### P2 — Developer Mode Expansion
| Gap | Master Plan | Current Phase |
|---|---|---|
| StructureTree drag-to-reorder (dnd-kit) | Z-02 §5 | Phase D |
| Responsive engine wired into PropertiesPanel | Z-02 §7 | Phase D |
| Properties Panel: Layout, Spacing, Typography, Colors, Borders | Z-02 §6 | Post D |
| OverlaySystem: z-index, stacking, resize handles | Z-02 §16 | Post D |
| Version control on publish | Z-02 §17 | Post D |

### P3 — Vision Expansion
| Gap | Master Plan | Current Phase |
|---|---|---|
| Data binding system | Z-02 §9 | Phase 3 |
| Dashboard builder (widget blocks) | Z-02 §15 | Phase 4 |
| Global navigation builder | Z-02 §14 | Phase 4 |
| SEO management | Z-02 §23 | Phase 4 |
| Multi-tenant / schools | Z-01 | Phase 4 |
| AI features | Z-01 §AI | Phase 3 |
| Monetization (paid courses, subscriptions) | Z-01 §MONETIZATION | Phase 5 |

---

## Structural Changes in ASSIST/

### Directory Restructuring

```
ASSIST/
├── Implementation/
│   ├── 00-master-index.md                     ← Updated to reference Z-01/Z-02
│   ├── 15-adaptation-bridge.md                ← THIS FILE
│   ├── Full LMS Flow/                         ← NEW — Z-01 tracking
│   │   ├── Z-01-- Checklist.md                ← Item-level checklist vs. Master LMS Flow
│   │   └── Z-02-- Checklist.md                ← Item-level checklist vs. Master Admin Flow
│   ├── 01-phase-0-foundation.md               ← Kept for historical reference
│   ├── 02-phase-1-core-learning.md            ← Kept for historical reference
│   ├── 03-phase-1.5-admin-cms.md              ← Kept for historical reference
│   ├── 04-phase-1.75-dynamic-renderer.md      ← Kept for historical reference
│   ├── 05-phase-2-adaptive-gamification.md    ← Kept for historical reference
│   ├── 06-phase-3-ai-mobile.md                ← Kept for historical reference
│   ├── 07-phase-4-parent-school.md            ← Kept for historical reference
│   ├── 08-phase-5-scale-marketplace.md        ← Kept for historical reference
│   ├── 10-engineering-standards.md            ← Kept (still valid)
│   ├── 11-phase-ui-transformation.md          ← Kept for historical reference
│   ├── 12-phase-2.5-dev-mode.md              ← Kept for historical reference
│   ├── 13-phase-dev-mode-e2e.md              ← Kept for historical reference
│   └── 14-phase-dashboard-complete.md         ← Kept for historical reference
├── S-IMPL/                                    ← Unchanged
├── Log/                                       ← Unchanged
├── Tools/                                     ← Unchanged
└── Vision - Core/                             ← Source documents (unchanged)
    ├── Master LMS Flow.md                     ← Z-01 source
    ├── Master Admin Flow.md                   ← Z-02 source
    ├── 01-vision-overview.md
    ├── 02-architecture-overview.md
    ├── 03-frontend-student.md
    ├── 04-frontend-teacher.md
    ├── 05-parent-dashboard.md
    ├── 06-admin-panel.md
    ├── 07-backend-infrastructure.md
    ├── 08-adaptive-engine.md
    ├── 09-ai-features.md
    ├── 10-theme-engine.md
    ├── 11-mobile-strategy.md
    ├── 12-lightweight-philosophy.md
    ├── 13-business-models.md
    ├── 14-mvp-roadmap.md
    ├── 15-tech-stack-details.md
    └── 16-visual-experience-engine.md
```

---

## How to Use This Bridge

1. **When planning new work:** Reference Z-01 or Z-02 checklist first, then the old phase docs for implementation detail.
2. **When measuring completion:** Use the Z-01 and Z-02 checklists as the single source of truth for "what's left."
3. **When refactoring:** The "Module-Based Structure" migration can be done incrementally — one module at a time, no big-bang rewrite.
4. **When prioritizing:** Use the Gap Prioritization table above to decide what to build next based on demo readiness vs. vision completeness.
