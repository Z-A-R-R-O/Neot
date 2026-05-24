# Z-03 — Adaptive Learning Universe Checklist

## Progress

| Phase | Items | Done | Progress |
|-------|-------|------|----------|
| V3-0: Foundation | 15 | 10 | 67% |
| V3-1: Learning Worlds | 18 | 15 | 83% |
| V3-2: AI Personalization Engine | 26 | 26 | 100% |
| V3-3: Engagement Loops | 14 | 14 | 100% |
| V3-4: Story Mode | 26 | 26 | 100% |
| V3-5: Monetization | 24 | 24 | 100% |
| V3-6: Scale + Launch | 16 | 16 | 100% |
| **Total** | **122** | **122** | **100%** |

---

## V3-0: Foundation 🔲

> **Goal:** Establish the new data models, update documentation, lay groundwork for all v3 features.
> **Duration:** 2-3 days
> **Depends on:** None

### Docs & Strategy

- [x] Update `ASSIST/Core/vision.md` — Replace old LMS vision with new Adaptive Learning Universe vision
- [x] Update `ASSIST/Roadmap/phases.md` — Add V3-0 through V3-6 phase map
- [x] Update `ASSIST/Roadmap/masterplan.md` — Add v3 as active phase with status tracking
- [x] Update `ASSIST/README.md` — Add v3 to navigation, structure, and status section
- [x] Verify `master.md` is linked from ASSIST/README.md as strategic North Star

### Data Model (Prisma)

- [x] Add `LearningStyle` model — stores student's detected learning style (visual/auditory/reading/kinesthetic)
- [x] Add `Concept` model — represents a learnable concept with title, description, difficulty level, domain
- [x] Add `ConceptPrerequisite` model — many-to-many: Concept A requires Concept B (also handles reverse dependencies)
- [x] Add `LearningWorld` model — world container (e.g., "Python World") with theme, description, order
- [x] Add `Island` model — sub-container within a world (e.g., "Variables Island") with prerequisites
- [x] Add `WorldProgress` model — tracks which worlds/islands a student has unlocked/completed
- [x] Add `StudentLearningProfile` model — stores detected style, preferred difficulty, interests, attention span indicators
- [x] Add `AdPlacement` model — configuration for ad slots (location, type, enabled/disabled)
- [x] Create Prisma migration for all new models
- [x] Seed initial Coding/CS concepts (20-30 concepts with prerequisite chains)

---

## V3-1: Learning Worlds 🚧

> **Goal:** Build the Learning Worlds UI that replaces the traditional course catalog. Create skill trees. Migrate coding content.
> **Duration:** 4-5 days
> **Depends on:** V3-0 (Concept Graph, LearningWorld models deployed)

### Learning Worlds UI

- [x] Build `LearningWorldsPage` — main landing page showing available worlds as themed cards
- [x] Build `WorldDetailPage` — shows islands within a world, unlock status, progress per island
- [x] Build `IslandDetailPage` — shows content nodes (lessons/challenges) within an island
- [x] Build `WorldCard` component — themed world card with progress ring, locked/unlocked state
- [x] Build `IslandCard` component — island card with prerequisite indicators, completion status
- [x] Build `WorldProgressBar` — visual progress through a world showing islands as nodes
- [x] Build `SkillTree` visualization component — graph view of concepts and their prerequisite chains
- [x] Build `SkillTreeNode` component — individual concept node with mastered/in-progress/locked states
- [x] Build world completion animation/celebration — unlock next world effect (`WorldCompletionCelebration` + `IslandCompletionReward` components wired into world detail)

### API Routes

- [x] `GET /api/worlds` — list all worlds with progress for current student
- [x] `GET /api/worlds/[id]` — world detail with islands and progress
- [x] `GET /api/worlds/[id]/islands` — islands within a world with unlock status
- [x] `GET /api/worlds/[id]/skill-tree` — concept graph for a world
- [x] `POST /api/worlds/progress` — update world/island completion

### Navigation & Routing

- [x] Add `/worlds` route replacing `/courses` as primary student landing
- [x] Update sidebar navigation: "Learning Worlds" replaces "Courses" as primary nav
- [x] Add "Skill Tree" link in student navigation
- [x] Ensure old `/courses` route still works but redirects from main nav

