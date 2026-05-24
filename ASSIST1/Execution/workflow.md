# AI Social OS — Workflow

## The Cycle

```
Read Plan -> Pick Task -> Read Spec -> Build -> Log -> Update ASSIST1 -> Commit -> Repeat
```

## Step by Step

### 1. Read the Plan

```powershell
cat ASSIST1/Roadmap/masterplan.md
```

Check:
- Current phase
- Priority gaps
- Next 10 tasks

### 2. Pick a Task

```powershell
cat ASSIST1/Execution/checklists/z-01-mvp.md
```

Look for:
- Not started items
- In progress items

### 3. Read the Spec

```powershell
cat ASSIST1/Vision/<relevant-spec>.md
cat ASSIST1/Core/architecture.md
```

Understand:
- What the feature does
- How it fits the system
- Technical requirements

### 4. Build

Write code in `app/src/`. Follow conventions in `ASSIST1/Core/principles.md`.

Rules:
- One feature per branch
- Test as you go
- Keep commits small and logical

### 5. Log

Create `ASSIST1/Log/YYYY-MM-DD-HHmm.md`:

```markdown
# Session: YYYY-MM-DD HH:MM

## What I did
- Built X feature
- Fixed Y bug
- Refactored Z

## Status
- Task: In progress / Done
- Blockers: None / [describe]

## Next
- Continue with...
- Need to fix...
```

### 6. Update ASSIST1 (MUST DO)

**Every change must be reflected in ASSIST1/.** After building:

- Update `Roadmap/masterplan.md` — progress %, status, next tasks
- Update `Roadmap/shipped.md` — add completed items
- Update `Execution/checklists/` — mark items done
- Update `Roadmap/phases.md` — if phase status changed
- Update relevant `Vision/` files — if spec changed during implementation

**Never commit without updating ASSIST1.** The docs are the source of truth.

### 7. Commit

```powershell
git add -A && git commit -m "XX -- AIOS -- Short description of changes"
```

Format: `XX -- AIOS -- <description>`

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

1. Check `ASSIST1/Log/` for similar past work
2. Read relevant spec in `ASSIST1/Vision/`
3. Check `ASSIST1/Core/architecture.md` for patterns
4. Ask for clarification
