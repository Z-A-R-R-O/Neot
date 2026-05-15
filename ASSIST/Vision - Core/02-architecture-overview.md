# System Architecture

## High-Level Architecture

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
│                    API Layer (REST + GraphQL)               │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    API GATEWAY                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   Auth   │  │  Rate    │  │  Cache   │  │  Load    │    │
│  │  Service │  │  Limit   │  │  Layer   │  │  Balance │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    BACKEND CORE                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  User    │  │  Course  │  │ Learning │  │ Analytics│    │
│  │ Service  │  │  Service │  │  Engine  │  │ Service  │    │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤    │
│  │  Quiz    │  │  Content │  │  AI      │  │ Gamifica-│    │
│  │  Service │  │  Service │  │  Service │  │ tion Svc │    │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤    │
│  │Notificat │  │  Payment │  │  Search  │  │  Media   │    │
│  │ Service  │  │  Service │  │  Service │  │  Service │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────┬──────────┬──────────┬────────────────────────────┘
           │          │          │
┌──────────▼──────────▼──────────▼────────────────────────────┐
│                   DATA LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  PostgreSQL   │  │    Redis     │  │  Object Storage  │   │
│  │  (Primary DB) │  │   (Cache)   │  │ (Media/Files)    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
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

## Admin CMS Architecture (Directus)

```
┌────────────────────────────────────────────┐
│              Directus CMS                   │
│                                              │
│  ┌────────────┐  ┌────────────┐            │
│  │   Schema   │  │  Content   │            │
│  │   Builder  │  │  Manager   │            │
│  └────────────┘  └────────────┘            │
│                                              │
│  ┌────────────┐  ┌────────────┐            │
│  │   Theme    │  │   Block    │            │
│  │   Engine   │  │  Library   │            │
│  └────────────┘  └────────────┘            │
│                                              │
│  ┌────────────┐  ┌────────────┐            │
│  │   User     │  │  Analytics │            │
│  │   Manager  │  │  Dashboard │            │
│  └────────────┘  └────────────┘            │
└────────────────────────────────────────────┘
```

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | Next.js | SSR for SEO, app-like experience, huge ecosystem |
| Mobile | Flutter | Smoother animations for kids, single codebase |
| Backend Platform | Supabase | Auth, DB, storage, realtime — all in one |
| Admin CMS | Directus | Self-hosted, fully customizable, extensible |
| AI | OpenAI API + Custom | Fast integration, plus custom for specific needs |
| Database | PostgreSQL | Reliable, scalable, JSONB for flexible schemas |
| Cache | Redis | In-memory speed for adaptive engine |
| State Management | Zustand (web) / Riverpod (mobile) | Lightweight, performant |
| Data Fetching | React Query | Caching, deduplication, background sync |
| Styling | Tailwind CSS | Utility-first, fast development, small bundles |
