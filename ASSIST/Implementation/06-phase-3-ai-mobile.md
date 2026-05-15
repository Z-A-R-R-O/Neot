# Phase 3: AI & Mobile

> **Goal:** AI tutor assistant, AI content generation for teachers, Flutter mobile app.

---

## Task 3.1 — OpenAI Integration Layer

```
Files to create:
  web/src/lib/ai/openai-client.ts
  web/src/lib/ai/models.ts
  web/src/lib/ai/prompts.ts
  web/src/lib/ai/safety.ts
  web/src/app/api/ai/route.ts
```

```typescript
class AIClient {
  private openai: OpenAI;

  async generate(request: AIRequest): Promise<AIResponse> {
    const model = this.selectModel(request);
    const moderated = await this.moderateInput(request.input);
    if (moderated.flagged) return this.safeFallback();

    const response = await this.openai.chat.completions.create({
      model,
      messages: [this.systemPrompt(request), ...request.messages],
      temperature: 0.7,
      max_tokens: 1024,
      stream: request.stream ?? false,
    });

    const outputModeration = await this.moderateOutput(response);
    if (outputModeration.flagged) return this.safeFallback();

    return this.formatResponse(response);
  }

  private selectModel(request: AIRequest): string {
    if (request.type === 'content_generation') return 'gpt-4o';
    if (request.type === 'tutor' && request.mode === 'simple') return 'gpt-4o-mini';
    return 'gpt-4o';
  }
}
```

Safety pipeline:
1. Input sanitization
2. OpenAI Moderation API check
3. System prompt injection (age-appropriate)
4. Generate response
5. Output moderation check
6. Fallback if flagged

**Write:** AI client handles all OpenAI interactions with safety guardrails.
**Test:** Send safe query → get response. Send flagged query → safe fallback.

---

## Task 3.2 — AI Tutor (Web)

```
Files to create:
  web/src/components/ai/ai-tutor.tsx
  web/src/components/ai/ai-tutor-button.tsx
  web/src/components/ai/ai-tutor-chat.tsx
  web/src/components/ai/ai-tutor-message.tsx
  web/src/components/ai/ai-mode-selector.tsx
  web/src/hooks/useAITutor.ts
  web/src/app/api/ai/tutor/route.ts
```

Interface (collapsible panel in lesson player):
```
┌──────────────────────────────────────────┐
│  🤖 AI Tutor                   [✕]      │
├──────────────────────────────────────────┤
│  AI: How can I help with this lesson?   │
│                                          │
│  You: I don't get fractions              │
│                                          │
│  AI: Think of pizza slices...            │
│                                          │
│  [🎤] ┌──────────────────────┐ [➤]     │
│       │ Type your question... │          │
│       └──────────────────────┘          │
└──────────────────────────────────────────┘
```

Tutor modes: Explain, Simplify (ELI5), Deep Dive, Socratic, Code Help.
System prompts per age group (child/teen/adult) — configurable in admin.

```typescript
interface TutorRequest {
  question: string;
  lessonId?: string;
  studentId: string;
  mode: 'explain' | 'simplify' | 'deep' | 'socratic' | 'code';
  context: {
    currentLesson: string;
    recentMistakes?: string[];
    ageGroup: 'child' | 'teen' | 'adult';
    language: string;
  };
}
```

**Write:** AI tutor accessible from any lesson. Context-aware. Multi-mode.
**Test:** Ask "explain photosynthesis" → age-appropriate response. Switch to simplify → simpler response.

---

## Task 3.3 — AI Tutor Streaming

```
Files to update:
  web/src/lib/ai/openai-client.ts
  web/src/hooks/useAITutor.ts
  web/src/components/ai/ai-tutor-chat.tsx
```

Implement streaming response via OpenAI SSE for real-time token-by-token display.

```typescript
async function* streamTutorResponse(request: TutorRequest) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [...],
    stream: true,
  });
  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || '';
  }
}
```

**Write:** AI responses stream token by token. No loading spinner — instant feedback.
**Test:** Ask question → characters appear progressively.

---

## Task 3.4 — AI Content Generator (Teacher)

```
Files to create:
  web/src/components/ai/content-generator.tsx
  web/src/components/ai/content-generator-form.tsx
  web/src/components/ai/generated-content-preview.tsx
  web/src/hooks/useAIContent.ts
  web/src/app/api/ai/generate-content/route.ts
```

Teacher input:
- Topic, age group, content type (lesson/quiz/flashcards/explanation/homework)
- Blocks to include (text, quiz, activity)
- Style (playful/formal/story/challenge)
- Language, duration

Generation types:
| Type | Output | Quality Check |
|------|--------|---------------|
| Full Lesson | Title, text blocks, quiz, activity | Factual accuracy |
| Quiz Questions | N questions with answers | Difficulty calibration |
| Explanations | Simplified text | Reading level match |
| Flashcards | N card deck | Spacing optimized |
| Summary | Bullet points | Key points covered |

```typescript
interface GenerateRequest {
  topic: string;
  ageGroup: 'child' | 'teen' | 'adult';
  contentType: 'lesson' | 'quiz' | 'explanation' | 'homework' | 'flashcards';
  blocks?: BlockType[];
  style?: 'playful' | 'formal' | 'story' | 'challenge';
  duration?: number;
}
```

**Write:** Teacher enters "Create lesson about fractions for 8-year-olds" → generated content preview with Accept/Edit/Regenerate.
**Test:** Generate lesson → preview blocks → Accept → blocks appear in lesson editor.

---

## Task 3.5 — AI Cost Optimization

