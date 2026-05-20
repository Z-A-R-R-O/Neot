# NEOT — Quick Start Guide

## First Time Setup

```powershell
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma migrate dev

# 3. Seed data (optional)
npx prisma db seed

# 4. Run dev server
npm run dev
```

## How to Work

1. **Read the plan** — Start with `ASSIST/README.md` to see current status
2. **Pick a task** — Check `ASSIST/Execution/checklists/` for available work
3. **Read the spec** — `ASSIST/Vision/` has detailed feature specs
4. **Build it** — Write code in `web/src/`
5. **Log it** — Create `ASSIST/Log/YYYY-MM-DD-HHmm.md`
6. **Commit it** — Run `.\ASSIST\Tools\git-helper.ps1 "Description"`

## Key Commands

```powershell
# Development
npm run dev                  # Start Next.js dev server
npm run build                # Production build
npm run lint                 # Run ESLint

# Database
npx prisma studio            # Open Prisma Studio
npx prisma migrate dev       # Apply migrations
npx prisma generate          # Generate Prisma client

# Git (use the helper for numbered commits)
.\ASSIST\Tools\git-helper.ps1 "Description"

# Optional automation helper
python ASSIST\Tools\Auto-next\auto-next.py
```

## Auto-Next Mini Manual

Auto-Next is a small overlay that keeps the AI chat moving.

- Run: `python ASSIST\Tools\Auto-next\auto-next.py`
- Press `START`.
- Click the AI chat input during the short countdown.
- If the red stop/wait icon is visible, Auto-Next does nothing.
- If the send icon is visible, Auto-Next types `Next`, waits 2 seconds, and submits.
- It scans once every 10 seconds.
- Press `STOP` to pause or `EXIT` to close.

## File Locations

| What | Where |
|------|-------|
| Pages | `web/src/app/` |
| Components | `web/src/components/` |
| Database schema | `web/prisma/schema.prisma` |
| API routes | `web/src/app/api/` |
| Styles | `web/src/styles/` |

## Need Help?

- `ASSIST/Core/vision.md` — What we're building
- `ASSIST/Core/architecture.md` — How it's structured
- `ASSIST/Core/principles.md` — Code standards
- `ASSIST/Log/` — Past work sessions for reference
