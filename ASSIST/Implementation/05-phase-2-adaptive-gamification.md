# Phase 2: Adaptive & Gamification

> **Goal:** Platform adapts to learners. Gamification drives engagement.

---

## Task 2.1 — Adaptive Profile Schema + API

```
Files to create:
  web/supabase/migrations/007_adaptive.sql
  web/src/app/api/adaptive/profile/route.ts
  web/src/app/api/adaptive/profile/[studentId]/route.ts
  web/src/lib/supabase/queries/adaptive.ts
  web/src/types/adaptive.ts
```

Tables:
- `adaptive_profiles` (student_id, learning_speed, retention_score, struggle_areas[], preferred_learning_style, attention_span_minutes, metadata JSONB)

```typescript
interface AdaptiveProfile {
  studentId: string;
  learningSpeed: number;           // 0.0-2.0 relative to mean
  retentionScore: number;          // 0.0-1.0
  attentionSpanMinutes: number;
  preferredLearningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  masteredConcepts: ConceptNode[];
  struggleAreas: ConceptNode[];
  frustrationIndex: number;        // 0.0-1.0
  engagementScore: number;         // 0.0-1.0
}
```

**Write:** Adaptive profile created on first quiz attempt. Updates after each major event.
**Test:** Complete a quiz → profile created with initial metrics.

---

## Task 2.2 — Behavioral Tracking

```
Files to create:
  web/src/hooks/useAdaptiveProfile.ts
  web/src/lib/adaptive/metrics.ts
  web/src/lib/adaptive/tracker.ts
```

Tracked metrics:
- Time per question (seconds per question)
- Mistake patterns (calculation vs. conceptual vs. careless)
- Hint usage count per question
- Answer changing frequency
- Video pause/rewind events
- Scroll depth per block
- Session length
- Streak of correct answers
- Quiz retake count

```typescript
// Tracker fires events from every block interaction
class AdaptiveTracker {
  track(event: AdaptiveEvent): void {
    // Batch events, flush every 30s or on lesson complete
    // POST /api/adaptive/events
  }
}
```

**Write:** All student interactions tracked. Events batched and sent periodically.
**Test:** Answer a quiz question → event recorded in DB.

---

## Task 2.3 — Adaptive Rule Engine

```
Files to create:
  web/src/lib/adaptive/rules-engine.ts
  web/src/lib/adaptive/actions.ts
  web/src/app/api/adaptive/rules/route.ts         ← CRUD for rules (admin)
  web/src/app/api/adaptive/evaluate/route.ts       ← Evaluate rules on event
```

```typescript
interface AdaptiveRule {
  id: string;
  name: string;
  conditions: Condition[];
  actions: Action[];
  priority: number;
  isEnabled: boolean;
}

interface Condition {
  parameter: string;   // 'quiz_score', 'hint_usage', 'time_per_question'
  operator: 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | 'between';
  value: number | [number, number];
  window?: 'session' | 'last_5' | 'last_10' | 'all_time';
}
```

Default rules (configurable via admin):
| Rule | Condition | Action |
|------|-----------|--------|
| Struggling | score < 40% OR hints > 3 | Reduce difficulty, insert remedial |
| Quick Learner | avg_score > 90% AND time < 50% avg | Skip redundant, offer challenge |
| Disengaged | session < 2min, 3+ sessions | Send encouragement, switch style |
| Frustrated | 3+ wrong in row | Show hint, simplify, encourage |
| Mastery | scored > 85% twice | Mark mastered, move forward |
| Review Needed | retention < 60%, last seen > 7d | Schedule review |

```typescript
async function evaluateRules(metrics: Metrics): Promise<AdaptiveAction[]> {
  const rules = await getEnabledRules();
  const matched = rules
    .sort((a, b) => b.priority - a.priority)
    .filter(rule => allConditionsMet(rule.conditions, metrics));
  return matched.map(rule => executeAction(rule.actions[0], metrics));
}
```

**Write:** Rules evaluated on quiz submission. Matched actions returned and applied.
**Test:** Submit failing quiz → rule triggers → difficulty reduced for next quiz.

---

