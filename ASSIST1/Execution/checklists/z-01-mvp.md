# Z-01 — MVP Checklist

## Progress

| Phase | Items | Done | Progress |
|-------|-------|------|----------|
| V1-0: Foundation | 6 | 0 | 0% |
| V1-1: Core Dashboard | 4 | 0 | 0% |
| V1-2: Social Connect | 6 | 0 | 0% |
| V1-3: Unified Posting | 8 | 0 | 0% |
| V1-4: AI Content Assistant | 7 | 0 | 0% |
| V1-5: Content Calendar | 3 | 0 | 0% |
| V1-6: Analytics | 4 | 0 | 0% |
| V1-7: Lead Inbox | 2 | 0 | 0% |
| **Total** | **40** | **0** | **0%** |

---

## V1-0: Foundation 🔲

> **Goal:** Set up project, auth, database, and base layout.
> **Duration:** 2-3 days

- [ ] Initialize Next.js project with App Router + TypeScript
- [ ] Configure Prisma with SQLite (dev) / PostgreSQL (prod)
- [ ] Set up authentication (NextAuth.js or Lucia) with email + OAuth
- [ ] Build base layout — sidebar navigation + top header
- [ ] Configure Tailwind CSS + theme system (dark/light)
- [ ] Create Prisma schema (User, Session, SocialAccount, Post, etc.)

---

## V1-1: Core Dashboard 🔲

> **Goal:** Build the main dashboard with overview stats and navigation.
> **Duration:** 2-3 days
> **Depends on:** V1-0

- [ ] Build sidebar navigation — Dashboard, Content, Calendar, Analytics, Leads, Campaigns, Settings
- [ ] Build dashboard header — user avatar, workspace switcher, notifications
- [ ] Build Quick Stats bar — followers, posts, engagement, leads
- [ ] Build Connected Accounts grid — show accounts with status, add connect button

---

## V1-2: Social Connect 🔲

> **Goal:** Implement OAuth connections for all 4 platforms.
> **Duration:** 4-5 days
> **Depends on:** V1-1

- [ ] Build OAuth callback handler — generic endpoint that works for all platforms
- [ ] Implement Instagram OAuth (Meta Graph API)
- [ ] Implement LinkedIn OAuth (Marketing API)
- [ ] Implement X/Twitter OAuth (API v2)
- [ ] Implement YouTube OAuth (Data API v3)
- [ ] Build Account management UI — list, disconnect, refresh tokens

---

## V1-3: Unified Posting 🔲

> **Goal:** Write once, publish to multiple platforms.
> **Duration:** 5-7 days
> **Depends on:** V1-2

- [ ] Build PostComposer — text editor with media upload
- [ ] Build platform selector — choose which accounts to post to
- [ ] Build platform preview tabs — Instagram/LinkedIn/X/YouTube previews
- [ ] Implement Instagram posting (carousel, single image, video)
- [ ] Implement LinkedIn posting (text + image)
- [ ] Implement X/Twitter posting (text + image)
- [ ] Implement YouTube posting (title, description, thumbnail)
- [ ] Build Post history list — all published/draft posts with status

---

## V1-4: AI Content Assistant 🔲

> **Goal:** Generate captions, hooks, hashtags, and ideas using AI.
> **Duration:** 4-5 days
> **Depends on:** V1-3

- [ ] Build AI generation API route — unified endpoint with OpenAI
- [ ] Build Caption generator UI — prompt → 3 variants → select
- [ ] Build Hook generator UI — hook types, multiple variants
- [ ] Build Hashtag generator UI — tiered by popularity, platform-aware
- [ ] Build Post idea generator — based on niche, content pillars
- [ ] Build CTA generator — various CTA types
- [ ] Build Brand Voice settings — tone, vocabulary, emoji/hashtag preference

---

## V1-5: Content Calendar 🔲

> **Goal:** Schedule and manage posts visually.
> **Duration:** 3-4 days
> **Depends on:** V1-3

- [ ] Build Calendar view — month/week/list layouts with scheduled posts
- [ ] Build Schedule dialog — date/time picker with timezone
- [ ] Build drag-and-drop reschedule — drag post to new time slot

---

## V1-6: Analytics 🔲

> **Goal:** Track views, engagement, growth across platforms.
> **Duration:** 5-7 days
> **Depends on:** V1-2 (data flowing)

- [ ] Build Analytics overview — metric cards + trend charts
- [ ] Build Account detail view — per-platform metrics with growth charts
- [ ] Build Post performance table — sortable, filterable, best/worst performers
- [ ] Build Analytics data collection cron — periodic snapshot worker

---

## V1-7: Lead Inbox 🔲

> **Goal:** Collect comments, DMs, and inquiries in one inbox.
> **Duration:** 4-5 days
> **Depends on:** V1-6

- [ ] Build Unified inbox — list + detail view with platform filter
- [ ] Build Lead management — status, tags, reply in-app
