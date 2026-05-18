# Teacher Dashboard — Spec

## Overview

Teachers create courses, manage lessons, assign work, and track student progress.

## Core Features

### Dashboard

- Overview of all courses taught
- Student enrollment counts per course
- Recent activity feed
- Pending assignments to grade
- Quick actions: create course, add assignment

### Course Builder

- Course metadata: title, description, thumbnail, category
- Module organization (drag-and-drop)
- Lesson creation within modules
- Section builder using Section Registry
- Preview mode before publishing
- Draft/published states

### Content Creation

- Rich text editor for text sections
- Video upload/embed for video sections
- Quiz builder with question types
- File upload for downloads
- Interactive content embedding
- Bulk import (CSV, SCORM)

### Assignment Management

- Create assignments with due dates
- Attach to specific lessons/modules
- Set point values, grading rubrics
- View submissions, grade, provide feedback
- Bulk actions for multiple submissions

### Student Tracking

- Per-student progress view
- Class-wide analytics
- At-risk student identification
- Engagement metrics (login frequency, time spent)
- Export reports (CSV, PDF)

### Communication

- Announcements to enrolled students
- Direct messaging (optional)
- Feedback on assignments
- Course-wide discussions (optional)

## User Flow

```
Login → Dashboard → Create/Edit Course → Build Content → Publish → Assign → Track → Grade
```

## Permissions

| Action | Permission |
|--------|-----------|
| Create course | Teacher role |
| Edit own courses | Course owner |
| View student data | Enrolled students |
| Grade assignments | Course owner or TA |
| Delete course | Course owner or Admin |
