# NEOT — v3 Transition Plan: LMS → Adaptive Learning Universe

## Overview

This document defines the complete transition from the current LMS platform to the **AI-Powered Adaptive Learning Universe** defined in `master.md`. This is not a rewrite — it is a strategic evolution that reuses existing systems while adding the core differentiator: **personalized learning intelligence**.

---

## Why v3?

| Dimension | v2 (Current — LMS) | v3 (Target — Adaptive Universe) |
|-----------|--------------------|----------------------------------|
| **Content model** | Course → Module → Lesson | Skill → Concept → Dependency → Mastery |
| **Organization** | Categories + Courses | Learning Worlds + Islands + Dungeons |
| **Personalization** | Mastery score + spaced repetition | Dynamic Learning Paths per learning style |
| **AI role** | Assistant (tutor chat, content gen) | Core engine (story gen, adapt, detect, optimize) |
| **Business model** | Freemium subscriptions + marketplace | Free + non-intrusive ads |
| **Experience** | School LMS feel | Netflix + Duolingo + YouTube + AI Tutor |
| **Content scope** | Any subject, teacher-driven | Start with Coding/CS, AI-scalable |
| **Engagement** | XP, streaks, badges, leaderboards | Worlds, quests, daily goals, curiosity loops |

---

## What Stays vs. What Changes

### Keep as-is (directly reusable)

| System | How it maps to v3 |
|--------|-------------------|
| **Gamification engine** (XP, streaks, badges, leaderboards) | Core engagement loop — already Duolingo-inspired |
| **Mastery tracking** (skills, scores, decay, spaced repetition) | Foundation of the adaptive engine |
| **Quiz system** (MCQ, true/false, adaptive, question bank) | Content delivery — reusable |
| **AI Tutor chat** (Socratic, lesson context, safety) | Rebrand as AI Learning Companion |
| **Auth system** (email, sessions, SSO, biometric) | Unchanged |
| **Theme engine** (CSS vars, dark/light, white-label) | Unchanged |
| **Section Registry** (content blocks) | Rendering layer — reusable |
| **Push notifications** | Engagement triggers — reusable |
| **Flutter app** | Mobile delivery — needs UI refresh |
| **Admin infrastructure** (backups, error tracking, security, performance) | Unchanged |

### Needs significant rework

| System | What changes |
|--------|-------------|
| **Content structure** | Add Concept Graph on top of existing Course/Module/Lesson model |
| **Student dashboard** | From course catalog → Netflix-style discovery + path visualization |
| **Teacher tools** | From course builder → knowledge graph contributor + world designer |
| **AI pipeline** | From assistant → core engine (story gen, style detection, curiosity) |
| **Business model** | De-emphasize subscriptions → add ad placement engine |

### Must be built from scratch

| Feature | Priority | Effort |
|---------|----------|--------|
| **Learning Graph / Concept Graph** | P0 | 3-5 days |
| **Learning Worlds UI** (islands, dungeons, kingdoms) | P0 | 3-4 days |
| **Dynamic Learning Path engine** | P0 | 4-5 days |
| **Learning Style Detector** | P0 | 3-4 days |
| **Story Generator (AI)** | P1 | 3-4 days |
| **Concept Simplifier (AI)** ("explain like I'm 10") | P1 | 2-3 days |
| **Curiosity Engine (AI)** | P1 | 2-3 days |
| **Difficulty Adapter (real-time)** | P1 | 2-3 days |
| **Memory Optimizer (enhanced)** | P1 | 2-3 days |
| **Ad placement engine** | P2 | 3-4 days |
| **Daily quests system** | P2 | 2-3 days |
| **Netflix-style discovery UI** | P2 | 3-4 days |

---

## v3 Phase Map

```
V3-0: Foundation ───→ V3-1: Learning Worlds ───→ V3-2: AI Engine
                                                         │
                    V3-3: Engagement ───→ V3-4: Story Mode
                                                    │
                    V3-5: Monetization ←────────────┘
                                                    │
                    V3-6: Scale ─────────────────────┘
```

