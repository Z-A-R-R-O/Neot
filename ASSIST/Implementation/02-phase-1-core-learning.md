# Phase 1: Core Learning System

> **Goal:** Students take courses. Teachers create them. Quizzes work end-to-end.

---

## Task 1.1 — Database Migrations for Courses

```
Files to create:
  web/supabase/migrations/002_courses.sql
```

Tables:
- `categories` (id, name, slug, description, icon, sort_order)
- `courses` (id, title, description, thumbnail, category_id, teacher_id, difficulty, age_range, estimated_minutes, status, is_adaptive, metadata JSONB)
- `modules` (id, course_id, title, description, sort_order)

RLS: teachers CRUD own courses, students read published.
Indexes on teacher_id, category_id, status.

**Write:** `npx supabase migration up` applies cleanly. RLS works.
**Test:** Insert course via SQL → visible to owner, hidden from others.

---

## Task 1.2 — Course CRUD API

```
Files to create:
  web/src/app/api/courses/route.ts
  web/src/app/api/courses/[id]/route.ts
  web/src/app/api/courses/[id]/modules/route.ts
  web/src/lib/supabase/queries/courses.ts
```

```typescript
GET    /api/courses                    → list (filtered)
GET    /api/courses/:id                → single with modules
POST   /api/courses                    → create (teacher only)
PATCH  /api/courses/:id                → update (owner or admin)
DELETE /api/courses/:id                → soft-delete
GET    /api/courses/:id/modules        → modules with lesson count
```

**Write:** API returns typed responses. Unauthorized requests get 403.
**Test:** `curl POST /api/courses` as teacher → 201. As student → 403.

---

## Task 1.3 — Course Listing & Detail Pages

```
Files to create:
  web/src/app/courses/page.tsx
  web/src/app/courses/[courseId]/page.tsx
  web/src/components/courses/course-card.tsx
  web/src/components/courses/course-grid.tsx
  web/src/components/courses/course-header.tsx
  web/src/components/courses/module-list.tsx
  web/src/components/courses/enroll-button.tsx
  web/src/hooks/useCourses.ts
```

Course card: thumbnail, title, teacher name, difficulty badge, progress bar, estimated time.
Course detail: header, module list with expandable lessons, enroll CTA.

**Write:** Student sees published courses. Course detail shows modules. Enroll button creates enrollment.
**Test:** Browse → click course → see detail → enroll → course appears in "My Courses".

---

## Task 1.4 — Lessons Table + API

```
Files to create:
  web/supabase/migrations/003_lessons.sql
  web/src/app/api/lessons/[id]/route.ts
  web/src/app/api/lessons/[id]/progress/route.ts
  web/src/lib/supabase/queries/lessons.ts
```

Tables:
- `lessons` (module_id, title, sort_order, estimated_minutes, content_schema JSONB)
- `lesson_progress` (student_id, lesson_id, status, time_spent, score, metadata JSONB)

```typescript
// content_schema
interface ContentSchema {
  blocks: Array<{
    blockId: string;
    blockType: BlockType;
    config: Record<string, any>;
  }>;
}
```

**Write:** Lesson API returns content_schema. Progress can be created/updated.
**Test:** Create lesson → fetch via API → receives content_schema array.

---

## Task 1.5 — Lesson Player Shell

```
Files to create:
  web/src/app/lessons/[lessonId]/page.tsx
  web/src/components/blocks/block-renderer.tsx
  web/src/components/player/player-header.tsx
  web/src/components/player/player-sidebar.tsx
  web/src/components/player/progress-bar.tsx
  web/src/components/player/navigation-buttons.tsx
  web/src/stores/lessonStore.ts
  web/src/hooks/useLessonProgress.ts
```

```
┌───┬────────────────────────────────────────────┐
│ ← │  📖 Lesson Title              ⏱ 12 min     │
├───┴────────────────────────────────────────────┤
│  [BLOCK RENDERER - renders current block]       │
│  [PREV]                              [NEXT ➡]  │
└─────────────────────────────────────────────────┘
```

**Write:** Player loads lesson → renders first block → Next advances → progress auto-saves on block change.
**Test:** Navigate through blocks. Page refresh → resume from last position.

---

## Task 1.6 — Text Block

```
Files to create:
  web/src/components/blocks/text-block.tsx
  web/src/types/blocks/text-block.ts
```

```typescript
interface TextBlockConfig {
  content: string;
  formatting?: {
    textColor?: string;
    bgColor?: string;
    fontSize?: 'sm' | 'md' | 'lg';
  };
}
```

