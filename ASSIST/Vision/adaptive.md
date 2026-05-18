# Adaptive Learning Engine — Spec

## Overview

The adaptive engine personalizes learning by adjusting content difficulty, recommending review, and tracking mastery per student.

## Core Components

### Mastery Tracking

- Per-topic mastery score (0-100)
- Based on quiz performance, time spent, retries
- Decay factor for inactive topics
- Prerequisite dependencies

### Difficulty Adjustment

- Content tagged with difficulty level (1-5)
- Auto-adjust based on mastery score
- Student can manually override
- Smooth transitions (no sudden jumps)

### Recommendation Engine

- Suggest next lesson based on:
  - Current course progress
  - Mastery gaps
  - Learning pace
  - Time available
- Mix of review and new content
- Spaced repetition for retention

### Analytics

- Mastery heatmap per student
- Progress velocity (topics/week)
- Time-to-mastery estimates
- At-risk student identification

## Algorithm

```
mastery = (correct_answers / total_attempts) * weight + (recency_factor * 0.2)
difficulty = clamp(round(mastery / 20), 1, 5)
next_topic = sort_by(prerequisite_met, mastery_score, time_since_review)
```

## Data Model

```
StudentMastery {
  studentId
  topicId
  score: 0-100
  attempts: number
  correct: number
  lastAttempt: DateTime
  difficulty: 1-5
  streak: number
}
```

## Integration Points

- Quiz system: feeds performance data
- Course player: requests next content
- Dashboard: displays mastery overview
- Teacher view: class-wide mastery analytics
