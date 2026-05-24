# NEOT — Build Operating System

> Plan first. Execute in order. Log every change.

## What is ASSIST?

ASSIST is the structured execution layer for the NEOT Learning Platform. Every task traces back to a plan, every change is logged, and every commit is numbered.

## Directory Structure

```
ASSIST/
├── README.md                  ← THIS FILE — navigation + workflow
├── GUIDE.md                   ← Quick-start for new contributors

├── CORE/                      ← Mission, architecture, engineering standards
│   ├── vision.md              ← What we're building and why (NEW: Adaptive Universe)
│   ├── architecture.md        ← System design, tech stack, data flow
│   └── principles.md          ← Code conventions, review checklist, standards

├── VISION/                    ← Detailed specs per role/system
│   ├── student.md             ← Student learning experience
│   ├── teacher.md             ← Teacher content creation
│   ├── parent.md              ← Parent monitoring dashboard
│   ├── admin.md               ← Admin control center
│   ├── adaptive.md            ← Adaptive learning engine
│   ├── ai.md                  ← AI tutor, content generation, safety
│   ├── themes.md              ← Theme engine, multi-mode operation
│   ├── mobile.md              ← Flutter mobile strategy
│   ├── business.md            ← Revenue models, pricing, projections
│   └── dev-mode.md            ← Visual Experience Engine (Dev Mode)

├── ROADMAP/                   ← What's done, what's next, what's planned
│   ├── masterplan.md          ← Combined v2 + v3 status, priorities
│   ├── phases.md              ← Phase map including v3 phases
│   ├── shipped.md             ← Complete v2 shipped inventory (LMS)
│   └── v3-transition.md       ← NEW: LMS → Adaptive Universe transition plan

├── EXECUTION/                 ← How to work, conventions, checklists
│   ├── workflow.md            ← Plan → Build → Log → Commit
│   ├── conventions.md         ← Naming, commits, branch strategy
│   └── checklists/
│       ├── z-01-lms.md        ← LMS flow — 110 items (100% ✅)
│       ├── z-02-admin.md      ← Admin flow — 60 items (100% ✅)
│       └── z-03-adaptive-universe.md  ← NEW: v3 — 112 items (39% 🚧)

├── LOG/                       ← One .md file per work session

└── TOOLS/
    ├── git-helper/
    │   └── git-helper.ps1         ← Auto-numbered commits
    └── Auto-next/
        ├── auto-next.py           ← Auto-Next watcher
        ├── templates/             ← Send/stop icon references
        └── auto-next.ps1          ← Fallback: Keyboard-only simulation

## Root-Level Strategic Document

master.md  ← NEW: Strategic North Star — full vision for the Adaptive Learning Universe
```

## Quick Start

```powershell
# 1. Read the strategic North Star
cat master.md

# 2. Check what's active
cat ASSIST/Roadmap/masterplan.md

# 3. Pick a task from the v3 checklist
cat ASSIST/Execution/checklists/z-03-adaptive-universe.md

# 4. Read the spec for context
cat ASSIST/Vision/adaptive.md

# 5. Build it (write code in web/)

# 6. Log the session
code ASSIST/Log/YYYY-MM-DD-HHmm.md

# 7. Update ASSIST docs (must do)

# 8. Commit
.\ASSIST\Tools\git-helper.ps1 "V3-0: Description of changes"

# Optional automation helper
python ASSIST\Tools\Auto-next\auto-next.py
```

## Workflow

```
Read the plan -> Pick a task -> Read the spec -> Build -> Log -> Update ASSIST -> Commit
```

| Step | Where | What |
|------|-------|------|
| **Orient** | `master.md` | Read strategic North Star |
| **Plan** | `Roadmap/masterplan.md` | See active phase + priority gaps |
| **Task** | `Execution/checklists/z-03-adaptive-universe.md` | Pick a 🔲 item |
| **Spec** | `Vision/` + `Core/` | Read architecture + role specs |
| **Build** | `web/src/` | Implement the code |
| **Log** | `Log/YYYY-MM-DD-HHmm.md` | What changed, why, status, next |
| **Update ASSIST** | `Roadmap/`, `Execution/` | Progress %, checklists, masterplan |
| **Commit** | `Tools/git-helper.ps1` | Auto-numbered: `XX -- NEOT -- desc` |

**ASSIST must always reflect reality.** Never commit code without updating ASSIST docs.

## Current Status

| Plan | Items | Done | Progress |
|------|-------|------|----------|
| **Z-01 LMS Flow** | 110 | 110 | 100% ✅ Shipped |
| **Z-02 Admin Flow** | 60 | 60 | 100% ✅ Shipped |
| **Z-03 Adaptive Universe** | 112 | 65 | 58% 🚧 Active |
| **Combined** | **282** | **235** | **83% 🚧** |

## Strategic Documents Reference

| Document | Location | Purpose |
|----------|----------|---------|
| **Strategic North Star** | `master.md` (root) | Full vision: AI-Powered Adaptive Learning Universe |
| **v3 Transition Plan** | `Roadmap/v3-transition.md` | How we get from LMS to Adaptive Universe |
| **v3 Checklist** | `Execution/checklists/z-03-adaptive-universe.md` | 112-item step-by-step implementation plan |
| **v2 Shipped Inventory** | `Roadmap/shipped.md` | Everything already built |
| **Phase Map** | `Roadmap/phases.md` | All phases including v3 |

## Phase Selection Rules

| Phase | Prerequisite | Entry Gate |
|-------|-------------|------------|
| **v2** Z-01/Z-02 | None | ✅ Complete (170/170) |
| **V3-0** Foundation | None | master.md + ASSIST docs aligned |
| **V3-1** Learning Worlds | V3-0 done | Concept Graph deployed |
| **V3-2** AI Personalization | V3-1 live | Worlds UI + graph populated |
| **V3-3** Engagement Loops | V3-2 stable | Dynamic paths working |
| **V3-4** Story Mode | V3-2 done | Learning profiles active |
| **V3-5** Monetization | V3-3 + V3-4 live | Engagement metrics established |
| **V3-6** Scale + Launch | All prior | Everything functional |

**Shipped:** ✅ v2 complete (170/170, 185 commits).
**Active:** 🚧 V3-4 Story Mode — 0% (0/16 items). V3-3 Engagement Loops complete ✅.