Markdown rendering via `react-markdown` + `remark-gfm`. Optional math notation via KaTeX.

**Write:** Text block renders markdown with proper typography. Student can highlight text.
**Test:** Create block with markdown → renders headings, lists, links, code blocks.

---

## Task 1.7 — Video Block

```
Files to create:
  web/src/components/blocks/video-block.tsx
```

Supports:
- YouTube/Vimeo embed via URL
- Supabase Storage upload
- HTML5 video: play/pause, seek, speed control, captions, PiP
- Transcript side panel
- Timestamp bookmarking

```typescript
interface VideoBlockConfig {
  source: 'youtube' | 'vimeo' | 'upload';
  url: string;
  transcript?: string;
  captions?: { language: string; url: string }[];
  posterImage?: string;
}
```

**Write:** Paste YouTube link → embed renders. Upload video → plays from storage.
**Test:** Video plays, speed control works, transcript toggles.

---

## Task 1.8 — Quiz Block + Database

```
Files to create:
  web/supabase/migrations/004_quizzes.sql
  web/src/types/blocks/quiz-block.ts
  web/src/components/blocks/quiz-block.tsx
  web/src/app/api/quizzes/[blockId]/attempt/route.ts
  web/src/app/api/quizzes/[blockId]/attempts/route.ts
  web/src/lib/supabase/queries/quizzes.ts
```

Quiz types:
- Multiple choice (single answer)
- Multiple select (checkboxes)
- True/False
- Fill in the blank (text input)
- Matching (drag-drop pair matching)

```typescript
interface QuizBlockConfig {
  questions: Question[];
  passingScore: number;
  shuffle: boolean;
  showCorrectAnswers: boolean;
  maxAttempts: number;
  timeLimit?: number;
  adaptive: {
    enabled: boolean;
    difficultyLevels: ('easy' | 'medium' | 'hard')[];
  };
}

interface Question {
  id: string;
  type: 'mcq' | 'msq' | 'true-false' | 'fill-blank' | 'matching';
  text: string;
  options?: { id: string; text: string }[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}
```

**Write:** Quiz renders questions → student answers → instant feedback → score calculated → attempt saved.
**Test:** Submit MCQ → see correct/incorrect. Score saved to DB.

---

## Task 1.9 — Quiz Feedback & Results

```
Files to create:
  web/src/components/blocks/quiz-feedback.tsx
  web/src/components/blocks/quiz-results.tsx
  web/src/components/blocks/quiz-review.tsx
  web/src/components/blocks/quiz-timer.tsx
```

Results: score %, questions correct/total, time taken, per-question review.

**Write:** After last question → results overlay. Student can review each question.
**Test:** Complete quiz → see score. Click review → see each question with correct answer.

---

## Task 1.10 — Course Creation Flow (Teacher)

```
Files to create:
  web/src/app/(teacher)/layout.tsx
  web/src/app/(teacher)/teacher/courses/page.tsx
  web/src/app/(teacher)/teacher/courses/new/page.tsx
  web/src/app/(teacher)/teacher/courses/[id]/edit/page.tsx
  web/src/app/(teacher)/teacher/courses/[id]/modules/page.tsx
  web/src/app/(teacher)/teacher/courses/[id]/lessons/page.tsx
  web/src/app/(teacher)/teacher/courses/[id]/publish/page.tsx
  web/src/components/teacher/course-form.tsx
  web/src/components/teacher/module-manager.tsx
  web/src/components/teacher/publish-workflow.tsx
  web/src/hooks/useTeacherCourses.ts
```

**Write:** Teacher creates course → adds modules → adds lessons → publishes. Course visible to students.
**Test:** Teacher creates course with 3 modules → publishes → student sees and enrolls.

---

## Task 1.11 — Drag-Drop Lesson Builder

```
Files to create:
  web/src/app/(teacher)/teacher/lessons/[lessonId]/edit/page.tsx
  web/src/components/teacher/lesson-editor.tsx
  web/src/components/teacher/block-palette.tsx
  web/src/components/teacher/block-editor-wrapper.tsx
  web/src/components/teacher/block-editors/text-editor.tsx
  web/src/components/teacher/block-editors/quiz-editor.tsx
  web/src/components/teacher/block-editors/video-editor.tsx
  web/src/stores/editorStore.ts
  web/src/hooks/useBuilder.ts
```