```
Files to create:
  web/src/lib/ai/cache.ts          ← Redis cache for common Q&A
  web/src/lib/ai/cost-tracker.ts   ← Track per-student usage
  web/src/lib/ai/rate-limiter.ts   ← Max N requests/hour per student
```

Strategies:
| Strategy | Implementation | Impact |
|----------|---------------|--------|
| Caching | Cache Q&A pairs in Redis (TTL: 24h) | 40-60% savings |
| Model Tiering | Simple Q: gpt-4o-mini, Complex: gpt-4o | 50-70% savings |
| Prompt Compression | Strip unnecessary context | 20-30% savings |
| Rate Limiting | Max 20 requests/hour per student | Prevents abuse |
| Streaming | Reduces timeout costs | UX improvement |

**Write:** Repeated questions served from cache. Rate limits enforced. Model tiering active.
**Test:** Ask same question twice → second response instant (cache hit). 21st request → rate limit error.

---

## Task 3.6 — AI Safety Configuration (Admin)

```
Files to update:
  web/src/app/(admin)/admin/ai/page.tsx
  web/src/components/admin/ai/ai-settings.tsx
  web/src/components/admin/ai/ai-system-prompts.tsx
  web/src/components/admin/ai/ai-test-console.tsx
```

Admin can:
- Select AI model
- Set temperature, max tokens
- Configure system prompts per age group
- Toggle safety filters (strict/relaxed)
- Test AI responses with sample queries
- View cost/usage analytics

**Write:** Admin panel for all AI configuration. Test console for prompt experimentation.
**Test:** Change system prompt for child mode → AI tutor uses new prompt.

---

## Task 3.7 — Flutter Project Scaffolding

```
Files to create:
  mobile/
    pubspec.yaml
    lib/main.dart
    lib/app.dart
    lib/core/
      api/api_client.dart
      api/endpoints.dart
      auth/auth_service.dart
      auth/auth_guard.dart
      cache/cache_manager.dart
      theme/theme_provider.dart
      network/connectivity_service.dart
      network/sync_manager.dart
```

```yaml
# pubspec.yaml dependencies
flutter_riverpod: ^2.4.0
dio: ^5.4.0
hive: ^2.2.3
hive_flutter: ^1.1.0
supabase_flutter: ^1.10.0
go_router: ^12.1.0
lottie: ^2.7.0
cached_network_image: ^3.3.0
connectivity_plus: ^5.0.0
flutter_secure_storage: ^9.0.0
```

**Write:** Flutter app builds, shows login screen, connects to Supabase backend.
**Test:** `flutter run` → app launches → login works → sees dashboard placeholder.

---

## Task 3.8 — Flutter Core Screens

```
Files to create:
  mobile/lib/features/auth/screens/
  mobile/lib/features/dashboard/screens/
  mobile/lib/features/lessons/screens/
  mobile/lib/features/lessons/widgets/blocks/
  mobile/lib/features/gamification/
  mobile/lib/features/profile/
  mobile/lib/shared/widgets/
  mobile/lib/l10n/
```

Auth: Login, signup, onboarding (same flows as web).
Dashboard: Continue learning, streak, XP, recommended courses.
Lesson Player: Block renderer (text, video, quiz).
Profile: Avatar, name, settings.

State management (Riverpod):
```dart
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authServiceProvider));
});

final dashboardProvider = FutureProvider.family<DashboardData, String>((ref, userId) {
  return ref.read(dashboardServiceProvider).getDashboard(userId);
});
```

**Write:** Student can login → see dashboard → open lesson → complete quiz → see XP update.
**Test:** Login → dashboard loads → tap course → lessons → complete quiz → back to dashboard → XP increased.

---

## Task 3.9 — Flutter Offline Support

```
Files to create:
  mobile/lib/core/cache/offline_queue.dart
  mobile/lib/core/network/sync_manager.dart
  mobile/lib/features/lessons/services/offline-downloader.dart
```

```dart
class OfflineQueue {
  Future<void> enqueue(QueuedAction action) async { /* persist to Hive */ }
  Future<void> syncAll() async {
    while (queue.isNotEmpty) {
      try {
        await queue.first.execute();
        queue.removeAt(0);
      } catch (e) { break; } // retry later
    }
  }
}
```

Cached data (with TTL):
- Courses: 7 days
- Lessons: 30 days (or until manually removed)
- User profile: 1 day
- Quiz attempts: 7 days (sync on reconnect)
- Theme config: 1 day

**Write:** Lessons cache for offline viewing. Quiz answers queued for sync when online.
**Test:** Go offline → open cached lesson → complete quiz → reconnect → answers sync.

---

## Task 3.10 — Flutter Push Notifications

```
Files to create:
  mobile/lib/core/notifications/
```

Firebase Cloud Messaging integration:
- Streak milestone (3/7/30 day)
- New lesson available
- Quiz result
- Achievement unlocked
- Study reminder (inactivity > 48h)
- Parent alert

**Write:** Device registers for push. Server sends targeted notifications.
**Test:** Complete lesson → achievement notification received.

---

## Phase 3 Validation Gate

- [ ] AI client connected with safety pipeline
- [ ] AI tutor accessible from lesson player
- [ ] Streaming responses work
- [ ] AI content generator creates lessons from prompts
- [ ] AI cost optimization (caching, model tiering)
- [ ] Admin can configure AI settings
- [ ] Flutter app builds and runs on Android
- [ ] Flutter login/signup works with Supabase
- [ ] Flutter lesson player renders text, video, quiz
- [ ] Flutter offline caching works
- [ ] Flutter push notifications received
- [ ] Flutter gamification elements display

> **Phase 3 Complete** ✅ → Move to `06-phase-4-parent-school.md`
