# NEOT — Shipped Inventory

## Completed Features

### Phase 0: Foundation
- [x] Next.js 16 setup with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS 4 integration
- [x] Prisma + SQLite database
- [x] User authentication (local, bcrypt)
- [x] Session management
- [x] Base layout (header, sidebar, footer)
- [x] Routing structure
- [x] Environment configuration

### Phase 1: Core Learning
- [x] Course creation (teacher)
- [x] Course enrollment (student)
- [x] Module organization
- [x] Lesson creation
- [x] Lesson player
- [x] Progress tracking
- [x] Quiz system (MCQ, true/false)
- [x] Score calculation
- [x] XP system
- [x] Streak tracking
- [x] Student dashboard
- [x] Teacher dashboard

### Phase 1.5: Admin CMS
- [x] Admin panel foundation
- [x] User management
- [x] Course oversight
- [x] Content moderation
- [x] Category management
- [x] Analytics dashboard
- [x] System settings

### Phase 1.75: Dynamic Renderer
- [x] Section Registry pattern
- [x] Video section renderer
- [x] Text section renderer
- [x] Quiz section renderer
- [x] Interactive section renderer
- [x] Code section renderer
- [x] Audio section renderer
- [x] Image section renderer
- [x] Download section renderer
- [x] Section builder UI

### Phase UI: UI Transformation
- [x] Visual redesign
- [x] Responsive layout
- [x] Dark mode
- [x] Theme switching
- [x] Component library
- [x] Accessibility improvements
- [x] SEO optimization

### Phase 2.5: Dev Mode
- [x] Visual Experience Engine
- [x] Block selection overlay
- [x] Properties panel
- [x] Live preview
- [x] Draft/publish workflow
- [x] Undo/redo history
- [x] Block registry
- [x] Zustand overlay store

### Phase 2: Adaptive + Gamification
- [x] Mastery tracking database models (Skill, SkillMastery, LessonSkill)
- [x] Mastery engine (calculate, adjust difficulty, trend detection)
- [x] Mastery service (update, query, weak/strong areas)
- [x] Skill seeder (10 default skills across categories)
- [x] Mastery tracking wired into lesson progress API
- [x] Mastery analytics API (`/api/gamification/mastery`)
- [x] Mastery dashboard component (category filter, skill cards, weak/strong areas)
- [x] Mastery page (`/dashboard/mastery`)
- [x] Navigation integration (sidebar + nav service)
- [x] Adaptive recommendation engine (review/practice/advance based on mastery)
- [x] Recommendations API (`/api/gamification/recommendations`)
- [x] Recommendations integrated into student dashboard
- [x] Lesson skills API (CRUD for skill-to-lesson mapping)
- [x] Skill mapper UI component for teachers
- [x] Skill mapping integrated into lesson editor
- [x] Leaderboard time windows (weekly, monthly views)
- [x] Leaderboard displays level and streak per user
- [x] At-risk student detection API (multi-factor risk scoring)
- [x] At-risk student component on teacher dashboard
- [x] Badge rarity system (common, uncommon, rare, epic, legendary)
- [x] Progress indicators for locked badges
- [x] Rarity filtering on achievements page
- [x] Streak notification service (warnings, milestones, recovery)
- [x] Streak heatmap (14-day activity visualization)
- [x] Streak notifications widget on student dashboard
- [x] Teacher mastery overview API (class-level skill analytics)
- [x] Class mastery component (skill breakdown, student rankings, course filter)
- [x] Teacher mastery view integrated into teacher dashboard
- [x] Refined XP calculation (difficulty multipliers, streak bonus, first-try, speed, perfect quiz)
- [x] XP bonus notifications when multipliers apply
- [x] Spaced repetition system (review scheduling based on mastery decay)
- [x] Review schedule widget on student dashboard (overdue/due/upcoming)
- [x] AI tutor chat API (Socratic method, lesson context, fallback responses)
- [x] AI tutor chat UI component
- [x] AI tutor integrated into lesson player sidebar
- [x] Content generation API (quiz, practice, summary, improvements, lesson outline)
- [x] Content generator UI for teachers
- [x] Content generation integrated into lesson editor
- [x] Quiz auto-generation component for teachers (AI-powered)
- [x] Question bank with CRUD API, search, filters, and pagination
- [x] Question Bank page for teachers (`/teacher/question-bank`)
- [x] QuestionBank database model
- [x] AI safety guardrails (profanity filter, sensitive topic detection, rate limiting)
- [x] AI tutor safety checks (blocked topics, response sanitization, rate limiting)
- [x] Offline mode architecture (service worker with cache strategies, IndexedDB for lesson caching, sync queue)
- [x] Offline page with cached lesson viewer
- [x] Offline sync hook with automatic sync on reconnect
- [x] Web push notifications (subscription management, notification settings, service worker push handler)
- [x] WebAuthn biometric login (passkey registration, authentication, settings management)
- [x] Multi-tenant architecture (Tenant model, tenant resolution, admin tenant management)
- [x] Content marketplace foundation (listings, purchases, reviews models, marketplace page)
- [x] API platform improvements (existing API key management, webhook system)

