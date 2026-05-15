# Adaptive Learning Engine — Detailed Specification

## Overview
The adaptive engine is the intelligence layer that personalizes each student's learning journey in real-time. It tracks behavior, adjusts difficulty, modifies pacing, and customizes content delivery — all without manual intervention.

## Core Tracking Parameters

### Behavioral Metrics

| Metric | How It's Measured | What It Indicates |
|--------|-------------------|-------------------|
| **Time per question** | Seconds spent on each question | Understanding level |
| **Mistake patterns** | Which types of errors (calculation, concept, careless) | Knowledge gaps |
| **Hint usage** | Number of hints requested per question | Confidence/struggle |
| **Answer changing** | Frequency of changing answers | Uncertainty |
| **Pause/rewind** | Video playback behavior | Confusion points |
| **Scroll depth** | How far student reads | Engagement level |
| **Session length** | Total time per study session | Attention span |
| **Return rate** | How often student comes back | Engagement/retention |
| **Streak length** | Consecutive correct answers | Mastery level |
| **Completion rate** | % of started lessons completed | Motivation |
| **Quiz retake** | How many times to pass | Learning speed |
| **Time of day** | When student studies most | Optimal scheduling |

### Derived Attributes

| Attribute | Calculation | Purpose |
|-----------|-------------|---------|
| **Learning Speed** | Average time to master a concept vs. platform average | Pacing adjustment |
| **Retention Score** | % of previously learned material remembered | Review scheduling |
| **Struggle Areas** | Concepts with lowest quiz scores | Targeted intervention |
| **Learning Style** | Which block types yield highest scores | Content preference |
| **Attention Span** | Average focused time before drop-off | Session length optimization |
| **Confidence Level** | Ratio of correct to attempted answers | Encouragement needed |
| **Frustration Index** | Combination of hints, time, abandonment | Difficulty adjustment |

## Adaptation Strategies

### Difficulty Adjustment

```
Current State:
  Student scores 60% on Quiz
  ↓
  System checks:
    - Mistake pattern: Conceptual (not careless)
    - Hint usage: 3/5 questions used all hints
    - Time: 2x average for these questions
  ↓
  Adaptive Response:
    - Next quiz: Reduce difficulty from Hard → Medium
    - Insert remedial Text block re-explaining concept
    - Switch to visual learning mode (more diagrams)
    - Offer "Try Again" with scaffolded version
```

| Trigger | Action |
|---------|--------|
| Score < 40% on quiz | Insert remedial lesson, reduce difficulty |
| Score 40-70% on quiz | Show hint, repeat with similar questions |
| Score > 90% consistently | Accelerate (skip remedial content) |
| 3+ wrong answers in a row | Pause, show encouragement, switch teaching style |
| > 5 hints used per question | Break down into smaller steps |
| Very fast + all correct | Offer challenge/enrichment material |
| Abandon lesson mid-way | Next session: ask if they want to resume or restart |

### Content Adaptation

```
Student struggles with fractions
  ↓
Adaptive Profile:
  learning_speed: 0.7 (slower than average)
  learning_style: "visual"
  struggle_areas: ["fractions", "decimals"]
  ↓
Lesson Modification:
  - Text blocks → More visual/diagram blocks
  - Pacing: 50% more examples before quiz
  - Style: Real-world examples (pizza, money)
  - Checkpoints: More frequent comprehension checks
  - Encouragement: Positive reinforcement messages
```

### Pacing Adaptation

```
Fast Learner Path:
  Lesson → Quiz (95%) → Skip redundant practice → Next lesson
  Total time: 8 minutes (vs. default 15)

Standard Path:
  Lesson → Practice → Quiz (75%) → Review → Next lesson
  Total time: 15 minutes

Struggling Path:
  Lesson → Interactive Practice → Remedial Content → Quiz (60%) → Retry → Next lesson
  Total time: 25 minutes
```

### Revision Scheduling (Spaced Repetition)

```
Based on retention_score and time since last review:

Day 1:  First learning
Day 3:  Quick review (10% of original time)
Day 7:  Practice quiz (covering core concepts)
Day 14: Challenge questions (mixed topics)
Day 30: Comprehensive review
Day 60: Mastery check

System automatically schedules review sessions
in the "Review" section of the dashboard.
```

## Adaptive Profile Schema

```typescript
interface AdaptiveProfile {
  studentId: string;
  
  // Core metrics
  learningSpeed: number;       // 0.0 - 2.0 (relative to mean)
  retentionScore: number;      // 0.0 - 1.0
  attentionSpanMinutes: number; // estimated focused minutes
  
  // Preferences
  preferredLearningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  preferredSessionLength: number; // minutes
  
  // Knowledge map
  masteredConcepts: ConceptNode[];
  struggleAreas: ConceptNode[];
  currentConcept: string;
  
  // Behavioral
  frustrationIndex: number;    // 0.0 - 1.0 (recent)
  engagementScore: number;     // 0.0 - 1.0 (trending)
  optimalTimeOfDay: string;    // "morning" | "afternoon" | "evening"
  
  // History
  totalLessonsCompleted: number;
  averageQuizScore: number;
  streakLength: number;
  
  // Metadata
  lastUpdated: timestamp;
  version: number;
}

interface ConceptNode {
  id: string;
  name: string;
  masteryLevel: number;  // 0.0 - 1.0
  lastAssessed: timestamp;
  prerequisites: string[];
  relatedConcepts: string[];
}
```

## Recommendation Engine

### Collaborative Filtering
- "Students like you also enjoyed..."
- Based on learning patterns, not just course enrollments
- Considers: age, grade, learning style, struggle areas

