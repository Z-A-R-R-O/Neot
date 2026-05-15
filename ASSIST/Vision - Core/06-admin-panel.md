# Admin Panel — Detailed Specification

## Overview
The "Control Center" for the entire platform. This is the main differentiator — a full no-code platform builder that lets admins control everything from homepage layout to AI behavior, without touching code.

## Core Modules

### 1. Visual Page Builder

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 Homepage Builder    [Save] [Preview] [Publish] [Revert]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 Desktop / Tablet / Mobile                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🔵 Hero Section #1  [Settings] [Duplicate] [🗑]    │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  Hero Title: "Learn Anything, Anywhere"    │      │   │
│  │  │  Subtitle: "Adaptive learning for all ages"│      │   │
│  │  │  CTA Button: "Start Learning" → /signup    │      │   │
│  │  │  Background: [🎨 Color] [🖼 Image] [🎥 Vid]│      │   │
│  │  │  Animation: [Fade In ▼]                    │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📚 Featured Courses Section  [Settings] [Dup] [🗑] │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  Display: [Grid ▼]  Items: [6]            │      │   │
│  │  │  Filter: [Popular ▼] [Trending ▼]         │      │   │
│  │  │  Show enrolled count: [✅]                 │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📊 Stats Bar  [Settings] [Duplicate] [🗑]          │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │  Students: 10,000+   Courses: 500+         │      │   │
│  │  │  Lessons: 5,000+     Countries: 50+        │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [➕ Add Section]  [↕ Reorder]  [🔄 Undo]                   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Available Section Types

| Section Type | Description |
|-------------|-------------|
| **Hero** | Main banner with title, subtitle, CTA, media background |
| **Feature Grid** | Grid of feature cards (icon + title + description) |
| **Course Carousel** | Horizontal scrollable course list |
| **Category Grid** | Subject/category navigation cards |
| **Stats Bar** | Animated statistics counters |
| **Testimonials** | User review/testimonial carousel |
| **CTA Banner** | Call-to-action strip (e.g., "Start Free Trial") |
| **Pricing Table** | Plan comparison cards |
| **FAQ Accordion** | Expandable questions/answers |
| **Blog/News** | Latest content grid |
| **Footer** | Multi-column footer with links |
| **Custom HTML** | Raw HTML/embed for advanced users |

### 3. Block Library Management