### Phase 4: Parent + School
- [x] Parent dashboard foundation (layout, children overview, alert settings)
- [x] Child detail page with enrollments, progress, achievements
- [x] Parent messages (inbox, compose, reply, mark read)
- [x] Parent alert settings component
- [x] Parent reports content component
- [x] Home learning support (suggestions, weak areas, activities)
- [x] School portal foundation (layout, role-based access)
- [x] School dashboard with stats, quick actions, activity feed
- [x] School settings with profile and white-label branding
- [x] School staff management (add, remove, bulk import)
- [x] School students page with search and stats
- [x] School courses page with listing
- [x] School analytics with enrollment stats, top courses, completion rate
- [x] School API routes (settings, white-label, staff, students)
- [x] School database models (School, SchoolWhiteLabel, SchoolContract)
- [x] School relations on Profile and Course models
- [x] School registration flow (`/register/school`) with two-step form
- [x] School registration API with validation and audit logging
- [x] School contracts page with active contract, history, and plan selection
- [x] School subscription management API (GET/POST `/api/school/subscription`)
- [x] SchoolPlanSelector client component with plan upgrade flow and confirmation dialog
- [x] Demo schools seed script (3 schools with users, contracts, white-label)
- [x] Admin schools management page with search and stats

### Phase 5: Scale + Marketplace
- [x] Revenue sharing system
  - [x] RevenueShareConfig model (platform fee %, min payout, payout method)
  - [x] PayoutAccount model (bank/PayPal/Stripe account per teacher)
  - [x] PayoutTransaction model (payout request lifecycle: pending→completed/rejected)
  - [x] MarketplacePurchase extended with teacherId, platformFee, teacherCut
  - [x] Purchase/checkout API (`/api/marketplace/purchase`) — creates purchase + enrollment
  - [x] Teacher earnings page (`/teacher/earnings`) with revenue summary, recent sales, payout settings
  - [x] Payout account management API (`/api/marketplace/payout-account`)
  - [x] Payout request API (`/api/marketplace/payouts`)
  - [x] Admin revenue management page (`/admin/revenue`) with platform stats, config, top teachers
  - [x] Admin revenue config API (`/api/admin/revenue`) — configure platform fee, min payout, method
  - [x] Admin payout approval API (`/api/admin/revenue/payouts`) — approve/reject payouts
  - [x] Purchase button component with enrolled state
  - [x] Navigation links: Earnings (teacher), Revenue (admin), Marketplace (student)
- [x] Course export/import tools
  - [x] Export API (`GET /api/courses/[id]/export`) — full course JSON download (modules, lessons, content, tags, category)
  - [x] Import API (`POST /api/courses/import`) — create new course from JSON with automatic category/tag creation
  - [x] Export button on each teacher course card with file download
  - [x] Import dialog with file upload on teacher courses page
- [x] Student analytics page
  - [x] Student Analytics API (`GET /api/analytics/student`) — XP trend, weekly activity, score distribution, XP breakdown, time spent, course progress
  - [x] Student analytics page (`/dashboard/analytics`) with 8 stat cards + 6 recharts (Area, Bar, Pie)
  - [x] Student analytics hook (`useStudentAnalytics`)
  - [x] Student nav link in sidebar
