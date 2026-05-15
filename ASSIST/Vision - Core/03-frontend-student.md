# Student App — Detailed Specification

## Overview
The primary learning interface. Must be ultra-clean, distraction-free, and adaptive to each learner's level (kids → adults).

## Core Pages

### 1. Authentication
- Login/Signup with email, Google, or magic link
- Age-gated registration (different flows for <13, 13-18, 18+)
- Adaptive onboarding that adjusts to age
- Parent/guardian email for minors

### 2. Home Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ☰ Logo                      🔔 👤  🎯 XP: 450  🔥 7 days │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  👋 Good Morning, Alex!                              │   │
│  │  "You're on a 7-day streak! Keep going!"             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 📚 Continue   │  │ 🎯 Today's   │  │ ⭐ Next      │      │
│  │ Fractions 3.2 │  │ Challenge    │  │ Achievement  │      │
│  │ (55% done)    │  │ Beat 80%     │  │ Math Master  │      │
│  │               │  │              │  │ (2 lessons)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📖 Recommended For You                               │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │   │
│  │  │Algebra│ │Grammar│ │Science│ │ Art  │               │   │
│  │  │ L5    │ │ L3    │ │ L2    │ │ L1   │               │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📊 Your Learning Path                                │   │
│  │  ● → ● → ○ → ○ → ○ → ○                               │   │
│  │  ✅  ✅  📖  🔒  🔒  🔒                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🏆 Weekly Leaderboard                                │   │
│  │  1. Alex — 450 XP   2. Priya — 420 XP    ...         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3. Lesson Player

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Course    📖 Fractions 3.2    ⏱ 12 min remain   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📺 Video / Interactive Content Block                │   │
│  │                                                      │   │
│  │  [Video Player or Animated Explanation]              │   │
│  │                                                      │   │
│  │  ▶ Play  ⏸ Pause  ⏭ Next  🔄 Replay                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📝 Quick Check (Quiz Block)                         │   │
│  │                                                      │   │
│  │  Q: What is 1/2 + 1/4?                               │   │
│  │                                                      │   │
│  │  ○ A) 1/6    ○ B) 2/6    ○ C) 3/4    ○ D) 1/3      │   │
│  │                                                      │   │
│  │  [Check Answer]                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🤖 AI Tutor (collapsible)                           │   │
│  │  Alex: "I don't understand this"                     │   │
│  │  AI: "Think of fractions like pizza slices..."      │   │
│  │  ┌─📝────────────────────────────────────────┐       │   │
│  │  │ Type your question...                     │       │   │
│  │  └───────────────────────────────────────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  └──────────────────────────────────────────────────────┘   │
│  📝 Notes Panel (side drawer)                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  My Notes:                                            │   │
│  │  1/2 + 1/4 = 3/4                                     │   │
│  │  Remember: common denominator first!                  │   │
│  │  ┌─📝────────────────────────────────┐               │   │
│  │  │ Add note...                       │               │   │
│  │  └───────────────────────────────────┘               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [⬅ Previous]                          [Next ➡]            │
└─────────────────────────────────────────────────────────────┘
```

### 4. Block Types (Rendered in Lesson Player)

| Block Type | Description | Interactive Elements |
|------------|-------------|---------------------|
| **Text** | Rich text with formatting | Highlight, bookmark, note |
| **Video** | Embedded or uploaded video | Play/pause, speed control, transcripts |
| **Quiz** | Multiple choice, fill-in-blank, matching | Instant feedback, hints, explanations |
| **Flashcards** | Swipeable card deck | Flip animation, spaced repetition |
| **Drag-Drop** | Arrange/match items | Touch-friendly drag mechanics |
| **Coding Sandbox** | Code editor + preview | Run, test, submit |
| **Story Mode** | Branching narrative | Choose-your-own-adventure decisions |
| **Audio** | Podcast/lecture audio | Playback speed, bookmarks |
| **AI Interaction** | Chat with AI tutor | Free text, voice input |
| **Drawing Canvas** | Draw, sketch, write | Multiple tools, colors, layers |
| **Memory Games** | Match pairs, sequence recall | Timer, score, levels |
| **3D/AR** | Interactive 3D models (advanced) | Rotate, zoom, tap targets |

### 5. Achievement System

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 Achievements                       🔥 7-day streak     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │  🌟  │  │  📚  │  │  🧮  │  │  ⚡  │  │  🎯  │         │
│  │First │  │ Book  │  │Math  │  │Speed │  │Perfect│         │
│  │Lesson│  │ Worm  │  │Master│  │Demon │  │Score  │         │
│  │  ✅  │  │  ✅  │  │  3/5 │  │  2/5 │  │  🔒  │         │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘         │
│                                                              │
│  💎 Rare: "Night Owl" - Complete a lesson after 10 PM      │
│  🏅 Epic: "Knowledge Seeker" - Finish 100 lessons          │
│  👑 Legendary: "Grand Master" - Top 1% of all learners       │
└─────────────────────────────────────────────────────────────┘
```

### 6. Gamification Elements

- **XP Points**: Earned per lesson, quiz score, streak, achievement
- **Streaks**: Consecutive days of learning (bonus XP multipliers)
- **Levels**: 1-100, each level unlocks new features/themes
- **Badges**: Digital collectibles for milestones
- **Leaderboards**: Weekly (optional, can be disabled for younger kids)
- **Currency (Coins/Gems)**: Earned via learning, spent on customization
- **Customization Rewards**: Unlock avatars, themes, animations

### 7. Focus Mode

- Full-screen lesson player
- All distractions hidden (nav, notifications, leaderboard)
- Pomodoro-style timer built in
- Ambient sound options (rain, forest, white noise)
- Block phone notifications (mobile)

### 8. Offline Mode

- Cache entire courses for offline access
- Sync progress when back online
- Background download manager
- Offline quiz taking (sync results later)
- Storage management UI

### 9. AI Tutor Integration

- Context-aware help button on every lesson
- Typed and voice input
- Multi-modal responses (text, images, video references)
- Explain like I'm 5 / Explain in detail modes
- Follow-up questions
- Personalized tutoring based on learning history

## Student App States

| State | Description |
|-------|-------------|
| Loading | Skeleton screens, shimmer animations |
| Empty | First-time user, no courses enrolled |
| Error | Network failure, fallback to cached content |
| Offline | Banner indicator, cached mode active |
| Refreshing | Pull-to-refresh with haptic feedback |
| Success | Lesson complete, XP celebration animation |
| Warning | Low battery, weak connection warning |
