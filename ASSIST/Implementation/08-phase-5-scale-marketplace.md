# Phase 5: Scale & Marketplace

> **Goal:** Full marketplace, all block types, public launch readiness.

---

## Task 5.1 — Creator Marketplace Framework

```
Files to create:
  web/prisma/schema.prisma             ← Add marketplace models
  web/src/app/api/marketplace/courses/route.ts
  web/src/app/api/marketplace/categories/route.ts
  web/src/app/api/marketplace/search/route.ts
  web/src/lib/marketplace/listing-service.ts
```

Tables (add to Prisma schema):
- `marketplace_courses` (course_id, price, status, featured_until, revenue_share)
- `marketplace_reviews` (course_id, user_id, rating, review, created_at)
- `marketplace_payouts` (teacher_id, amount, status, period)

Marketplace statuses: draft, pending_review, published, rejected, archived.

**Write:** Teachers can list courses on marketplace with price and categories.
**Test:** Teacher publishes course → sets price $9.99 → appears in marketplace listing.

---

## Task 5.2 — Course Discovery & Search

```
Files to create:
  web/src/app/marketplace/page.tsx
  web/src/app/marketplace/categories/[slug]/page.tsx
  web/src/app/marketplace/search/page.tsx
  web/src/components/marketplace/marketplace-header.tsx
  web/src/components/marketplace/marketplace-card.tsx
  web/src/components/marketplace/marketplace-filters.tsx
  web/src/components/marketplace/search-bar.tsx
  web/src/components/marketplace/pagination.tsx
  web/src/hooks/useMarketplace.ts
```

Search features:
- Full-text search (title, description, tags)
- Filters: category, difficulty, price range, rating, age group
- Sort: relevance, price low-high, rating, newest, most popular
- Paginated results with infinite scroll option

**Write:** Marketplace page with search, filters, sort, pagination.
**Test:** Search "Algebra" → filter by price < $10 → sort by rating → results display correctly.

---

## Task 5.3 — Payment Integration (Stripe)

```
Files to create:
  web/src/lib/payments/stripe-client.ts
  web/src/lib/payments/stripe-webhooks.ts
  web/src/app/api/payments/create-checkout/route.ts
  web/src/app/api/payments/webhook/route.ts
  web/src/app/api/payments/subscription/route.ts
  web/src/components/marketplace/purchase-button.tsx
  web/src/hooks/usePayment.ts
```

Flow:
1. Student clicks "Buy Course" → `POST /api/payments/create-checkout`
2. Creates Stripe Checkout Session → redirects to Stripe
3. Student completes payment → Stripe webhook fires
4. Webhook creates purchase record → enrolls student → sends receipt email
5. Redirect back to course page

```typescript
interface Purchase {
  studentId: string;
  courseId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  stripeSessionId: string;
  createdAt: Date;
}
```

Subscription plans also via Stripe (Pro, Family, School).
Regional payment providers: Razorpay (India), Mercado Pago (LATAM).

**Write:** Student purchases course → Stripe Checkout → enrolled on success.
**Test:** Buy course → redirect to Stripe → complete payment → enrolled → receipt emailed.

---

## Task 5.4 — Creator Payouts

```
Files to create:
  web/src/app/api/marketplace/payouts/route.ts
  web/src/app/(teacher)/teacher/revenue/page.tsx
  web/src/components/teacher/revenue/revenue-dashboard.tsx
  web/src/components/teacher/revenue/payout-history.tsx
  web/src/components/teacher/revenue/tax-info-form.tsx
```

Teacher revenue dashboard:
- Total earnings, this month, pending payout
- Sales by course (units × price)
- Payout history with status
- Tax information form (W-9/W-8BEN)
- Connect Stripe account link

Revenue share:
- Free teacher: 80% (20% platform fee)
- Pro teacher ($19.99/mo): 90% (10% platform fee)
- Premium creator ($49.99/mo): 95% (5% platform fee)

**Write:** Teacher sees revenue dashboard with earnings, sales breakdown, payouts.
**Test:** Student buys course → teacher dashboard shows +$7.99 pending payout.

---

## Task 5.5 — Reviews & Ratings

```
Files to create:
  web/src/components/marketplace/review-form.tsx
  web/src/components/marketplace/review-list.tsx
  web/src/components/marketplace/review-summary.tsx
  web/src/app/api/marketplace/courses/[id]/reviews/route.ts
```

Features:
- Star rating (1-5)
- Written review (optional, min 10 chars)
- Verified purchase badge
- Sort by most helpful, recent, highest/lowest
- Teacher can respond to reviews
- Review helpfulness voting

