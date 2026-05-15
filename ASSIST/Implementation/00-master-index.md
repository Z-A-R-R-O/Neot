# Implementation Master Index

> Structured build plan for NEOT Learning Platform.
> Every phase produces deployable, testable output.

---

## Phase Map

| # | Phase | Primary Output | Status |
|--:|-------|----------------|--------|
| 0 | **Foundation** | Deployed Next.js + Prisma/SQLite + Auth UI | ✅ Complete |
| 1 | **Core Learning** | Course player + Teacher builder + Quiz | ✅ Complete (Tasks 1.4-1.17 shipped; schema via Prisma) |
| 1.5 | **Admin CMS** | Page builder + Theme engine + User mgmt | 🔲 Not started |
| 2 | **Adaptive + Gamification** | Adaptive engine + XP/Streaks + Recs | 🔲 Not started |
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
│   ├── 04-phase-2-adaptive-gamification.md
│   ├── 05-phase-3-ai-mobile.md
│   ├── 06-phase-4-parent-school.md
│   ├── 07-phase-5-scale-marketplace.md
│   ├── 08-engineering-standards.md
│   └── 09-reference-architecture.md
├── Log/
├── Tools/
└── Vision - Core/
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
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
                │                                    │
                └──► Phase 1.5 ──────────────────────┘
                                      │
                                      └──► Phase 3
```

- Phase 1.5 can start after Phase 1 course/lesson CRUD is stable
- Phase 2 requires Phase 1 quiz system
- Phase 3 requires Phase 2 adaptive profiles + Phase 1.5 settings
- Phase 4 requires Phase 1 student/teacher data
- Phase 5 requires everything prior

---

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

---

## Shipped Inventory (Phase 0 + Phase 1)

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

### Phase 1 — Core Learning (✅ Tasks 1.4–1.17 shipped)
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

### Gaps / Next Up
- **Phase 1 Validation Gate** — E2E testing flow
- **Phase 1.5 — Admin CMS** — page builder, theme engine, user mgmt
- **Phase 2 — Gamification** — XP/streaks/badges models exist, no UI
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
│   ├── layout/              ← Shell: header, sidebar, footer
│   ├── gamification/        ← XP display, streak, badges
│   └── ai/                  ← AI tutor, content generator
├── hooks/                   ← Custom React hooks
├── lib/                     ← Core logic, clients, utils
│   ├── supabase/            ← Auth layer (name legacy — local auth, no Supabase)
│   ├── db.ts                ← Prisma client singleton
│   ├── api/                 ← External API integrations
│   └── ai/                  ← AI service wrappers
├── generated/prisma/        ← Prisma generated client (gitignored)
├── stores/                  ← Zustand state stores
└── types/                   ← TypeScript type definitions
```
