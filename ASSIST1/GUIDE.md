# AI Social OS — Quick Start Guide

## First Time Setup

```powershell
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma migrate dev

# 3. Run dev server
npm run dev
```

## How to Work

1. **Read the plan** — Start with `ASSIST1/README.md` to see current status
2. **Pick a task** — Check `ASSIST1/Execution/checklists/` for available work
3. **Read the spec** — `ASSIST1/Vision/` has detailed feature specs
4. **Build it** — Write code in `app/src/`
5. **Log it** — Create `ASSIST1/Log/YYYY-MM-DD-HHmm.md`
6. **Commit it** — `git commit -m "XX -- AIOS -- Description"`

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

# Git
git add -A && git commit -m "XX -- AIOS -- Description"
```

## File Locations

| What | Where |
|------|-------|
| Pages | `app/src/app/` |
| Components | `app/src/components/` |
| Database schema | `app/prisma/schema.prisma` |
| API routes | `app/src/app/api/` |
| Styles | `app/src/styles/` |

## Need Help?

- `ASSIST1/Core/vision.md` — What we're building
- `ASSIST1/Core/architecture.md` — How it's structured
- `ASSIST1/Core/principles.md` — Code standards
- `ASSIST1/Log/` — Past work sessions for reference
