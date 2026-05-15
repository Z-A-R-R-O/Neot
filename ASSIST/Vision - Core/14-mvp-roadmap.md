# MVP & Roadmap — Detailed Specification

## Development Phases

### Phase 0: Foundation (Weeks 1-4)

**Goal**: Working prototype with core infrastructure

```
Week 1-2: Project Setup
  - Next.js project with Tailwind + Framer Motion
  - Supabase project setup (auth, DB, storage)
  - Directus CMS installation and configuration
  - PostgreSQL schema creation (core tables)
  - CI/CD pipeline (GitHub Actions → Vercel)

Week 3-4: Authentication & User Management
  - Login/signup (email + Google OAuth)
  - Role-based profiles (student, teacher, admin)
  - Basic onboarding flow
  - RLS policies for data security
```

**Deliverables**:
- Deployed Next.js app on Vercel
- Working auth (signup, login, logout)
- Supabase connected with core tables
- Directus admin panel accessible
- CI/CD pipeline verified

### Phase 1: Core Learning (Weeks 5-10)

**Goal**: Students can take courses, teachers can create them

```
Week 5-6: Course & Lesson System
  - Course CRUD (create, read, update, archive)
  - Module/lesson hierarchy
  - Lesson player with block rendering
  - Text block, Video block (embed + upload)
  - Basic lesson progress tracking

Week 7-8: Quiz System
  - Quiz block (multiple choice, true/false)
  - Quiz attempt tracking
  - Score calculation
  - Instant feedback (correct/incorrect)
  - Basic quiz results display

Week 9-10: Teacher Dashboard
  - Course creation wizard
  - Drag-drop lesson editor
  - Block library (text, video, quiz)
  - Basic analytics (enrollments, completions)
  - Course publish/unpublish workflow
```

**Deliverables**:
- Working student experience (login → take course → complete quiz)
- Working teacher experience (create course → add lessons → publish)
- Block renderer system
- Progress tracking database

### Phase 1.5: Admin CMS (Weeks 11-13)

**Goal**: Admin can control content, not code

```
Week 11: Page Builder
  - Homepage section management
  - Section types (Hero, Featured Courses, Stats)
  - Drag-drop section ordering
  - Section config (title, content, buttons)

Week 12: Theme Engine
  - Color customization
  - Basic typography control
  - Theme presets (Kids, School, Dark)
  - Theme switching (admin preview)

Week 13: Content Management
  - User management (search, suspend, role change)
  - Course moderation
  - Basic platform settings
  - Media library
```

**Deliverables**:
- Admin can edit homepage without code
- Theme switching between 3 presets
- User management interface
- Directus as primary CMS backend

### Phase 2: Adaptive & Gamification (Weeks 14-18)

**Goal**: Platform starts adapting to learners, gamification drives engagement

```
Week 14-15: Adaptive Engine
  - Track quiz performance, time, hints
  - Adaptive profile creation (per student)
  - Difficulty adjustment rules
  - Remedial lesson insertion
  - Admin rule editor

Week 16-17: Gamification
  - XP system (earn from lessons, quizzes, streaks)
  - Streak tracking (daily, weekly)
  - Achievement definitions and awards
  - Level system
  - Leaderboard (optional per course)

Week 18: Recommended Content
  - "Continue Learning" section
  - Basic recommendation algorithm
  - "Students also took" (collaborative)
  - Course discovery page
```

**Deliverables**:
- Adaptive difficulty on quizzes
- XP, streaks, levels working
- 10+ achievement badges
- Personalized dashboard

### Phase 3: AI & Mobile (Weeks 19-24)

**Goal**: AI tutor assistant, Flutter mobile app launched

```
Week 19-20: AI Tutor (Web)
  - Q&A interface in lesson player
  - Context-aware responses
  - Age-appropriate mode switching
  - Content safety guardrails
  - Rate limiting and caching

Week 21-22: AI Content Generator
  - Teacher tool: generate lessons from prompts
  - Generate quizzes from content
  - Generate explanations at different levels
  - Content review workflow

Week 23-24: Flutter Mobile App (MVP)
  - Auth (same Supabase backend)
  - Dashboard (continue learning, streak, XP)
  - Lesson player (text, video, quiz blocks)
  - Offline caching (download lessons)
  - Push notifications
```

