# AI Content Assistant — Spec

## Overview

The AI Content Assistant generates platform-optimized content using LLMs. It reduces content creation from 30 minutes to 30 seconds.

## Features

### Caption Generator
- Generate full captions from a topic or keyword
- Tone control: professional, casual, funny, inspirational, educational
- Length control: short (<50 chars), medium (50-150), long (150+)
- Platform-aware formatting (hashtags, line breaks, emojis)

### Hook Generator
- Generate attention-grabbing first lines
- Hook types: question, statistic, story, controversy, curiosity gap
- Multiple variants (3-5 options per request)

### Hashtag Generator
- Generate relevant hashtags from content/topic
- Tiered by popularity: broad, niche, hyper-niche
- Platform-specific optimization (Instagram vs. X vs. LinkedIn)
- Limit control: 5, 10, 15, 20, 30

### Post Idea Generator
- Generate content ideas based on:
  - Niche/industry
  - Content pillars (educational, entertaining, promotional, community)
  - Current trends
- Results as a grid of idea cards

### CTA Generator
- Generate call-to-action phrases
- CTA types: learn more, sign up, buy now, comment, share, save, follow

## Brand Voice System

Users define their brand voice, which the AI uses across all generations:

```typescript
interface BrandVoice {
  id: string;
  userId: string;
  name: string;
  tone: string[];            // e.g. ["professional", "friendly"]
  vocabulary: string[];      // e.g. ["leverage", "synergy"] — avoid
  emojiStyle: 'minimal' | 'moderate' | 'heavy';
  hashtagPreference: 'minimal' | 'moderate' | 'heavy';
  customInstructions: string; // e.g. "Always use Oxford comma"
}
```

## Generation UX

```
Input: "Post about our new analytics feature"
         ↓
    [Generate] button
         ↓
  AI generates 3 variants
         ↓
  ┌──────────────────────┐
  │ Variant 1  [Use]     │  ← Click to apply to composer
  │  "Tired of guessing  │
  │   what works?"       │
  ├──────────────────────┤
  │ Variant 2  [Use]     │
  │  "Your data has      │
  │  stories to tell."   │
  ├──────────────────────┤
  │ Variant 3  [Use]     │
  │  "Analytics that     │
  │  actually help."     │
  └──────────────────────┘
         ↓
  [Regenerate] [Edit tone] [Adjust length]
```

## AI Models

| Task | Model | Notes |
|------|-------|-------|
| Caption generation | GPT-4o-mini | Fast, cheap, good quality |
| Hook generation | GPT-4o-mini | Creative, multiple variants |
| Hashtag generation | GPT-4o-mini | Structured output |
| Post ideas | GPT-4o | Higher quality for strategic thinking |
| Brand voice parsing | GPT-4o | One-time setup per brand |

## Cost Optimization

- Cache identical generation requests (same input + brand = cached)
- Batch non-urgent generations
- Tiered model selection (expensive model only for complex tasks)
- Daily generation limits per tier:
  - Free: 50 generations/day
  - Pro: 500 generations/day
  - Agency: unlimited
