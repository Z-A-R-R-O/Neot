# AI Social OS — Build Operating System

> Plan first. Execute in order. Log every change.

## What is ASSIST1?

ASSIST1 is the structured execution layer for the AI Social OS platform. Every task traces back to a plan, every change is logged, and every commit is numbered.

## Directory Structure

```
ASSIST1/
├── README.md                  ← THIS FILE — navigation + workflow
├── GUIDE.md                   ← Quick-start for new contributors

├── CORE/                      ← Mission, architecture, engineering standards
│   ├── vision.md              ← What we're building and why
│   ├── architecture.md        ← System design, tech stack, data flow
│   └── principles.md          ← Code conventions, review checklist, standards

├── VISION/                    ← Detailed specs per feature/system
│   ├── master.md              ← Strategic North Star — full vision
│   ├── dashboard.md           ← Core dashboard experience
│   ├── social-connect.md      ← Social account connections
│   ├── content.md             ← Unified posting, calendar, scheduling
│   ├── ai-assistant.md        ← AI content generation
│   ├── analytics.md           ← Views, engagement, growth tracking
│   ├── leads.md               ← Lead inbox, comments, DMs
│   ├── campaigns.md           ← Campaign management
│   ├── automation.md          ← Auto-replies, workflows (Phase 2)
│   └── business.md            ← Business model, SaaS pricing, agency

├── ROADMAP/                   ← What's done, what's next, what's planned
│   ├── masterplan.md          ← Combined status, priorities
│   ├── phases.md              ← Phase map (V1 MVP → Phase 2 → Scale)
│   └── shipped.md             ← Shipped features inventory

├── EXECUTION/                 ← How to work, conventions, checklists
│   ├── workflow.md            ← Plan → Build → Log → Commit
│   ├── conventions.md         ← Naming, commits, branch strategy
│   └── checklists/
│       ├── z-01-mvp.md        ← MVP — 40 items
│       └── z-02-phase2.md     ← Phase 2 — 30 items

├── LOG/                       ← One .md file per work session

└── TOOLS/                     ← Shared tooling (git, automation)
```

## Quick Start

```powershell
# 1. Read the strategic North Star
cat ASSIST1/Vision/master.md

# 2. Check what's active
cat ASSIST1/Roadmap/masterplan.md

# 3. Pick a task from the MVP checklist
cat ASSIST1/Execution/checklists/z-01-mvp.md

# 4. Read the spec for context
cat ASSIST1/Vision/dashboard.md

# 5. Build it (write code in app/)

# 6. Log the session
code ASSIST1/Log/YYYY-MM-DD-HHmm.md

# 7. Update ASSIST1 docs (must do)

# 8. Commit
git add -A && git commit -m "XX -- AIOS -- Description"
```

## Workflow

```
Read the plan -> Pick a task -> Read the spec -> Build -> Log -> Update ASSIST1 -> Commit
```

| Step | Where | What |
|------|-------|------|
| **Orient** | `ASSIST1/Vision/master.md` | Read strategic North Star |
| **Plan** | `Roadmap/masterplan.md` | See active phase + priority gaps |
| **Task** | `Execution/checklists/z-01-mvp.md` | Pick a 🔲 item |
| **Spec** | `Vision/` + `Core/` | Read architecture + feature specs |
| **Build** | `app/src/` | Implement the code |
| **Log** | `Log/YYYY-MM-DD-HHmm.md` | What changed, why, status, next |
| **Update ASSIST1** | `Roadmap/`, `Execution/` | Progress %, checklists, masterplan |
| **Commit** | `git commit` | Auto-numbered: `XX -- AIOS -- desc` |

**ASSIST1 must always reflect reality.** Never commit code without updating ASSIST1 docs.

## Current Status

| Plan | Items | Done | Progress |
|------|-------|------|----------|
| **Z-01 MVP** | 40 | 0 | 0% 🔲 Not Started |
| **Z-02 Phase 2** | 30 | 0 | 0% 🔲 Planned |
| **Combined** | **70** | **0** | **0% 🔲** |

## Phase Overview

| Phase | Name | Status | Focus |
|-------|------|--------|-------|
| **V1-0** | Foundation | 🔲 Planned | Project setup, auth, shell |
| **V1-1** | Core Dashboard | 🔲 Planned | Dashboard layout, navigation |
| **V1-2** | Social Connect | 🔲 Planned | OAuth, account management |
| **V1-3** | Unified Posting | 🔲 Planned | Write once, post everywhere |
| **V1-4** | AI Content Assistant | 🔲 Planned | Caption/hook/hashtag generation |
| **V1-5** | Content Calendar | 🔲 Planned | Scheduling system |
| **V1-6** | Analytics | 🔲 Planned | Views, engagement, growth |
| **V1-7** | Lead Inbox | 🔲 Planned | Comments, DMs, inquiries |
| **V2-1** | Campaigns | 🔲 Planned | Campaign management |
| **V2-2** | Automation | 🔲 Planned | Auto-replies, workflows |
| **V2-3** | Scale | 🔲 Planned | White-label, agency features |

## Strategic Documents Reference

| Document | Location | Purpose |
|----------|----------|---------|
| **Strategic North Star** | `Vision/master.md` | Full vision: AI Social OS |
| **MVP Checklist** | `Execution/checklists/z-01-mvp.md` | 40-item step-by-step implementation plan |
| **Phase Map** | `Roadmap/phases.md` | All phases with dependencies |
| **Shipped Inventory** | `Roadmap/shipped.md` | Everything already built |
