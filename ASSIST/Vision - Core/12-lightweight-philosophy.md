# Lightweight Philosophy — Detailed Specification

## Overview
The platform must work flawlessly on low-end devices, slow networks, and in bandwidth-constrained environments. This is a core differentiator, especially for markets like India, Southeast Asia, and Africa.

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.0s | Lighthouse |
| Bundle Size (initial) | < 100KB gzipped | Webpack analyzer |
| Runtime Memory | < 50MB | Chrome task manager |
| APK Size | < 8MB | Play Console |
| Offline Support | Full course caching | Manual test |
| 3G Load Time | < 5s to interactive | Network throttling |
| Images Loaded | Progressive/blur-up | Visual inspection |

## Web Performance Strategy

### Bundle Optimization

```
Next.js Bundle Strategy:

/app (routes)
  /dashboard    → Dynamic import, lazy load
  /lesson/:id   → Dynamic import, prefetch on hover
  /quiz/:id     → Dynamic import, prefetch on lesson complete

/lib (code splitting)
  /components
    /blocks/    → Each block type is lazy loaded
    /ai/        → AI tutor loaded only when opened

/vendors
  framer-motion → Tree-shake unused animations
  react-query   → Only what's needed
  zustand       → Already tiny (1KB)

Target: /dashboard route < 80KB JS gzipped
```

### Image Optimization

All images go through Next.js Image component for automatic:
- WebP format conversion
- Responsive size generation
- Lazy loading with blur-up placeholders
- Quality optimization (default 75%)

### Font Strategy

- Variable fonts (one file replaces multiple weights)
- `font-display: swap` to prevent invisible text
- Unicode range subsetting (latin-only for most pages)
- Fallback fonts with matching metrics to prevent layout shift

### Network Strategy

Loading priority order:
1. Critical CSS (inlined in `<head>`, < 2KB)
2. Hero image (preloaded with `<link rel="preload">`)
3. Route JS bundle (prefetched on link hover)
4. Below-fold images (lazy loaded with IntersectionObserver)
5. Non-critical JS (AI tutor, animations) — idle callback
6. Analytics — loaded last, non-blocking

## Mobile Performance Strategy

### Flutter Optimizations

| Technique | Implementation | Impact |
|-----------|---------------|--------|
| Const constructors | Every widget that can be const is const | Less GC |
| Selective rebuilds | Riverpod `.select()` to watch only needed state | Smoother UI |
| RepaintBoundary | Wrap complex animated widgets | No repaint cascading |
| Image precaching | `precacheImage()` for next-screen images | Instant display |
| Hive storage | Key-value cache instead of SQLite for simple data | 10x faster reads |
| Lazy loading | Screens loaded only when navigated to | 40% less memory |

### Android-Specific Optimizations

- ABI splitting: arm64-v8a + armeabi-v7a only
- Release build stripping: debug symbols removed
- ProGuard: remove unused classes, obfuscate
- No largeHeap request — stay memory-efficient

## Offline Strategy

### What Works Offline

| Feature | Offline Support | Sync Strategy |
|---------|----------------|---------------|
| View cached lessons | Full | Read local, update on connect |
| Take quizzes | Full | Queue results, sync later |
| View achievements | Cached last state | Update on connect |
| Watch cached videos | Full | Download manager |
| Take notes | Full | Sync on connect |
| View profile | Cached | Update on connect |
| AI Tutor | Requires network | Graceful fallback message |
| Course browsing | Cached catalog | Refresh on connect |

### Offline UX

```typescript
function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (!isOnline) {
    return (
      <div className="offline-banner">
        <p>You are offline - viewing cached content</p>
        <button onClick={tryReconnect}>Retry</button>
      </div>
    );
  }
  return null;
}
```

### Sync Manager (Web)

```typescript
class SyncManager {
  private queue: QueuedAction[] = [];

  async enqueue(action: QueuedAction) {
    this.queue.push(action);
    await this.persistQueue();
  }

  async syncAll() {
    for (const action of [...this.queue]) {
      try {
        await action.execute();
        this.queue = this.queue.filter((q) => q.id !== action.id);
        await this.persistQueue();
      } catch {
        break; // Stop on first failure, retry later
      }
    }
  }
}
```

## Data Usage Optimization

| Feature | Data per Use | Optimization |
|---------|-------------|--------------|
| Load lesson (text + images) | ~200KB | Cache, compress images |
| Load lesson with video | ~5-50MB | Offer download, stream at 480p |
| Quiz (5 questions) | ~50KB | Cache quiz assets |
| AI Tutor query | ~10KB | Cache common Q&A responses |
| Image (hero) | ~100KB | WebP, 720p max |
| Image (thumbnail) | ~20KB | WebP, 150x150 |
| Font loading | ~50KB | Variable fonts, subset |

## Progressive Enhancement

```
Level 1 (Slow 2G / Low-end Android):
  - Text-only lessons
  - No animations
  - No autoplay video
  - Reduced image quality (placeholder-level)
  - Offline-first always

Level 2 (3G / Mid-range):
  - Images at 50% quality
  - Subtle animations
  - Video on demand (tap to load)
  - Some caching

Level 3 (4G+/WiFi / Modern device):
  - Full experience
  - HD images
  - All animations
  - Autoplay video
  - AI tutor
  - Full caching + background sync
```

## Bundle Size Budget

| Category | Budget (gzipped) |
|----------|------------------|
| Framework (Next.js, React) | 45KB |
| UI Library (Tailwind) | 10KB |
| State Management (Zustand) | 1KB |
| Data Fetching (React Query) | 13KB |
| Animations (Framer Motion) | 15KB |
| Icons (Lucide) | 5KB (tree-shaken) |
| Route-specific JS | 20KB per route |
| **Total per route** | **< 100KB** |

## Monitoring & Alerting

| Metric | Target | Alert If |
|--------|--------|----------|
| Lighthouse Performance Score | > 90 | < 80 |
| FCP | < 1.5s | > 3s |
| TTI | < 3s | > 5s |
| Bundle Size | < 100KB | > 150KB |
| Offline Error Rate | < 1% | > 5% |
| 3G Page Load | < 5s | > 10s |
