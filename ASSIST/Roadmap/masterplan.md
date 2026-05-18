# NEOT — Master Plan

## Combined Status: Z-01 (LMS) + Z-02 (Admin)

| Plan | Items | Done | Progress |
|------|-------|------|----------|
| Z-01 LMS Flow | 211 | 168 | 79.6% |
| Z-02 Admin Flow | 265 | 165 | 62.3% |
| **Combined** | **476** | **333** | **70.0%** |

## Active Phase: Phase 2 (Adaptive + Gamification)

### Current Priorities

1. **Phase 2: Adaptive + Gamification** — Mastery tracking, badges, leaderboards, adaptive difficulty
2. **Phase 3: AI + Mobile** — AI tutor integration, Flutter app foundation
3. **Phase 4: Parent + School** — Parent dashboard, school management tools
4. **Phase 5: Scale + Marketplace** — Multi-tenant, content marketplace

### Gap Analysis

| Area | Status | Gap |
|------|--------|-----|
| Auth | ✅ Complete | — |
| Database | ✅ Complete | — |
| Course CRUD | ✅ Complete | — |
| Lesson Player | ✅ Complete | — |
| Quiz System | 🚧 Partial | Adaptive quizzes, question bank |
| Section Registry | ✅ Complete | — |
| Theme Engine | ✅ Complete | White-label customization |
| Admin Panel | 🚧 Partial | Properties panel, full analytics |
| Dev Mode | ✅ Complete | Block editor, live preview |
| Mastery Tracking | ✅ Complete | Skill models, mastery engine, dashboard, API |
| Adaptive Engine | ✅ Complete | Recommendation engine, skill-to-lesson mapping UI, mastery tracking |
| Leaderboard | ✅ Complete | All-time, weekly, monthly views with level/streak display |
| At-Risk Detection | ✅ Complete | Teacher dashboard: inactivity, low progress, low scores, low mastery |
| Badge System | ✅ Complete | Rarity tiers (common-legendary), progress indicators, rarity filtering |
| Streak Notifications | ✅ Complete | Warnings, milestones, recovery prompts, streak heatmap |
| Mastery Teacher View | ✅ Complete | Class-level skill analytics, student rankings, course filtering |
| AI Features | ❌ Not Started | AI tutor, content generation |
| Mobile App | ❌ Not Started | Flutter app, offline mode |
| Parent Dashboard | ❌ Not Started | Progress monitoring, communication |
| School Tools | ❌ Not Started | White-label, bulk management |

## Next 10 Tasks

| # | Task | Plan | Priority |
|---|------|------|----------|
| 1 | AI tutor chat interface | Z-01 | Medium |
| 2 | Content generation API | Z-02 | Medium |
| 3 | Parent dashboard foundation | Z-02 | Medium |
| 4 | School account management | Z-02 | Medium |
| 5 | Flutter app setup | Z-01 | Low |
| 6 | Offline sync architecture | Z-01 | Low |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-15 | SQLite for dev, PostgreSQL for prod | Fast local dev, scalable prod |
| 2026-05-16 | Section Registry pattern | Extensible content blocks |
| 2026-05-17 | Dev Mode before Adaptive | Visual tools help teachers create better content |
| 2026-05-18 | Consolidate ASSIST structure | Easier navigation, single source of truth |
| 2026-05-18 | Mastery tracking before AI | Foundation for adaptive learning; AI needs mastery data to personalize |
| 2026-05-18 | Recommendation engine uses mastery data | Suggests review/practice/advance based on skill scores |
| 2026-05-18 | Skill-to-lesson mapping in lesson editor | Teachers can tag lessons with skills and set weights for mastery tracking |
| 2026-05-18 | Leaderboard time windows | Weekly/monthly views give fresh competitive cycles |
| 2026-05-18 | At-risk student detection for teachers | Multi-factor risk scoring helps teachers intervene early |
| 2026-05-18 | Badge rarity system | 5 tiers (common-legendary) with distinct visual styling and progress tracking |
| 2026-05-18 | Streak notifications on dashboard | Proactive nudges prevent streak loss and motivate consistency |
| 2026-05-18 | Teacher mastery view | Class-level skill analytics help teachers identify gaps and celebrate wins |
