# Phase 4: Parent Dashboard & School Features

> **Goal:** Parent monitoring, school management, platform hardening.

---

## Task 4.1 — Parent Dashboard Shell

```
Files to create:
  web/src/app/(parent)/layout.tsx
  web/src/app/(parent)/parent/page.tsx
  web/src/components/parent/shell.tsx
  web/src/components/parent/sidebar.tsx
  web/src/components/parent/children-overview.tsx
  web/src/hooks/useParentDashboard.ts
```

Parent nav: Overview, Children, Reports, Settings.
Child overview cards: name, age, grade, overall %, weekly time, on-track status.

**Write:** Parent sees all linked children with key metrics at a glance.
**Test:** Link child account → child card appears with progress data.

---

## Task 4.2 — Child Linking Flow

```
Files to create:
  web/src/app/(parent)/parent/children/page.tsx
  web/src/app/(parent)/parent/children/add/page.tsx
  web/src/components/parent/child-link-form.tsx
  web/src/components/parent/child-card.tsx
  web/src/app/api/parent/children/route.ts
  web/src/app/api/parent/link/route.ts
```

Methods to link child:
- Enter child's email → child gets approval request
- Enter invitation code generated from child's profile
- QR code scan (mobile)
- Existing parent-child from signup flow

```typescript
// Link flow
POST /api/parent/link
{ childEmail: string }  → sends approval request to child
{ childCode: string }   → immediate link via pre-generated code
```

**Write:** Parent can link children via email or code. Child approves the request.
**Test:** Generate link code from child account → parent enters code → children linked.

---

## Task 4.3 — Individual Child Report

```
Files to create:
  web/src/app/(parent)/parent/children/[childId]/page.tsx
  web/src/components/parent/child-report.tsx
  web/src/components/parent/performance-trend-chart.tsx
  web/src/components/parent/subject-breakdown.tsx
  web/src/components/parent/strengths-weaknesses.tsx
  web/src/components/parent/recommended-actions.tsx
```

Report sections:
- Performance trend (line chart, 7/30/90 day)
- Subject breakdown (Math 92%, English 78%, Science 88%)
- Strengths cards (highest scoring concepts)
- Areas needing improvement (lowest scoring, lessons behind)
- Recommended actions: "Review Fractions Lesson 2.3", "Try Vocab Builder"

**Write:** Parent sees detailed per-child report with trends, strengths, and action items.
**Test:** View child report → see Math 92% (strength), English 78% (improvement needed) → action recommendations.

---

## Task 4.4 — Screen Time Controls

```
Files to create:
  web/src/app/(parent)/parent/children/[childId]/screen-time/page.tsx
  web/src/components/parent/screen-time-controls.tsx
  web/src/components/parent/screen-time-usage.tsx
  web/src/components/parent/usage-history-chart.tsx
  web/src/app/api/parent/screen-time/route.ts
```

Controls:
| Setting | Options |
|---------|---------|
| Daily time limit | Slider 30-180 min |
| Curfew | Time range (e.g., 8PM-7AM) |
| Weekend limit | Slider 60-240 min |
| Focus hours | Time range (no games/messaging) |

The app enforces these via: session timeout, lock screen, notification.

**Write:** Parent sets limits → student app enforces them → usage history tracked.
**Test:** Set 30 min daily limit → student uses 30 min → lesson player locks.

---

## Task 4.5 — Parent Notifications & Alerts

```
Files to create:
  web/src/app/api/parent/alerts/route.ts
  web/src/lib/parent/alert-service.ts
  web/src/components/parent/alert-banner.tsx
  web/src/components/parent/notification-preferences.tsx
```

Alert types:
| Alert | Trigger | Channel |
|-------|---------|---------|
| Milestone | Child completes course | Push, Email |
| Struggling | Score < 60% on 3+ quizzes | Push, Email, SMS |
| Falling Behind | No activity for 3+ days | Email, SMS |
| Screen Time | Approaching daily limit | Push |
| Weekly Report | Every Sunday | Email |
| Achievement | Rare badge earned | Push |

**Write:** Alerts fire based on triggers. Parent configures channels per alert type.
**Test:** Score < 60% on 3 quizzes → parent receives notification.

---

## Task 4.6 — Weekly Email Reports

```
Files to create:
  web/src/lib/parent/weekly-report.ts
  web/src/app/api/cron/weekly-report/route.ts
```

Report contents:
- Weekly summary: time spent, lessons completed, quizzes passed
- Subject breakdown with change vs. last week
- Streak status
- New achievements
- Recommended actions for upcoming week
- HTML email template with inline styles

**Write:** Scheduled job generates + sends weekly report every Sunday.
**Test:** Run cron job → parent receives formatted email with child's weekly data.

---

## Task 4.7 — Classroom Creation (Schools)

```
Files to create:
  web/supabase/migrations/009_schools.sql
  web/src/app/api/schools/classrooms/route.ts
  web/src/components/teacher/classroom-manager.tsx
  web/src/components/teacher/classroom-create-form.tsx
```

Tables:
- `classrooms` (id, name, school_id, teacher_id, grade, subject, enrollment_code)
- `classroom_students` (classroom_id, student_id, enrolled_at)

Features:
- Teacher creates classroom → gets unique enrollment code
- Students join via code or email invite
- Teacher sees classroom-specific analytics
- Batch enroll from CSV

