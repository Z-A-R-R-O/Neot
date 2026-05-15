# Implementation Master Index

> Structured build plan for NEOT Learning Platform.
> Every phase produces deployable, testable output.

---

## Phase Map

| # | Phase | Primary Output | Status |
|---|-------|----------------|--------|
| 0 | **Foundation** | Deployed Next.js + Supabase + Auth | 🔲 |
| 1 | **Core Learning** | Course player + Teacher builder + Quiz | 🔲 |
| 1.5 | **Admin CMS** | Page builder + Theme engine + User mgmt | 🔲 |
| 2 | **Adaptive + Gamification** | Adaptive engine + XP/Streaks + Recs | 🔲 |
| 3 | **AI + Mobile** | AI Tutor + Content Gen + Flutter app | 🔲 |
| 4 | **Parent + School** | Parent dash + Classroom + Hardening | 🔲 |
| 5 | **Scale + Marketplace** | Marketplace + Launch + Full blocks | 🔲 |

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
│   ├── supabase/            ← DB client + queries
│   ├── api/                 ← External API integrations
│   └── ai/                  ← AI service wrappers
├── stores/                  ← Zustand state stores
└── types/                   ← TypeScript type definitions
```
