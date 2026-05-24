# Social Account Connection — Spec

## Overview

Users connect their social media accounts via OAuth. Once connected, the platform can post, read analytics, and fetch inbox items on their behalf.

## Supported Platforms (V1)

1. **Instagram** — via Meta Graph API
2. **LinkedIn** — via LinkedIn Marketing API
3. **X/Twitter** — via Twitter API v2
4. **YouTube** — via YouTube Data API v3

## Connection Flow

```
User clicks "Connect [Platform]"
         ↓
Redirect to platform OAuth page
         ↓
User authorizes permissions
         ↓
Platform redirects to callback URL
         ↓
Exchange code for access token
         ↓
Store encrypted token + profile data
         ↓
Account appears in dashboard
```

## Data Stored Per Account

| Field | Description |
|-------|-------------|
| `platform` | instagram / linkedin / x / youtube |
| `platformAccountId` | Platform-specific user ID |
| `username` | Display username |
| `displayName` | Full profile name |
| `avatarUrl` | Profile image URL |
| `accessToken` | OAuth access token (encrypted) |
| `refreshToken` | OAuth refresh token (encrypted) |
| `tokenExpiresAt` | Token expiration timestamp |
| `followerCount` | Current follower/subscriber count |
| `profileUrl` | Link to platform profile |
| `connectedAt` | When the account was connected |

## Permissions Required

| Platform | Scopes |
|----------|--------|
| Instagram | `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `pages_read_engagement` |
| LinkedIn | `w_member_social`, `r_liteprofile`, `r_emailaddress`, `rw_organization_admin` |
| X/Twitter | `tweet.read`, `tweet.write`, `users.read`, `offline.access`, `dm.read`, `dm.write` |
| YouTube | `https://www.googleapis.com/auth/youtube`, `https://www.googleapis.com/auth/youtube.readonly` |

## UI Components

### Connect Button
- Platform-specific (Instagram brand color, LinkedIn brand color, etc.)
- Shows: platform icon + "Connect [Platform]"
- Handles OAuth redirect

### Account Card
- Avatar + username + platform icon
- Follower count
- Connection status badge
- Disconnect button

### Account Selector
- Multi-select component for choosing which accounts to post to
- Shows avatar + platform icon + username
- Toggle on/off per account

## Error Handling

| Error | User Message |
|-------|-------------|
| Token expired | "Reconnect [platform] to continue posting" |
| Permission revoked | "Connection lost — please reconnect" |
| API rate limited | "[Platform] is rate limited. Try again later." |
| Account deleted on platform | "Account not found on [platform]" |
