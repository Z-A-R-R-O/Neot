# Z-03 — Adaptive Learning Universe Checklist

## Progress

| Phase | Items | Done | Progress |
|-------|-------|------|----------|
| V3-0: Foundation | 15 | 10 | 67% |
| V3-1: Learning Worlds | 18 | 15 | 83% |
| V3-2: AI Personalization Engine | 26 | 26 | 100% |
| V3-3: Engagement Loops | 14 | 14 | 100% |
| V3-4: Story Mode | 16 | 0 | 0% |
| V3-5: Monetization | 14 | 0 | 0% |
| V3-6: Scale + Launch | 16 | 0 | 0% |
| **Total** | **112** | **65** | **58%** |

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
- [ ] Build world completion animation/celebration — unlock next world effect

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

## V3-4: Story Mode 🔲

> **Goal:** Build the AI features that make NEOT unique — story generator, concept simplifier, memory optimizer.
> **Duration:** 5-6 days
> **Depends on:** V3-2 (AI pipeline established, learning profiles active)

### Story Generator

- [ ] Build `StoryGenerator` prompt — takes concept + learning level + student interests → generates a short narrative explaining the concept
- [ ] Build story rendering component — nicely formatted story with optional audio narration
- [ ] Build `StoryModeToggle` — "Explain this as a story" button on any lesson
- [ ] Build story difficulty levels — simple story (age 10) / normal (teen) / advanced (adult)
- [ ] Cache generated stories — avoid regenerating same concept story for same level
- [ ] Build story feedback — "This was helpful / Too simple / Too complex" to improve generation

### Concept Simplifier

- [ ] Build `ConceptSimplifier` — takes any concept + student age/level → explains like they're 10
- [ ] Build `SimplifyToggle` — "Explain simply" button on any concept/lesson
- [ ] Build analogy engine — finds real-world analogies for abstract concepts ("Variables are like labeled boxes")
- [ ] Build progressive disclosure — start simple, offer to "Dive deeper" for more detail
- [ ] Build simplify levels — ELI5 / Teen / Normal / Detailed

### Memory Optimizer

- [ ] Build enhanced spaced repetition — personalized decay curves per student based on memory patterns
- [ ] Build `OptimalReviewTime` calculator — predicts when student is about to forget each concept
- [ ] Build `ReviewDashboard` — shows concepts due for review ordered by urgency
- [ ] Build `MicroReview` — 30-second review cards (quick recall, no full lesson needed)
- [ ] Build review streak — consecutive days of review = XP multiplier
- [ ] Build `MasteryForecast` — "You'll master this in X more sessions at your current pace"

### AI API Integration

- [ ] Create unified AI service with cost tracking per feature
- [ ] Add caching layer for story + simplify responses
- [ ] Add rate limiting per student per feature
- [ ] Add cost dashboard — track AI API spend per feature

### API Routes

- [ ] `POST /api/ai/story` — generate story for a concept
- [ ] `POST /api/ai/simplify` — simplify a concept explanation
- [ ] `GET /api/memory/review-queue` — concepts due for review
- [ ] `POST /api/memory/review-complete` — log review result, update decay curve
- [ ] `GET /api/memory/forecast` — time-to-mastery estimates

---

## V3-5: Monetization 🔲

> **Goal:** Non-intrusive ad system — Google AdSense, sponsored learning, AI-relevant ads.
> **Duration:** 4-5 days
> **Depends on:** V3-3 (Traffic/engagement baseline established)

### Ad Placement Engine

- [ ] Build `AdSlot` component — configurable ad container (sidebar, footer, between-cards)
- [ ] Build `AdManager` — controls which ad slots are active per page per user
- [ ] Build `AdPreferences` — user can set interests to get more relevant ads
- [ ] Build `AdStyle` system — ads automatically match site theme (colors, rounded corners)
- [ ] Build ad placement strategy — lesson content pages get sidebar ads; world pages get between-card ads; dashboard gets footer ads
- [ ] Build `AdBlockerDetector` — show polite "help us stay free" message (never block content)

### Google AdSense Integration

- [ ] Register AdSense account and get site code
- [ ] Integrate AdSense auto ads code in layout
- [ ] Add manual ad placements — sidebar unit, in-feed unit, between-lesson unit
- [ ] Test ad rendering in dev mode with ad unit placeholders
- [ ] Build ad placeholder component — renders cleanly when adblocker present or no ad served
- [ ] Add privacy-compliant ad consent (GDPR/COPPA-friendly)

### Sponsored Learning (Stage 2)

- [ ] Build `SponsoredPath` model — sponsor (company) + concept path + creative assets
- [ ] Build `SponsoredCard` component — "Brought to you by [Sponsor]" with brief educational message
- [ ] Build sponsor matching logic — match sponsors to relevant learning paths (e.g., Intel → AI track)
- [ ] Build admin sponsor management page

### AI-Relevant Ads (Stage 3)

- [ ] Build `AdTargeting` — uses current learning context to serve relevant ads (learning Python → VSCode ad)
- [ ] Build `AdRelevanceScore` — ensures ads are educationally relevant, not random
- [ ] Build privacy-safe targeting — uses current topic only, never personal data

### API Routes

- [ ] `GET /api/ads/config` — ad configuration for frontend
- [ ] `POST /api/ads/impression` — log ad impression
- [ ] `POST /api/ads/click` — log ad click
- [ ] `GET /api/admin/ads/stats` — admin ad performance dashboard
- [ ] `GET /api/admin/ads/config` — manage ad slots, sponsors

---

## V3-6: Scale + Launch 🔲

> **Goal:** Polish UX, optimize performance, launch beta with Coding/CS domain.
> **Duration:** 5-7 days
> **Depends on:** V3-4, V3-5 (All features stable)

### UX Polish

- [ ] Audit all v3 pages for mobile responsiveness
- [ ] Build Netflix-style content discovery page — personalized recommendations with rich thumbnails
- [ ] Add Continue Watching section — carousel of in-progress worlds/islands
- [ ] Build onboarding flow — first-time user picks interests → gets personalized starting recommendation
- [ ] Add smooth page transitions and micro-animations
- [ ] Audit loading states — every component needs a skeleton/shimmer
- [ ] Audit empty states — every page looks good when data is empty
- [ ] Add sound effects toggle — XP earned, quest complete, level up sounds

### Performance Optimization

- [ ] Add caching to Concept Graph API responses
- [ ] Lazy-load Learning Worlds page (world cards load as user scrolls)
- [ ] Add suspense boundaries around AI-generated content (story, simplify)
- [ ] Optimize skill tree rendering — virtualize if > 50 nodes
- [ ] Prefetch most likely next content based on current path
- [ ] Run Lighthouse audit — target 90+ on all metrics

### Analytics

- [ ] Add v3-specific analytics events:
  - World viewed / island entered / concept mastered
  - Learning style detection / override
  - Dynamic path generated / followed
  - Quest completed / streak milestone
  - Story viewed / simplify used
  - Ad impression / click
- [ ] Build Learning Effectiveness dashboard — compare quiz scores, retention, time-to-mastery across students

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
- [ ] Verify AI features have fallback when API is unavailable
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