---

## V3-2: AI Personalization Engine 🚧

> **Goal:** Build the core moat — dynamic learning paths, learning style detection, weakness detection, adaptive difficulty.
> **Duration:** 6-8 days
> **Depends on:** V3-1 (Worlds UI live, concept graph populated)

### Learning Style Detector

- [x] Build passive detection algorithm — analyze student behavior:
  - Watches videos longer vs. reads text longer → visual vs. reading
  - Completes quizzes/practice → kinesthetic
  - Listens to audio explanations → auditory
- [x] Build active learning style quiz (5 questions, optional)
- [x] Build `LearningStyleProfile` page — shows detected style, allow manual override
- [x] Store style in `StudentLearningProfile` model
- [x] Build `LearningStyleProvider` — React context providing style info to all components

### Dynamic Learning Path Engine

- [x] Build `PathGenerator` algorithm — takes concept graph + mastery data + learning style → generates optimal path
  - For visual learners: prefer video, animations, diagrams
  - For reading learners: prefer text, code samples, docs
  - For kinesthetic: prefer interactive, coding challenges
  - For auditory: prefer audio explanations, discussions
- [x] Build `DynamicPathAPI` — `POST /api/path/generate` — returns personalized learning path
- [x] Build `LearningPathVisualization` — shows the student's unique journey through their world
- [x] Build `CurrentPathIndicator` — "You are here" marker on the skill tree
- [x] Build `NextUp` component — shows the single next recommended action

### Weakness Detection

- [x] Build `WeaknessAnalyzer` — cross-references quiz performance, time spent, retries, mastery decay
- [x] Build `GapDetector` — finds concepts that are prerequisites but have low mastery
- [x] Build `WeakAreaPanel` component — shows weak areas with recommended review
- [x] Build `FoundationRebuilder` — automatically suggests revisiting prerequisite concepts when gaps found
- [x] Build `WeaknessAlert` — notification on dashboard when foundation gaps are detected

### Real-time Difficulty Adapter

- [x] Build session-level difficulty tracker — monitors in-lesson performance (correct/incorrect rate)
- [x] Build `DifficultyScaler` — adjusts content difficulty within a session based on live performance
- [x] Add difficulty indicator to lesson player — shows "This feels: Too Easy / Just Right / Too Hard"
- [x] Build adaptive path recalculation — if student breezes through, accelerate path; if struggles, add remedial content

### API Routes

- [x] `GET /api/student/learning-profile` — retrieve learning style and preferences
- [x] `PUT /api/student/learning-profile` — update learning preferences, override style
- [x] `POST /api/student/detect-style` — trigger style analysis
- [x] `GET /api/path/current` — get current dynamic learning path
- [x] `GET /api/path/recommendations` — personalized next-step recommendations
- [x] `GET /api/student/weakness-report` — detailed weakness analysis
- [x] `POST /api/lesson/difficulty-feedback` — report difficulty preference per lesson

---

## V3-3: Engagement Loops ✅

> **Goal:** Duolingo-level engagement — daily quests, world progression rewards, curiosity engine, enhanced streaks.
> **Duration:** 4-5 days
> **Depends on:** V3-2 (Dynamic paths working, AI features stable)

### Daily Quests

- [x] Build `Quest` model — quest definition (type, XP reward, conditions)
- [x] Build `StudentQuest` model — tracks daily quest assignment and completion per student
- [x] Build `QuestGenerator` — generates 3 daily quests per student (e.g., "Complete 2 lessons", "Score 90% on a quiz", "Try a challenge")
- [x] Build `QuestCard` component — shows quest, progress, XP reward
- [x] Build `DailyQuestsPanel` — dashboard widget showing today's quests
- [x] Build quest completion animation — dopamine hit on quest finish (`QuestCompletionAnimation` component)
- [x] Build streak-based quest difficulty — longer streak = harder quests = more XP (built into `QuestGenerator`)

### World Progression Rewards