## Task 2.4 — Adaptive Lesson Mutation

```
Files to create:
  web/src/lib/adaptive/lesson-mutator.ts
  web/src/hooks/useAdaptiveLesson.ts
```

At lesson load time, the adaptive engine modifies the lesson content:
- Insert remedial text blocks for known struggle areas
- Skip redundant practice for mastered concepts
- Adjust quiz difficulty (which questions are served)
- Switch block types based on preferred learning style
- Add encouragement messages or challenge content

```typescript
async function mutateLesson(
  lesson: Lesson,
  profile: AdaptiveProfile
): Promise<Lesson> {
  let mutated = { ...lesson };
  
  if (profile.struggleAreas.includes(lesson.topic)) {
    mutated.blocks.unshift(createRemedialBlock(lesson.topic));
  }
  
  if (profile.preferredLearningStyle === 'visual') {
    mutated.blocks = mutated.blocks.map(b => 
      b.type === 'text' ? convertToVisual(b) : b
    );
  }
  
  return mutated;
}
```

**Write:** Two students taking same lesson may see different content based on profiles.
**Test:** Create two students with different profiles → same lesson → different blocks rendered.

---

## Task 2.5 — Gamification Database

```
Files to create:
  web/supabase/migrations/008_gamification.sql
```

Tables:
- `xp_events` (user_id, amount, reason, source)
- `achievements` (user_id, achievement_key, unlocked_at)
- `streaks` (user_id, current_streak, longest_streak, last_activity_date)
- `user_levels` (user_id, level, total_xp)

**Write:** All gamification tables exist with proper indexes and RLS.
**Test:** Insert XP event → triggers level calculation.

---

## Task 2.6 — XP & Level System

```
Files to create:
  web/src/app/api/gamification/xp/route.ts
  web/src/app/api/gamification/levels/route.ts
  web/src/lib/gamification/xp-calculator.ts
  web/src/lib/gamification/level-system.ts
  web/src/hooks/useGamification.ts
```

XP sources:
| Action | XP |
|--------|----|
| Complete lesson | 100 |
| Pass quiz (80%+) | 50 |
| Perfect score | 100 |
| Daily login | 10 |
| Streak day 3 | 50 |
| Streak day 7 | 200 |
| Complete course | 500 |

Level thresholds:
- Level 1: 0 XP (Beginner)
- Level 5: 5,000 XP (Knowledge Seeker)
- Level 10: 20,000 XP (Scholar)
- Level 25: 100,000 XP (Master)
- Level 50: 500,000 XP (Grand Master)

```typescript
function calculateLevel(totalXp: number): { level: number; progress: number } {
  // Each level requires level * 1000 XP
  // Returns current level and progress to next
}
```

**Write:** XP awarded on lesson/quiz completion. Level calculated from total XP. Progress bar shows next level.
**Test:** Complete lesson → +100 XP → level bar updates.

---

## Task 2.7 — Streak Tracking

```
Files to create:
  web/src/app/api/gamification/streak/route.ts
  web/src/lib/gamification/streak-tracker.ts
  web/src/components/gamification/streak-display.tsx
```

Logic:
- Daily cron checks all students' last_activity_date
- If yesterday: increment streak
- If > yesterday: reset to 1
- Milestone notifications at 3/7/14/30/100 days

**Write:** Streak increments on daily activity. Resets if gap > 1 day.
**Test:** Complete lesson today → streak = 1. Complete tomorrow → streak = 2. Skip a day → streak resets.

---

## Task 2.8 — Achievement System

```
Files to create:
  web/src/app/api/gamification/achievements/route.ts
  web/src/lib/gamification/achievement-definitions.ts
  web/src/lib/gamification/achievement-checker.ts
  web/src/components/gamification/achievement-card.tsx
  web/src/components/gamification/achievement-grid.tsx
  web/src/components/gamification/achievement-unlock-modal.tsx
```

