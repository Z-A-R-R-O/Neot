# Phase: Dashboard Completion — Student, Teacher & Admin

> **Goal:** All three dashboards (student, teacher, admin) are fully functional with live data, gamification UI, and no empty states or hardcoded placeholders.

---

## Current State Audit

### Student Dashboard — What Exists
| Feature | Status |
|---------|--------|
| Welcome header with name | ✅ Complete |
| Stats cards (Courses, Lessons, XP) | ✅ Complete |
| Achievements page (earned/locked, summary) | ✅ Complete |
| Leaderboard page (top 50, rank, XP) | ✅ Complete |
| My Courses page (enrolled, progress bars) | ✅ Complete |
| **Active Courses section on dashboard** | **🔲 Empty state only — no course cards** |
| **Learning Streak** | **🔲 Hardcoded to 0 days** |
| **XP popup on lesson/quiz completion** | **🔲 Not implemented** |
| **Level progress indicator** | **🔲 Not implemented** |
| **Streak flame in header** | **🔲 Not implemented** |
| **Continue Learning recommendations** | **🔲 Not implemented** |

### Teacher Dashboard — What Exists
| Feature | Status |
|---------|--------|
| Stats cards (Courses, Students, Enrollments) | ✅ Complete (inline in page) |
| Analytics page (4 charts with Recharts) | ✅ Complete |
| Analytics hook (`useCourseAnalytics`) | ✅ Complete |
| **overview-stats.tsx component** | **⚠️ Built but unused (page renders inline)** |
| **quick-actions.tsx component** | **⚠️ Built but unused (page renders inline)** |
| **Students page** | **🔲 Placeholder — empty state only, no student list** |
| **Course creation flow** | ✅ Complete |

### Admin Dashboard — What Exists
| Feature | Status |
|---------|--------|
| Stats cards (Users, Courses, Enrollments, Pages) | ✅ Complete |
| Page builder with Dev Mode | ✅ Complete |
| Theme editor | ✅ Complete |
| Block library | ✅ Complete |
| User management | ✅ Complete |
| Media library | ✅ Complete |
| Platform settings | ✅ Complete |

### Parent Dashboard — What Exists
| Feature | Status |
|---------|--------|
| **Entire parent dashboard** | **🔲 Does not exist** |

---

## Task D.1 — Student Dashboard: Active Courses Cards

```
Files to modify:
  web/src/app/(dashboard)/dashboard/page.tsx       ← Also fetch enrollments
  web/src/components/dashboard/dashboard-content.tsx  ← Render course cards
```

The dashboard currently shows "No active courses yet" even when the student is enrolled. 

**Write:** Dashboard "Active Courses" section renders actual enrolled courses as cards with:
- Course title, thumbnail, category badge
- Progress bar with percentage
- "Continue Learning" CTA per card
- "View all" link to `/dashboard/courses`

**Test:** Enroll in 3 courses → dashboard shows 3 course cards with individual progress bars.

---

## Task D.2 — Learning Streak Tracking

```
Files to create:
  web/src/app/api/gamification/streak/route.ts
  web/src/lib/gamification/streak-tracker.ts

Files to modify:
  web/prisma/schema.prisma             ← Add streak fields to Profile or new model
  web/src/components/dashboard/dashboard-content.tsx  ← Remove hardcoded "0 days"
```

**Write:** Streak increments on daily lesson activity. Resets if gap > 1 day. Dashboard shows real streak count.

**Test:** Complete lesson today → streak = 1. Complete tomorrow → streak = 2. Skip a day → streak resets.

---

## Task D.3 — XP Popup + Level Progress

```
Files to create:
  web/src/components/gamification/xp-popup.tsx
  web/src/components/gamification/level-progress.tsx
  web/src/lib/gamification/xp-calculator.ts
  web/src/lib/gamification/level-system.ts

Files to modify:
  web/src/app/lessons/[lessonId]/page.tsx  ← Award XP on lesson complete + trigger popup
  web/src/components/dashboard/dashboard-content.tsx  ← Add level progress card
```

**XP Popup:** Animated "+100 XP" floating text on lesson/quiz completion. Fades in, floats up, disappears.

**Level System:**
| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Beginner |
| 5 | 5,000 | Knowledge Seeker |
| 10 | 20,000 | Scholar |
| 25 | 100,000 | Master |
| 50 | 500,000 | Grand Master |

**Level Progress:** Circular or bar progress showing level number + XP progress to next level.

**Write:** Complete lesson → XP popup animates → level bar updates on dashboard.

**Test:** Complete 5 lessons → XP popup shows each time → dashboard level bar reflects progress.

---

## Task D.4 — Streak Flame in Header

```
Files to create:
  web/src/components/gamification/streak-flame.tsx

Files to modify:
  web/src/components/layout/header.tsx  ← Add streak flame next to user avatar
```

**Write:** Header shows a fire icon + streak count. Changes color based on streak length (gray=0, orange=1-6, red=7+).

**Test:** Login with 7-day streak → red flame with "7" shows in header.

---

## Task D.5 — Continue Learning Recommendations

```
Files to create:
  web/src/components/dashboard/continue-learning.tsx

Files to modify:
  web/src/app/(dashboard)/dashboard/page.tsx  ← Fetch incomplete lessons
  web/src/components/dashboard/dashboard-content.tsx  ← Add section
```

