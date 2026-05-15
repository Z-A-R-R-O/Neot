# Mobile Strategy — Detailed Specification

## Overview
Flutter-based mobile app that mirrors the web platform while adding native capabilities: offline support, push notifications, camera, microphone, and smooth animations optimized for low-end devices.

## Platform Support

| Platform | Priority | Minimum Version | Notes |
|----------|----------|-----------------|-------|
| Android | Primary | Android 8.0 (API 26) | 95% of target market |
| iOS | Secondary | iOS 14 | Higher-income users |
| Web (PWA) | Tertiary | Modern browsers | Instant access, no install |

## App Structure

```
lib/
├── main.dart                    # App entry, provider setup
├── app.dart                     # MaterialApp, routing, theme
│
├── core/
│   ├── api/                     # Dio HTTP client, interceptors
│   │   ├── api_client.dart
│   │   ├── api_interceptors.dart
│   │   └── endpoints.dart
│   ├── auth/                    # Supabase Auth integration
│   │   ├── auth_service.dart
│   │   └── auth_guard.dart
│   ├── cache/                   # Local storage (Hive/Isar)
│   │   ├── cache_manager.dart
│   │   ├── offline_queue.dart
│   │   └── storage_optimizer.dart
│   ├── theme/                   # Dynamic theme from CMS
│   │   ├── theme_provider.dart
│   │   ├── theme_converter.dart
│   │   └── widget_themes.dart
│   ├── network/                 # Connectivity detection
│   │   ├── connectivity_service.dart
│   │   └── sync_manager.dart
│   └── utils/                   # Helpers, constants
│       ├── constants.dart
│       ├── screen_utils.dart
│       └── validators.dart
│
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   ├── widgets/
│   │   └── providers/
│   ├── dashboard/
│   │   ├── screens/
│   │   ├── widgets/             # Streak card, Continue card
│   │   └── providers/
│   ├── lessons/
│   │   ├── screens/
│   │   ├── widgets/             # Block renderers
│   │   │   ├── blocks/
│   │   │   │   ├── text_block.dart
│   │   │   │   ├── video_block.dart
│   │   │   │   ├── quiz_block.dart
│   │   │   │   ├── flashcard_block.dart
│   │   │   │   ├── drag_drop_block.dart
│   │   │   │   ├── audio_block.dart
│   │   │   │   ├── drawing_block.dart
│   │   │   │   └── ai_tutor_block.dart
│   │   │   └── block_renderer.dart
│   │   └── providers/
│   ├── quizzes/
│   ├── gamification/
│   ├── achievements/
│   ├── ai_tutor/
│   ├── search/
│   └── profile/
│
├── shared/
│   ├── widgets/                 # Reusable components
│   │   ├── loading_skeleton.dart
│   │   ├── error_widget.dart
│   │   ├── offline_banner.dart
│   │   ├── celebration_overlay.dart
│   │   └── animated_progress.dart
│   └── models/                  # Shared data models
│       ├── user.dart
│       ├── course.dart
│       ├── lesson.dart
│       ├── block.dart
│       └── quiz.dart
│
└── l10n/                        # Localization
    ├── app_en.arb
    ├── app_hi.arb               # Hindi
    ├── app_es.arb               # Spanish
    └── app_fr.arb               # French
```

## State Management (Riverpod)

```dart
// Provider example structure
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authServiceProvider));
});

final dashboardProvider = FutureProvider.family<DashboardData, String>((ref, userId) {
  return ref.read(dashboardServiceProvider).getDashboard(userId);
});

final lessonProvider = StateNotifierProvider.family<LessonNotifier, LessonState, String>(
  (ref, lessonId) => LessonNotifier(ref, lessonId),
);

// Adaptive block rendering
final blockRendererProvider = Provider.family<Widget, BlockConfig>((ref, blockConfig) {
  switch (blockConfig.type) {
    case 'text': return TextBlock(blockConfig);
    case 'quiz': return QuizBlock(blockConfig);
    case 'video': return VideoBlock(blockConfig);
    // ...
  }
});
```

## Offline-First Architecture

### Sync Strategy

```
Online Mode:
  Real-time API calls → Cache results locally → Display

Offline Mode:
  Read from local cache → Queue writes → Sync when online
```

### Local Storage (Hive/Isar)

```dart
// Cache structure
class CacheManager {
  static const boxes = {
    'courses': Duration(days: 7),
    'lessons': Duration(days: 30),
    'user_profile': Duration(days: 1),
    'quiz_attempts': Duration(days: 7),
    'theme_config': Duration(days: 1),
    'achievements': Duration(days: 1),
  };

  Future<void> cacheCourse(Course course) async {
    final box = await Hive.openBox('courses');
    await box.put(course.id, course.toJson());
    await box.put('${course.id}_cached_at', DateTime.now().toIso8601String());
  }

  Future<Course?> getCachedCourse(String id) async {
    final box = await Hive.openBox('courses');
    final data = box.get(id);
    final cachedAt = box.get('${id}_cached_at');
    
    if (data == null || cachedAt == null) return null;
    
    final age = DateTime.now().difference(DateTime.parse(cachedAt));
    if (age > const Duration(days: 7)) return null; // Expired
    
    return Course.fromJson(data);
  }
}
```

