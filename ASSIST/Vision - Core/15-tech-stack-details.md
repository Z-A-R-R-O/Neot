# Technology Stack — Detailed Specification

## Complete Stack Overview

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (Web)                          │
│  Next.js 14 (App Router)  +  TypeScript 5                  │
│  Tailwind CSS 3  +  Framer Motion 10                      │
│  Zustand (state)  +  React Query/TanStack Query 5         │
│  React Hook Form  +  Zod (validation)                     │
│  Lucide React (icons)  +  Radix UI (headless primitives)  │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│                    MOBILE (Flutter)                         │
│  Flutter 3.16  +  Dart 3                                   │
│  Riverpod (state)  +  Dio (HTTP)                           │
│  Hive/Isar (local DB)  +  GoRouter (routing)              │
│  Lottie (animations)  +  flutter_tts (text-to-speech)      │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│                    BACKEND (Supabase)                       │
│  PostgreSQL 15  +  pgvector (embeddings)                   │
│  Supabase Auth  +  Row Level Security                      │
│  Supabase Storage (S3-compatible)                          │
│  Supabase Realtime (WebSockets)                            │
│  pg_cron (scheduled jobs)                                  │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│                    ADMIN CMS (Directus)                     │
│  Directus 10 (self-hosted or cloud)                        │
│  Custom extensions (blocks, theme engine)                  │
│  REST + GraphQL API                                        │
│  Role-based access control                                 │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│                    AI LAYER                                 │
│  OpenAI GPT-4o + GPT-4o-mini (main models)                 │
│  OpenAI Whisper (speech-to-text)                           │
│  OpenAI TTS (text-to-speech)                               │
│  pgvector (embeddings for RAG)                             │
│  Custom moderation layer (content safety)                  │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│                    HOSTING & INFRA                          │
│  Vercel (web frontend + serverless functions)              │
│  Supabase Cloud (database + auth + storage)                │
│  Redis Cloud / Upstash (caching)                           │
│  Cloudflare (DNS + CDN + DDoS protection)                  │
│  Sentry (error tracking)                                   │
│  PostHog (product analytics)                               │
└────────────────────────────────────────────────────────────┘
```

## Frontend (Web) — Detailed

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.0",
    
    "framer-motion": "^10.18.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0",
    
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    
    "lucide-react": "^0.303.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-slider": "^1.1.0",
    "@radix-ui/react-progress": "^1.0.0",
    "@radix-ui/react-toast": "^1.1.0",
    
    "react-markdown": "^9.0.0",
    "rehype-highlight": "^7.0.0",
    "remark-gfm": "^4.0.0",
    
    "openai": "^4.24.0",
    "date-fns": "^3.2.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.2.0",
    "vitest": "^1.2.0",
    "cypress": "^13.6.0"
  }
}
```

### Project Structure

```
web/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/              # Login, signup, forgot-password
│   │   ├── (dashboard)/         # Student dashboard
│   │   ├── (teacher)/           # Teacher dashboard
│   │   ├── (admin)/             # Admin panel
│   │   ├── courses/             # Course listing
│   │   ├── lessons/             # Lesson player
│   │   └── api/                 # API routes (server actions)
│   │
│   ├── components/
│   │   ├── ui/                  # Primitive UI components
│   │   ├── blocks/              # Learning block renderers
│   │   ├── layout/              # Nav, sidebar, footer
│   │   ├── gamification/        # XP, streak, achievement displays
│   │   └── ai/                  # AI tutor, content generator
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAdaptiveProfile.ts
│   │   ├── useGamification.ts
│   │   └── useOffline.ts
│   │
│   ├── lib/                     # Utilities, API clients
│   │   ├── supabase/
│   │   ├── api/
│   │   ├── ai/
│   │   └── utils/
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── authStore.ts
│   │   ├── lessonStore.ts
│   │   └── themeStore.ts
│   │
│   └── types/                   # TypeScript type definitions
│       ├── database.ts          # Supabase types
│       ├── blocks.ts            # Block schema types
│       ├── gamification.ts
│       └── admin.ts
│
├── public/
│   ├── fonts/
│   └── images/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | Zustand | Minimal boilerplate, 1KB bundle, TypeScript-first |
| Data Fetching | TanStack Query (React Query) | Caching, dedup, background sync, optimistic updates |
| Forms | React Hook Form + Zod | Performant (uncontrolled), type-safe validation |
| UI Primitives | Radix UI | Accessible, unstyled, composable |
| Styling | Tailwind CSS + tailwind-merge | Utility-first, consistent, small CSS output |
| Icons | Lucide | Tree-shakeable, consistent design, MIT license |
| Animations | Framer Motion | Declarative, Gesture support, layout animations |
| Date/Time | date-fns | Tree-shakeable, immutable, comprehensive |

## Mobile (Flutter) — Detailed

### Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State & Data
  flutter_riverpod: ^2.4.0
  riverpod_annotation: ^2.3.0
  dio: ^5.4.0
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # Supabase
  supabase_flutter: ^1.10.0
  
  # UI
  lottie: ^2.7.0
  shimmer: ^3.0.0
  flutter_animate: ^4.3.0
  cached_network_image: ^3.3.0
  flutter_svg: ^2.0.0
  
  # Navigation
  go_router: ^12.1.0
  
  # Utilities
  connectivity_plus: ^5.0.0
  package_info_plus: ^5.0.0
  device_info_plus: ^9.1.0
  flutter_secure_storage: ^9.0.0
  share_plus: ^7.2.0
  url_launcher: ^6.2.0
  path_provider: ^2.1.0
  flutter_tts: ^3.8.0
  speech_to_text: ^6.5.0
  
  # Firebase (push notifications)
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.0
  flutter_local_notifications: ^16.3.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.0
  riverpod_generator: ^2.3.0
  hive_generator: ^2.0.0
  flutter_lints: ^3.0.0
  mocktail: ^1.0.0
```

