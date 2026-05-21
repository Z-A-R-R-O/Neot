# NEOT — Master Plan

## Combined Status: Z-01 (LMS) + Z-02 (Admin)

| Plan | Items | Done | Progress |
|------|-------|------|----------|
| Z-01 LMS Flow | 211 | 200 | 94.8% |
| Z-02 Admin Flow | 265 | 180 | 67.9% |
| **Combined** | **476** | **380** | **79.8%** |

## Active Phase: Phase 5 (Scale + Marketplace)

### Current Priorities

1. **Phase 5: Scale + Marketplace** — Revenue sharing, export/import tools, analytics
2. **Phase 3: AI + Mobile** — Flutter app foundation
3. **Phase 4: Parent + School** — Polish remaining items
4. **Phase 2: Adaptive + Gamification** — Minor polish

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
| Content Marketplace | 🚧 Partial | Revenue sharing built, purchase flow complete, course export/import tools |
| Admin Panel | 🚧 Partial | Properties panel, full analytics |
| Dev Mode | ✅ Complete | Block editor, live preview |
| Mastery Tracking | ✅ Complete | Skill models, mastery engine, dashboard, API |
| Adaptive Engine | ✅ Complete | Recommendation engine, skill-to-lesson mapping UI, mastery tracking |
| Leaderboard | ✅ Complete | All-time, weekly, monthly views with level/streak display |
| At-Risk Detection | ✅ Complete | Teacher dashboard: inactivity, low progress, low scores, low mastery |
| Badge System | ✅ Complete | Rarity tiers (common-legendary), progress indicators, rarity filtering |
| Streak Notifications | ✅ Complete | Warnings, milestones, recovery prompts, streak heatmap |
| Mastery Teacher View | ✅ Complete | Class-level skill analytics, student rankings, course filtering |
| XP System | ✅ Complete | Difficulty multipliers, streak bonus, first-try bonus, speed bonus, perfect quiz bonus |
| Spaced Repetition | ✅ Complete | Review scheduling based on mastery decay, urgency tracking |
| AI Tutor | ✅ Complete | Socratic method chat, lesson context, fallback responses |
| Content Generation | ✅ Complete | Quiz questions, practice problems, summaries, lesson outlines, improvement suggestions |
| AI Features | ❌ Not Started | AI tutor, content generation |
| Mobile App | ❌ Not Started | Flutter app, offline mode |
| Parent Dashboard | ✅ Complete | Foundation, child detail, messages, alerts |
| School Portal | ✅ Complete | Dashboard, settings, staff, students, courses, analytics |
| School Management | ✅ Complete | Database models, white-label, bulk provisioning |
| AI Features | ❌ Not Started | AI tutor, content generation |
| Mobile App | ❌ Not Started | Flutter app, offline mode |

## Next 10 Tasks

| # | Task | Plan | Priority |
|---|------|------|----------|
| 1 | ✅ Course export/import tools | Z-01 | Done |
| 2 | Advanced analytics dashboards | Z-01 | Medium |
| 3 | Flutter app setup | Z-01 | Low |
| 4 | Plugin/extensions framework | Z-01 | Low |
| 5 | Performance optimization | Z-01 | Medium |
| 6 | Admin advanced analytics | Z-02 | Medium |

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
| 2026-05-18 | Refined XP calculation | Multi-factor XP rewards (difficulty, streak, first-try, speed, perfect quiz) incentivize quality learning |
| 2026-05-18 | Spaced repetition system | Review scheduling based on mastery decay prevents knowledge loss |
| 2026-05-18 | AI Tutor in lesson player | Socratic method chat with lesson context helps students learn independently |
| 2026-05-18 | Content generation API | Teachers can auto-generate quizzes, practice problems, summaries, and lesson outlines |
| 2026-05-20 | School portal with white-label branding | Schools need self-service management with custom branding, colors, logos |
| 2026-05-20 | School staff bulk import via CSV-style text | Schools need to quickly onboard many teachers/students at once |
| 2026-05-20 | Auto-Next uses send/stop icon templates | Template matching proved more reliable than input diffing for the JetBrains AI Chat UI |
| 2026-05-20 | Revenue sharing uses dedicated models | Separate PayoutAccount and PayoutTransaction models keep financial records clean and auditable |
| 2026-05-20 | Purchase auto-enrolls buyer | Creating a MarketplacePurchase simultaneously creates an Enrollment to give immediate course access |
| 2026-05-21 | Course export/import uses JSON format | Full course structure (modules, lessons, content, tags, category) serialized as JSON for portability; import auto-creates missing categories and tags |