### Offline Queue

```dart
class OfflineQueue {
  final List<QueuedAction> queue = [];

  Future<void> enqueue(QueuedAction action) async {
    queue.add(action);
    await persistQueue();
  }

  Future<void> syncAll() async {
    while (queue.isNotEmpty) {
      final action = queue.first;
      try {
        await action.execute();
        queue.removeAt(0);
      } catch (e) {
        // Retry later
        break;
      }
    }
    await persistQueue();
  }
}

class QueuedAction {
  final String type; // 'quiz_attempt', 'lesson_progress', 'note'
  final Map<String, dynamic> data;
  final DateTime createdAt;

  Future<void> execute() async {
    final api = ApiClient();
    switch (type) {
      case 'quiz_attempt':
        await api.post('/quizzes/attempt', data: data);
        break;
      case 'lesson_progress':
        await api.patch('/lessons/progress', data: data);
        break;
    }
  }
}
```

## Performance Optimization for Low-End Devices

### Strategy

| Technique | Implementation | Impact |
|-----------|---------------|--------|
| **Lazy Loading** | Load screens only when navigated to | 40% less memory |
| **Image Optimization** | WebP format, 720p max, progressive loading | 60% less bandwidth |
| **Animation Budget** | Reduced animations on low-battery/low-RAM | Battery life +30% |
| **Widget Reparenting** | Minimize rebuild scope with Riverpod select() | Smoother 60fps |
| **ShrinkWrap Off** | Prefer fixed-size lists over shrinkWrap | Better scroll perf |
| **Const Widgets** | Maximize const constructors | Less GC pressure |
| **Isolate Compute** | Heavy computation in background isolates | No UI jank |
| **Memory Pool** | Reuse frequently created objects | Less allocation |

### Device Detection

```dart
class DeviceCapability {
  static bool isLowEndDevice() {
    final ram = DeviceInfo().totalMemory;
    final cores = DeviceInfo().processorCores;
    return ram < 2 * 1024 * 1024 * 1024 || cores < 4; // <2GB RAM or <4 cores
  }

  static bool isSlowNetwork() {
    final connection = Connectivity().checkConnectivity();
    return connection == ConnectivityResult.mobile && 
           DeviceInfo().connectionType == '2G' || 
           DeviceInfo().connectionType == '3G';
  }

  static AnimationConfig getAnimationConfig() {
    if (isLowEndDevice()) {
      return AnimationConfig(enable: false);
    }
    if (isSlowNetwork()) {
      return AnimationConfig(enable: true, reduced: true);
    }
    return AnimationConfig(enable: true, full: true);
  }
}
```

## Push Notifications

| Event | Trigger | Platform |
|-------|---------|----------|
| Streak milestone | 3/7/30 day streak | Android + iOS |
| New lesson available | Teacher publishes | Android + iOS |
| Quiz result | Attempt submitted | Android + iOS |
| Achievement unlocked | Milestone reached | Android + iOS |
| Reminder to study | Inactivity > 48h | Android + iOS |
| Parent alert | Score below threshold | Android + iOS |
| Assignment due | Deadline approaching | Android + iOS |

## App Size Optimization

| Asset | Strategy | Size |
|-------|----------|------|
| App bundle | Split APK per ABI | < 8MB per variant |
| Fonts | Subset only used characters | < 200KB |
| Images | WebP + CDN, no assets in bundle | < 500KB |
| Animations | Lottie files (compressed JSON) | < 100KB |
| Initial load | Lazy-load feature modules | < 2MB initial |

## Flutter vs React Native Decision

| Factor | Flutter | React Native | Verdict |
|--------|---------|--------------|---------|
| Animation performance | ✅ Excellent (Skia engine) | ⚠️ Good (JS bridge overhead) | Flutter |
| Low-end device perf | ✅ Better | ⚠️ Heavier | Flutter |
| Kids animation | ✅ Smooth 60fps | ⚠️ Drops frames | Flutter |
| Time to market | ⚠️ Moderate | ✅ Faster ecosystem | Tie |
| Web target | ⚠️ Beta quality | ✅ React Native Web | RN for web |
| Custom UI | ✅ Full control | ⚠️ Native components | Flutter |
| Developer availability | ⚠️ Less common | ✅ More devs | RN |

**Decision**: Flutter for mobile (better animations for kids + low-end perf), Next.js for web.