```
┌───────────────────┬──────────────────────────────────────┐
│  🔍 Add Blocks    │  Block 1: Text                       │
│  [📝 Text]        │  Block 2: Quiz                       │
│  [📺 Video]       │  Block 3: Video                      │
│  [❓ Quiz]        │                                      │
│  [...]            │  [➕ Add Block]                       │
│                   │  [Save]              [Preview]       │
└───────────────────┴──────────────────────────────────────┘
```

**Write:** Teacher drags block → drops into lesson → editor appears → saves → content_schema updated.
**Test:** Add 3 blocks → drag to reorder → save → lesson preview shows correct order.

---

## Task 1.12 — Text Block Editor

```
Files to create:
  web/src/components/teacher/block-editors/text-editor.tsx
```

Features: Rich text toolbar (H1-H6, bold, italic, lists, links, images, code, math notation), reading level calculator.

**Write:** Teacher types formatted text → saves → renders correctly in lesson player.
**Test:** Create text with heading, bold, list, image, code block → preview renders correctly.

---

## Task 1.13 — Quiz Block Editor

```
Files to create:
  web/src/components/teacher/block-editors/quiz-editor.tsx
  web/src/components/teacher/block-editors/quiz-question-editor.tsx
  web/src/components/teacher/block-editors/quiz-option-editor.tsx
  web/src/components/teacher/block-editors/quiz-settings-panel.tsx
```

Features: Add questions, set options/answers, explanations, hints, difficulty, shuffle, passing score, timer, preview mode.

**Write:** Teacher creates 5-question quiz → previews → saves → renders in lesson player.
**Test:** Create quiz → set answers → save → student takes it → score recorded.

---

## Task 1.14 — Teacher Dashboard

```
Files to create:
  web/src/app/(teacher)/teacher/page.tsx
  web/src/components/teacher/dashboard/overview-stats.tsx
  web/src/components/teacher/dashboard/recent-activity.tsx
  web/src/components/teacher/dashboard/student-progress-table.tsx
  web/src/components/teacher/dashboard/quick-actions.tsx
  web/src/hooks/useTeacherAnalytics.ts
```

Widgets: Overview stats, My Courses cards, Student Performance table, Quick Actions.

**Write:** Teacher dashboard loads with real course and student data.
**Test:** Teacher logs in → sees courses → clicks course → sees student progress.

---

## Task 1.15 — Course Analytics

```
Files to create:
  web/src/app/(teacher)/teacher/courses/[id]/analytics/page.tsx
  web/src/components/teacher/analytics/enrollment-chart.tsx
  web/src/components/teacher/analytics/completion-funnel.tsx
  web/src/components/teacher/analytics/score-distribution.tsx
  web/src/components/teacher/analytics/drop-off-points.tsx
  web/src/components/teacher/analytics/difficulty-matrix.tsx
  web/src/hooks/useCourseAnalytics.ts
```

Charts (recharts): Enrollment line, Completion funnel, Score distribution bar, Drop-off points, Difficulty heatmap.

**Write:** Charts render with real data. Filterable by date range.
**Test:** Enroll 3 students → complete lessons → see completion funnel update.

---

## Task 1.16 — Lesson Progress Tracking

```
Files to update:
  web/src/hooks/useLessonProgress.ts
  web/src/app/api/lessons/[id]/progress/route.ts
  web/src/components/player/progress-bar.tsx
```

Auto-tracking: block view, time spent increment, quiz score, completion status, course progress %.

**Write:** Progress updates as student navigates. Resume works. Course progress reflects lesson completions.
**Test:** Complete 3 of 5 lessons → course shows 60%. Resume → starts at last block.

---

## Task 1.17 — Enrollment Management

```
Files to create:
  web/src/app/api/enrollments/route.ts
  web/src/app/api/enrollments/mine/route.ts
  web/src/components/courses/enroll-button.tsx
  web/src/hooks/useEnrollments.ts
```

**Write:** Student enrolls → course in "My Courses". Duplicate prevented.
**Test:** Enroll → see course. Re-enroll → 409 Conflict.

---

## Phase 1 Validation Gate

- [ ] Course CRUD works end-to-end
- [ ] Lesson player renders text, video, quiz blocks
- [ ] Quiz scoring + feedback works
- [ ] Teacher can create course with drag-drop builder
- [ ] Publish/unpublish workflow works
- [ ] Progress tracking saves and resumes
- [ ] Student enrollment flow complete
- [ ] Teacher dashboard shows real data
- [ ] Course analytics show charts
- [ ] Mobile-responsive lesson player
- [ ] Loading/error states for all data views
- [ ] E2E: Teacher creates → Student takes → Progress tracked

> **Phase 1 Complete** ✅ → Move to `03-phase-1.5-admin-cms.md`