**Write:** Dashboard shows "Continue Learning" section with the student's most recently accessed incomplete lesson. Card shows course name, lesson title, estimated time, and a "Continue" button.

**Test:** Start lesson → leave mid-way → dashboard shows "Continue: Lesson Name" → click → resumes at last block.

---

## Task D.6 — Teacher Dashboard: Connect Unused Components

```
Files to modify:
  web/src/app/(teacher)/teacher/page.tsx  ← Import and render overview-stats.tsx + quick-actions.tsx
```

Currently the teacher page renders stats inline. The reusable `overview-stats.tsx` and `quick-actions.tsx` components are built but unused.

**Write:** Teacher page uses `OverviewStats` for stats bar and `QuickActions` for action shortcuts.

**Test:** Teacher logs in → sees proper stats cards + quick action grid → clicking "Create New Course" navigates correctly.

---

## Task D.7 — Teacher: Students Page with Data

```
Files to modify:
  web/src/app/(teacher)/teacher/students/page.tsx  ← Replace placeholder with real data
  web/src/app/api/teacher/students/route.ts        ← New API route
  web/src/components/teacher/student-table.tsx     ← New component
```

**Write:** Students page shows real enrolled students per teacher's courses:
- Table: name, email, enrolled courses, last activity, average score
- Search/filter
- Empty state for no enrollments

**Test:** Enroll 5 students → teacher sees 5 rows in students table → search filters correctly.

---

## Task D.8 — Parent Dashboard (Scaffold)

```
Files to create:
  web/src/app/(parent)/layout.tsx
  web/src/app/(parent)/parent/page.tsx
  web/src/components/parent/children-overview.tsx
```

**Write:** Parent layout with auth guard. Dashboard shows placeholder with "Parent Dashboard — Coming Soon" and a child linking flow description.

Actual child linking flow (Phase 4 scope) is not part of this task — only the route group shell.

**Test:** Login as parent → redirects to `/parent` → sees dashboard scaffold.

---

## Task D.9 — XP Awarded on Lesson Complete

```
Files to modify:
  web/src/app/api/lessons/[id]/progress/route.ts  ← Award XP on completion
```

**Write:** When a lesson is marked complete, auto-create an `XPTransaction` record: +100 XP. On quiz pass (80%+): +50 XP bonus.

**Test:** Complete lesson → XPTransaction created with amount 100. Pass quiz → +50 bonus XP.

---

## Task D.10 — Dashboard: Loading & Error States

```
Files to audit & fix:
  web/src/components/dashboard/dashboard-content.tsx
  web/src/app/(dashboard)/dashboard/page.tsx
  web/src/app/(dashboard)/dashboard/courses/page.tsx
```

**Write:** All dashboard pages show proper loading skeletons (not blank) and error states with retry when DB queries fail.

**Test:** Simulate DB failure → error state with "Try Again" button. Simulate slow query → skeleton appears.

---

## Task D.11 — Dev Mode: Remaining Gaps

```
Files to create/modify:
  web/src/components/dev-mode/OverlaySystem.tsx     ← Not a stub, actually manage overlays
  web/src/components/dev-mode/StructureTree.tsx     ← Wire drag-to-reorder (dnd-kit)
  web/src/lib/responsive-engine.ts                  ← Wire into PropertiesPanel + LivePreview
  web/src/components/dev-mode/PropertiesPanel.tsx   ← Add responsive style overrides per breakpoint
  web/src/components/dev-mode/PresetPicker.tsx      ← Wire to section-builder onApply
  web/src/components/ui/toast.tsx                   ← Use toast system instead of state-based
```

Dev Mode gaps from Phase 2.5 that need closing:
- `OverlaySystem.tsx` is a pass-through stub (14 lines, no logic)
- `responsive-engine.ts` exists but is not wired into PropertiesPanel or LivePreview
- `StructureTree` has decorative grip icon but no actual drag-to-reorder
- `responsive-engine.ts` style merging not applied to live preview
- No proper toast system for notifications

**Write:** All 6 gaps closed. Dev Mode is fully functional end-to-end.

**Test:** 
- OverlaySystem manages overlay z-ordering and position tracking
- Drag a block in StructureTree → reorders → canvas updates
- Switch to mobile → properties panel shows per-breakpoint style overrides
- Presets apply and persist to DB
- Toast shows on publish/save

---

## Phase Validation Gate

- [ ] Dashboard "Active Courses" shows real enrolled courses with progress
- [ ] Learning streak tracks daily activity, displays real count
- [ ] XP popup animates on lesson/quiz completion
- [ ] Level progress indicator shows level + XP to next
- [ ] Streak flame in header displays real streak
- [ ] "Continue Learning" shows incomplete lesson with resume link
- [ ] Teacher dashboard uses OverviewStats + QuickActions components
- [ ] Teacher students page shows real enrolled students with search
- [ ] Parent dashboard route group scaffolded
- [ ] XP awarded automatically on lesson/quiz completion
- [ ] All dashboard pages have proper loading/error states
- [ ] OverlaySystem is a real overlay manager, not a stub
- [ ] StructureTree supports drag-to-reorder
- [ ] Responsive engine wired into properties panel + live preview
- [ ] Presets fully connected to section creation flow
- [ ] Toast notifications use proper toast system
- [ ] `typecheck` + `next build` pass with zero errors

> **Phase Complete** ✅ — All dashboards fully functional, Dev Mode gaps closed.
