# NEOT

> **Learning should adapt to humans. Humans should not adapt to systems.**

A modular, adaptive learning ecosystem purpose-built for education — lightweight, kid-friendly, fully controllable, and fast. NEOT serves students (ages 5-18+), teachers, parents, schools, and platform administrators through a unified architecture.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        Web Frontend (Next.js 16)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Student  │ │ Teacher  │ │  Parent  │ │  Admin   │ │  School │ │
│  │  Portal  │ │Dashboard │ │Dashboard │ │  Panel   │ │  Portal │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│  ─────────────────────────────────────────────────────────────── │
│  Shared: UI Library | Layouts | Blocks | Gamification | AI       │
│  ─────────────────────────────────────────────────────────────── │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │  Theme Engine │ │  Section     │ │  Adaptive/Mastery Engine │ │
│  │  (CSS vars)   │ │  Registry    │ │  + Spaced Repetition    │ │
│  └──────────────┘ └──────────────┘ └──────────────────────────┘ │
├────────────────────────────────────────────────────────────────────┤
│                     API Routes (App Router)                        │
├────────────────────────────────────────────────────────────────────┤
│           Prisma ORM (LibSQL Adapter) | SQLite / PostgreSQL       │
├────────────────────────────────────────────────────────────────────┤
│                    Directus CMS (PostgreSQL/Supabase)              │
├────────────────────────────────────────────────────────────────────┤
│                          Mobile (Flutter)                          │
└────────────────────────────────────────────────────────────────────┘
```

---

## Interfaces

| Interface | Audience | Route | Purpose |
|-----------|----------|-------|---------|
| **Student Portal** | Learners 5-18+ | `/dashboard` | Adaptive lesson player, gamified progress, AI tutor |
| **Teacher Dashboard** | Educators | `/teacher` | No-code lesson builder, drag-drop blocks, analytics |
| **Parent Dashboard** | Parents/Guardians | `/parent` | Progress monitoring, alerts, communication |
| **Admin Panel** | Platform owners | `/admin` | Visual page builder, theme engine, user/content management |
| **School Portal** | School admins | `/school` | White-label branding, staff/student management, contracts |

---

## Features

### Student

- Adaptive lesson player with block-based content (text, video, quiz, PDF, assignment)
- Gamification: XP, levels (50 tiers), streaks, achievements, badges, leaderboards
- Mastery tracking with skill-based scoring and spaced repetition reviews
- AI tutor for Socratic-style question answering
- Bookmarks, notes, course certificates, progress tracking

### Teacher

- Drag-and-drop course builder with module/lesson management
- Block-based lesson editor with 5 content block types
- Quiz builder with question bank and AI auto-generation
- Student analytics: class mastery overview, at-risk identification, engagement charts
- Messaging system for student communication
- Course publishing workflow with draft/published states
- Course marketplace listing for revenue sharing

### Parent

- Child progress monitoring with reports and analytics
- Configurable alerts (streak drops, inactivity, low quiz scores)
- Direct communication with teachers
- Home learning support tools

### Admin

- Full user, course, and content management
- Visual page builder (CMS) with 15+ section types and live preview
- Theme engine with color picker, font selector, animation config
- Custom roles and permissions system
- Revenue dashboard with Stripe payout management
- Security scanning, compliance reporting, load testing
- Audit logs, error tracking, backup management
- SSO, LTI 1.3, and SIS integration management
- Plugin system and app marketplace
- Feature flags, localization, SEO, CDN configuration

### School

- White-label branding (custom logo, colors, fonts, domain)
- Staff and student management with bulk CSV import
- Subscription and contract management
- School-specific analytics and reporting
- SIS integration (PowerSchool, Infinite Campus, custom API)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Web Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 4 + CSS variables for theming |
| **State Management** | Zustand (stores) + TanStack React Query (server state) |
| **ORM / Database** | Prisma 7 + SQLite (dev, via LibSQL adapter) / PostgreSQL (prod) |
| **Auth** | Local sessions (bcrypt + cookies), WebAuthn passkeys, SSO (OAuth2) |
| **Payments** | Stripe (payment intents, webhooks, marketplace payouts) |
| **Email** | SendGrid / SMTP with dark-themed HTML templates |
| **Analytics** | Google Analytics 4 / Mixpanel |
| **Headless CMS** | Directus 11.6 (PostgreSQL on Supabase, S3 file storage) |
| **Mobile** | Flutter 3+ / Dart 3+ (Provider, GoRouter, Dio) |
| **Hosting** | Vercel (frontend) |
| **Key Libraries** | Framer Motion (animation), Recharts (charts), Radix UI (primitives), DnD Kit (drag-drop), Jose (JWT), Zod (validation) |

---

## Core Subsystems

### Adaptive Learning Engine
Skill-based mastery scoring that tracks performance, recency (30-day decay), streak bonuses, and consistency. Adjusts difficulty (1-5) and recommends review, practice, or advance actions. Spaced repetition schedules reviews at increasing intervals (1, 3, 7, 14, 30, 60 days).

### Gamification System
- **XP**: Earned for lesson completion, quiz passes, streaks, achievements, daily login
- **Levels**: 50 tiers (Beginner → Grand Master) with configurable XP requirements
- **Streaks**: Current streak, longest streak, notifications, recovery prompts
- **Achievements**: Criteria-based with XP rewards and unlock animations
- **Badges**: 5 rarity tiers (Common → Legendary) with progress indicators
- **Leaderboards**: All-time, weekly, monthly views
- **Seasonal Events**: Timed events with XP multipliers and special rewards

### AI Features
- **AI Tutor**: Socratic-style chat assistant for students
- **Content Generation**: Auto-generate lesson content and quiz questions
- **Quiz Auto-Generate**: One-click quiz creation from lesson content
- **Content Safety**: Profanity filtering, sensitive topic detection, age-appropriate checks for under-13 users

### Theme Engine
CSS variable-based theming with runtime switching. Supports light/dark/custom/white-label modes. Full theme editor in admin panel (colors, fonts, animations) with live preview. WCAG AA accessibility compliance.

### Page Builder / CMS
Visual page builder with 15+ section types (hero, feature grid, stats bar, how-it-works, CTA, FAQ, pricing, testimonials, course carousel, custom HTML + premium animated sections). Version history, templates, reusable blocks, draft/publish workflow, dev mode with drag-and-drop overlay.

### Marketplace
Course marketplace with Stripe-powered revenue sharing (platform fee: 20%, min payout: $50). Teachers can list courses for sale, students can purchase, and payouts are processed automatically.

### Security
- Session-based auth with 7-day TTL
- WebAuthn passkey support
- SSO (Google, Microsoft, GitHub, OpenID Connect)
- Rate limiting (100 req/min for API, 5 req/min per key for sensitive endpoints)
- CSRF origin validation
- Role-based access control with granular permissions
- Security scanning, compliance reporting (GDPR/COPPA), audit logging

---

## Project Structure

```
NEOT/
├── ASSIST/                     # Project OS: planning, specs, logs
│   ├── Core/                   #   Vision, architecture, principles
│   ├── Vision/                 #   Role/system specifications
│   ├── Roadmap/                #   Master plan, phases, shipped inventory
│   ├── Execution/              #   Workflow, conventions, checklists
│   ├── Log/                    #   Session logs
│   └── Tools/                  #   Git helper scripts
├── web/                        # Next.js 16 application
│   ├── src/
│   │   ├── app/                #   App Router pages + API routes
│   │   │   ├── (public)/       #     Marketing / CMS pages
│   │   │   ├── (auth)/         #     Login, signup, password reset
│   │   │   ├── (dashboard)/    #     Student portal
│   │   │   ├── (teacher)/      #     Teacher dashboard
│   │   │   ├── (admin)/        #     Admin panel (40+ pages)
│   │   │   ├── (parent)/       #     Parent dashboard
│   │   │   ├── (school)/       #     School portal
│   │   │   └── api/            #     100+ API route handlers
│   │   ├── components/         #   Reusable UI components
│   │   │   ├── ui/             #     Primitives (button, input, dialog...)
│   │   │   ├── layout/         #     App shell, sidebar, header
│   │   │   ├── blocks/         #     Lesson blocks + page sections
│   │   │   ├── teacher/        #     Course builder, editors
│   │   │   ├── admin/          #     Admin feature components
│   │   │   ├── dashboard/      #     Student dashboard widgets
│   │   │   ├── gamification/   #     XP, streak, achievement popups
│   │   │   ├── ai/             #     AI tutor chat, content generator
│   │   │   └── ...             #     Auth, courses, player, settings...
│   │   ├── lib/                #   Utilities, services, configurations
│   │   │   ├── auth.ts         #     Session management
│   │   │   ├── db.ts           #     Prisma client singleton
│   │   │   ├── middleware.ts   #     Auth middleware logic
│   │   │   ├── gamification/   #     XP, streaks, mastery, achievements
│   │   │   ├── theme/          #     Theme provider & CSS variable engine
│   │   │   ├── security/       #     Compliance, scanning, load testing
│   │   │   └── courses/        #     Progress, certificates, enrollments
│   │   ├── hooks/              #   Custom React hooks
│   │   ├── stores/             #   Zustand state stores
│   │   ├── generated/          #   Prisma generated client
│   │   └── types/              #   Shared TypeScript types
│   ├── prisma/                 #   Schema + migrations
│   ├── proxy.ts                #   Edge auth proxy
│   └── package.json
├── directus/                   # Directus headless CMS
│   ├── docker-compose.yml      #   PostgreSQL + S3 on Supabase
│   ├── Dockerfile              #   Custom image with extension support
│   ├── directus.config.js      #   Runtime configuration
│   └── extensions/             #   Custom extensions (empty, ready)
├── flutter/                    # Flutter mobile app
│   └── lib/
│       ├── main.dart           #   Entry point with GoRouter
│       ├── core/               #   API client, config, theme
│       ├── models/             #   Data classes (User, Course, Lesson, Module)
│       ├── providers/          #   Auth state (ChangeNotifier)
│       └── screens/            #   Login, home, courses, lesson, profile
└── .env.directus.example       # Directus environment template
```

---

## API Overview (100+ endpoints)

| Domain | Routes | Purpose |
|--------|--------|---------|
| `/api/auth/*` | 18 | Login, signup, logout, sessions, passkeys, SSO, email verification |
| `/api/courses/*` | 9 | Course CRUD, modules, import/export |
| `/api/lessons/*` | 7 | Lesson CRUD, progress, skills, assignments |
| `/api/gamification/*` | 7 | Streaks, leaderboard, mastery, recommendations |
| `/api/analytics/*` | 2 | Student and platform analytics |
| `/api/teacher/*` | 4 | Student list, mastery overview, at-risk, messaging |
| `/api/admin/*` | 40+ | Users, courses, settings, themes, media, webhooks, LTI, SIS, security, backups |
| `/api/payments/*` | 2 | Stripe payment intents + webhook |
| `/api/marketplace/*` | 5 | Listings, purchases, earnings, payouts |
| `/api/school/*` | 8 | Settings, staff, students, subscription, white-label |
| `/api/ai/*` | 2 | AI tutor, content generation |
| `/api/messages/*` | 3 | Internal messaging |
| `/api/notifications/*` | 4 | In-app notifications |
| `/api/lti/*` | 3 | LTI 1.3 launch, keyset, OIDC |
| `/api/*` | +10 | Search, quizzes, bookmarks, notes, reviews, certificates, blog, etc. |

---

## Database (Prisma)

**60 models** across these domains:
- **Users & Auth**: Profile, Session, Passkey, PasswordResetToken, Role, ApiKey
- **Content**: Course, Module, Lesson, LessonSkill, Category, Tag, BlockDefinition
- **Learning**: LessonProgress, Enrollment, SkillMastery, AssignmentSubmission, Certificate
- **Gamification**: XPTransaction, Achievement, Badge, UserAchievement, UserBadge, SeasonalEvent
- **CMS**: CustomPage, PageSection, PageVersion, PageTemplate, LayoutTemplate, ReusableBlock, NavItem
- **Commerce**: MarketplaceListing, MarketplacePurchase, PayoutAccount, PayoutTransaction, RevenueShareConfig
- **School/Tenant**: School, SchoolWhiteLabel, SchoolContract, Tenant, SsoProvider, UserLink
- **Integrations**: LtiRegistration, SisConfig, Webhook, Plugin, MarketplaceApp, AppInstallation
- **Admin**: AuditLog, ErrorLog, SecurityScan, ComplianceReport, LoadTestRun, BackupRecord, PlatformSetting, FeatureFlag, DashboardConfig, Media, BlogPost, Review, Message, Notification, Bookmark, LessonNote, Report, PreviewToken, PushSubscription
- **Learning Tools**: QuestionBank

---

## Getting Started

```bash
git clone https://github.com/Z-A-R-R-O/Neot.git
cd Neot/web
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

### Prerequisites
- Node.js 18+
- npm 9+

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | TypeScript check + Vitest |
| `npm run test:watch` | Vitest in watch mode |

### Directus CMS

```bash
cd directus
docker compose up -d
```

CMS available at `http://localhost:8055`.

### Environment

Copy `.env.local.example` to `.env.local` and configure:
- `DATABASE_URL` — SQLite (default: `file:../dev.db`) or PostgreSQL connection string
- `OPENAI_API_KEY` — For AI tutor and content generation
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — For payments
- `SENDGRID_API_KEY` or `SMTP_*` — For email
- `NEXT_PUBLIC_DIRECTUS_URL` — Directus CMS URL
- `GA4_MEASUREMENT_ID` / `MIXPANEL_TOKEN` — Analytics

---

## Mobile App (Flutter)

The Flutter app (`flutter/`) provides native iOS/Android access with:
- Session-based auth (shared with web)
- Course browsing with thumbnails
- Module/lesson tree with expandable sections
- Markdown lesson content renderer
- Lesson completion with XP feedback
- Material 3 design (light/dark themes)

### Run the Flutter app

```bash
cd flutter
flutter pub get
flutter run
```

Requires the Next.js dev server running on `http://localhost:3000`.

---

## Deployment

### Web (Vercel)

Configure these environment variables in your Vercel project:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_URL` — Deployment URL
- Stripe, SendGrid, OpenAI, SSO keys as needed

### Directus CMS (Docker)

```bash
cd directus
# Configure .env with Supabase credentials
docker compose up -d
```

### Database

- **Development**: SQLite (auto-created at `web/dev.db`)
- **Production**: PostgreSQL — set `DATABASE_URL` and run `npx prisma db push` or `npx prisma migrate deploy`

---

## ASSIST — Project Operating System

NEOT is built using the ASSIST methodology — a structured execution layer that governs how work is planned, tracked, and committed.

```
Read Plan → Pick Task → Read Spec → Build → Log → Update ASSIST → Commit → Repeat
```

- **Core/vision.md** — Mission, philosophy, target users, differentiators
- **Core/architecture.md** — System design, data flow, performance targets
- **Core/principles.md** — Code standards, security rules, review checklist
- **Roadmap/masterplan.md** — Full feature inventory with status tracking
- **Execution/checklists/** — Granular task checklists (LMS + Admin flows)
- **Log/** — Per-session development logs

Start here: `ASSIST/README.md`

### Commit Convention

```
XX -- NEOT -- <short imperative description>
```

Use the helper script for auto-numbered commits:
```powershell
.\ASSIST\Tools\git-helper.ps1 "add course completion certificates"
```

---

## Status

100% of planned features are shipped — 170/170 checklist items across LMS (110) and Admin (60) tracks, delivered across 12 phases (0 → 6).

See `ASSIST/Roadmap/shipped.md` for the complete inventory.