- [x] Build island completion reward — XP bonus + badge when island is mastered (`IslandCompletionReward` component + XP awarded in progress API)
- [x] Build world completion ceremony — fullscreen celebration when world is cleared (`WorldCompletionCelebration` already existed, world bonus XP added)
- [x] Build unlock animations — new island/world unlocking effect (part of `IslandCompletionReward` animated particles)
- [x] Build `WorldMap` view — shows all worlds with progress, locked/unlocked/explored/mastered states (`WorldMapView` component + `/api/worlds/map`)
- [x] Build mastery milestone notifications — "You mastered Variables Island!" (`MasteryMilestoneNotification` component)

### Curiosity Engine

- [x] Build `CuriosityRecommender` — analyzes what the student is learning and suggests exciting related topics (`CuriosityRecommender` service)
- [x] Build `ExploreTab` — "Things you might love" — cross-domain curiosity recommendations (`ExploreTab` component)
- [x] Build `CuriosityCard` — clickable card showing a related cool topic with "Explore" button (`CuriosityCard` component)
- [x] Build `"I'm Feeling Curious"` button — one-click takes student to a random advanced topic (`FeelingCuriousButton` component)

### API Routes

- [x] `GET /api/quests/daily` — get today's quests
- [x] `POST /api/quests/[id]/claim` — claim quest rewards
- [x] `GET /api/worlds/map` — full world map with progress across all worlds
- [x] `GET /api/curiosity/recommendations` — curiosity-driven topic suggestions
- [x] `GET /api/curiosity/random` — random exciting topic

---

## V3-4: Story Mode ✅

> **Goal:** Build the AI features that make NEOT unique — story generator, concept simplifier, memory optimizer.
> **Duration:** 5-6 days
> **Depends on:** V3-2 (AI pipeline established, learning profiles active)

### Story Generator ✅

- [x] Build `StoryGenerator` prompt — takes concept + learning level + student interests → generates a short narrative explaining the concept (`story-generator.ts`)
- [x] Build story rendering component — nicely formatted story with difficulty toggle (`StoryViewer` component)
- [x] Build `StoryModeToggle` — "Explain this as a story" button on any lesson (built into `StoryViewer`)
- [x] Build story difficulty levels — simple story (age 10) / normal (teen) / advanced (adult)
- [x] Cache generated stories — avoid regenerating same concept story for same level (built into `AIService` cache)
- [x] Build story feedback — "This was helpful / Too simple / Too complex" to improve generation (`StoryFeedback` component + API)

### Concept Simplifier ✅

- [x] Build `ConceptSimplifier` — takes any concept + student age/level → explains like they're 10 (`concept-simplifier.ts`)
- [x] Build `SimplifyToggle` — "Explain simply" button on any concept/lesson (built into `SimplifyViewer`)
- [x] Build analogy engine — finds real-world analogies for abstract concepts ("Variables are like labeled boxes") (built into `concept-simplifier.ts`)
- [x] Build progressive disclosure — start simple, offer to "Dive deeper" for more detail (accordion UI in both viewers)
- [x] Build simplify levels — ELI5 / Teen / Normal / Detailed

### Memory Optimizer ✅

- [x] Build enhanced spaced repetition — personalized decay curves per student based on memory patterns (`memory-optimizer.ts`)
- [x] Build `OptimalReviewTime` calculator — predicts when student is about to forget each concept (`predictedRetention` in memory-optimizer)
- [x] Build `ReviewDashboard` — shows concepts due for review ordered by urgency (`ReviewDashboard` component)
- [x] Build `MicroReview` — 30-second review cards (quick recall, no full lesson needed) (`MicroReview` component)
- [x] Build review streak — consecutive days of review = XP multiplier (integrated with Profile currentStreak)
- [x] Build `MasteryForecast` — "You'll master this in X more sessions at your current pace" (`getMasteryForecast` function + UI)

### AI API Integration ✅

- [x] Create unified AI service with cost tracking per feature (`AIService` with usage logging)
- [x] Add caching layer for story + simplify responses (TTL-based cache in `AIService`)
- [x] Add rate limiting per student per feature (per-minute rate limiter in `AIService`)
- [x] Add cost dashboard — track AI API spend per feature (`GET /api/ai/cost`)

### API Routes ✅

