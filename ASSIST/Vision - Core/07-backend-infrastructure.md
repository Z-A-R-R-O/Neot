# Backend Infrastructure — Detailed Specification

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend Platform | Supabase | Auth, DB, Storage, Realtime, RLS |
| Database | PostgreSQL 15 | Primary relational database |
| Caching | Redis 7 | Session, query cache, rate limiting |
| File Storage | Supabase Storage / S3-compatible | Media, uploads, backups |
| Queue | Supabase Realtime / pg_cron | Async jobs, notifications |
| Search | PostgreSQL Full-Text Search / Meilisearch | Course/content search |
| AI | OpenAI API + pgvector | Embeddings, recommendations, tutor |
| Monitoring | Supabase Logs + Sentry | Error tracking, performance |
| CDN | Vercel Edge Network | Static assets, image optimization |

## Database Schema Design

### Core Tables

```sql
-- Users & Authentication (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'parent', 'admin')) DEFAULT 'student',
  age_group TEXT CHECK (age_group IN ('child', 'teen', 'adult')),
  parent_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  teacher_id UUID REFERENCES public.profiles(id),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  age_range INT4RANGE,
  estimated_minutes INT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  is_adaptive BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules (course chapters)
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL,
  estimated_minutes INT,
  content_schema JSONB NOT NULL DEFAULT '[]',
  -- content_schema stores ordered array of block references:
  -- [{block_type: "text", block_id: "uuid", config: {...}}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocks (reusable learning components)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type TEXT NOT NULL CHECK (block_type IN (
    'text', 'video', 'quiz', 'flashcards', 'drag_drop',
    'code_sandbox', 'story', 'audio', 'ai_interaction',
    'drawing_canvas', 'memory_game', 'poll', 'embed'
  )),
  name TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  -- config varies by block_type:
  -- text: {content, formatting}
  -- quiz: {questions[], passing_score, shuffle}
  -- video: {url, transcript, captions}
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) DEFAULT 0, -- 0.00 to 100.00
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- Lesson Progress
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  time_spent_seconds INT DEFAULT 0,
  score DECIMAL(5,2),
  attempts INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- Quiz Attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.blocks(id),
  lesson_id UUID REFERENCES public.lessons(id),
  score DECIMAL(5,2),
  answers JSONB NOT NULL,
  time_taken_seconds INT,
  hint_used INT DEFAULT 0,
  adaptive_difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamification
CREATE TABLE public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT,
  source TEXT, -- 'lesson', 'quiz', 'streak', 'achievement'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adaptive Engine
CREATE TABLE public.adaptive_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  learning_speed DECIMAL(5,2), -- relative to average
  retention_score DECIMAL(5,2),
  struggle_areas TEXT[], -- array of concept keys
  preferred_learning_style TEXT CHECK (
    learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')
  ),
  attention_span_minutes INT,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Admin CMS (page builder)
CREATE TABLE public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL, -- 'homepage', 'courses', 'about', etc.
  section_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Themes
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  config JSONB NOT NULL,
  -- config: {colors{}, typography{}, radii{}, animations{}, spacing{}}
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events (high-volume, consider time-series)
CREATE TABLE public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  event_type TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX idx_xp_events_user ON public.xp_events(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_analytics_user ON public.analytics_events(user_id, event_type);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);
CREATE INDEX idx_courses_status ON public.courses(status, difficulty);
CREATE INDEX idx_courses_search ON public.courses USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_page_sections_active ON public.page_sections(page_key, is_active);
CREATE INDEX idx_profiles_role ON public.profiles(role);
```

### Row Level Security (Supabase RLS)

