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
│   ├── vision.md              ← What we're building and why
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
│   ├── masterplan.md          ← Z-01 + Z-02 combined status + gap analysis
│   ├── phases.md              ← Phase map, dependencies, entry gates
│   └── shipped.md             ← Complete shipped inventory
├── EXECUTION/                 ← How to work, conventions, checklists
│   ├── workflow.md            ← Plan → Build → Log → Commit
│   ├── conventions.md         ← Naming, commits, branch strategy
│   └── checklists/
│       ├── z-01-lms.md        ← LMS flow — 211-item detailed checklist
│       └── z-02-admin.md      ← Admin flow — 265-item detailed checklist
├── LOG/                       ← One .md file per work session
└── TOOLS/
    ├── git-helper/
    │   └── git-helper.ps1         ← Auto-numbered commits: "XX -- NEOT -- <desc>"
    └── Auto-next/
        ├── auto-next.py           ← Template-based Auto-Next watcher
        ├── templates/             ← Send/stop icon references
        └── auto-next.ps1          ← Fallback: Keyboard-only simulation
```

## Quick Start

```powershell
# 1. Check what's active
cat ASSIST/Roadmap/masterplan.md

# 2. Pick a task from the checklist
cat ASSIST/Execution/checklists/z-01-lms.md

# 3. Read the spec for context
cat ASSIST/Vision/student.md

# 4. Build it (write code in web/)

# 5. Log the session
code ASSIST/Log/YYYY-MM-DD-HHmm.md

# 6. Commit
.\ASSIST\Tools\git-helper.ps1 "Description of changes"

# Optional automation helper
python ASSIST\Tools\Auto-next\auto-next.py
```

## Workflow

```
Read the plan -> Pick a task -> Read the spec -> Build -> Log -> Update ASSIST -> Commit
```

| Step | Where | What |
|------|-------|------|
| **Plan** | `Roadmap/masterplan.md` | See active phase + priority gaps |
| **Task** | `Execution/checklists/` | Pick a 🔲 or 🚧 item |
| **Spec** | `Vision/` + `Core/` | Read architecture + role specs |
| **Build** | `web/src/` | Implement the code |
| **Log** | `Log/YYYY-MM-DD-HHmm.md` | What changed, why, status, next |
| **Update ASSIST** | `Roadmap/`, `Execution/` | Progress %, shipped items, checklists |
| **Commit** | `Tools/git-helper.ps1` | Auto-numbered: `XX -- NEOT -- desc` |

Auto-Next is an optional local automation tool, not a required workflow step. Python version image-matches the AI chat send/stop icons: stop icon means wait, send icon means type `Next / Continue `, wait 2 seconds, then submit.

Manual command:

```powershell
python ASSIST\Tools\Auto-next\auto-next.py
```

Use `START` in the overlay, click the chat input during the focus countdown, and leave it running. It scans every 10 seconds.

**ASSIST must always reflect reality.** Never commit code without updating ASSIST docs.

## Current Status

| Plan | Progress | Active Work |
|------|----------|-------------|
| **Z-01 LMS Flow** | 95.3% (201/211) | Student analytics page, mobile foundation |
| **Z-02 Admin Flow** | 68.3% (181/265) | Revenue analytics, course performance, CSV export |
| **Combined** | 80.3% (382/476) | Phase 5 export/import + analytics (student + admin), Phase 2/3/4 complete |

## Phase Selection Rules

| Phase | Prerequisite | Entry Gate |
|-------|-------------|------------|
| **0** Foundation | None | — |
| **1** Core Learning | Phase 0 done | Auth + DB working |
| **1.5** Admin CMS | Phase 1 stable | Course CRUD + lesson player |
| **1.75** Dynamic Renderer | Phase 1.5 done | Section builder + registry |
| **UI** Redesign | Phase 1.75 done | Page builder working |
| **2.5** Dev Mode | Phase 1.75 done | Block registry + overlay store |
| **2** Adaptive + Gamification | Phase 1 done | Quiz + progress tracking |
| **3** AI + Mobile | Phase 2 + 1.5 done | Adaptive profiles + CMS |
| **4** Parent + School | Phase 1 done | Student/teacher data |
| **5** Scale + Marketplace | All prior | Everything stable |

**Shipped:** ✅ Phases 0, 1, 1.5, 1.75, UI, 2.5, D complete.