**Write:** Teacher creates classroom → shares code → students join → linked to course enrollments.
**Test:** Create classroom → code generated → student enters code → added to classroom.

---

## Task 4.8 — Batch Enrollment (CSV Import)

```
Files to create:
  web/src/app/api/schools/batch-enroll/route.ts
  web/src/components/teacher/csv-uploader.tsx
  web/src/lib/schools/csv-parser.ts
```

```typescript
// CSV format: email, name, grade
async function batchEnroll(classroomId: string, csvFile: File) {
  const students = parseCSV(csvFile);
  const results = [];
  for (const student of students) {
    const user = await findOrCreateUser(student.email, student.name);
    const enrollment = await enrollInCourse(user.id, courseId);
    results.push(enrollment);
  }
  return { success: results.filter(r => r.ok).length, errors: results.filter(r => !r.ok) };
}
```

**Write:** Teacher uploads CSV → students auto-created and enrolled.
**Test:** Upload CSV with 10 students → all appear in classroom roster.

---

## Task 4.9 — School Admin Role

```
Files to create:
  web/src/hooks/useSchoolAdmin.ts
  web/src/components/teacher/school-admin-panel.tsx
  web/src/app/api/schools/teachers/route.ts
  web/src/app/api/schools/analytics/route.ts
```

School admin can:
- Manage teachers (add/remove from school)
- View all classrooms in school
- School-wide analytics (enrollments, completion rates, avg scores)
- Create school-branded themes
- Custom subdomain

**Write:** School admin has oversight of all teachers and students in their school.
**Test:** School admin sees all classrooms → filters by teacher → sees aggregated analytics.

---

## Task 4.10 — White-Label Basics

```
Files to create:
  web/src/lib/white-label/custom-domain.ts
  web/src/app/api/settings/branding/route.ts
```

White-label features:
- Custom domain (CNAME to platform)
- Custom logo (in header, email, login)
- Custom colors (overrides theme primary)
- Custom footer links
- Remove "Powered by NEOT" branding

**Write:** School with white-label sees custom branding across all touchpoints.
**Test:** Set custom logo + domain → login page shows custom logo on custom domain.

---

## Task 4.11 — Performance Optimization Audit

```
Files to investigate and improve:
  web/next.config.js               ← Image optimization, compression
  web/src/app/layout.tsx            ← Font loading strategy
  web/src/app/globals.css           ← Critical CSS inlining
  web/src/middleware.ts             ← Edge runtime for faster auth
```

Check each item:
- [ ] Bundle size per route < 100KB gzipped
- [ ] FCP < 1.5s, LCP < 2.5s, TTI < 3s
- [ ] Image optimization (WebP, responsive sizes)
- [ ] Font display swap
- [ ] Dynamic imports for heavy components (AI, animations)
- [ ] Route prefetching on hover
- [ ] Lighthouse score > 90

**Write:** Performance budget enforced. Lighthouse CI runs on every PR.
**Test:** Lighthouse CI passes > 90 on all categories.

---

## Task 4.12 — Security Audit

```
Files to review:
  web/src/middleware.ts             ← CSP headers
  web/next.config.js                ← CORS configuration
  web/supabase/migrations/          ← RLS policies on all tables
  web/.env.local.example           ← Confirm no secrets
```

Checklist:
- [ ] HTTPS everywhere
- [ ] RLS on all tables (verified with test queries)
- [ ] JWT auth with proper expiry
- [ ] Rate limiting on API routes
- [ ] CSP headers set (XSS prevention)
- [ ] CORS restricted to own domains
- [ ] SQL injection protection (parameterized queries)
- [ ] CSRF protection
- [ ] No secrets in client-side code
- [ ] Input validation (Zod schemas on all API routes)

**Write:** Security scan passes. All RLS policies verified.
**Test:** Attempt direct DB query from client → blocked by RLS. Attempt SQL injection → sanitized.

---

## Task 4.13 — Accessibility Audit

```
Files to review: All UI components
```

Checklist (WCAG 2.1 AA):
- [ ] Color contrast ratio > 4.5:1
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Screen reader friendly
- [ ] `prefers-reduced-motion` respected
- [ ] Error messages associated with inputs

**Write:** Axe DevTools passes without violations.
**Test:** Tab through entire lesson player → all elements reachable and visible.

---

## Task 4.14 — Load Testing

```
Files to create:
  web/__tests__/load/              ← k6 or artillery scripts
```

Test scenarios:
- 100 concurrent users browsing courses
- 50 concurrent users taking quizzes
- 20 concurrent AI tutor requests
- API response times under 500ms at 90th percentile

**Write:** Load test scripts ready. Performance baseline established.
**Test:** 100 concurrent users → p95 response time < 500ms.

---

## Phase 4 Validation Gate

- [ ] Parent sees linked children with progress
- [ ] Child linking via email/code works
- [ ] Per-child detailed reports with charts
- [ ] Screen time controls enforced
- [ ] Parent notifications/email reports working
- [ ] Classrooms with enrollment codes work
- [ ] CSV batch enrollment works
- [ ] School admin role with analytics
- [ ] White-label branding (logo, domain)
- [ ] Lighthouse score > 90
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] Load tested with 100 concurrent users

> **Phase 4 Complete** ✅ → Move to `07-phase-5-scale-marketplace.md`