**Deliverables**:
- AI tutor in every lesson
- AI content generation for teachers
- Flutter app on TestFlight/Play Console internal testing
- Offline lesson support

### Phase 4: Parent & Advanced (Weeks 25-30)

**Goal**: Parent dashboard, school features, platform maturity

```
Week 25-26: Parent Dashboard
  - Child linking (via email/code)
  - Performance overview
  - Screen time controls
  - Weekly email reports
  - Struggle alerts

Week 27-28: School Features
  - Classroom creation
  - Batch enrollment (CSV import)
  - Teacher-student assignment
  - School admin role
  - Basic white-label (custom domain/logo)

Week 29-30: Platform Hardening
  - Performance optimization (bundle, caching)
  - Security audit (penetration testing)
  - Accessibility audit (WCAG 2.1 AA)
  - Load testing (1000 concurrent users)
  - Documentation (API, user guides)
```

**Deliverables**:
- Parent dashboard live
- School onboarding flow
- White-label basics
- Performance targets met
- Accessibility compliance

### Phase 5: Scale & Marketplace (Weeks 31-36)

**Goal**: Full marketplace, advanced features, public launch

```
Week 31-32: Creator Marketplace
  - Course listing/browsing
  - Payment integration (Stripe)
  - Creator payouts
  - Reviews and ratings
  - Revenue dashboard

Week 33-34: Advanced Features
  - Full block library (flashcards, drag-drop, coding sandbox)
  - Advanced analytics (teacher + admin)
  - Certificate generation
  - Focus mode
  - Collaborative classrooms

Week 35-36: Public Launch
  - Marketing website
  - SEO optimization
  - App store submission (iOS + Android)
  - Press kit
  - Launch monitoring (Sentry, analytics)
```

**Deliverables**:
- Public platform launch
- Marketplace with 100+ courses
- Mobile apps on both stores
- Full block library (12+ types)

## Feature Priority Matrix

| Feature | Effort | Impact | Phase |
|---------|--------|--------|-------|
| Auth + User profiles | Low | Critical | 0 |
| Course/Lesson CRUD | Medium | Critical | 1 |
| Lesson player with blocks | High | Critical | 1 |
| Quiz system | Medium | Critical | 1 |
| Teacher dashboard | High | High | 1 |
| Admin page builder | High | High | 1.5 |
| Theme engine | Medium | High | 1.5 |
| Adaptive engine | High | High | 2 |
| Gamification | Medium | High | 2 |
| AI Tutor | High | Medium | 3 |
| AI Content Gen | Medium | Medium | 3 |
| Mobile app (Flutter) | High | High | 3 |
| Parent dashboard | Medium | High | 4 |
| School features | High | High | 4 |
| Creator marketplace | High | High | 5 |
| Analytics | Medium | Medium | 5 |

## Milestone Summary

```
Month 1  ██░░░░░░░░░░  Foundation complete
Month 2  ████░░░░░░░░  Core learning works
Month 3  ██████░░░░░░  Admin CMS ready
Month 4  ███████░░░░░  Adaptive + gamification
Month 5  ████████░░░░  AI integrated
Month 6  ██████████░░  Mobile MVP launched
Month 7  ███████████░  Parent + school features
Month 8  ████████████  Public launch + marketplace
```

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase scaling limits | Medium | High | Monitor usage, plan migration path to custom backend |
| AI costs too high | Medium | Medium | Caching, model tiering, prompt compression |
| Flutter app performance | Low | Medium | Early prototyping, device testing from week 1 |
| Low teacher adoption | Medium | High | Onboarding flow, template courses, AI-assisted creation |
| Browser compatibility | Low | Medium | Use well-supported features, progressive enhancement |
| Content moderation | Medium | High | AI pre-moderation + human review queue |
| Payment integration complexity | Medium | Medium | Start with single provider (Stripe), expand later |
