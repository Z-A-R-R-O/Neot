# NEOT

> **Learning should adapt to humans. Humans should not adapt to systems.**

A modular learning ecosystem that is adaptive, lightweight, kid-friendly, fully controllable, and fast — purpose-built for education.

---

## Overview

NEOT is an end-to-end learning platform with four main interfaces:

| Interface | Audience | Purpose |
|-----------|----------|---------|
| **Student App** | Learners 5-18+ | Adaptive lesson player, gamified progress, AI tutor |
| **Teacher Dashboard** | Educators | No-code lesson builder, drag-drop blocks, analytics |
| **Parent Dashboard** | Parents/Guardians | Progress monitoring, screen time controls, reports |
| **Admin Panel** | Platform owners | Visual page builder, theme engine, full control |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Mobile | Flutter + Dart |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Admin CMS | Directus |
| AI | OpenAI GPT-4o / GPT-4o-mini |
| Hosting | Vercel + Supabase Cloud |

## Build Plan

Structured implementation phases are documented in `ASSIST/Implementation/`. See `ASSIST/README.md` for workflow rules.

```
ASSIST/
├── Implementation/    ← Phased build plans with task blocks
├── Vision - Core/     ← Product specifications
├── Tools/             ← Automation scripts
└── Log/               ← Change journal
```

## Getting Started

```bash
git clone https://github.com/Z-A-R-R-O/Neot.git
cd Neot/web
npm install
npm run dev
```

## Commit Convention

```
XX -- NEOT -- <description>
```

Use the helper: `.\ASSIST\Tools\git-helper.ps1 "your message"`
