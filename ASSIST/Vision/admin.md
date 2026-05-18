# Admin Panel — Spec

## Overview

The admin panel provides platform-wide control: user management, content oversight, analytics, billing, and system configuration.

## Core Features

### Dashboard

- Platform health metrics
- User counts (students, teachers, parents, schools)
- Revenue overview
- System status (uptime, errors)
- Recent activity log

### User Management

- Search, filter, view all users
- Create/edit/disable accounts
- Role assignment and permissions
- Bulk operations (import/export)
- Password reset, account recovery

### Content Oversight

- Course approval workflow
- Content moderation
- Category/tag management
- Featured content curation
- Copyright/DMCA handling

### Analytics

- Platform-wide usage stats
- Engagement trends (DAU, MAU)
- Revenue analytics
- Course performance rankings
- Student outcome metrics
- Export reports

### Billing & Subscriptions

- Plan management (Free, Pro, School, Enterprise)
- Invoice generation
- Payment tracking
- Refund processing
- Coupon/discode management

### System Configuration

- Platform settings (maintenance mode, feature flags)
- Email templates
- Notification settings
- Theme defaults
- API key management
- Backup/restore

### School Management

- School account creation
- White-label configuration
- Bulk user provisioning
- School-specific analytics
- Contract management

## User Flow

```
Login → Admin Dashboard → Select Module → Manage → Review → Apply Changes
```

## Permission Levels

| Level | Access |
|-------|--------|
| Super Admin | Full platform access |
| Admin | All except billing, system config |
| Moderator | Content oversight only |
| Support | User management, tickets |
