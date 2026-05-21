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
- [x] Compliance reporting
  - [x] ComplianceReport Prisma model (status, category, results JSON, summary JSON)
  - [x] Migration applied
  - [x] 16 compliance checks across 4 categories:
    - GDPR: privacy policy, data retention, data access, right to erasure, age verification, cookie consent
    - COPPA: underage users, parental consent
    - Data Protection: encryption at rest, encryption in transit, data backups, access controls
    - Platform: terms of service, user communication
  - [x] `POST /api/admin/compliance` — run report (with category filter)
  - [x] `GET /api/admin/compliance` — list reports
  - [x] `GET /api/admin/compliance/[id]` — view report detail
  - [x] Admin compliance page (`/admin/compliance`) with category filter, run/refresh, history table, detail view with per-check results
  - [x] Nav sidebar link
- [x] Load testing tools
  - [x] LoadTestRun Prisma model (targetUrl, method, concurrency, totalRequests, results JSON, summary JSON)
  - [x] Migration applied
  - [x] Load test engine: configurable URL/method/concurrency/requests, concurrent fetch with timing
  - [x] Summary stats: success/fail count, avg/min/max/P50/P95/P99 response times, requests/sec, status codes
  - [x] `POST /api/admin/load-test` — run test (validates URL, caps concurrency at 50, requests at 200)
  - [x] `GET /api/admin/load-test` — list runs
  - [x] `GET /api/admin/load-test/[id]` — view detail with full request log
  - [x] Admin load test page (`/admin/load-test`) with endpoint combo presets, config form, history table, detail view with stat cards, timing breakdown, status codes, request log
  - [x] Nav sidebar link
- [x] Phase 6 checklist audit
  - [x] Webhook system (CRUD + dispatch + admin page) marked done
  - [x] API rate limiting (configurable via security settings) marked done
- [x] CDN integration
  - [x] `lib/cdn.ts` — getCdnConfig, saveCdnConfig, buildCdnUrl, transformMediaUrl, isCdnConfigured
  - [x] `GET/PUT /api/admin/cdn` — retrieve/update CDN config
  - [x] Admin CDN page (`/admin/cdn`) with toggle, URL, prefix config, live preview
  - [x] Media API enhanced to include `cdnUrl` field when CDN enabled
  - [x] Audit logging for CDN changes
  - [x] Nav sidebar link
  - [x] Z-01 Phase 5 + Z-02 Phase 6 both marked done

## Metrics

| Metric | Value |
|--------|-------|
| Total commits | 185 |
| Files created | 1000+ |
| Database tables | 30+ |
| API routes | 100+ |
| Components | 200+ |
| Pages | 80+ |
| Flutter screens | 6 |
| Prisma migrations | 15+ |

## Phase 6: Integrations (Z-02)

- [x] SSO/SAML integration
  - [x] SsoProvider Prisma model (name, type, clientId/Secret, issuerUrl, enabled)
  - [x] UserLink Prisma model (userId, providerId, externalId, email)
  - [x] `lib/sso.ts` — CRUD, OAuth2 URL builder, code exchange, user info fetch, auto-create/link accounts
  - [x] `GET/POST /api/admin/sso` — list/create providers
  - [x] `GET/PATCH/DELETE /api/admin/sso/[id]` — manage providers
  - [x] `GET /api/auth/sso` — list enabled providers for login page
  - [x] `GET /api/auth/sso/[provider]` — initiate OAuth2 redirect
  - [x] `GET /api/auth/sso/[provider]/callback` — exchange code, create session
  - [x] SsoButtons component on login page
  - [x] Admin SSO page (`/admin/sso`) with CRUD and toggle
  - [x] Supports Google, Microsoft, GitHub (built-in endpoints) + custom/SAML
- [x] Payment gateway (Stripe)
  - [x] Payment Prisma model (userId, amount, stripeIntentId, status, purchaseId)
  - [x] `lib/stripe.ts` — config CRUD, createPaymentIntent, webhook handler
  - [x] `GET/PUT /api/admin/stripe/config` — Stripe API keys, webhook secret, currency
  - [x] `POST /api/payments/create-intent` — creates PaymentIntent + Payment record
  - [x] `POST /api/payments/webhook` — handles payment_intent.succeeded/failed
  - [x] `/checkout` page with Stripe Payment Element
  - [x] `/marketplace/purchase/success` confirmation page
  - [x] Marketplace purchase flow redirects to checkout when Stripe enabled
  - [x] Admin Stripe page (`/admin/stripe`) with config form
- [x] Email service (SendGrid)
  - [x] `lib/email.ts` — SendGrid REST API sender, email templates (verification, password reset, welcome)
  - [x] `GET/PUT /api/admin/email/config` — provider, API key, from email/name
  - [x] `POST /api/admin/email/test` — send test email
  - [x] Wired into signup (verification + welcome) and forgot-password (reset email)
  - [x] Admin email page (`/admin/email`) with config and test send
- [x] Analytics integration (GA4, Mixpanel)
  - [x] `lib/analytics.ts` — config reader/writer
  - [x] `GET/PUT /api/admin/analytics/config` — fetch/update GA4/Mixpanel settings
  - [x] `AnalyticsScripts` client component with gtag.js + Mixpanel script injection
  - [x] Wired in root layout (server component reads config, passes to client)
  - [x] Admin analytics config page (`/admin/analytics/config`)
  - [x] Integrations page shows Analytics card with status
