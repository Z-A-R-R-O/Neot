# AI Social OS — Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, CSS variables |
| **State** | Zustand, React Context |
| **Database** | SQLite (dev), PostgreSQL (prod via Prisma) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js / Lucia (OAuth + sessions) |
| **AI** | OpenAI API, Anthropic API |
| **Deployment** | Vercel |
| **File Storage** | Uploadthing / S3 |

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App                           │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Dashboard   │  Content     │  Analytics   │  Leads         │
│  Overview    │  Manager     │  Dashboard   │  Inbox         │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                    Shared Component Library                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Social      │  │ AI Content  │  │ Calendar /          │ │
│  │ Connector   │  │ Engine      │  │ Scheduler           │ │
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
User ──┬── SocialAccount (per platform)
       │── Post (content + scheduling)
       │── Media (images, videos)
       │── Campaign
       │── Lead (from comments/DMs)
       │── AnalyticsSnapshot
       │── AIGenerationLog
       └── BrandProfile (voice, tone, guidelines)

SocialAccount ── platform (instagram/linkedin/x/youtube)
               ── accessToken, refreshToken
               ── profile data (username, avatar, follower count)

Post ──┬── PostVersion (content per platform)
       │── PostSchedule (publish time)
       │── PostMedia (attached media)
       └── PostAnalytics (performance)

Campaign ──┬── CampaignPost (linked posts)
           └── CampaignGoal (targets, dates)
```

## Key Systems

### Social Connector

OAuth-based platform connection. Each platform implements:

```typescript
interface SocialPlatform {
  connect: (code: string) => Promise<SocialAccount>;
  post: (accountId: string, content: PostContent) => Promise<PostResult>;
  delete: (accountId: string, postId: string) => Promise<void>;
  analytics: (accountId: string, range: DateRange) => Promise<Analytics>;
  inbox: (accountId: string) => Promise<InboxItem[]>;
}
```

### AI Content Engine

Generates platform-optimized content:

```typescript
interface AIContentRequest {
  brandVoice: BrandProfile;
  platform: string;
  topic: string;
  contentType: 'caption' | 'hook' | 'hashtags' | 'ideas' | 'cta';
  tone?: string;
  length?: 'short' | 'medium' | 'long';
}
```

### Calendar Scheduler

Time-based content publishing with queue management:

```
Schedule Post ──→ Queue ──→ Platform API ──→ Published
                     │
                Pending / Failed
```

## Data Flow

```
User Action → API Route → Prisma → Database
                  ↓
            Business Logic (AI, validation)
                  ↓
            Response (JSON)
                  ↓
            React Component → UI Update
```

## External Integrations

| Platform | API | Auth | Scope |
|----------|-----|------|-------|
| Instagram | Graph API | OAuth 2.0 | content_publish, comments, insights |
| LinkedIn | Marketing API | OAuth 2.0 | posting, analytics, messaging |
| X/Twitter | API v2 | OAuth 2.0 | tweet, DM, analytics |
| YouTube | Data API v3 | OAuth 2.0 | upload, analytics, comments |

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- API Response: < 300ms (p95)
- AI Generation: < 3s (with caching)
- Dashboard Load: < 2s (with all accounts)
