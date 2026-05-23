# NEOT — Combined Master Plan

## Status Overview

| Plan | Items | Done | Progress |
|------|-------|------|----------|
| Z-01 LMS Flow | 110 | 110 | 100% ✅ |
| Z-02 Admin Flow | 60 | 60 | 100% ✅ |
| **Z-03 Adaptive Universe** | **112** | **10** | **9% 🚧** |
| **Combined v2+v3** | **282** | **180** | **64% 🚧** |

## Active Phase: V3-0 — Foundation

See `ASSIST/Execution/checklists/z-03-adaptive-universe.md` for detailed task list.

### V3-0 Priority Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Update ASSIST docs (vision, phases, checklist) | ✅ Done |
| 2 | Add Concept Graph data models (Concept, Prerequisite, Dependency, LearningWorld, Island) | ✅ Done |
| 3 | Add Learning World models (World, Island, Progress) | ✅ Done |
| 4 | Add StudentLearningProfile model | ✅ Done |
| 5 | Add AdPlacement model | ✅ Done |
| 6 | Add LearningStyle model | ✅ Done |
| 7 | Create Prisma migration | ✅ Done |
| 8 | Seed initial Coding/CS concepts (51 concepts, 54 prerequisites) | ✅ Done |

### Next After V3-0

| Phase | Items | Target |
|-------|-------|--------|
| V3-1: Learning Worlds | 18 | V3-0 done |
| V3-2: AI Personalization | 20 | V3-1 live |
| V3-3: Engagement Loops | 14 | V3-2 stable |
| V3-4: Story Mode | 16 | V3-2 done |
| V3-5: Monetization | 14 | V3-3 + V3-4 live |
| V3-6: Scale + Launch | 16 | All prior done |

## v2 Shipped Summary

| Phase | Z-01 | Z-02 |
|-------|------|------|
| 0: Foundation | 7/7 ✅ | 5/5 ✅ |
| 1: Core Learning/Admin | 12/12 ✅ | 7/7 ✅ |
| 1.5: Admin CMS | 7/7 ✅ | 5/5 ✅ |
| 1.75: Dynamic Renderer | 10/10 ✅ | — |
| UI: Transformation | 7/7 ✅ | — |
| 2.5: Dev Mode | 8/8 ✅ | — |
| 2: Adaptive + Gamification | 19/19 ✅ | 6/6 ✅ |
| 3: AI + Mobile | 13/13 ✅ | — |
| 4: Parent + School | 17/17 ✅ | 5/5 ✅ |
| 5: Scale + Marketplace | 10/10 ✅ | 10/10 ✅ |
| 6: Integrations | — | 10/10 ✅ |

## v3 Phase Overview

| Phase | Items | Status | Est. Duration |
|-------|-------|--------|--------------|
| V3-0: Foundation | 15 | 🔲 Active (67%) | 2-3 days |
| V3-1: Learning Worlds | 18 | 🔲 Planned | 4-5 days |
| V3-2: AI Personalization | 20 | 🔲 Planned | 6-8 days |
| V3-3: Engagement Loops | 14 | 🔲 Planned | 4-5 days |
| V3-4: Story Mode | 16 | 🔲 Planned | 5-6 days |
| V3-5: Monetization | 14 | 🔲 Planned | 4-5 days |
| V3-6: Scale + Launch | 16 | 🔲 Planned | 5-7 days |

## Z-03 Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-23 | v3 is NOT a rewrite | Existing codebase is rich — reuse gamification, mastery, quiz, auth, AI |
| 2026-05-23 | Concept Graph overlays existing Course model | Course/Module/Lesson stays; Concept Graph lives on top |
| 2026-05-23 | Learning Worlds = UI layer, not data migration | No data migration. Worlds are a new UI on existing course data |
| 2026-05-23 | Start with Coding/CS only | Focus is the moat: personalization engine. One domain to validate |
| 2026-05-23 | AdSense is Stage 1 monetization | Display ads are easy, low-risk, fund free learning immediately |
| 2026-05-23 | AI features are P0-P1 in v3 | The entire v3 thesis is AI personalization — core differentiator |

## Strategic Documents

- **North Star:** `master.md` (root) — full vision document
- **v3 Transition Plan:** `ASSIST/Roadmap/v3-transition.md`
- **v2 Shipped Inventory:** `ASSIST/Roadmap/shipped.md`
- **v2 Vision:** `ASSIST/Core/vision.md` (updated for v3)
- **Phase Map:** `ASSIST/Roadmap/phases.md`
- **Checklist:** `ASSIST/Execution/checklists/z-03-adaptive-universe.md`