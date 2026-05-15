# Teacher App — Detailed Specification

## Overview
A no-code content creation platform enabling teachers to build courses, lessons, quizzes, and adaptive learning paths without technical skills.

## Core Pages

### 1. Teacher Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  ☰ Dashboard    📚 Courses    📊 Analytics    👥 Students   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📊 This Week Overview                                │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │   │
│  │  │ 245    │  │ 89%    │  │ 4.7 ⭐ │  │ 12     │    │   │
│  │  │Students│  │Pass Rate│  │Rating  │  │New     │    │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🎯 Quick Actions                                     │   │
│  │  [➕ New Course]  [📝 New Lesson]  [📋 New Quiz]     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📚 My Courses                                        │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  📐 Mathematics Grade 5                     │      │   │
│  │  │  12 Lessons  ·  45 Students  ·  92% Pass   │      │   │
│  │  │  [Edit] [Analytics] [Share] [📋]            │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  📝 English Grammar                        │      │   │
│  │  │  8 Lessons  ·  30 Students  ·  88% Pass    │      │   │
│  │  │  [Edit] [Analytics] [Share] [📋]            │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📈 Student Performance (Recent)                      │   │
│  │  ┌──────┬────────┬──────┬──────┬──────┐              │   │
│  │  │Name  │Course  │Progr.│Avg   │Risk  │              │   │
│  │  ├──────┼────────┼──────┼──────┼──────┤              │   │
│  │  │Alice │ Math   │ 78%  │ 92%  │ 🟢  │              │   │
│  │  │Bob   │ Math   │ 45%  │ 67%  │ 🟡  │              │   │
│  │  │Carol │ English│ 23%  │ 55%  │ 🔴  │              │   │
│  │  └──────┴────────┴──────┴──────┴──────┘              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Course Builder (Drag-Drop)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Courses  >  Mathematics Grade 5  [Draft]  [Publish]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Course Settings: Title | Description | Thumbnail | Level    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📖 Course Outline                                    │   │
│  │                                                       │   │
│  │  ≡ 1. Numbers & Operations                           │   │
│  │    ≡ 1.1 Place Value                             📝📋 │   │
│  │    ≡ 1.2 Addition & Subtraction                  📝📋 │   │
│  │    ≡ 1.3 Multiplication Tables                    📝📋 │   │
│  │    [➕ Add Lesson]                                    │   │
│  │                                                       │   │
│  │  ≡ 2. Fractions                                      │   │
│  │    ≡ 2.1 What is a Fraction?                    📝📋 │   │
│  │    ≡ 2.2 Equivalent Fractions                   📝📋 │   │
│  │    [➕ Add Lesson]                                    │   │
│  │                                                       │   │
│  │  [➕ Add Module]                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🧩 Available Blocks (drag into lesson)              │   │
│  │                                                       │   │
│  │  [📝 Text] [📺 Video] [❓ Quiz] [🃏 Flashcards]     │   │
│  │  [↕️ Drag-Drop] [💻 Code] [📖 Story] [🎵 Audio]    │   │
│  │  [🤖 AI Activity] [🎨 Drawing] [🧠 Memory Game]     │   │
│  │  [📊 Poll] [📋 Assignment] [🔗 Embed] [🎯 Goal]    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3. Block Editor (per block type)

**Text Block Editor:**
- Rich text editor (heading, bold, italic, lists, links, images, math notation)
- Color coding support
- Reading level indicator (Grade 3, Grade 5, etc.)
- Word count and estimated reading time

**Quiz Block Editor:**
```
┌─────────────────────────────────────────────────────────────┐
│  ❓ Quiz Block Editor                                        │
├─────────────────────────────────────────────────────────────┤
│  Question: What is 1/2 + 1/4?                               │
│                                                              │
│  Type: [Multiple Choice ▼]   Difficulty: [Medium ▼]         │
│                                                              │
│  Options:                                                    │
│  ○ A) 1/6           ✅ Correct                              │
│  ○ B) 2/6                                                    │
│  ○ C) 3/4                                                    │
│  ○ D) 1/3                                                    │
│                                                              │
│  Hint: "Remember to find common denominator first!"          │
│  Explanation: "1/2 = 2/4, so 2/4 + 1/4 = 3/4"               │
│                                                              │
│  Adaptive Settings:                                          │
│  - If correct: Next question difficulty [Harder ▼]          │
│  - If wrong: Show hint, then [Easier ▼] version             │
│                                                              │
│  [➕ Add Option]  [Save Block]  [Preview Block]             │
└─────────────────────────────────────────────────────────────┘
```

### 4. AI-Assisted Content Generation

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Content Generator                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  "Create a lesson about fractions for 8 year olds"           │
│  [Generate ✨]                                               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Generated Content Preview:                           │   │
│  │                                                       │   │
│  │  📖 Lesson: Introduction to Fractions                 │   │
│  │  📝 Explanation: "Imagine a pizza cut into 4 slices."│   │
│  │  ❓ Quiz: 5 questions generated                       │   │
│  │  🎮 Activity: Interactive pizza-splitting game        │   │
│  │  📋 Homework: 2 practice worksheets                   │   │
│  │                                                       │   │
│  │  [Accept All] [Edit] [Regenerate] [Customize]        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Tone: [Playful ▼]  Language: [English ▼]  Length: [15min] │
└─────────────────────────────────────────────────────────────┘
```

### 5. Analytics Dashboard

| Metric | Description | Visualization |
|--------|-------------|---------------|
| Enrollment | Total students enrolled | Line chart (over time) |
| Completion Rate | % of students completing course | Funnel chart |
| Average Score | Quiz/test scores across lessons | Bar chart |
| Drop-off Points | Where students stop most | Funnel with hotspots |
| Time Spent | Average time per lesson | Heatmap |
| Difficulty Matrix | Which concepts are hardest | 2D grid |
| Engagement Score | Composite of activity metrics | Gauge |
| Student Growth | New vs returning students | Stacked area |

### 6. Student Management

- Student list with search/filter
- Individual student progress view
- Send messages/announcements
- Assign remedial work
- Export reports (PDF/CSV)
- Parent contact integration

### 7. Adaptive Path Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 Adaptive Path Settings                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Learning Path: Mathematics Grade 5                   │   │
│  │                                                       │   │
│  │  Default Path: 1 → 2 → 3 → 4 → 5 → 6                 │   │
│  │                                                       │   │
│  │  If student scores >80% on Quiz 2:                    │   │
│  │    Skip Lesson 3, go to Lesson 4 (Advanced path)      │   │
│  │                                                       │   │
│  │  If student scores <50% on Quiz 2:                    │   │
│  │    Insert Remedial Lesson 2.5 before Lesson 3         │   │
│  │                                                       │   │
│  │  [➕ Add Rule]  [Visualize Path]  [Test Scenarios]    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Condition Builder:                                         │
│  ┌─If──────────────┬───────────┬───────────┐               │
│  │ Quiz Score      │ is less   │ 50%       │               │
│  │ └───────────────┴───────────┴───────────┘               │
│  │ Then: Insert Lesson "Fractions Basics Review"            │
│  └──────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

## Teacher App States

| State | Handling |
|-------|----------|
| Draft | Course saved but unpublished |
| Published | Course live for students |
| Archived | Course removed from active listing |
| Pending Review | Submitted for admin approval (marketplace) |
