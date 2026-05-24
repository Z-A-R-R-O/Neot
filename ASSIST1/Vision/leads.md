# Lead Inbox — Spec

## Overview

The lead inbox collects comments, DMs, and inquiries from all connected platforms into a single unified inbox. Users can view, respond, and manage leads without switching between platforms.

## Data Sources

| Platform | Lead Sources |
|----------|-------------|
| Instagram | Post comments, story replies, DM |
| LinkedIn | Post comments, DM, connection requests |
| X/Twitter | Post replies, mentions, DM |
| YouTube | Video comments, live chat |

## Inbox Layout

```
┌──────────────────────────────────────────────────┐
│  Inbox                                   [Filter] │
├──────────────────────┬───────────────────────────┤
│  ┌────────────────┐  │  ┌─────────────────────┐  │
│  │ Search...      │  │  │ Message Content      │  │
│  ├────────────────┤  │  │                      │  │
│  │ All Inbox   24 │  │  │ @user: "Love this   │  │
│  │ Unread      8  │  │  │ post! How do I get  │  │
│  │              │  │  │ started?"            │  │
│  ├────────────────┤  │  │                      │  │
│  │ 📱 Instagram 12│  │  │ ┌──────────────────┐ │  │
│  │ 📘 LinkedIn  6 │  │  │ │ Reply box...     │ │  │
│  │ 🐦 X/Twitter 4 │  │  │ │ [AI Reply] [Send]│ │  │
│  │ ▶️ YouTube  2  │  │  │ └──────────────────┘ │  │
│  ├────────────────┤  │  │                      │  │
│  │ @user1        │  │  │ Platform: Instagram   │  │
│  │ "How much..." │  │  │ Post: "Our new        │  │
│  │ 5m ago  ○    │  │  │ feature is live!"     │  │
│  ├────────────────┤  │  │ Status: New lead     │  │
│  │ @user2        │  │  │ Tags: [Interested]   │  │
│  │ "Great post!"  │  │  │                      │  │
│  │ 15m ago ○    │  │  │ [Convert to Lead]    │  │
│  └────────────────┘  │  └─────────────────────┘  │
└──────────────────────┴───────────────────────────┘
```

## Lead Management

### Lead Statuses
- **New** — Unread/untouched
- **Read** — Viewed but not responded
- **Replied** — Response sent
- **Qualified** — High potential lead
- **Converted** — Became a customer
- **Closed** — No longer relevant

### Lead Actions
- Reply directly in inbox
- Mark as lead (with tags)
- Assign to team member
- Schedule follow-up
- Add notes
- Move to CRM pipeline

### Tags
- Custom tags per workspace
- Auto-tagging rules (e.g. "pricing" → tag: sales-ready)
- Filter by tag

## AI Auto-Reply (Phase 2)

```typescript
interface AutoReplyConfig {
  enabled: boolean;
  triggerKeywords: string[];     // e.g. ["pricing", "cost", "how much"]
  replyTemplate: string;         // e.g. "Thanks for asking! Here's our pricing..."
  tone: 'professional' | 'friendly' | 'sales';
  requireApproval: boolean;     // Review before sending
  workingHoursOnly: boolean;
}
```

## UI Components

### Inbox List
- Avatar + name + platform icon
- Message preview (first 60 chars)
- Time (relative: "5m ago")
- Unread indicator (dot)
- Platform filter tabs

### Message Detail
- Full conversation thread
- Context: which post/message triggered this
- Quick reply box with AI assist
- Lead status + tags
- Convert to lead button

### Filter Bar
- Platform filter
- Status filter (new, read, replied, etc.)
- Tag filter
- Date range
- Search by keyword
