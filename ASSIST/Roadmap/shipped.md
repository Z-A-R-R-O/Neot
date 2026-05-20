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
- [x] Admin schools management page with search and stats

## Technical Achievements

- [x] Course assignment system
- [x] SEO meta tags
- [x] Accessibility audit fixes
- [x] Git helper script (auto-numbered commits)
- [x] Auto-Next helper (template-based send/stop icon watcher)
- [x] Session logging system
- [x] ASSIST documentation structure

## Metrics

| Metric | Value |
|--------|-------|
| Total commits | 100+ |
| Files created | 500+ |
| Database tables | 18+ |
| API routes | 45+ |
| Components | 95+ |
| Pages | 40+ |
