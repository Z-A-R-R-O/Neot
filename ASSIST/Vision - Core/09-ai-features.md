# AI Features — Detailed Specification

## Overview
AI capabilities across the platform serve three primary functions: tutoring, content generation, and personalization. The AI layer integrates via OpenAI API with custom fine-tuning and caching for performance and cost optimization.

## 1. AI Tutor

### Capabilities

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Q&A** | Answer student questions about lesson content | All lessons |
| **Explain Like I'm 5** | Simplify explanations for younger students | All lessons |
| **Deep Dive** | Advanced explanations for curious students | All lessons |
| **Step-by-Step** | Walk through problem-solving | Math, Coding |
| **Voice Input** | Speak questions instead of typing | Mobile + Web (Chrome) |
| **Multi-language** | Answer in student's preferred language | All |
| **Context-Aware** | Knows what lesson student is on | All lessons |
| **Socratic Method** | Ask guiding questions instead of giving answers | Optional mode |
| **Code Help** | Debug and explain code | Coding blocks |
| **Visual Generation** | Create diagrams on demand | Premium feature |

### AI Tutor Interface

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Tutor                           [Minimize] [✕]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AI: I see you're working on fractions! How can I   │   │
│  │  help you understand 1/2 + 1/4 better?               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  You: I don't get why the denominators need to be    │   │
│  │  the same.                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AI: Great question! Think of pizza slices:          │   │
│  │                                                       │   │
│  │  🍕 1/2 = 2/4 (if we cut each half into 2)          │   │
│  │  🍕 1/4 = 1/4                                       │   │
│  │                                                       │   │
│  │  Now both are in "quarters", so we can add:          │   │
│  │  2/4 + 1/4 = 3/4 🎉                                 │   │
│  │                                                       │   │
│  │  Does that help? Would you like another example?     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📎 Ask about: This Lesson  Any Topic  My Question   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [🎤 Voice]  ┌──────────────────────────────────────┐  [➤] │
│              │ Type your question...                 │       │
│              └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### AI Tutor API

```typescript
// POST /api/ai/tutor
interface TutorRequest {
  question: string;
  lessonId?: string;
  studentId: string;
  mode: 'explain' | 'simplify' | 'deep' | 'socratic' | 'code';
  context: {
    currentLesson: string;
    recentMistakes?: string[];
    ageGroup: 'child' | 'teen' | 'adult';
    language: string;
  };
}

interface TutorResponse {
  answer: string;
  followUpSuggestions: string[];
  references?: {
    type: 'lesson' | 'video' | 'example';
    id: string;
    title: string;
  }[];
  generatedVisual?: string; // URL to generated diagram
}
```

### System Prompts (Configurable in Admin Panel)

```
Child Mode (5-10 years):
  "You are a friendly, encouraging tutor for a child aged {age}.
   Use simple words, emojis, and real-world examples (pizza, toys, animals).
   Keep responses under 3 sentences. Always be positive.
   Never give direct quiz answers — guide them to discover."

Teen Mode (11-17 years):
  "You are a smart, respectful tutor for a teenager.
   Use clear explanations with relevant examples (games, social media, sports).
   Be direct but supportive. Challenge them to think deeper.
   Reference how this knowledge applies in real life."

Adult Mode (18+ years):
  "You are a knowledgeable tutor for an adult learner.
   Provide comprehensive, efficient explanations.
   Use technical terms when appropriate but explain them.
   Focus on practical application and efficiency."
```

## 2. AI Content Generator

### For Teachers

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 Generate Lesson Content                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input:                                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Topic: Introduction to Photosynthesis               │   │
│  │  Age: 10-12 years old                               │   │
│  │  Style: Playful & curious                            │   │
│  │  Duration: 20 minutes                                │   │
│  │  Blocks: [Text ✅] [Quiz ✅] [Activity ✅] [Video ❌] │   │
│  │  Language: English                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Generate ✨]  [Save as Template]                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Generated Preview:                                   │   │
│  │                                                       │   │
│  │  📝 Title: How Plants Make Their Own Food             │   │
│  │                                                       │   │
│  │  📝 Text Block 1: "Did you know plants are amazing   │   │
│  │  little chefs? They make their own food using        │   │
│  │  sunlight, water, and air!"                          │   │
│  │                                                       │   │
│  │  📺 Suggested Video: "Photosynthesis for Kids"       │   │
│  │  (automatically searches relevant video)             │   │
│  │                                                       │   │
│  │  ❓ Quiz (5 questions):                               │   │
│  │  1. What gas do plants absorb from the air?          │   │
│  │  2. What is the green pigment in plants called?      │   │
│  │  ...                                                  │   │
│  │                                                       │   │
│  │  🎮 Activity: "Build a Leaf" drag-drop game          │   │
│  │                                                       │   │
│  │  [Accept All]  [Edit Block by Block]  [Regenerate]   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Generation Types

| Generation Type | Output | Quality Check |
|-----------------|--------|---------------|
| **Full Lesson** | Title, text blocks, quiz, activity, homework | Age-appropriate, factual accuracy |
| **Quiz Questions** | N questions with options, answer, explanation | Difficulty calibration |
| **Explanations** | Simplified text for a concept | Reading level match |
| **Examples** | Real-world examples for abstract concepts | Relevance check |
| **Homework** | Practice problems, worksheets | Answer key included |
| **Flashcards** | N card deck with term-definition pairs | Spacing optimized |
| **Story Mode** | Branching narrative for a topic | Engaging, educational |
| **Summary** | Lesson summary in bullet points | Key points covered |
| **Study Guide** | Comprehensive review material | All concepts covered |

### API

