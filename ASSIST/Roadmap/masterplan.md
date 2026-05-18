# NEOT — Master Plan

## Combined Status: Z-01 (LMS) + Z-02 (Admin)

| Plan | Items | Done | Progress |
|------|-------|------|----------|
| Z-01 LMS Flow | 211 | 159 | 75.4% |
| Z-02 Admin Flow | 265 | 165 | 62.3% |
| **Combined** | **476** | **324** | **68.1%** |

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
| Adaptive Engine | 🚧 In Progress | Difficulty adjustment wired, recommendation engine next |
| AI Features | ❌ Not Started | AI tutor, content generation |
| Mobile App | ❌ Not Started | Flutter app, offline mode |
| Parent Dashboard | ❌ Not Started | Progress monitoring, communication |
| School Tools | ❌ Not Started | White-label, bulk management |

## Next 10 Tasks

| # | Task | Plan | Priority |
|---|------|------|----------|
| 1 | Badge system + achievement tracking | Z-01 | High |
| 2 | Leaderboard time windows (weekly, monthly) | Z-01 | High |
| 3 | Adaptive recommendation engine | Z-01 | High |
| 4 | Skill-to-lesson mapping UI (teacher) | Z-01 | High |
| 5 | AI tutor chat interface | Z-01 | Medium |
| 6 | Content generation API | Z-02 | Medium |
| 7 | Parent dashboard foundation | Z-02 | Medium |
| 8 | School account management | Z-02 | Medium |
| 9 | Flutter app setup | Z-01 | Low |
| 10 | Offline sync architecture | Z-01 | Low |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-15 | SQLite for dev, PostgreSQL for prod | Fast local dev, scalable prod |
| 2026-05-16 | Section Registry pattern | Extensible content blocks |
| 2026-05-17 | Dev Mode before Adaptive | Visual tools help teachers create better content |
| 2026-05-18 | Consolidate ASSIST structure | Easier navigation, single source of truth |
| 2026-05-18 | Mastery tracking before AI | Foundation for adaptive learning; AI needs mastery data to personalize |
