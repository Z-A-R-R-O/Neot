# Core Dashboard — Spec

## Overview

The dashboard is the primary landing page. It provides an at-a-glance overview of all connected accounts, upcoming posts, recent performance, and quick actions.

## Layout

```
┌──────────────────────────────────────────────────┐
│  Sidebar (collapsible)         │  Main Content   │
│                                │                  │
│  ● Dashboard                   │  ┌────────────┐ │
│  ● Content                     │  │ Quick Stats │ │
│  ● Calendar                    │  │ Accounts    │ │
│  ● Analytics                   │  │ Connected   │ │
│  ● Leads                       │  └────────────┘ │
│  ● Campaigns                   │                  │
│  ● Settings                    │  ┌────────────┐ │
│                                │  │ Upcoming   │ │
│  ── Account ──                 │  │ Posts      │ │
│  @handle1 ✓                    │  └────────────┘ │
│  @handle2 ✓                    │                  │
│  + Connect                     │  ┌────────────┐ │
│                                │  │ Recent     │ │
│                                │  │ Activity   │ │
│                                │  └────────────┘ │
└──────────────────────────────────────────────────┘
```

## Sections

### Quick Stats Bar
- Total followers (across all platforms)
- Posts published this week
- Total engagement (likes + comments + shares)
- New leads this week

### Connected Accounts
- Grid of connected platform accounts
- Each shows: avatar, username, platform icon, follower count
- Status indicator: connected / expired / error
- "+ Connect Account" button

### Upcoming Posts
- Next 5 scheduled posts
- Shows: platform icon, content preview (truncated), scheduled time, status
- Quick actions: edit, reschedule, cancel

### Recent Activity
- Chronological feed of: posts published, comments received, milestones reached
- Each item: icon, description, relative time

## Key Interactions

| Action | Result |
|--------|--------|
| Click account | Open account detail view |
| Click upcoming post | Open post editor |
| Click "New Post" | Open post composer |
| Click stat card | Navigate to analytics detail |
