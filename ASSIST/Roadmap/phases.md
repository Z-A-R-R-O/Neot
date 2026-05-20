# NEOT — Phase Map

## Phase Overview

| Phase | Name | Status | Focus |
|-------|------|--------|-------|
| 0 | Foundation | ✅ Done | Auth, DB, base layout, routing |
| 1 | Core Learning | ✅ Done | Courses, lessons, quiz, progress |
| 1.5 | Admin CMS | ✅ Done | Content management, teacher tools |
| 1.75 | Dynamic Renderer | ✅ Done | Section registry, page builder |
| UI | UI Transformation | ✅ Done | Visual redesign, responsive, themes |
| 2.5 | Dev Mode | ✅ Done | Visual Experience Engine |
| 2 | Adaptive + Gamification | 🚧 Next | Mastery, badges, leaderboards, XP |
| 3 | AI + Mobile | ❌ Planned | AI tutor, Flutter app, offline |
| 4 | Parent + School | 🚧 In Progress | Parent dashboard, school portal, white-label, contracts |
| 5 | Scale + Marketplace | ❌ Planned | Multi-tenant, content marketplace |

## Phase Dependencies

```
Phase 0 → Phase 1 → Phase 1.5 → Phase 1.75 → Phase UI → Phase 2.5
                                              ↓
                                        Phase 2 → Phase 3 → Phase 4 → Phase 5
```

## Entry Gates

| Phase | Must Have Before Starting |
|-------|--------------------------|
| 0 | Repo setup, dev environment |
| 1 | Auth working, DB schema ready |
| 1.5 | Course CRUD complete, lesson player working |
| 1.75 | Admin CMS stable, section types defined |
| UI | All content rendering functional |
| 2.5 | Block registry, overlay store ready |
| 2 | Quiz system complete, progress tracking stable |
| 3 | Adaptive engine working, CMS mature |
| 4 | Student/teacher data model complete |
| 5 | All prior phases stable, performance optimized |

## Phase 2 Details (Next)

### Adaptive Engine
- [ ] Mastery tracking data model
- [ ] Difficulty adjustment algorithm
- [ ] Recommendation engine
- [ ] Mastery dashboard (student + teacher)

### Gamification
- [ ] Badge system (definitions, awards)
- [ ] Leaderboard (class, global)
- [ ] XP calculation rules
- [ ] Level progression thresholds
- [ ] Streak tracking + notifications

### Estimated Effort
- Adaptive Engine: 2-3 weeks
- Gamification: 1-2 weeks
- Testing + Polish: 1 week
- **Total: 4-6 weeks**

## Phase 3 Details (After 2)

### AI Features
- [ ] AI tutor chat interface
- [ ] Content generation API
- [ ] Quiz auto-generation
- [ ] Safety guardrails

### Mobile Foundation
- [ ] Flutter project setup
- [ ] API client
- [ ] Auth flow
- [ ] Course browsing
- [ ] Lesson viewing

### Estimated Effort
- AI Features: 2-3 weeks
- Mobile Foundation: 3-4 weeks
- **Total: 5-7 weeks**