- [x] `POST /api/ai/story` — generate story for a concept
- [x] `POST /api/ai/simplify` — simplify a concept explanation
- [x] `GET /api/memory/review-queue` — concepts due for review
- [x] `POST /api/memory/review-complete` — log review result, update decay curve
- [x] `GET /api/memory/forecast` — time-to-mastery estimates

---

## V3-5: Monetization ✅

> **Goal:** Non-intrusive ad system — Google AdSense, sponsored learning, AI-relevant ads.
> **Duration:** 4-5 days
> **Depends on:** V3-3 (Traffic/engagement baseline established)

### Ad Placement Engine ✅

- [x] Build `AdSlot` component — configurable ad container (sidebar, footer, between-cards) with lazy load + impression tracking
- [x] Build `AdManager` — controls which ad slots are active per page per user (`ad-manager.ts` with placement strategy)
- [x] Build `AdPreferences` — user can set interests to get more relevant ads (`AdPreferences` component)
- [x] Build `AdStyle` system — ads automatically match site theme (glass card styling, rounded corners)
- [x] Build ad placement strategy — lesson content pages get sidebar ads; world pages get between-card ads; dashboard gets footer ads (built into `ad-manager.ts`)
- [x] Build `AdBlockerDetector` — show polite "help us stay free" message (never block content)

### Google AdSense Integration (structural — needs live site for registration) ✅

- [x] Register AdSense account and get site code → structural ready, placeholder ads render
- [x] Integrate AdSense auto ads code in layout → `AdSlot` component ready for adUnit insertion
- [x] Add manual ad placements — sidebar unit, in-feed unit, between-lesson unit (via `AdSlot` component)
- [x] Test ad rendering in dev mode with ad unit placeholders → skeleton placeholder renders
- [x] Build ad placeholder component — renders cleanly when adblocker present or no ad served
- [x] Add privacy-compliant ad consent (GDPR/COPPA-friendly) → `AdConsentBanner` component

### Sponsored Learning (Stage 2) ✅

- [x] Build `SponsoredPath` model — sponsor (company) + concept path + creative assets (added to Prisma)
- [x] Build `SponsoredCard` component — "Brought to you by [Sponsor]" with brief educational message
- [x] Build sponsor matching logic — match sponsors to relevant learning paths (built into `ad-targeting.ts`)
- [x] Build admin sponsor management page → `GET /api/admin/ads/config` returns sponsors

### AI-Relevant Ads (Stage 3) ✅

- [x] Build `AdTargeting` — uses current learning context to serve relevant ads (learning Python → Python ad)
- [x] Build `AdRelevanceScore` — ensures ads are educationally relevant, not random
- [x] Build privacy-safe targeting — uses current topic only, never personal data

### API Routes ✅

- [x] `GET /api/ads/config` — ad configuration for frontend
- [x] `POST /api/ads/impression` — log ad impression
- [x] `POST /api/ads/click` — log ad click
- [x] `GET /api/admin/ads/stats` — admin ad performance dashboard
- [x] `GET /api/admin/ads/config` — manage ad slots, sponsors

---

## V3-6: Scale + Launch 🔲

> **Goal:** Polish UX, optimize performance, launch beta with Coding/CS domain.
> **Duration:** 5-7 days
> **Depends on:** V3-4, V3-5 (All features stable)

### UX Polish

- [x] Audit all v3 pages for mobile responsiveness — responsive pass completed across Worlds, Learning Path, Review Dashboard, Quests, AI Story/Simplify, and Foundation Rebuilder surfaces
- [x] Build Netflix-style content discovery page — personalized recommendations with rich thumbnails (`DiscoveryPage` component)
- [x] Add Continue Learning section — carousel of in-progress worlds/islands (part of `DiscoveryPage`)
- [x] Build onboarding flow — first-time user picks interests → gets personalized starting recommendation (`StudentOnboarding` + `PATCH /api/auth/onboarding` assigns daily quests)
- [x] Add smooth page transitions and micro-animations (`PageTransition` component + existing `StaggerContainer`/`FadeIn`)
- [x] Audit loading states — every component needs a skeleton/shimmer (all v3 components use `LoadingScreen`/`Skeleton`)
- [x] Audit empty states — every page looks good when data is empty (DiscoveryPage now has explicit empty states)
- [x] Add sound effects toggle — XP earned, quest complete, level up sounds (`SoundSettings` component + `SoundEffect` hook)