```sql
-- Examples of RLS policies
-- Students can only read their own progress
CREATE POLICY student_own_progress ON public.lesson_progress
  FOR ALL USING (auth.uid() = student_id);

-- Teachers can read their own courses
CREATE POLICY teacher_own_courses ON public.courses
  FOR ALL USING (auth.uid() = teacher_id);

-- Parents can read their children's progress
CREATE POLICY parent_children_progress ON public.lesson_progress
  FOR SELECT USING (
    auth.uid() IN (
      SELECT parent_id FROM public.profiles WHERE id = student_id
    )
  );

-- Admins have full access
CREATE POLICY admin_full_access ON public.courses
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );
```

## API Design

### REST API Endpoints

```
# Authentication
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
GET    /api/auth/session

# Users
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/:id
GET    /api/users/:id/progress

# Courses
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PATCH  /api/courses/:id
DELETE /api/courses/:id
GET    /api/courses/:id/modules
GET    /api/courses/:id/lessons

# Lessons
GET    /api/lessons/:id
POST   /api/lessons/:id/progress
PATCH  /api/lessons/:id/progress

# Quizzes
POST   /api/quizzes/:blockId/attempt
GET    /api/quizzes/:blockId/attempts

# Enrollments
POST   /api/enrollments
GET    /api/enrollments/mine
DELETE /api/enrollments/:id

# Gamification
GET    /api/gamification/xp
GET    /api/gamification/streak
GET    /api/gamification/achievements
GET    /api/gamification/leaderboard

# Analytics
GET    /api/analytics/overview
GET    /api/analytics/courses/:id
GET    /api/analytics/students/:id

# Recommendations
GET    /api/recommendations

# AI
POST   /api/ai/tutor
POST   /api/ai/generate-content
POST   /api/ai/explain

# Admin CMS
GET    /api/admin/pages/:key
PUT    /api/admin/pages/:key
GET    /api/admin/themes
POST   /api/admin/themes
PUT    /api/admin/themes/:id
GET    /api/admin/analytics
GET    /api/admin/users
PATCH  /api/admin/users/:id
```

### GraphQL (for complex queries)

```graphql
# Example query for student dashboard
query StudentDashboard {
  me {
    name
    avatar
    xp
    streak
    currentCourses {
      id
      title
      progress
      nextLesson {
        id
        title
      }
    }
    recommendations {
      id
      title
      thumbnail
      relevanceScore
    }
    achievements(last: 5) {
      key
      name
      icon
      unlockedAt
    }
  }
}
```

## Real-time Features (Supabase Realtime)

- **Live progress**: Teacher sees student progress as they complete lessons
- **Collaborative**: Student sees classmates' activity in shared courses
- **Notifications**: Instant push when achievements unlocked
- **Admin**: Real-time dashboard metrics
- **Chat**: Student-AI tutor streaming responses

## File Storage Structure

```
/media
  /avatars
    /{user_id}.jpg
  /thumbnails
    /{course_id}.jpg
  /videos
    /{lesson_id}/
  /audio
    /{lesson_id}/
  /documents
    /{uuid}.pdf
  /uploads
    /{teacher_id}/
      /{uuid}.{ext}
```

## Caching Strategy

| Data | Cache TTL | Strategy |
|------|-----------|---------|
| Course list | 5 minutes | Cache-aside |
| Lesson content | 1 hour | Cache-aside |
| User profile | 30 minutes | Write-through |
| Analytics aggregations | 1 hour | Lazy refresh |
| Theme config | 24 hours | Write-through |
| Page sections | 1 hour | Cache-aside |
| Leaderboard | 5 minutes | Background refresh |

## Queue/Async Jobs

| Job | Trigger | Action |
|-----|---------|--------|
| Welcome email | User signup | SendGrid API call |
| Streak check | Daily cron | Update streak counts |
| Analytics aggregation | Hourly | Rollup raw events |
| Recommendation refresh | Daily | Re-calculate all profiles |
| Achievement check | On lesson complete | Check & award achievements |
| Certificate generation | Course complete | Generate PDF |
| Content moderation | New upload | AI scan for inappropriate content |
| Backup | Daily | Database dump to S3 |
