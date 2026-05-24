# Analytics — Spec

## Overview

The analytics system aggregates performance data from all connected platforms into a single dashboard. Users can track growth, engagement, and content performance across accounts.

## Metrics Tracked

### Account-Level Metrics

| Metric | Description | Source |
|--------|-------------|--------|
| Followers | Total follower/subscriber count | Platform API |
| Follower Growth | Net new followers (7d, 30d) | Calculated from snapshots |
| Posts Published | Total posts in time range | Our database |
| Engagement Rate | (likes + comments + shares) / impressions | Platform API |
| Reach | Unique accounts that saw content | Platform API |
| Impressions | Total content views | Platform API |
| Profile Visits | Times profile was viewed | Platform API |

### Post-Level Metrics

| Metric | Description |
|--------|-------------|
| Likes | Total likes/reactions |
| Comments | Total comments/replies |
| Shares | Total shares/retweets/reposts |
| Saves | Total bookmarks/saves |
| Engagement Rate | (likes + comments + shares) / impressions |
| Click-Through Rate | Link clicks / impressions |
| Reach | Unique accounts reached |
| Impressions | Total views |

## Dashboard Views

### Overview
- Key metric cards (total followers, posts this week, total engagement)
- Growth trend charts (7d, 30d, 90d)
- Platform breakdown bar chart
- Top performing post this period

### Account Detail
- Per-platform metrics
- Follower growth over time (line chart)
- Engagement rate trend
- Post history with performance indicators
- Best times to post (based on historical data)

### Content Analysis
- Performance table with sorting
- Filter by platform, date range, content type
- Best/worst performing posts
- Hashtag performance analysis

## Data Collection

```
                           ┌─────────────────┐
 Cron job (every 1hr) ───→ │ Analytics Worker │
                           └────────┬────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            Instagram API    LinkedIn API     X/Twitter API
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                          Analytics Snapshot
                          (stored in DB)
```

## UI Components

### Stat Card
- Metric label, value, trend indicator (up/down)
- Sparkline (mini chart)
- Platform icon if applicable

### Trend Chart
- Line chart with configurable time ranges
- Platform overlay (compare platforms)
- Hover tooltip with exact values
- Export option (PNG, CSV)

### Performance Table
- Sortable columns
- Platform icon, content preview, metrics
- Color-coded performance indicators
- Row click → post detail

## Data Retention

| Tier | Snapshot Frequency | Data Retention |
|------|-------------------|----------------|
| Free | Every 6 hours | 30 days |
| Pro | Every 1 hour | 90 days |
| Agency | Every 30 minutes | 1 year |

## Export Options

- CSV export for any view
- Report PDF (weekly/monthly summary)
- Email report (scheduled)
- API access (Pro+)