- [x] CDN configuration
  - [x] `lib/cdn.ts` — getCdnConfig, saveCdnConfig, buildCdnUrl, transformMediaUrl
  - [x] `GET/PUT /api/admin/cdn` — CDN config with URL validation + audit logging
  - [x] Admin CDN page (`/admin/cdn`) with toggle, URL, prefix config, live preview
  - [x] Media API enhanced to include `cdnUrl` field when CDN enabled
- [x] Webhook system (fully built with CRUD, events, dispatch)
- [x] API rate limiting (configurable via security settings)
- [x] LTI integration (LMS standard)
  - [x] LtiRegistration Prisma model (issuer, clientId, deploymentId, auth/token/keyset URLs)
  - [x] `lib/lti.ts` — CRUD, findLtiRegistration, NEOT endpoint URLs
  - [x] `GET/POST /api/admin/lti` — list/create registrations
  - [x] `GET/PATCH/DELETE /api/admin/lti/[id]` — manage registrations
  - [x] `GET /api/lti/oidc` — OIDC login flow (redirects to LMS auth URL)
  - [x] `POST /api/lti/launch` — JWT validation with jose, LTI claim extraction, auto-create users
  - [x] `GET /api/lti/keyset` — JWK keyset endpoint for LMS verification
  - [x] Admin LTI page (`/admin/lti`) with CRUD and copy-able NEOT URLs
- [x] SIS integration (student info systems)
  - [x] SisConfig Prisma model (name, provider, apiUrl, apiKey, csvMapping, schoolId)
  - [x] SisSyncLog Prisma model (status, recordsSynced, recordsFailed, errors, summary)
  - [x] `lib/sis.ts` — CRUD, processCsvUpload (parses CSV, creates/updates profiles by email)
  - [x] `GET/POST /api/admin/sis` — list/create configs
  - [x] `GET/PATCH/DELETE /api/admin/sis/[id]` — manage configs
  - [x] `POST /api/admin/sis/sync` — CSV upload + processing
  - [x] `GET /api/admin/sis/logs` — sync history
  - [x] Admin SIS page (`/admin/sis`) with config CRUD, CSV upload, sync history
- [x] Third-party app marketplace
  - [x] MarketplaceApp Prisma model (name, description, developer, category, version, configSchema, status)
  - [x] AppInstallation Prisma model (appId, userId, schoolId, config, status)
  - [x] `lib/marketplace-apps.ts` — CRUD, install/uninstall with count tracking
  - [x] `GET/POST /api/admin/marketplace-apps` — admin list/create
  - [x] `GET/PATCH/DELETE /api/admin/marketplace-apps/[id]` — approve/reject/edit/delete
  - [x] `GET /api/marketplace-apps` — browse approved apps
  - [x] `POST/DELETE /api/marketplace-apps` — install/uninstall
  - [x] `GET /api/marketplace-apps/installations` — user's installed apps
  - [x] Admin marketplace page (`/admin/marketplace-apps`) with approval workflow
  - [x] User apps page (`/apps`) with browse by category, install/uninstall, installed tab

## Phase 3: Mobile (Z-01)

- [x] Flutter app setup
  - [x] `flutter/pubspec.yaml` — Dio, go_router, provider, cached_network_image, video_player, chewie, connectivity_plus, shared_preferences, flutter_spinkit
  - [x] `flutter/lib/main.dart` — app entry with GoRouter navigation, dark/light themes
  - [x] `flutter/lib/core/theme.dart` — Material 3 light/dark themes
  - [x] `flutter/lib/core/config.dart` — API base URL configuration
  - [x] `flutter/lib/core/api_client.dart` — Dio HTTP client with session cookie management, secure storage
  - [x] `flutter/lib/models/models.dart` — User, Course, Lesson, Module with JSON parsing
  - [x] `flutter/lib/providers/auth_provider.dart` — login/logout/session management with Provider
  - [x] `flutter/lib/screens/login_screen.dart` — email/password login with loading state
  - [x] `flutter/lib/screens/home_screen.dart` — dashboard with user stats, quick actions
  - [x] `flutter/lib/screens/courses_screen.dart` — course listing with thumbnails
  - [x] `flutter/lib/screens/course_detail_screen.dart` — course detail with modules/lessons expansion
  - [x] `flutter/lib/screens/lesson_screen.dart` — lesson viewing with markdown content, complete button
  - [x] `flutter/lib/screens/profile_screen.dart` — user profile with stats, sign out

## Plugin System (Z-01)

- [x] Plugin/extensions framework
  - [x] Plugin Prisma model (name, slug, version, author, enabled, config JSON, hooks JSON, webhookUrl)
  - [x] `lib/plugins.ts` — CRUD, triggerHook() dispatches to plugin webhooks, getPluginsByHook()
  - [x] `GET/POST /api/admin/plugins` — list/create plugins
  - [x] `GET/PATCH/DELETE /api/admin/plugins/[slug]` — manage plugins
  - [x] Admin plugins page (`/admin/plugins`) with CRUD, enable/disable toggle, hook checkboxes, config viewer
  - [x] 15 hook types: before/after login, signup, purchase, course publish, lesson complete, on XP award, badge unlock, notification, webhook dispatch, custom