```typescript
// POST /api/ai/generate-content
interface GenerateRequest {
  topic: string;
  ageGroup: 'child' | 'teen' | 'adult';
  contentType: 'lesson' | 'quiz' | 'explanation' | 'homework' | 'flashcards';
  blocks?: BlockType[];
  style?: 'playful' | 'formal' | 'story' | 'challenge';
  language?: string;
  duration?: number; // minutes
  existingContent?: string; // context for continuation
}

interface GenerateResponse {
  title: string;
  blocks: GeneratedBlock[];
  estimatedDuration: number;
  readingLevel: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

## 3. AI Recommendation System

### Data Sources

- Learning history (courses, lessons, scores)
- Behavioral patterns (time, hints, engagement)
- Concept mastery graph
- Similar learner profiles
- Course metadata (tags, difficulty, popularity)
- Time-based recency

### Recommendation Pipeline

```
Daily Batch:
  1. Update all learner profiles (feature extraction)
  2. Compute similarity matrix (collaborative filtering)
  3. Update content embeddings (content-based)
  4. Generate recommendations for each user
  5. Store in recommendations table

Real-time:
  1. On lesson/quiz completion, update immediate
  2. Recalculate "Continue Learning" / "Next Lesson"
  3. Return cached batch recommendations + real-time adjustments
```

### API

```typescript
// GET /api/recommendations
interface RecRequest {
  studentId: string;
  type: 'continue' | 'next' | 'weakness' | 'enrichment' | 'popular';
  limit?: number;
}

interface RecResponse {
  recommendations: Recommendation[];
}

interface Recommendation {
  courseId: string;
  lessonId?: string;
  title: string;
  reason: string; // human-readable: "Because you excelled in Algebra"
  score: number;
  thumbnail: string;
  type: 'continue' | 'remedial' | 'next' | 'enrichment' | 'popular';
}
```

## 4. AI Safety & Guardrails

### Content Filtering

| Filter | Description | Strictness by Mode |
|--------|-------------|-------------------|
| **Toxicity** | Profanity, hate speech, violence | Strict (all modes) |
| **Adult Content** | Sexual, gambling, drugs | Strict (all modes) |
| **Factual Accuracy** | Educational content must be correct | Strict (all modes) |
| **Age-Appropriate** | Reading level, concepts, examples | Adaptive (per age group) |
| **Direct Answers** | AI shouldn't give away quiz answers | In-lesson mode only |
| **PII Protection** | Don't ask/store personal info | Strict (all modes) |

### Safety Implementation

```typescript
// AI response pipeline with safety checks
async function generateSafeResponse(request: TutorRequest): Promise<TutorResponse> {
  // 1. Input sanitization
  const sanitized = sanitizeInput(request.question);
  
  // 2. Content moderation check
  const moderation = await openai.moderations.create({ input: sanitized });
  if (moderation.results[0].flagged) {
    return {
      answer: "I'm sorry, I can't answer that. Let's focus on your lesson!",
      followUpSuggestions: ["Ask me about today's lesson"],
    };
  }
  
  // 3. Inject system prompt based on age/mode
  const systemPrompt = getSystemPrompt(request.context.ageGroup, request.mode);
  
  // 4. Add lesson context
  const context = await getLessonContext(request.lessonId);
  
  // 5. Generate with safety constraints
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt + safetyConstraints },
      { role: 'user', content: buildPrompt(sanitized, context) }
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });
  
  // 6. Post-generation moderation
  const output = response.choices[0].message.content;
  const outputModeration = await openai.moderations.create({ input: output });
  
  if (outputModeration.results[0].flagged) {
    return fallbackResponse();
  }
  
  return formatResponse(output);
}
```

## 5. Cost Optimization

| Strategy | Implementation | Estimated Savings |
|----------|---------------|------------------|
| **Caching** | Cache common Q&A pairs (Redis, TTL: 24h) | 40-60% |
| **Prompt Compression** | Strip unnecessary context, use summaries | 20-30% |
| **Model Tiering** | Simple Q: GPT-4o-mini, Complex: GPT-4o | 50-70% |
| **Response Streaming** | Stream tokens to reduce timeout costs | UX improvement |
| **Rate Limiting** | Max 20 requests/hour per student | Prevents abuse |
| **Batch Processing** | Content generation queued, not real-time | 30% |
| **Embedding Cache** | Cache course/lesson embeddings | 60% |

### Model Selection Logic

```typescript
function selectModel(request: AIRequest): Model {
  if (request.type === 'content_generation') {
    return 'gpt-4o'; // Quality matters for content
  }
  
  if (request.type === 'tutor' && request.mode === 'simple') {
    return 'gpt-4o-mini'; // Simple Q&A is cheaper
  }
  
  if (request.type === 'embedding') {
    return 'text-embedding-3-small';
  }
  
  return 'gpt-4o'; // Default to best for complex tutoring
}
```

## 6. Future AI Features

| Feature | Description | Timeline |
|---------|-------------|----------|
| **Voice Conversation** | Real-time voice chat with AI tutor | Phase 2 |
| **Image Recognition** | Upload worksheet photo, AI reads & helps | Phase 2 |
| **Personalized Worksheets** | Generate unique worksheets per student | Phase 2 |
| **AI-Powered Flashcards** | Auto-generate from any text content | Phase 2 |
| **Essay Grading** | AI evaluates and gives feedback on essays | Phase 3 |
| **Code Review** | AI reviews student code submissions | Phase 3 |
| **Handwriting Recognition** | Read handwritten answers | Phase 3 |
| **Emotion Detection** | Camera-based engagement/frustration detection | Phase 3 (opt-in) |
| **Adaptive Video** | AI-generated animated explanations | Phase 3 |
| **Multi-modal Tutor** | Combines text, voice, image, and video | Phase 3 |