- [x] Teacher analytics CSV export (`/teacher/analytics`)
- [x] Beta analytics feature flag enabled (`beta_analytics` → `true`)
- [x] Admin advanced analytics
  - [x] Revenue analytics (total revenue, platform fees, payouts, net) on admin analytics page
  - [x] Course performance table with drill-down links to course detail
  - [x] CSV export for admin analytics page
  - [x] Admin analytics API extended with revenue + course performance data

## Technical Achievements

- [x] Course assignment system
- [x] SEO meta tags
- [x] Accessibility audit fixes
- [x] Git helper script (auto-numbered commits)
- [x] Auto-Next helper (template-based send/stop icon watcher)
- [x] Session logging system
- [x] ASSIST documentation structure
- [x] Performance monitoring dashboard (system metrics, activity trends, charts)
- [x] System health checks (DB connectivity, memory, disk, uptime, error tracking)
- [x] Performance optimization
  - [x] Pagination limits (`take: 200`) on courses API to prevent unbounded queries
  - [x] Pagination limits (`take: 50`) on blog API
  - [x] Cache-Control headers on public GET APIs (courses: 60s, blog: 300s)
  - [x] Database indexes on `course.teacherId`, `course.status`, `lessonProgress.updatedAt`, `marketplaceListing.price`
- [x] Error tracking integration
  - [x] ErrorLog Prisma model (level, source, stack trace, metadata, resolved status)
  - [x] Migration applied
  - [x] GET/POST /api/admin/error-logs (list with filters, capture)
  - [x] PATCH/DELETE /api/admin/error-logs/[id] (resolve, delete)
  - [x] Admin error logs page (filter by level/source/status, expand details, resolve/delete)
  - [x] ErrorBoundary component (catches React render errors)
  - [x] GlobalErrorCatcher (window.onerror + unhandledrejection) registered in Providers
  - [x] Nav sidebar link for error logs
- [x] Z-02 Phase 5 checklist audit
  - [x] Marked properties panel, accessibility tools, perf dashboard, audit viewer, system health as done
  - [x] Progress updated from 71.7% → 75% (45/60)
- [x] Audit log nav link added to admin sidebar
- [x] Automated backups (scheduling, restore)
  - [x] BackupRecord Prisma model (filename, size, status, type, file path)
  - [x] Migration applied
  - [x] `POST /api/admin/backup/trigger` — triggers a backup, saves file to `backups/` dir
  - [x] `GET /api/admin/backup/records` — list backup history with pagination
  - [x] `POST /api/admin/backup/records/[id]/restore` — restore from backup with rollback
  - [x] `DELETE /api/admin/backup/records` — delete backup record and file
  - [x] `GET/PUT /api/admin/backup/settings` — schedule config (frequency, time, retention, enable/disable)
  - [x] Enhanced admin backup page: create backup, history table, restore/delete actions, schedule settings
  - [x] Masterplan gap analysis fixed (AI Features, Admin Panel, Quiz System, Content Marketplace)
- [x] Security scanning (active scanning)
  - [x] SecurityScan Prisma model (status, results JSON, summary JSON, triggeredBy, timestamps)
  - [x] Migration applied
  - [x] 11 security checks: password policy, complexity, public registration, session TTL, login rate limit, database type, admin accounts, disabled accounts, production URL, rate limiting, user base
  - [x] `POST /api/admin/security/scan` — run scan
  - [x] `GET /api/admin/security/scan` — list scans
  - [x] `GET /api/admin/security/scan/[id]` — view scan detail
  - [x] Admin security scan page (`/admin/security/scan`) with run/refresh, history table, detail view with per-check results
  - [x] "Run Security Scan" button on security settings page

## Metrics

| Metric | Value |
|--------|-------|
| Total commits | 100+ |
| Files created | 500+ |
| Database tables | 18+ |
| API routes | 48+ |
| Components | 95+ |
| Pages | 40+ |
