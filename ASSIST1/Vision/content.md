# Content Management — Spec

## Overview

The content system allows users to write once and publish across multiple platforms. Each post gets platform-aware formatting, media attachments, and scheduling.

## Post Composer

```
┌──────────────────────────────────────────────┐
│  New Post                               [X] │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  Write your content here...              ││
│  │                                          ││
│  │  ┌──────────────────────────────────────┐││
│  │  │ ✨ AI: Generate caption              │││
│  │  │ ✨ AI: Generate hook                 │││
│  │  │ ✨ AI: Generate hashtags             │││
│  │  └──────────────────────────────────────┘││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  Attach media: [Upload] [Gallery]        ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  Post to:                                ││
│  │  [✓] Instagram  ▌ [✓] LinkedIn           ││
│  │  [✓] X/Twitter  ▌ [ ] YouTube            ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │  Platform previews:                      ││
│  │  ┌─────┐ ┌─────┐ ┌─────┐                ││
│  │  │ IG  │ │ LI  │ │ X   │                ││
│  │  └─────┘ └─────┘ └─────┘                ││
│  └──────────────────────────────────────────┘│
│                                              │
│  [ Schedule ]      [ Publish Now ]           │
└──────────────────────────────────────────────┘
```

## Platform-Aware Formatting

Each platform gets optimized formatting:

| Platform | Character Limit | Media | Best Practices |
|----------|----------------|-------|----------------|
| Instagram | 2,200 | Images (1-10), Video (60s) | Hashtags in caption or first comment |
| LinkedIn | 3,000 | Images (1-20), PDF | Professional tone, line breaks |
| X/Twitter | 280 (4,000 with Premium) | Images (1-4) | Short, punchy, hashtags limited |
| YouTube | 5,000 | Thumbnail | SEO-optimized title + description |

## Post Versions

Users can customize content per platform while keeping a base version:

```typescript
interface Post {
  id: string;
  userId: string;
  baseContent: string;       // Default content
  mediaIds: string[];
  createdAt: DateTime;
  
  versions: PostVersion[];   // Platform-specific overrides
  schedule: PostSchedule | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

interface PostVersion {
  platform: string;
  accountId: string;
  content: string;           // Platform-specific content
  mediaIds: string[];
  status: 'pending' | 'published' | 'failed';
  publishedAt: DateTime | null;
  platformPostId: string | null;
}
```

## Content Calendar

### View Options
- **Month** — Full month grid with post indicators
- **Week** — Weekly timeline view
- **List** — Chronological list of scheduled posts

### Interactions
- Drag post to reschedule
- Click to edit
- Quick-post from calendar slot
- Filter by platform/account
- Show published vs. scheduled

## Scheduling

- Pick date + time
- Timezone-aware
- Recurring options (optional)
- Queue management (if multiple posts at same time)
- Draft → Schedule → Auto-publish flow
