# Student Portal — Spec

## Overview

The student portal is the primary learning interface. Students access courses, complete lessons, take quizzes, and track their progress.

## Core Features

### Dashboard

- Welcome message with student name
- Continue learning section (last accessed course)
- Course catalog (enrolled + available)
- Progress overview (XP, streak, level)
- Upcoming assignments with due dates
- Achievement notifications

### Course Player

- Course title, progress bar, module navigation
- Lesson content rendered via Section Registry
- Navigation: previous/next lesson, module jump
- Mark complete, bookmark, note-taking
- Quiz integration within lessons
- Auto-save progress

### Quiz System

- Multiple question types: MCQ, true/false, fill-in, matching
- Immediate feedback on submission
- Score tracking, retry logic
- Time limits (optional)
- Review mode after completion

### Progress Tracking

- XP earned per lesson/quiz
- Streak counter (daily login + activity)
- Level progression with thresholds
- Badges for achievements
- Skill mastery indicators per topic

### Profile

- Avatar, display name, bio
- Stats: courses completed, XP, streak, badges
- Achievement showcase
- Settings: notifications, theme, privacy

## User Flow

```
Login → Dashboard → Select Course → Lesson Player → Complete Lesson → Quiz → Progress Update → Dashboard
```

## Key Interactions

| Action | Result |
|--------|--------|
| Click course | Open course player at last position |
| Complete lesson | XP awarded, progress saved, next lesson unlocked |
| Submit quiz | Score shown, mastery updated, retry option |
| Earn badge | Notification, profile update |
| Miss day | Streak warning, then reset |

## Mobile Considerations

- Touch-friendly navigation
- Swipe between lessons
- Offline mode for downloaded content
- Push notifications for reminders
