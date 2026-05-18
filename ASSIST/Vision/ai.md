# AI Features — Spec

## Overview

AI enhances the learning experience without being a dependency. Core features work offline; AI adds value on top.

## Features

### AI Tutor

- Contextual help within lessons
- Answers questions about current content
- Explains concepts in simpler terms
- Socratic method — guides, doesn't give answers
- Subject-specific personas

### Content Generation

- Auto-generate quiz questions from lesson text
- Suggest lesson improvements
- Create practice problems
- Summarize long content
- Translate content (multi-language support)

### Personalization

- Learning style detection
- Content format recommendations
- Optimal study time suggestions
- Motivation messaging based on behavior

### Safety & Guardrails

- Content filtering for appropriateness
- No personal data in AI prompts
- Human review for AI-generated content
- Opt-out option for all AI features
- Transparency: label AI-generated content

## Technical Approach

- API-based (OpenAI, Anthropic, or self-hosted)
- Caching for common queries
- Rate limiting per user
- Fallback to non-AI experience
- Cost monitoring and alerts

## Integration Points

- Lesson player: AI help button
- Quiz builder: auto-generate questions
- Teacher tools: content suggestions
- Dashboard: personalized recommendations