**Write:** Student can rate and review purchased courses. Ratings aggregated and displayed.
**Test:** Purchase course → leave 4-star review → review appears with "Verified Purchase" badge.

---

## Task 5.6 — Full Block Library

```
Files to create:
  web/src/components/blocks/flashcard-block.tsx
  web/src/components/blocks/drag-drop-block.tsx
  web/src/components/blocks/code-sandbox-block.tsx
  web/src/components/blocks/story-block.tsx
  web/src/components/blocks/audio-block.tsx
  web/src/components/blocks/drawing-canvas-block.tsx
  web/src/components/blocks/memory-game-block.tsx
  web/src/components/blocks/poll-block.tsx
  web/src/components/blocks/embed-block.tsx
  web/src/components/teacher/block-editors/flashcard-editor.tsx
  web/src/components/teacher/block-editors/drag-drop-editor.tsx
  web/src/components/teacher/block-editors/code-editor.tsx
  web/src/components/teacher/block-editors/story-editor.tsx
  web/src/components/teacher/block-editors/audio-editor.tsx
  web/src/components/teacher/block-editors/drawing-editor.tsx
  web/src/components/teacher/block-editors/memory-game-editor.tsx
  web/src/components/teacher/block-editors/poll-editor.tsx
  web/src/components/teacher/block-editors/embed-editor.tsx
```

| Block | Description | Interaction |
|-------|-------------|-------------|
| Flashcards | Swipeable card deck | Flip animation, spaced repetition |
| Drag-Drop | Arrange/match items | Touch-friendly drag mechanics |
| Code Sandbox | Code editor + preview | Run, test, submit |
| Story Mode | Branching narrative | Choose-your-own-adventure |
| Audio | Podcast/lecture | Playback speed, bookmarks |
| Drawing Canvas | Draw, sketch, write | Tools, colors, layers |
| Memory Game | Match pairs | Timer, score, levels |
| Poll | Class/group poll | Vote, see results |
| Embed | External content | Iframe, oEmbed |

**Write:** All 12+ block types available in lesson builder and render correctly in player.
**Test:** Create lesson with flashcards → student views and flips through deck.

---

## Task 5.7 — Certificates

```
Files to create:
  web/src/lib/certificates/certificate-generator.ts
  web/src/app/api/certificates/generate/route.ts
  web/src/app/api/certificates/[id]/route.ts
  web/src/components/courses/certificate-display.tsx
```

On course completion:
1. Generate certificate PDF with student name, course name, date, completion score
2. Unique certificate ID for verification
3. Store in filesystem/S3 (via Media model)
4. Email to student
5. Shareable link
6. Printable version

**Write:** Student completes course → certificate generated → downloadable + shareable.
**Test:** Complete all lessons + pass all quizzes → "Get Certificate" button → PDF downloads.

---

## Task 5.8 — Focus Mode

```
Files to create:
  web/src/components/player/focus-mode.tsx
  web/src/hooks/useFocusMode.ts
```

Features:
- Full-screen lesson player (hides nav, sidebar, notifications)
- Pomodoro timer (25 min study / 5 min break)
- Ambient sounds (rain, forest, white noise)
- Distraction-free reading layout

**Write:** Student toggles focus mode → player goes full-screen with timer and ambient sound options.
**Test:** Toggle focus mode → nav hidden → timer starts → break notification at 25 min.

---

## Task 5.9 — Collaborative Classrooms

```
Files to create:
  web/src/app/api/classrooms/collaboration/route.ts
  web/src/components/teacher/live-activity-feed.tsx
  web/src/components/teacher/collaborative-whiteboard.tsx
  web/src/hooks/useRealtimeClassroom.ts
```

Real-time features via Supabase Realtime:
- Teacher sees students' live progress during lesson
- Students can see who's online in same classroom
- Teacher can broadcast messages/announcements
- Collaborative whiteboard (basic drawing + text)
- Shared quiz leaderboard

**Write:** Teacher sees live student activity during class session.
**Test:** Teacher opens classroom dashboard → sees student progress updating in real-time.

---

## Task 5.10 — Advanced Admin Analytics

```
Files to create:
  web/src/app/(admin)/admin/analytics/page.tsx
  web/src/components/admin/analytics/revenue-charts.tsx
  web/src/components/admin/analytics/user-growth.tsx
  web/src/components/admin/analytics/course-performance.tsx
  web/src/components/admin/analytics/retention-cohorts.tsx
  web/src/components/admin/analytics/geo-distribution.tsx
  web/src/components/admin/analytics/conversion-funnel.tsx
```

