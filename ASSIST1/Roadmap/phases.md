# AI Social OS — Phase Map

## Phase Overview

| Phase | Name | Status | Focus |
|-------|------|--------|-------|
| V1-0 | Foundation | 🔲 Not Started | Project setup, auth, shell |
| V1-1 | Core Dashboard | 🔲 Not Started | Dashboard overview, navigation |
| V1-2 | Social Connect | 🔲 Not Started | OAuth integration, account management |
| V1-3 | Unified Posting | 🔲 Not Started | Post composer, cross-platform publishing |
| V1-4 | AI Content Assistant | 🔲 Not Started | Caption, hook, hashtag generation |
| V1-5 | Content Calendar | 🔲 Not Started | Scheduling, calendar views, queue management |
| V1-6 | Analytics | 🔲 Not Started | Metrics, charts, export |
| V1-7 | Lead Inbox | 🔲 Not Started | Unified inbox, lead management |
| V2-1 | Campaigns | 🔲 Planned | Campaign builder, templates |
| V2-2 | Automation | 🔲 Planned | Auto-replies, workflows, triggers |
| V2-3 | Scale | 🔲 Planned | White-label, team, API, marketplace |

## Phase Dependencies

```
V1-0 Foundation
    │
V1-1 Core Dashboard
    │
V1-2 Social Connect
    │
V1-3 Unified Posting ──→ V1-5 Content Calendar
    │                         │
    ├── V1-4 AI Assistant     │
    │                         │
    └── V1-6 Analytics ───────┘
              │
         V1-7 Lead Inbox
              │
         V2-1 Campaigns ──── V2-2 Automation
              │                    │
              └── V2-3 Scale ──────┘
```

## Entry Gates

| Phase | Must Have Before Starting |
|-------|--------------------------|
| **V1-0** | ASSIST1 docs complete, team aligned |
| **V1-1** | Auth working, base layout rendering |
| **V1-2** | Dashboard renders, navigation works |
| **V1-3** | At least 1 platform connected |
| **V1-4** | Post composer exists |
| **V1-5** | Post publishing works |
| **V1-6** | At least 1 platform with data flowing |
| **V1-7** | Analytics dashboard live |
| **V2-1** | All V1 phases complete |
| **V2-2** | Campaigns live, lead inbox active |
| **V2-3** | Automation workflows stable |

## Estimated Effort

| Phase | Duration |
|-------|----------|
| V1-0: Foundation | 2-3 days |
| V1-1: Core Dashboard | 2-3 days |
| V1-2: Social Connect | 4-5 days |
| V1-3: Unified Posting | 5-7 days |
| V1-4: AI Content Assistant | 4-5 days |
| V1-5: Content Calendar | 3-4 days |
| V1-6: Analytics | 5-7 days |
| V1-7: Lead Inbox | 4-5 days |
| V2-1: Campaigns | 5-6 days |
| V2-2: Automation | 6-8 days |
| V2-3: Scale | 5-7 days |
| **Total** | **45-60 days** |