### Content-Based Filtering
- "Because you're good at Algebra, try Geometry"
- Based on concept mastery graph
- Suggests next logical concepts in knowledge tree

### Hybrid Scoring

```
Recommendation Score = 
  (0.4 × Personalization Factor)
  + (0.3 × Relevance to Current Learning Path)
  + (0.2 × Popularity Among Similar Learners)
  + (0.1 × Recency/Newness)
```

### Recommendation Types

| Type | Description | Placement |
|------|-------------|-----------|
| **Continue Learning** | Resume incomplete lessons | Dashboard hero |
| **Next Logical Step** | Prerequisite-based progression | Course page |
| **Weak Area Focus** | Remedial content for struggle topics | Suggested section |
| **Enrichment** | Challenge content for advanced students | Optional section |
| **Review** | Spaced repetition reminders | Review tab |
| **Popular** | Trending among similar cohort | Discovery section |
| **Teacher Picked** | Manual recommendations | Featured section |

## Adaptive Rule Engine

### Rule Definition

```typescript
interface AdaptiveRule {
  id: string;
  name: string;
  description: string;
  
  conditions: Condition[];
  actions: Action[];
  priority: number;  // Higher = evaluated first
  isEnabled: boolean;
}

interface Condition {
  parameter: string;  // 'quiz_score', 'hint_usage', 'time_per_question'
  operator: 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | 'between';
  value: number | [number, number];
  window?: 'session' | 'last_5' | 'last_10' | 'all_time';
}

interface Action {
  type: 'adjust_difficulty' | 'insert_block' | 'show_hint' | 
        'send_message' | 'skip_content' | 'modify_pacing' | 
        'switch_style' | 'trigger_notification';
  params: Record<string, any>;
}
```

### Default Rules (configurable in Admin Panel)

| Rule Name | Condition | Action |
|-----------|-----------|--------|
| Struggling Student | quiz_score < 40% OR hints > 3 | Reduce difficulty, insert remedial |
| Quick Learner | avg_score > 90% AND time < 50% avg | Skip redundant, offer challenge |
| Disengaged | session < 2 min, 3+ sessions | Send encouragement, switch style |
| Frustrated | 3+ wrong in row, increasing time | Show hint, simplify, encourage |
| Mastery | Same concept scored > 85% twice | Mark mastered, move forward |
| Review Needed | retention_score < 60%, last seen > 7d | Schedule review session |
| Peak Time | Optimal time of day detected | Send "Study now, you're in the zone!" |

## Student-Facing Adaptation

### Student Dashboard Adaptations

```
Based on adaptive profile, the dashboard shows:

🔵 Low engagement student (logged in after 5 days):
  "We missed you! Here's a quick 5-min review to get back on track."
  → Shows shortest lessons
  → Big, encouraging visuals
  → "Easy win" recommended content

🟢 High engagement student (daily user, 90%+ scores):
  "You're on fire! Ready for a challenge?"
  → Shows hardest available content
  → Leaderboard position
  → Advanced achievements

🟡 Struggling student (multiple low quiz scores):
  "Let's try a different approach."
  → Switches to preferred learning style
  → Shows simpler, visual content
  → Hides leaderboard (reduce pressure)
```

### In-Lesson Adaptation

```
During Lesson Playback:

If student rewinded video at 2:30 timestamp:
  → System notes: "Confusion point at 2:30"
  → Adds bookmark at that point
  → Offers alternative explanation

If student spent 30+ seconds on a quiz question:
  → Auto-shows hint after 30s
  → If still wrong, offers simplified version

If student is breezing through:
  → Embedded challenge questions appear
  → "Want to go deeper?" expandable section
```

## Technical Implementation

### Adaptive Engine Pipeline

```
1. Event Collection
   ↓
2. Feature Extraction (real-time)
   ↓
3. Rule Evaluation (priority order)
   ↓
4. Action Queue
   ↓
5. Profile Update
   ↓
6. Content Mutation (lesson/adjustment)
```

### Real-time Processing

```typescript
// Example: Real-time adaptive check on quiz submission
async function processQuizAttempt(attempt: QuizAttempt): Promise<AdaptiveResponse> {
  const profile = await getAdaptiveProfile(attempt.studentId);
  const metrics = calculateMetrics(attempt, profile);
  
  // Rule evaluation
  const matchedRules = await evaluateRules(metrics);
  
  // Execute highest priority action
  for (const rule of matchedRules.sort((a, b) => b.priority - a.priority)) {
    if (rule.isEnabled && allConditionsMet(rule.conditions, metrics)) {
      return executeAction(rule.actions[0], attempt, profile);
    }
  }
  
  return { type: 'no_action' };
}

async function calculateMetrics(attempt: QuizAttempt, profile: AdaptiveProfile) {
  return {
    quizScore: attempt.score,
    timePerQuestion: attempt.timeTakenSeconds / attempt.answers.length,
    hintUsage: attempt.hintUsed,
    mistakes: analyzeMistakes(attempt.answers),
    consecutiveWrong: profile.consecutiveWrong,
    learningStyle: profile.preferredLearningStyle,
    frustrationIndex: profile.frustrationIndex,
  };
}
```

### Profile Persistence

```
adaptive_profiles table:
- Updated after every major event (quiz, lesson completion)
- Aggregated daily via cron for slow-changing metrics
- Cached in Redis (TTL: 1 hour)
- Recalculated: on-demand (real-time) + daily batch
```

## Cold Start Strategy

For new users with no history:
- Default to "medium" difficulty
- Present learning style questionnaire OR infer from first 3 sessions
- Use age/grade as initial baseline
- Adaptive kicks in after 3 lessons or 5 quiz attempts
- Fall back to collaborative filtering for recommendations (what similar ages like)