| Phase | Name | Focus | Duration |
|-------|------|-------|----------|
| V3-0 | Foundation | Concept Graph data model, Learning Style profile, ASSIST docs | 2-3 days |
| V3-1 | Learning Worlds | World/Island/Dungeon UI, skill tree visualization, content migration | 4-5 days |
| V3-2 | AI Personalization | Style detector, difficulty adapter, weakness detection, dynamic paths | 6-8 days |
| V3-3 | Engagement Loops | Daily quests, world progression rewards, curiosity engine | 4-5 days |
| V3-4 | Story Mode | Story generator, concept simplifier, memory optimizer | 5-6 days |
| V3-5 | Monetization | Ad placement engine, AdSense integration, sponsored learning | 4-5 days |
| V3-6 | Scale | UX polish, performance, beta launch, expansion | 5-7 days |

**Total estimated effort: 30-40 days**

---

## Entry Gates

| Phase | Must Have Before Starting |
|-------|--------------------------|
| **V3-0** | master.md approved, ASSIST docs updated, team aligned |
| **V3-1** | Concept Graph data model deployed, content identified for migration |
| **V3-2** | Learning Worlds UI live, concept graph populated, mastery data flowing |
| **V3-3** | Dynamic learning paths working, AI features stable |
| **V3-4** | Engagement loops live, retention metrics baseline established |
| **V3-5** | Story mode working, user engagement proven |
| **V3-6** | Ad system stable, performance acceptable |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Concept Graph is too abstract, hard to populate | Medium | Start with simple prerequisites (X requires Y), expand iteratively |
| AI features cost too much in API fees | Medium | Cache aggressively, batch requests, use local models for simple tasks |
| Ad revenue too low to sustain | Low | Stage 1 = Google AdSense (low effort), Stage 2-3 = higher CPM. Free model doesn't depend on ads initially. |
| Users confused by Worlds metaphor | Medium | Progressive onboarding, tooltips, familiar UI elements as fallback |
| Existing LMS users resist change | Low | v3 is new product direction; existing features remain accessible during transition |

---

## Existing Code Reuse Map

| v3 Feature | Built From | v2 Source |
|------------|-----------|-----------|
| Skill → Concept → Dependency | ✓ Reuse + extend | Skill model, LessonSkill mapping |
| Learning Worlds | ✨ New UI | Course model as data source |
| XP / Streaks / Badges | ✓ Direct reuse | Gamification engine |
| Spaced Repetition | ✓ Direct reuse | Review scheduling |
| AI Tutor | ✓ Rebrand | AI Tutor chat |
| Story Generator | ✨ New feature | Uses existing AI content gen API |
| Quiz Generator | ✓ Direct reuse | AI quiz generation |
| Weakness Detection | ✓ Reuse + extend | Mastery analytics, at-risk detection |
| Learning Style | ✨ New feature | New — analyzes behavior patterns |
| Curiosity Engine | ✨ New feature | New — built on recommendation engine |
| Ad System | ✨ New feature | New — no existing equivalent |
| Daily Quests | ✨ New feature | New — uses existing XP/streak triggers |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-23 | v3 is NOT a rewrite | Existing codebase is rich and layered — reuse gamification, mastery, quiz, auth, AI |
| 2026-05-23 | Concept Graph overlays existing Course model | Course/Module/Lesson stays as content container; Concept Graph lives on top |
| 2026-05-23 | Learning Worlds = UI layer, not data migration | No data migration needed. Worlds are a new UI on top of existing course data |
| 2026-05-23 | Start with Coding/CS only | Focus is the moat: personalization engine. One domain is enough to validate |
| 2026-05-23 | AdSense is Stage 1 monetization | Display ads are easy, low-risk, and fund free learning immediately |
| 2026-05-23 | AI features are P0-P1 in v3, not optional | The entire v3 thesis is AI personalization — without it, there's no differentiator |

---

## Quick Reference

```powershell
# Start here
cat master.md

# Read the full transition plan
cat ASSIST/Roadmap/v3-transition.md

# Pick a task
cat ASSIST/Execution/checklists/z-03-adaptive-universe.md

# Read relevant spec
cat ASSIST/Vision/adaptive.md

# Build and log
# ... code ...
# Then log
code ASSIST/Log/YYYY-MM-DD-HHmm.md

# Commit
.\ASSIST\Tools\git-helper.ps1 "V3-0: <description>"
```