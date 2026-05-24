# NEOT — Phase Map

## Phase Overview

| Phase | Name | Status | Focus |
|-------|------|--------|-------|
| 0 | Foundation | ✅ Shipped | Auth, DB, base layout, routing |
| 1 | Core Learning | ✅ Shipped | Courses, lessons, quiz, progress |
| 1.5 | Admin CMS | ✅ Shipped | Content management, teacher tools |
| 1.75 | Dynamic Renderer | ✅ Shipped | Section registry, page builder |
| UI | UI Transformation | ✅ Shipped | Visual redesign, responsive, themes |
| 2.5 | Dev Mode | ✅ Shipped | Visual Experience Engine |
| 2 | Adaptive + Gamification | ✅ Shipped | Mastery, badges, leaderboards, XP |
| 3 | AI + Mobile | ✅ Shipped | AI tutor, Flutter app, offline |
| 4 | Parent + School | ✅ Shipped | Parent dashboard, school portal |
| 5 | Scale + Marketplace | ✅ Shipped | Multi-tenant, content marketplace |
| 6 | Integrations | ✅ Shipped | SSO, LTI, SIS, Stripe, SendGrid, CDN |
| **V3-0** | **Foundation** | **✅ Shipped** | **Concept Graph, Learning Style, docs** |
| **V3-1** | **Learning Worlds** | **✅ Shipped** | **World/Island/Dungeon UI, skill trees** |
| **V3-2** | **AI Personalization** | **✅ Shipped** | **Dynamic paths, style detection, weakness detection, difficulty scaler** |
| **V3-3** | **Engagement Loops** | **✅ Shipped** | **Daily quests, curiosity engine, progression** |
| **V3-4** | **Story Mode** | **✅ Shipped** | **Story generator, concept simplifier, memory optimizer** |
| **V3-5** | **Monetization** | **✅ Shipped** | **Ad placement, AdSense, sponsored learning** |
| **V3-6** | **Scale + Launch** | **✅ Implementation complete** | **UX polish, performance, beta launch** |

## Phase Dependencies

```
v2 shipped phases (0-6) — all complete
                      │
                 V3-0 Foundation
                      │
                 V3-1 Learning Worlds
                      │
                 V3-2 AI Personalization Engine
                     / \
                    /   \
            V3-3 Engagement   V3-4 Story Mode
                    \   /
                     \ /
                 V3-5 Monetization
                      │
                 V3-6 Scale + Launch
```

## Entry Gates

| Phase | Must Have Before Starting |
|-------|--------------------------|
| **V3-0** | master.md approved, ASSIST docs updated, team aligned |
| **V3-1** | Concept Graph data model deployed, content identified for migration |
| **V3-2** | Learning Worlds UI live, concept graph populated, mastery data flowing |
| **V3-3** | Dynamic learning paths working, AI features stable |
| **V3-4** | Learning profiles have data from real usage |
| **V3-5** | Engagement loops live, retention metrics baseline established |
| **V3-6** | Story mode working, user engagement proven, ad system stable |

## v2 Shipped Phases (Completed)

| Phase | Name | Items | Status |
|-------|------|-------|--------|
| 0 | Foundation | 7 | ✅ Complete |
| 1 | Core Learning | 12 | ✅ Complete |
| 1.5 | Admin CMS | 7 | ✅ Complete |
| 1.75 | Dynamic Renderer | 10 | ✅ Complete |
| UI | UI Transformation | 7 | ✅ Complete |
| 2.5 | Dev Mode | 8 | ✅ Complete |
| 2 | Adaptive + Gamification | 19 | ✅ Complete |
| 3 | AI + Mobile | 13 | ✅ Complete |
| 4 | Parent + School | 17 | ✅ Complete |
| 5 | Scale + Marketplace | 10 | ✅ Complete |
| 6 | Integrations | 10 | ✅ Complete |

## V3-0 Details (Active)

### Concept Graph Data Model
- [ ] Concept model (id, title, description, difficulty, domain)
- [ ] ConceptPrerequisite model (Concept A requires Concept B)
- [ ] ConceptDependency model (Concept A builds on Concept B)
- [ ] LearningWorld model (name, theme, description, order)
- [ ] Island model (name, worldId, prerequisites, order)
- [ ] WorldProgress model (studentId, worldId, islandId, status)
- [ ] StudentLearningProfile model (detected style, preferences)

### Learning Style System
- [ ] Passive detection algorithm (analyzes behavior)
- [ ] Active style quiz (optional, 5-7 questions)
- [ ] LearningStyleProfile page

### ASSIST Docs Update
- [ ] Core/vision.md — new vision
- [ ] Roadmap/phases.md — v3 phase map
- [ ] Roadmap/masterplan.md — combined status
- [ ] Execution/checklists/z-03-adaptive-universe.md — checklist

## Estimated Effort

| Phase | Duration |
|-------|----------|
| V3-0: Foundation | 2-3 days |
| V3-1: Learning Worlds | 4-5 days |
| V3-2: AI Personalization | 6-8 days |
| V3-3: Engagement Loops | 4-5 days |
| V3-4: Story Mode | 5-6 days |
| V3-5: Monetization | 4-5 days |
| V3-6: Scale + Launch | 5-7 days |
| **Total** | **30-40 days** |