```
┌─────────────────────────────────────────────────────────────┐
│  🧩 Learning Blocks    [+ Create New Block]                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🔍 Search blocks...                    [Grid] [List]│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 📝   │ │ 📺   │ │ ❓   │ │ 🃏   │ │ ↕️   │ │ 💻   │   │
│  │ Text │ │Video │ │ Quiz │ │Flash │ │Drag  │ │Code  │   │
│  │      │ │      │ │      │ │ Cards│ │Drop  │ │Sandbx│   │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 📖   │ │ 🎵   │ │ 🤖   │ │ 🎨   │ │ 🧠   │ │ 📊   │   │
│  │ Story│ │Audio │ │AI    │ │Draw  │ │Memory│ │ Poll │   │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Edit Block: Quiz Block                               │   │
│  │                                                       │   │
│  │  Block Name: [Standard Quiz]                         │   │
│  │  Version: v2.3                                        │   │
│  │                                                       │   │
│  │  Fields:                                              │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐       │   │
│  │  │Question  │Options   │Correct   │Explanation│       │   │
│  │  ├──────────┼──────────┼──────────┼──────────┤       │   │
│  │  │ Text     │ Array    │ Integer  │ RichText │       │   │
│  │  │ required │ required │ required │ optional │       │   │
│  │  └──────────┴──────────┴──────────┴──────────┘       │   │
│  │                                                       │   │
│  │  Styles:                                              │   │
│  │  - Button color: [#4F46E5]                            │   │
│  │  - Animation: [Slide In ▼]                            │   │
│  │  - Feedback: [Instant ▼]                              │   │
│  │                                                       │   │
│  │  Adaptive Settings:                                   │   │
│  │  - Difficulty levels: [Easy] [Medium] [Hard]          │   │
│  │  - Hints per question: [3]                            │   │
│  │  - Time limit: [60s]                                  │   │
│  │                                                       │   │
│  │  [Save Changes]  [Test Block]  [Version History]      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4. Theme Engine

```
┌─────────────────────────────────────────────────────────────┐
│  🎨 Theme Manager                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Active Theme: [Kids Mode ▼]                          │   │
│  │                                                       │   │
│  │  Themes:                                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │ 🧒 Kids  │ │ 🏫 School│ │ 🌙 Dark  │ │ 🎮 Game  │ │   │
│  │  │ Mode     │ │ Mode     │ │ Minimal  │ │ Mode     │ │   │
│  │  │ Active   │ │          │ │          │ │          │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Theme Settings: Kids Mode                            │   │
│  │                                                       │   │
│  │  Colors:                                              │   │
│  │  Primary:   [🟣 #7C3AED]                             │   │
│  │  Secondary: [🟡 #F59E0B]                             │   │
│  │  Accent:    [🟢 #10B981]                             │   │
│  │  Background:[⚪ #FFF7ED]                             │   │
│  │  Text:      [⚫ #1F2937]                             │   │
│  │                                                       │   │
│  │  Typography:                                          │   │
│  │  Heading Font: [Fredoka One ▼]                       │   │
│  │  Body Font:   [Nunito ▼]                             │   │
│  │  Base Size:   [16px ▼]                               │   │
│  │                                                       │   │
│  │  Border Radius: [12px ▼] (rounded, kid-friendly)      │   │
│  │  Animations: [Bouncy ▼]                              │   │
│  │  Icons: [Emoji Style ▼]                              │   │
│  │                                                       │   │
│  │  [Save Theme]  [Duplicate]  [Export]  [Import]       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CSS Variables Generated:                              │   │
│  │  :root {                                               │   │
│  │    --primary: #7C3AED;                                 │   │
│  │    --primary-light: #A78BFA;                           │   │
│  │    --secondary: #F59E0B;                               │   │
│  │    --radius: 12px;                                     │   │
│  │    --font-heading: 'Fredoka One', cursive;            │   │
│  │    --animation-bounce: cubic-bezier(0.68, -0.55, ...) │   │
│  │  }                                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 5. Adaptive Engine Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 Adaptive Engine Settings                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Rules Engine                                        │   │
│  │                                                       │   │
│  │  ┌─ Condition ───────────┬── Action ──────────────┐  │   │
│  │  │ Quiz Score < 40%     │ → Show remedial lesson  │  │   │
│  │  ├──────────────────────┼─────────────────────────┤  │   │
│  │  │ Quiz Score > 90%     │ → Skip to next chapter  │  │   │
│  │  ├──────────────────────┼─────────────────────────┤  │   │
│  │  │ 3+ wrong answers     │ → Show hint, reduce    │  │   │
│  │  │ in a row             │   difficulty            │  │   │
│  │  ├──────────────────────┼─────────────────────────┤  │   │
│  │  │ No activity 5 min   │ → Send encouragement   │  │   │
│  │  ├──────────────────────┼─────────────────────────┤  │   │
│  │  │ Speed > 2x average  │ → Offer mastery challenge│  │   │
│  │  └──────────────────────┴─────────────────────────┘  │   │
│  │                                                       │   │
│  │  [➕ Add Rule]  [📋 Rule Templates]  [🧪 Test Rules]│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tracking Parameters                                  │   │
│  │                                                       │   │
│  │  ✅ Time per question                                 │   │
│  │  ✅ Scroll depth                                      │   │
│  │  ✅ Pause/rewind events (video)                      │   │
│  │  ✅ Mistake patterns                                  │   │
│  │  ✅ Session duration                                  │   │
│  │  ✅ Answer changing behavior                          │   │
│  │  ✅ Hint usage                                        │   │
│  │  ❌ Keyboard/mouse tracking (disabled for privacy)    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6. Gamification Rules

```
┌─────────────────────────────────────────────────────────────┐
│  🎮 Gamification Engine                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  XP Rules                                             │   │
│  │                                                       │   │
│  │  Action                          XP                   │   │
│  │  ─────────────────────────────────────               │   │
│  │  Complete a lesson           [100 XP ▼]               │   │
│  │  Pass a quiz (80%+)         [50 XP ▼]                │   │
│  │  Perfect score              [100 XP ▼]               │   │
│  │  Daily login                [10 XP ▼]                │   │
│  │  Streak day 3               [50 XP ▼]                │   │
│  │  Streak day 7               [200 XP ▼]               │   │
│  │  Help another student       [75 XP ▼]                │   │
│  │  Complete a course          [500 XP ▼]               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Level System                                         │   │
│  │  Level 1:    0 XP      - Beginner                    │   │
│  │  Level 2:  500 XP      - Curious Learner             │   │
│  │  Level 5:  5,000 XP    - Knowledge Seeker            │   │
│  │  Level 10: 20,000 XP   - Scholar                     │   │
│  │  Level 25: 100,000 XP  - Master                      │   │
│  │  Level 50: 500,000 XP  - Grand Master                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Achievement Definitions                              │   │
│  │  [➕ New Achievement]                                 │   │
│  │                                                       │   │
│  │  Name: "First Steps"      Icon: 👶  Rarity: Common   │   │
│  │  Trigger: Complete 1st lesson                         │   │
│  │                                                       │   │
│  │  Name: "Bookworm"         Icon: 📚  Rarity: Rare     │   │
│  │  Trigger: Complete 50 lessons                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 7. Course & Content Management

| Feature | Description |
|---------|-------------|
| Course CRUD | Create, edit, publish, archive courses |
| Category Management | Subject, grade, topic taxonomy |
| Lesson Reordering | Drag-drop lesson order within modules |
| Bulk Import | CSV/JSON course structure import |
| Version Control | Rollback to previous lesson versions |
| Content Scheduling | Schedule publish/unpublish dates |
| Localization | Multi-language content management |
| Media Library | Centralized image/video/audio management |

### 8. User Management

| Feature | Description |
|---------|-------------|
| User Search | By name, email, role, status |
| Role Management | Student, Teacher, Parent, Admin, Moderator |
| Bulk Operations | Import, export, suspend, email |
| Activity Log | Full audit trail of user actions |
| Ban/Suspend | With reason and duration |
| Email Verification | Manual trigger for unverified users |

### 9. Analytics Dashboard (Admin)

| Metric | Description |
|--------|-------------|
| Active Users | DAU/MAU with growth trend |
| Revenue | MRR, ARR, subscription stats |
| Course Performance | Top courses by enrollment, revenue, rating |
| Geo Distribution | Users by country heatmap |
| Device Breakdown | Web vs Mobile vs Tablet |
| Retention Cohorts | Weekly/monthly retention curves |
| Conversion Funnel | Visit → Signup → First Lesson → Paid |
| Server Health | API latency, error rates, uptime |

### 10. AI Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Service Configuration                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AI Tutor Settings                                    │   │
│  │                                                       │   │
│  │  Model: [GPT-4o ▼]                                   │   │
│  │  Temperature: [0.7 ─────●──────] (creativity)         │   │
│  │  Max Tokens: [2048]                                   │   │
│  │  Safety Filter: [Strict ▼] (for kids mode)           │   │
│  │                                                       │   │
│  │  System Prompt:                                       │   │
│  │  ┌────────────────────────────────────────────┐      │   │
│  │  │ You are a friendly tutor for a {age} year  │      │   │
│  │  │ old student. Explain {topic} in simple     │      │   │
│  │  │ terms. Use examples the child can relate   │      │   │
│  │  │ to. Never give direct answers to quizzes.  │      │   │
│  │  └────────────────────────────────────────────┘      │   │
│  │                                                       │   │
│  │  [Save AI Settings]  [Test AI Response]               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Recommendation Engine                                │   │
│  │  Algorithm: [Collaborative + Content-Based Hybrid ▼] │   │
│  │  Factors: Behavior 60% · Popularity 20% · New 20%    │   │
│  │  Refresh: [Every 24 hours ▼]                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 11. Settings & Configuration

| Setting Category | Options |
|-----------------|---------|
| **General** | Platform name, logo, favicon, timezone |
| **Authentication** | OAuth providers (Google, Apple), magic link, SSO |
| **Email** | SMTP config, templates, from address |
| **Payments** | Stripe/Razorpay keys, currency, tax rates |
| **Storage** | S3/Cloudinary config, max file size, allowed types |
| **Performance** | CDN, caching rules, image optimization |
| **Security** | Rate limits, password policy, 2FA, IP whitelist |
| **Localization** | Default language, available languages, RTL support |

## Admin Panel States

| State | Description |
|-------|-------------|
| Draft | Changes saved but not live |
| Preview | Admin previewing unpublished changes |
| Published | Changes deployed to production |
| A/B Test | Running experiment with variant pages |
| Conflict | Merge conflict from concurrent edits |
| Scheduled | Changes set to publish at specific time |
