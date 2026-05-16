# ASSIST — NEOT Build Operating System

> Structured execution layer for the NEOT Learning Platform.
> **Plan first. Execute in order. Log every change.**

---

## Directory Structure

```
ASSIST/
├── README.md                  ← THIS FILE — operating manual
├── GUIDE.md                   ← Contributor quick-start guide
├── Vision - Core/             ← Product specs (16 files: architecture, UX, data models)
│   ├── 01-vision-overview.md  → 16-visual-experience-engine.md
├── Implementation/            ← Phased build plans (tasks with files + acceptance criteria)
│   ├── 00-master-index.md     ← Phase map, dependency graph, naming conventions
│   ├── 01-phase-0-foundation.md
│   ├── 02-phase-1-core-learning.md
│   ├── 03-phase-1.5-admin-cms.md
│   ├── 04-phase-1.75-dynamic-renderer.md
│   ├── 05-phase-2-adaptive-gamification.md
│   ├── 06-phase-3-ai-mobile.md
│   ├── 07-phase-4-parent-school.md
│   ├── 08-phase-5-scale-marketplace.md
│   ├── 10-engineering-standards.md
│   ├── 11-phase-ui-transformation.md
│   ├── 12-phase-2.5-dev-mode.md
│   └── 13-phase-dev-mode-e2e.md
├── S-IMPL/                    ← Split implementation (parallel dev tracks)
│   ├── README.md
│   ├── 01-track-a/
│   ├── 02-track-b/
│   ├── 03-merge/
│   └── 04-validation/
├── Tools/                     ← Automation scripts for the build workflow
│   └── git-helper.ps1         ← Auto-numbered commits: "XX -- NEOT -- <description>"
└── Log/                       ← Change journal — one .md file per work session
```

---

## Workflow Rules

### 1. Always Work on Plan

Every task must trace back to a task in the Implementation phase files. The workflow:

```
Read the plan  →  Pick a task  →  Read the spec  →  Build  →  Log  →  Commit
```

- **Read the plan** — open `Implementation/00-master-index.md` to see which phase is active
- **Pick a task** — each task in a phase file has `Files → Write → Test` blocks
- **Read the spec** — cross-reference `Vision - Core/` for detailed product requirements
- **Build** — implement the code
- **Log** — write a log entry (see rule 2)
- **Commit** — use the git helper (see rule 3)

### 2. Report Every Change in Log/

Every work session produces a log file in `ASSIST/Log/`. This creates an audit trail of what was done, why, and what's next.

**Log file format:**

```
ASSIST/Log/YYYY-MM-DD-HHmm.md
```

```markdown
# YYYY-MM-DD HH:mm — <phase/task reference>

## What was done
- <file path> — <what changed and why>
- <file path> — <what changed and why>

## Status
- Task <X.Y>: complete / in-progress / blocked

## Next steps
- <what to do next>

## Blockers / Notes
- <any issues, decisions, or context>
```

**Examples:**

```
# 2026-05-15 14:30 — Phase 0 Task 0.6

## What was done
- src/components/auth/login-form.tsx — implemented email/password login form with Zod validation
- src/components/auth/signup-form.tsx — added age-gated registration flow for <13/13-18/18+
- src/hooks/useAuth.ts — created auth hook with session management

## Status
- Task 0.6: complete
- Task 0.7: in-progress

## Next steps
- Build auth middleware in middleware.ts
- Set up route protection for dashboard pages

## Blockers / Notes
- Decided to use server-side session cookies (not localStorage) for security
```

### 3. Use the Git Helper for Commits

Always commit via the tool:

```powershell
# Interactive (prompts for description):
.\ASSIST\Tools\git-helper.ps1

# Direct:
.\ASSIST\Tools\git-helper.ps1 "Add login form with Zod validation"

# Result: "05 -- NEOT -- Add login form with Zod validation"
```

The commit format is: `XX -- NEOT -- <description>` where `XX` auto-increments.

---

## End-to-End Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. PICK a task from Implementation/XX-phase-X-name.md       │
│     → Read the Files / Write / Test block                     │
│                                                              │
│  2. READ spec in Vision - Core/ if you need details           │
│     → Architecture, data models, UI mockups, API design       │
│                                                              │
│  3. BUILD the code                                            │
│     → Create/modify files listed in the task                  │
│     → Follow conventions in 08-engineering-standards.md       │
│     → Verify against Write (acceptance) and Test (validation) │
│                                                              │
│  4. WRITE a log entry in ASSIST/Log/YYYY-MM-DD-HHmm.md       │
│     → What was changed, why, current status, next steps       │
│                                                              │
│  5. COMMIT via ASSIST/Tools/git-helper.ps1                    │
│     → Stages all, auto-numbers, creates commit                │
│                                                              │
│  6. REPEAT — next task in the phase                          │
│     → When phase validation gate passes, move to next phase   │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Selection Rules

| Phase | Prerequisite | Entry Gate |
|-------|-------------|------------|
| **0** Foundation | None | — |
| **1** Core Learning | Phase 0 done | Phase 0 validation gate ✅ |
| **1.5** Admin CMS | Phase 1 course basics stable | Course CRUD + lesson player working |
| **1.75** Dynamic Renderer | Phase 1.5 done | Section builder + registry ready |
| **UI** Redesign | Phase 1.75 done | Page builder working |
| **2.5** Dev Mode | Phase 1.75 done | Block registry + overlay store ready |
| **2** Adaptive + Gamification | Phase 1 done | Quiz system + progress tracking working |
| **3** AI + Mobile | Phase 2 + 1.5 done | Adaptive profiles + CMS settings ready |
| **4** Parent + School | Phase 1 done | Student/teacher data populated |
| **5** Scale + Marketplace | All prior phases | Everything stable |

**Shipped:** ✅ Phases 0, 1, 1.5, 1.75, UI, 2.5 complete. Phase 2 (Adaptive + Gamification) is the next active phase.

---

## Tools Reference

| Tool | Path | Purpose |
|------|------|---------|
| **git-helper.ps1** | `ASSIST/Tools/git-helper.ps1` | Auto-numbered commits: stages all, finds next number, commits as `XX -- NEOT -- <desc>` |

---

## Quick Start

```powershell
# 1. Read the active phase
code ASSIST/Implementation/01-phase-0-foundation.md

# 2. Read the spec for context
code "ASSIST/Vision - Core/07-backend-infrastructure.md"

# 3. Build it
# (write code)

# 4. Log the session
code ASSIST/Log/2026-05-15-1430.md

# 5. Commit
.\ASSIST\Tools\git-helper.ps1 "Implement auth login flow"
```