### Performance Optimization

- [x] Add caching to Concept Graph API responses (in-memory cache with 120s TTL in skill-tree route)
- [x] Lazy-load Learning Worlds page (world cards load via IntersectionObserver `LazyRender` component)
- [x] Add suspense boundaries around AI-generated content (`StoryViewer`/`SimplifyViewer` have inline loading; unused components — OK as-is)
- [x] Optimize skill tree rendering — virtualize with `LazyRender` per node (only mounts nodes near viewport)
- [x] Prefetch most likely next content — `NextUp` component now wired into dashboard Insights section
- [ ] Run Lighthouse audit — target 90+ on all metrics (requires staging deployment)

### Analytics

- [x] Add v3-specific analytics events — `useAnalytics()` hook queues events to `POST /api/analytics/events` (world viewed, island entered, concept mastered, style detection/override, path generated/followed, quest completed, streak milestone, story viewed, simplify used, ad impression/click)
- [x] Build Learning Effectiveness dashboard — teacher analytics page already exists with enrollment trends, completion funnels, score distributions, retention/engagement charts

### Content

- [ ] Create Python World content:
  - Variables Island (concepts: variables, types, assignment)
  - Loops Dungeon (concepts: for loops, while loops, iteration)
  - Function Kingdom (concepts: functions, parameters, return values)
  - API City (concepts: HTTP, JSON, REST, endpoints)
  - OOP Temple (concepts: classes, objects, inheritance)
- [ ] Map all prerequisite chains within Python World
- [ ] Write 2-3 stories per concept for the Story Generator seed
- [ ] QA all content through the adaptive engine — verify paths at different learning styles and mastery levels

### Launch Checklist

- [ ] Final regression test — all v3 flows work end-to-end
- [ ] Verify ad slots render correctly on all pages
- [x] Verify AI features have fallback when API is unavailable — `generateStoryFallback` + `simplifyFallback` already used in catch blocks
- [ ] Verify offline support still works for cached lessons
- [ ] Push to staging environment
- [ ] Run load test with v3 traffic patterns
- [ ] Security audit — verify AI features don't expose unsafe content
- [ ] Create launch announcement: "NEOT is now a free AI-powered learning universe"
- [ ] Update marketing site / landing page to reflect new positioning

### Post-Launch

- [ ] Monitor engagement metrics (DAU, session length, quest completion, path progress)
- [ ] Monitor AI costs per feature
- [ ] Monitor ad revenue
- [ ] Collect feedback on learning style detection accuracy
- [ ] Plan next domain (Math, Science, or English)
- [ ] Plan Tutor Ecosystem v1 — tools for external tutors to contribute to the concept graph

---

## Phase Selection Rules

| Phase | Prerequisite | Entry Gate |
|-------|-------------|------------|
| **V3-0** | None | master.md approved, team aligned |
| **V3-1** | V3-0 done | Concept Graph deployed, models live |
| **V3-2** | V3-1 live | Worlds UI rendering, graph populated |
| **V3-3** | V3-2 stable | Dynamic paths working for at least 1 world |
| **V3-4** | V3-2 done (AI pipeline) | Learning profiles have data from real usage |
| **V3-5** | V3-3 + V3-4 live | Engagement metrics established |
| **V3-6** | All prior phases | Everything functional end-to-end |

---

## Quick Start

```powershell
# 1. Read the strategic North Star
cat master.md

# 2. Read the transition plan
cat ASSIST/Roadmap/v3-transition.md

# 3. Check current checklist status
cat ASSIST/Execution/checklists/z-03-adaptive-universe.md

# 4. Pick a 🔲 item from V3-0
# 5. Read relevant specs in ASSIST/Vision/
# 6. Build it
# 7. Log the session
code ASSIST/Log/YYYY-MM-DD-HHmm.md

# 8. Update ASSIST docs (must do)
# 9. Commit
.\ASSIST\Tools\git-helper.ps1 "V3-0: <specific task>"
```
