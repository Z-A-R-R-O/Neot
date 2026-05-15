# NEOT — Contributor Guide

> For developers picking up this project fresh from a clone.

---

## Quick Start

```powershell
# 1. Install dependencies
cd web
npm install

# 2. Set up environment
copy .env.local.example .env.local

# 3. Push database schema + generate Prisma client
npx prisma db push
npx prisma generate

# 4. Start dev server
npm run dev
```

Open http://localhost:3000 — you'll see the landing page.

---

## Creating an Admin Account

1. Go to `/signup` and register
2. Open Prisma Studio: `npx prisma studio` (runs at http://localhost:51212)
3. Find your `Profile` record, change `role` to `"admin"`
4. Log out and back in — you'll see the admin sidebar
5. Visit `/admin` for the dashboard

---

## Project Structure

```
web/
├── prisma/
│   └── schema.prisma          ← Database models (source of truth)
├── src/
│   ├── app/
│   │   ├── (auth)/             ← Login, signup, forgot-password
│   │   ├── (dashboard)/        ← Student/parent dashboards
│   │   ├── (teacher)/          ← Teacher tools
│   │   ├── (admin)/            ← Admin panel (Phase 1.5)
│   │   ├── courses/            ← Course listing + detail
│   │   ├── lessons/            ← Lesson player
│   │   └── api/                ← Route handlers
│   ├── components/
│   │   ├── ui/                 ← shadcn/ui primitives (button, card, dialog...)
│   │   ├── layout/             ← Sidebar, header, shell, offline-banner
│   │   ├── admin/              ← Admin components (pages, themes, blocks, users, media, settings)
│   │   ├── blocks/             ← Lesson block renderers (text, video, quiz)
│   │   └── gamification/       ← XP, streaks, badges (Phase 2)
│   ├── hooks/                  ← Custom React hooks
│   ├── lib/                    ← Core logic
│   │   ├── auth.ts             ← Session management (bcrypt + SQLite cookies)
│   │   ├── db.ts               ← Prisma client singleton
│   │   ├── csrf.ts             ← CSRF origin validation
│   │   ├── rate-limit.ts       ← In-memory rate limiter
│   │   ├── theme/              ← Theme engine (provider, converter, resolver)
│   │   └── supabase/           ← Legacy naming — not used
│   ├── stores/                 ← Zustand stores
│   └── types/                  ← TypeScript type definitions
├── ASSIST/                     ← Build operating system (see below)
└── directus/                   ← Directus CMS config (not in use yet)
```

---

## Architecture Decisions

| Choice | Why |
|--------|-----|
| **Prisma + SQLite** | Zero-config, fast iteration, no external DB needed |
| **Local auth** (bcrypt + session cookies) | Fully offline, no external service dependency |
| **Zustand** for UI state | Lightweight, no boilerplate |
| **TanStack Query** for server state | Caching, deduplication, background sync |
| **shadcn/ui** (Radix Nova) | Accessible, styled, registry-managed |
| **App Router** (server components by default) | Better perf, only add `"use client"` when needed |

---

## ASSIST Workflow

The `ASSIST/` directory is the project's operating manual. Every task follows:

```
Read the plan → Pick a task → Read the spec → Build → Log → Commit
```

### Directory layout

```
ASSIST/
├── README.md              ← Operating manual
├── GUIDE.md               ← This file
├── Vision - Core/         ← Product specs (architecture, UX, data models)
│   └── 01-vision-overview.md ... 15-tech-stack-details.md
├── Implementation/        ← Phased build plans
│   ├── 00-master-index.md ← Phase map, dependency graph, shipped inventory
│   ├── 01-phase-0-foundation.md (✅ done)
│   ├── 02-phase-1-core-learning.md (✅ done)
│   ├── 03-phase-1.5-admin-cms.md (✅ done)
│   ├── 04-phase-1.75-dynamic-renderer.md (✅ done)
│   ├── 11-phase-ui-transformation.md (✅ done)
│   ├── 12-phase-2.5-dev-mode.md (🚧 in-progress)
│   ├── 13-phase-dev-mode-e2e.md (🚧 in-progress)
│   ├── 05-phase-2-adaptive-gamification.md
│   ├── 06-phase-3-ai-mobile.md
│   ├── 07-phase-4-parent-school.md
│   ├── 08-phase-5-scale-marketplace.md
│   └── 10-engineering-standards.md
├── Log/                   ← One .md file per work session
└── Tools/
    └── git-helper.ps1     ← Auto-numbered commits
```

### How to pick a task

1. Open `Implementation/00-master-index.md` to see which phase is active
2. Open the phase file (e.g., `04-phase-2-adaptive-gamification.md`)
3. Each task block has:
   - **Files**: what to create/modify
   - **Write**: acceptance criteria
   - **Test**: how to validate

### Before you build

Read the relevant spec in `Vision - Core/` for context. Follow conventions in `08-engineering-standards.md`.

### After you build

1. **Log it** — create a file in `Log/` named `YYYY-MM-DD-HHmm.md` describing what changed and why
2. **Commit** — use the git helper:
   ```powershell
   .\ASSIST\Tools\git-helper.ps1 "Description of changes"
   ```
   Or if it prompts, commit manually:
   ```powershell
   git add -A
   git commit -m "XX -- NEOT -- Description"
   ```

---

## Current State

| Phase | Status |
|-------|--------|
| 0 Foundation | ✅ Complete |
| 1 Core Learning | ✅ Complete |
| 1.5 Admin CMS | ✅ Complete |
| 1.75 Dynamic Renderer | ✅ Complete |
| UI Transformation | ✅ Complete |
| 2.5 Dev Mode | 🚧 In Progress |
| 2 Adaptive + Gamification | 🔲 Not started |
| 3 AI + Mobile | 🔲 Not started |
| 4 Parent + School | 🔲 Not started |
| 5 Scale + Marketplace | 🔲 Not started |

---

## Common Tasks

### Add a new Prisma model
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push` + `npx prisma generate`
3. Import from `@/generated/prisma/client`

### Add a new API route
Create in `src/app/api/<scope>/<route>/route.ts`:
```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // ...
}
```

### Add a new admin page
1. Create in `src/app/(admin)/admin/<name>/page.tsx`
2. The admin layout already checks for admin role
3. Sidebar nav items are in `src/components/layout/sidebar.tsx`

### Run checks
```powershell
npm run typecheck    # TypeScript
npm run test         # Vitest
npm run build        # Next.js build (compiles all routes)
```

---

## VSCode Setup

Recommended extensions:
- **Prisma** — schema syntax highlighting
- **Tailwind CSS IntelliSense** — class autocomplete
- **ESLint** — lint on save
- **Pretty TypeScript Errors** — readable type errors

---

## Need Help?

- Read `ASSIST/README.md` — the operating manual
- Read the relevant phase file for task context
- Check `Log/` for recent session notes and decisions
