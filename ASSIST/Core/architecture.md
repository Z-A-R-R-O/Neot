# NEOT — Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, CSS variables for theming |
| **State** | Zustand (lightweight), React Context for auth |
| **Database** | SQLite (dev), PostgreSQL (prod via Prisma) |
| **ORM** | Prisma 6 |
| **Auth** | Local auth with bcrypt, session-based |
| **Deployment** | Vercel (frontend), Railway/Render (backend) |
| **Mobile** | Flutter (iOS/Android) |

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 16 App                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Student     │  Teacher     │  Parent      │  Admin         │
│  Portal      │  Dashboard   │  Dashboard   │  Panel         │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                    Shared Component Library                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Theme Engine│  │ Section     │  │ Adaptive            │ │
│  │             │  │ Registry    │  │ Engine              │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    API Routes (App Router)                  │
├─────────────────────────────────────────────────────────────┤
│                    Prisma ORM                               │
├─────────────────────────────────────────────────────────────┤
│                    SQLite / PostgreSQL                      │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema (Core Entities)

```
User ──┬── Student ──┬── Enrollment ── Course
       │             └── Progress ──── Lesson
       │
       ├── Teacher ──┬── Course (owned)
       │             └── Assignment
       │
       ├── Parent ───┬── Child (Student)
       │             └── Communication
       │
       └── Admin ──── Platform settings

Course ──┬── Module ──┬── Lesson ──┬── Section (typed)
         │            │            └── Quiz
         │            └── Assignment
         └── Enrollment
```

## Key Systems

### Section Registry

Extensible content block system. Each section type implements a common interface:

```typescript
interface SectionRenderer {
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'code' | 'audio' | 'image' | 'download';
  render: (data: SectionData) => JSX.Element;
  validate: (data: unknown) => SectionData;
}
```

### Theme Engine

CSS variable-based theming with runtime switching:

```css
:root {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --color-text: #111827;
  --radius: 0.5rem;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-bg: #111827;
  --color-text: #f9fafb;
}
```

### Adaptive Engine

Adjusts content difficulty based on student performance:

1. Track quiz scores, time spent, retries
2. Calculate mastery level per topic
3. Adjust next content difficulty
4. Recommend review for weak areas

## Data Flow

```
User Action → API Route → Prisma → Database
                  ↓
            Business Logic
                  ↓
            Response (JSON)
                  ↓
            React Component → UI Update
```

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- API Response: < 200ms (p95)
- Database Query: < 50ms (p95)
- Bundle Size: < 200KB (initial JS)
