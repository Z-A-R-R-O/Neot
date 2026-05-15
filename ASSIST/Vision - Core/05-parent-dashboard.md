# Parent Dashboard — Detailed Specification

## Overview
A powerful yet simple dashboard for parents to monitor, guide, and support their children's learning journey. This is a major differentiation feature that most edtech platforms neglect.

## Core Pages

### 1. Parent Home Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ☰ Overview    👤 Children    📊 Reports    ⚙️ Settings    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  👨‍👩‍👧‍👦 Your Children                               │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  🧑 Alex  · Age 10  · Grade 5              │      │   │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐          │      │   │
│  │  │  │ 85%    │ │ 3h 20m │ │  🟢   │          │      │   │
│  │  │  │Overall │ │This Week│ │On Track│          │      │   │
│  │  │  └────────┘ └────────┘ └────────┘          │      │   │
│  │  │  [View Full Report →]                       │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  👧 Sara  · Age 7  · Grade 2               │      │   │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐          │      │   │
│  │  │  │ 92%    │ │ 2h 10m │ │  🟢   │          │      │   │
│  │  │  │Overall │ │This Week│ │On Track│          │      │   │
│  │  │  └────────┘ └────────┘ └────────┘          │      │   │
│  │  │  [View Full Report →]                       │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📊 Weekly Snapshot (All Children)                    │   │
│  │                                                       │   │
│  │  ⏱ Screen Time: 5h 30m this week                    │   │
│  │  📚 Lessons Completed: 24                            │   │
│  │  ✅ Quizzes Passed: 18/21 (86%)                      │   │
│  │  🔥 Combined Streak: 12 days                         │   │
│  │                                                       │   │
│  │  [View Detailed Analytics →]                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Individual Child Report

```
┌─────────────────────────────────────────────────────────────┐
│  ← Overview  >  Alex's Report                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🧑 Alex  ·  85% Overall  ·  🟢 On Track             │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  │   │
│  │  │Math   │ │English│ │Science│ │ Art   │ │Music  │  │   │
│  │  │ 92%   │ │ 78%   │ │ 88%   │ │ 95%   │ │ 70%   │  │   │
│  │  │ 🟢    │ │ 🟡    │ │ 🟢    │ │ 🟢    │ │ 🟡    │  │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📈 Performance Trend                                 │   │
│  │                                                       │   │
│  │  100% ┤      ╱╲                                        │   │
│  │   80% ┤ ╱╲ ╱  ╲ ╱╲                                    │   │
│  │   60% ┤╱  ╲    ╱  ╲                                   │   │
│  │       └──────────────────                              │   │
│  │       M   T   W   T   F   S   S                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  💪 Strengths                                         │   │
│  │  ✅ Multiplication tables (95%)                       │   │
│  │  ✅ Sentence structure (88%)                          │   │
│  │  ✅ Solar system (92%)                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ⚠️ Areas Needing Improvement                        │   │
│  │  ⚠️ Fractions (62% — 3 lessons behind)               │   │
│  │  ⚠️ Vocabulary (70% — below class avg of 82%)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🎯 Recommended Actions                               │   │
│  │  📖 Review Fractions Lesson 2.3 — 15 min             │   │
│  │  🎮 Try "Vocab Builder" game — 10 min                │   │
│  │  📝 Complete practice worksheet #4                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3. Screen Time & Usage Controls

```
┌─────────────────────────────────────────────────────────────┐
│  ⏱ Screen Time Controls                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Daily Usage: Today                                   │   │
│  │  ████████░░░░░░░░░░ 45 min / 90 min limit           │   │
│  │  Subjects: Math 25m · English 15m · Science 5m       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Limits & Schedules                                   │   │
│  │                                                       │   │
│  │  ⏰ Daily Time Limit: [90 min ▼]                      │   │
│  │  🌙 Curfew:           [8:00 PM - 7:00 AM ▼]          │   │
│  │  📅 Weekend Limit:    [120 min ▼]                    │   │
│  │  🔇 Focus Hours:      3:00 PM - 5:00 PM (no games)  │   │
│  │                                                       │   │
│  │  [Save Settings]                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📊 Usage History                                     │   │
│  │  ┌────────┬───────┬───────┬───────┬────────┬───┐    │   │
│  │  │ Day    │ Time  │Lesson │Quiz   │Game    │ ...│    │   │
│  │  ├────────┼───────┼───────┼───────┼────────┼───┤    │   │
│  │  │ Mon    │ 45m   │ 3     │ 2     │ 1      │   │    │   │
│  │  │ Tue    │ 55m   │ 4     │ 3     │ 0      │   │    │   │
│  │  └────────┴───────┴───────┴───────┴────────┴───┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4. Notifications & Alerts

| Alert Type | Trigger | Channel |
|------------|---------|---------|
| 🟢 **Milestone** | Child completes a lesson/course | Push, Email |
| 🟡 **Struggling** | Score < 60% on 3+ quizzes | Push, Email, SMS |
| 🔴 **Falling Behind** | No activity for 3+ days | Email, SMS |
| ⏰ **Screen Time** | Approaching daily limit | Push |
| 📊 **Weekly Report** | Every Sunday evening | Email |
| 🏆 **Achievement** | Child earns rare badge | Push |
| 🆕 **New Recommendation** | AI suggests new content | Push |

### 5. Parent Settings

- Manage linked children (add/remove)
- Notification preferences
- Weekly report email settings
- Privacy controls (what data to share)
- Account settings
- Multi-language support

## Parent Dashboard States

| State | Description |
|-------|-------------|
| First Visit | Onboarding to link a child account |
| No Children | Prompt to add child via code/email |
| Weekly Report | Generated every Sunday |
| Alert | High-priority notification banner |
