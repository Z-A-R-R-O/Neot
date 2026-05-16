# System Architecture

## High-Level Architecture

> **Note:** The architecture diagram below reflects the *planned* architecture with Supabase/PostgreSQL/Redis. The **current implementation** uses:
> - **SQLite via Prisma** (instead of PostgreSQL) — zero-config local dev
> - **Local auth** via bcrypt + session cookies (instead of Supabase Auth)
> - **In-memory rate limiter** (instead of Redis)
> - **Custom API routes** in Next.js App Router (all backend logic lives in `web/src/app/api/`)

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND APPS                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Student  │  │ Teacher  │  │  Parent  │  │  Admin   │   │
│  │   App    │  │   App    │  │ Dashboard│  │  Panel   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴─────────────┴─────────────┘          │
│                         │                                   │
│              API Layer (Next.js App Router)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    API LAYER                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Local    │  │  Rate    │  │  CSRF    │                  │
│  │ Auth     │  │  Limit   │  │  Guard   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    BACKEND CORE (Next.js API Routes)         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Auth    │  │  Course  │  │  Lesson  │  │ Analytics│    │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │    │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤    │
│  │  Admin   │  │  Media   │  │  Enroll  │  │  Quiz   │    │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────┬──────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  SQLite (via Prisma + LibSQL adapter)             │       │
│  │  - 17 models covering all features                │       │
│  │  - Single-file local DB (web/dev.db)              │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     AI LAYER                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  OpenAI  │  │  Custom  │  │  Vector  │  │  Recom-  │     │
│  │  GPT-4   │  │  Models  │  │   DB     │  │  mender  │     │
│  │          │  │ (Whisper)│  │(Embeddings│  │  Engine  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  ADMIN CMS ENGINE (Directus)                  │
│  Visual schema builder → Dynamic frontend generation          │
│  Theme engine → Multi-mode experiences                        │
│  Block system → Reusable content components                   │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action → Frontend → API Gateway → Backend Service → Database
                             ↓
                        Cache Check (Redis)
                             ↓
                        AI Processing (if needed)
                             ↓
                        Response → Frontend → UI Update
```

## Request Lifecycle

1. **Client Request** — Student opens lesson, API call to `/api/lessons/:id`
2. **API Gateway** — Authenticates JWT, checks rate limits, routes to Course Service
3. **Course Service** — Fetches lesson data from PostgreSQL, checks Redis cache
4. **Adaptive Engine** — Analyzes student profile, adjusts difficulty/data returned
5. **AI Layer** — If tutor mode, generates personalized explanation
6. **Response** — Returns lesson content + adaptive modifications to client
7. **Client Render** — Renders dynamic blocks based on schema from admin CMS

## Frontend Architecture (Next.js)

```
┌─────────────────────────────────────────────┐
│              Next.js App                     │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │         Layout System               │    │
│  │  ┌─────┐ ┌─────┐ ┌──────┐          │    │
│  │  │Nav  │ │Main │ │Footer│          │    │
│  │  └─────┘ └─────┘ └──────┘          │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │      Feature Modules                │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐  │    │
│  │  │ Auth   │ │ Course │ │ Quiz   │  │    │
│  │  │ Module │ │ Player │ │ Engine │  │    │
│  │  └────────┘ └────────┘ └────────┘  │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐  │    │
│  │  │ AI     │ │Gamifica│ │Analytics│  │    │
│  │  │ Tutor  │ │ tion   │ │        │  │    │
│  │  └────────┘ └────────┘ └────────┘  │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │      Block Renderer Engine          │    │
│  │  (Dynamic components from CMS)      │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │   State Management (Zustand)        │    │
│  │   Data Fetching (React Query)       │    │
│  │   Styling (Tailwind CSS)            │    │
│  │   Animation (Framer Motion)         │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Mobile App Architecture (Flutter)

```
┌──────────────────────────────────────────┐
│            Flutter App                    │
│                                           │
│  ┌────────────┐  ┌────────────┐          │
│  │  Widgets   │  │  Screens   │          │
│  │  (Blocks)  │  │  (Pages)   │          │
│  └────────────┘  └────────────┘          │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │       State Management (Riverpod)│    │
│  │       API Layer (Dio)            │    │
│  │       Local DB (Hive/Isar)      │    │
│  │       Offline Sync (SQLite)      │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

## Admin CMS / Visual Experience Engine

> **Evolved vision:** See `16-visual-experience-engine.md`. The admin system transitions to a **Dual Mode Visual Experience Engine** — editing happens directly on the live frontend via an overlay (Dev Mode), not in a separate CMS panel.

```
┌──────────────────────────────────────────────────────────┐
│              Visual Experience Engine (V2)                │
│                                                            │
│  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │    Viewer Mode          │  │    Dev Mode Overlay    │  │
│  │  (production frontend)  │  │  (editing on live DOM) │  │
│  └────────────────────────┘  └────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Shared Block Engine                      │ │
│  │  BlockRegistry  →  PageRenderer  →  Block Tree       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │  Theme     │  │  Media     │  │  User      │          │
│  │  Engine    │  │  Library   │  │  Manager   │          │
│  └────────────┘  └────────────┘  └────────────┘          │
└──────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

| Decision | Current Implementation | Notes |
|----------|----------------------|-------|
| Frontend Framework | Next.js 16 + React 19 | App Router, server components by default |
| Mobile | Web-first (Flutter planned) | No mobile app yet |
| Backend DB | SQLite via Prisma + LibSQL adapter | Zero-config local dev |
| Auth | Local: bcryptjs + session cookies | No external auth dependency |
| Admin CMS | Custom Prisma-based admin panel | Directus container available but not active |
| AI | OpenAI API (planned) | Not yet integrated |
| Database | SQLite → PostgreSQL later | LibSQL adapter makes migration straightforward |
| Cache | In-memory (Redis planned) | Simple for single-process dev |
| State Management | Zustand (web) | Lightweight, no boilerplate |
| Data Fetching | TanStack Query | Caching, deduplication, background sync |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, dark premium theme |
