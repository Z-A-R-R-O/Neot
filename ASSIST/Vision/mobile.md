# Mobile Strategy — Spec

## Overview

Native mobile apps built with Flutter for iOS and Android, not web wrappers.

## Architecture

```
Flutter App
├── API Client → NEOT REST API
├── Local DB (SQLite) → Offline cache
├── Auth → Token-based with refresh
└── State Management → Riverpod/Bloc
```

## Features (v1)

- Course browsing and enrollment
- Lesson viewing (text, video, quiz)
- Progress sync with web
- Push notifications
- Offline mode for downloaded content
- Biometric login

## Features (v2)

- In-app messaging
- Camera integration for assignments
- Voice input for quizzes
- AR content (future)
- Widget for home screen (streak, progress)

## Offline Strategy

- Download lessons for offline viewing
- Queue actions when offline
- Sync when connection restored
- Conflict resolution: server wins

## Platform Considerations

| Feature | iOS | Android |
|---------|-----|---------|
| Auth | Face ID / Touch ID | Fingerprint / Face unlock |
| Storage | iCloud backup | Google Drive backup |
| Notifications | APNs | FCM |
| Payments | In-App Purchase | Google Play Billing |

## Distribution

- App Store (iOS)
- Google Play (Android)
- Enterprise distribution for schools