Metrics:
- DAU/MAU with growth trend
- MRR/ARR, subscription stats
- Top courses by enrollment/revenue
- User retention cohorts (weekly/monthly)
- Conversion funnel: Visit → Signup → First Lesson → Paid
- Geo distribution (country heatmap)
- Device breakdown (web vs mobile vs tablet)
- Server health (API latency, error rates)

**Write:** Admin analytics dashboard with all key metrics visualized.
**Test:** Mock data shows charts → revenue chart reflects Stripe data.

---

## Task 5.11 — Marketing Website

```
Files to create/update:
  web/src/app/page.tsx             ← Full marketing homepage
  web/src/app/about/page.tsx
  web/src/app/pricing/page.tsx
  web/src/app/contact/page.tsx
  web/src/app/features/page.tsx
  web/src/app/for-schools/page.tsx
  web/src/app/for-teachers/page.tsx
  web/src/app/blog/page.tsx
```

Marketing site sections (using page builder from Phase 1.5):
- Hero with platform demo animation
- Feature highlights (adaptive, no-code, lightweight, gamified)
- Testimonials from beta users
- Pricing tables (Free, Pro, Family, School)
- FAQ section
- Blog preview with latest posts
- Footer with links, social proof

**Write:** Marketing website communicates all value propositions clearly. SEO-optimized.
**Test:** Lighthouse SEO score > 90. Google Search preview renders correctly.

---

## Task 5.12 — SEO Optimization

```
Files to update:
  web/src/app/layout.tsx           ← Meta tags, structured data
  web/src/app/sitemap.ts           ← Dynamic sitemap generation
  web/src/app/robots.ts            ← Robots.txt
  web/next.config.js               ← OpenGraph image generation
```

SEO checklist:
- [ ] Semantic HTML (h1-h6, article, section, nav)
- [ ] Meta descriptions on all pages
- [ ] OpenGraph tags (title, description, image, type)
- [ ] Twitter card tags
- [ ] JSON-LD structured data (Course, Organization, FAQ)
- [ ] Dynamic sitemap (includes all courses, categories, blog)
- [ ] robots.txt with proper crawl directives
- [ ] Canonical URLs
- [ ] SSR for all marketing pages
- [ ] Breadcrumb navigation

**Write:** All pages have proper meta tags, structured data, sitemap.
**Test:** Google Rich Results Test → all structured data valid.

---

## Task 5.13 — Mobile App Store Submission

```
Files to prepare:
  mobile/android/app/src/main/play/
  mobile/ios/Runner/
  mobile/fastlane/
```

Steps:
- Android: Generate signed bundle, create Play Console listing (screenshots, description, privacy policy)
- iOS: Create App Store Connect listing, prepare for TestFlight
- Privacy policy: COPPA compliance, data handling, parental consent
- App assets: icon (all sizes), screenshots (all devices), feature graphic
- Fastlane: automate screenshots, metadata upload

**Write:** Mobile app builds ready for store submission. TestFlight build available.
**Test:** Internal testing via TestFlight → full app flow works on device.

---

## Task 5.14 — Launch Readiness

```
Files to create:
  web/src/app/press/page.tsx
  web/__tests__/e2e/              ← Full user journey tests
  .github/workflows/e2e.yml       ← E2E test CI
```

Pre-launch checklist:
- [ ] E2E tests for critical paths (signup → course → quiz → payment)
- [ ] Error monitoring (Sentry) configured and tested
- [ ] Performance monitoring (Vercel Analytics + PostHog)
- [ ] Uptime monitoring (Better Stack)
- [ ] Backup strategy verified (Supabase daily + manual)
- [ ] Customer support channel (email/intercom)
- [ ] Documentation: API docs, user guides, admin guides
- [ ] Press kit: logo, screenshots, team photos, company description
- [ ] Terms of Service, Privacy Policy, COPPA compliance docs
- [ ] Incident response plan

**Write:** Platform is launch-ready. Monitoring, backups, docs all in place.
**Test:** E2E test passes for full purchase flow. Sentry captures a test error.

---

## Phase 5 Validation Gate

- [ ] Creator marketplace with search, filters, purchase
- [ ] Stripe payments working (checkout, webhooks, receipts)
- [ ] Creator payouts dashboard functional
- [ ] Reviews & ratings system complete
- [ ] All 12+ block types implemented and rendering
- [ ] Certificate generation + download works
- [ ] Focus mode with timer + ambient sounds
- [ ] Collaborative classroom with real-time progress
- [ ] Advanced admin analytics with all charts
- [ ] Marketing website fully built and SEO-optimized
- [ ] Mobile apps submitted to stores
- [ ] E2E tests cover critical user journeys
- [ ] Monitoring and alerting configured
- [ ] Documentation and legal docs complete

> **Phase 5 Complete** ✅ — Platform ready for public launch.
