# NEOT — Workflow

## The Cycle

```
Read Plan → Pick Task → Read Spec → Build → Log → Update ASSIST → Commit → Repeat
```

## Step by Step

### 1. Read the Plan

```powershell
cat ASSIST/Roadmap/masterplan.md
```

Check:
- Current phase
- Priority gaps
- Next 10 tasks

### 2. Pick a Task

```powershell
cat ASSIST/Execution/checklists/z-01-lms.md
cat ASSIST/Execution/checklists/z-02-admin.md
```

Look for:
- 🔲 Not started (pick one)
- 🚧 In progress (continue or reassign)
- ✅ Done (skip)

### 3. Read the Spec

```powershell
cat ASSIST/Vision/<relevant-spec>.md
cat ASSIST/Core/architecture.md
```

Understand:
- What the feature does
- How it fits the system
- Technical requirements

### 4. Build

Write code in `web/src/`. Follow conventions in `ASSIST/Core/principles.md`.

Rules:
- One feature per branch
- Test as you go
- Keep commits small and logical

### 5. Log

Create `ASSIST/Log/YYYY-MM-DD-HHmm.md`:

```markdown
# Session: YYYY-MM-DD HH:MM

## What I did
- Built X feature
- Fixed Y bug
- Refactored Z

## Status
- Task: 🚧 In progress / ✅ Done
- Blockers: None / [describe]

## Next
- Continue with...
- Need to fix...
```

### 6. Update ASSIST (MUST DO)

**Every change must be reflected in ASSIST/.** After building:

- Update `Roadmap/masterplan.md` — progress %, status, gap analysis, next tasks
- Update `Roadmap/shipped.md` — add completed items
- Update `Execution/checklists/` — mark items ✅
- Update `Roadmap/phases.md` — if phase status changed
- Update relevant `Vision/` files — if spec changed during implementation

**Never commit without updating ASSIST.** The docs are the source of truth.

### 7. Commit

```powershell
.\ASSIST\Tools\git-helper.ps1 "Short description of changes"
```

Format: `XX -- NEOT -- <description>`

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `dev` | Integration branch |
| `feature/<name>` | Individual features |
| `fix/<name>` | Bug fixes |

## Commit Rules

- One logical change per commit
- Write in imperative mood
- Reference task/checklist item
- Never commit secrets
- Never commit `.env` files

## When Stuck

1. Check `ASSIST/Log/` for similar past work
2. Read relevant spec in `ASSIST/Vision/`
3. Check `ASSIST/Core/architecture.md` for patterns
4. Ask for clarification