## Backend (Supabase) — Detailed

### PostgreSQL Configuration

```sql
-- Recommended config settings
-- These would be set via Supabase dashboard

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pg_cron for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Performance tuning
ALTER SYSTEM SET shared_buffers = '256MB';     -- Adjust based on instance size
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET random_page_cost = 1.1;        -- SSD optimization
ALTER SYSTEM SET effective_io_concurrency = 200; -- SSD optimization
```

### Supabase Project Settings

```toml
# supabase/config.toml
[project]
name = "neot-learning"
plan = "pro"  # Start with Pro plan ($25/mo)

[auth]
enabled = true
sites_url = "https://neot-learning.vercel.app"
additional_redirect_urls = ["https://*.vercel.app"]
jwt_expiry = 3600
enable_signup = true
providers = ["email", "google"]

[analytics]
enabled = true

[storage]
enabled = true
file_size_limit = "50MB"
mime_types = ["image/*", "video/*", "audio/*", "application/pdf"]

[realtime]
enabled = true
```

## Admin CMS (Directus) — Detailed

### Directus Configuration

```javascript
// directus.config.js
module.exports = {
  // Database
  DB_CLIENT: 'postgres',
  DB_HOST: process.env.SUPABASE_DB_HOST,
  DB_PORT: 5432,
  DB_DATABASE: 'postgres',
  DB_USER: process.env.SUPABASE_DB_USER,
  DB_PASSWORD: process.env.SUPABASE_DB_PASSWORD,
  
  // Use Supabase PostgreSQL as Directus backend
  // This shares the database between Directus and the app
  
  // Auth
  PUBLIC_URL: 'https://cms.neot-learning.com',
  AUTH_PROVIDERS: ['supabase'],
  
  // Storage
  STORAGE_LOCATIONS: 'supabase',
  STORAGE_SUPABASE_DRIVER: 's3',
  STORAGE_SUPABASE_KEY: process.env.SUPABASE_S3_KEY,
  STORAGE_SUPABASE_SECRET: process.env.SUPABASE_S3_SECRET,
  STORAGE_SUPABASE_BUCKET: 'directus',
  STORAGE_SUPABASE_REGION: 'auto',
  
  // Cache
  CACHE_ENABLED: true,
  CACHE_TTL: '5m',
  CACHE_STORE: 'redis',
  REDIS_HOST: process.env.REDIS_HOST,
  
  // Rate Limiting
  RATE_LIMITER_ENABLED: true,
  RATE_LIMITER_POINTS: 100,
  RATE_LIMITER_DURATION: 60,
  
  // Extensions
  EXTENSIONS_PATH: './extensions',
};
```

### Custom Directus Extensions

| Extension | Purpose |
|-----------|---------|
| **Block Builder** | Custom interface for creating/editing learning blocks |
| **Theme Manager** | Visual theme editor with live preview |
| **Page Builder** | Drag-drop homepage section builder |
| **Analytics Dashboard** | Custom admin analytics with charts |
| **Content Generator** | AI content generation button in lesson editor |
| **Bulk Operations** | CSV import/export for courses and users |

## DevOps & Infrastructure

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-cms:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker build -t neot-cms ./directus
          docker push ${{ vars.REGISTRY }}/neot-cms:${{ github.sha }}
          # Deploy to Railway/Render/AWS
```

### Environment Variables

```bash
# .env.local (Frontend)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_DIRECTUS_URL=https://cms.neot-learning.com
NEXT_PUBLIC_OPENAI_API_KEY=...
NEXT_PUBLIC_VERCEL_URL=...

# Supabase Environment
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_DB_HOST=...
SUPABASE_DB_PASSWORD=...
SUPABASE_S3_KEY=...
SUPABASE_S3_SECRET=...

# Directus Environment
DIRECTUS_ADMIN_EMAIL=...
DIRECTUS_ADMIN_PASSWORD=...
DIRECTUS_SECRET=...
REDIS_HOST=...
REDIS_PASSWORD=...

# AI
OPENAI_API_KEY=...
OPENAI_ORG_ID=...

# Payments
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

## Monitoring & Observability

| Tool | Purpose | Free Tier Limit |
|------|---------|-----------------|
| **Sentry** | Error tracking, performance | 5k events/month |
| **PostHog** | Product analytics, session recording | 1M events/month |
| **Supabase Logs** | Database & API logs | Included |
| **Vercel Analytics** | Web vitals, traffic | 2.5k monthly views |
| **Better Stack** | Uptime monitoring | 3 URL monitors |
| **Lighthouse CI** | Performance budgets | Free |

## Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| HTTPS everywhere | ✅ | Vercel default |
| Row Level Security | ✅ | Supabase RLS on all tables |
| JWT authentication | ✅ | Supabase Auth |
| Password hashing | ✅ | Supabase (bcrypt) |
| Rate limiting | ✅ | API Gateway level |
| CORS configuration | ✅ | Restrict to own domains |
| Content Security Policy | ✅ | Strict CSP headers |
| SQL injection protection | ✅ | Supabase parameterized queries |
| XSS prevention | ✅ | React escaping + CSP |
| CSRF protection | ✅ | Supabase built-in |
| DDoS protection | ✅ | Cloudflare |
| Data encryption at rest | ✅ | Supabase |
| Data encryption in transit | ✅ | HTTPS |
| Regular backups | ✅ | Supabase daily backups |
| Access audit logs | ✅ | Supabase + Directus |
| Privacy policy/GDPR | ⚠️ | Legal review needed |
| COPPA compliance | ⚠️ | For under-13 users |
