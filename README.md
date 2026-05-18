# NEOT

> **Learning should adapt to humans. Humans should not adapt to systems.**

A modular learning ecosystem that is adaptive, lightweight, kid-friendly, fully controllable, and fast — purpose-built for education.

---

## Overview

NEOT is an end-to-end learning platform with four main interfaces:

| Interface | Audience | Purpose |
|-----------|----------|---------|
| **Student App** | Learners 5-18+ | Adaptive lesson player, gamified progress, AI tutor |
| **Teacher Dashboard** | Educators | No-code lesson builder, drag-drop blocks, analytics |
| **Parent Dashboard** | Parents/Guardians | Progress monitoring, screen time controls, reports |
| **Admin Panel** | Platform owners | Visual page builder, theme engine, full control |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 16 + React 19 + TypeScript + Tailwind CSS |
| Mobile | Web-first (Flutter planned) |
| Backend | Prisma + SQLite (LibSQL adapter), local auth (bcrypt sessions) |
| Admin CMS | Custom Prisma-based panel + Directus container |
| AI | OpenAI (planned) |
| Hosting | Vercel |

## ASSIST — Project Operating System

**ASSIST is the main of this project.** It is the structured execution layer that governs how NEOT is planned, built, tracked, and maintained. Every task traces back to a plan, every change is logged, and every commit is numbered.

```
ASSIST/
├── README.md                  ← Navigation + workflow guide
├── GUIDE.md                   ← Quick-start for contributors
├── Core/                      ← Mission, architecture, engineering standards
│   ├── vision.md              ← What we're building and why
│   ├── architecture.md        ← System design, tech stack, data flow
│   └── principles.md          ← Code conventions, review checklist, standards
├── Vision/                    ← Detailed specs per role/system
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
├── Roadmap/                   ← Plans, phases, shipped inventory
│   ├── masterplan.md          ← Combined status + gap analysis
│   ├── phases.md              ← Phase map, dependencies, entry gates
│   └── shipped.md             ← Complete shipped inventory
├── Execution/                 ← Workflow, conventions, checklists
│   ├── workflow.md            ← Plan → Build → Log → Commit
│   ├── conventions.md         ← Naming, commits, branch strategy
│   └── checklists/
│       ├── z-01-lms.md        ← LMS flow checklist
│       └── z-02-admin.md      ← Admin flow checklist
├── Log/                       ← Session logs (one .md per work session)
└── Tools/
    └── git-helper.ps1         ← Auto-numbered commits
```

### Workflow

```
Read Plan → Pick Task → Read Spec → Build → Log → Commit → Repeat
```

Start here: `ASSIST/README.md`

## Getting Started

```bash
git clone https://github.com/Z-A-R-R-O/Neot.git
cd Neot/web
npm install
npm run dev
```

## Commit Convention

```
XX -- NEOT -- <description>
```

Use the helper: `.\ASSIST\Tools\git-helper.ps1 "your message"`