Built-in achievements:
| Name | Trigger | Rarity |
|------|---------|--------|
| First Steps | Complete 1st lesson | Common |
| Bookworm | Complete 50 lessons | Rare |
| Math Whiz | Perfect score on 10 math quizzes | Rare |
| Speed Demon | Complete lesson in < 50% avg time | Uncommon |
| Night Owl | Complete lesson after 10 PM | Rare |
| Streak Master | 30-day streak | Epic |
| Knowledge Seeker | Reach Level 10 | Rare |
| Grand Master | Reach Level 50 | Legendary |

Admin can create custom achievements with custom triggers.

**Write:** Achievements triggered on lesson/quiz completion. Unlock animation plays.
**Test:** Complete 1st lesson → "First Steps" achievement unlocks → modal appears.

---

## Task 2.9 — Gamification UI Components

```
Files to create:
  web/src/app/(dashboard)/dashboard/achievements/page.tsx
  web/src/components/gamification/xp-popup.tsx
  web/src/components/gamification/level-progress.tsx
  web/src/components/gamification/leaderboard-table.tsx
  web/src/components/gamification/streak-flame.tsx
```

- **XP Popup**: Animated +XP floating text on lesson/quiz complete
- **Level Progress**: Circular or bar progress to next level
- **Leaderboard**: Weekly (course-specific or platform-wide, opt-in)
- **Streak Flame**: Fire emoji + day count in header

**Write:** Gamification elements visible in dashboard and lesson player.
**Test:** Complete lesson → XP popup animates → streak increments → leaderboard updates.

---

## Task 2.10 — Recommendations Engine

```
Files to create:
  web/src/app/api/recommendations/route.ts
  web/src/lib/recommendations/collaborative-filtering.ts
  web/src/lib/recommendations/content-based.ts
  web/src/lib/recommendations/hybrid-scorer.ts
  web/src/components/courses/recommended-section.tsx
  web/src/hooks/useRecommendations.ts
```

Recommendation types:
| Type | Algorithm | Placement |
|------|-----------|-----------|
| Continue Learning | Last incomplete | Dashboard hero |
| Next Logical Step | Prerequisite graph | Course page |
| Weak Area Focus | Struggle analysis | Suggested section |
| Enrichment | Performance > 90% | Optional section |
| Review | Spaced repetition | Review tab |
| Popular | Collaborative filter | Discovery section |

```typescript
// Hybrid scoring
function calculateScore(item): number {
  return (0.4 * personalizationFactor)
       + (0.3 * relevanceToCurrentPath)
       + (0.2 * popularityAmongSimilar)
       + (0.1 * recency);
}
```

**Write:** Dashboard shows recommended courses. "Continue Learning" shows incomplete lessons.
**Test:** Complete Algebra → Geometry recommended via content-based.

---

## Task 2.11 — Admin Adaptive/Gamification Config Panel

```
Files to update:
  web/src/app/(admin)/admin/adaptive/page.tsx
  web/src/app/(admin)/admin/gamification/page.tsx
  web/src/components/admin/adaptive/rule-editor.tsx
  web/src/components/admin/adaptive/rule-test-panel.tsx
  web/src/components/admin/gamification/xp-settings.tsx
  web/src/components/admin/gamification/achievement-editor.tsx
```

Admin can:
- View/create/edit adaptive rules (condition builder UI)
- Test rules with sample student data
- Set XP amounts per action
- Define achievement badges (name, icon, trigger, rarity)
- Set level thresholds

**Write:** Admin interface for all gamification/adaptive configuration.
**Test:** Create new rule "score > 95% → skip lesson" → student with 100% skips ahead.

---

## Phase 2 Validation Gate

- [ ] Adaptive profile created per student
- [ ] Behavioral tracking captures time, hints, mistakes
- [ ] Adaptive rules evaluate and execute actions
- [ ] Lesson content mutates based on student profile
- [ ] XP awarded on lesson/quiz completion
- [ ] Streaks track and persist correctly
- [ ] 10+ achievements with unlock animations
- [ ] Levels display with progress to next
- [ ] Leaderboard shows weekly rankings
- [ ] Recommendations show Continue Learning + Suggested
- [ ] Admin can edit adaptive rules and XP settings
- [ ] Dashboard adapts differently per student profile

> **Phase 2 Complete** ✅ → Move to `05-phase-3-ai-mobile.md`
