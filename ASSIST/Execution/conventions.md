# NEOT — Conventions

## Naming

### Files

| Type | Convention | Example |
|------|-----------|---------|
| Pages | kebab-case | `course-player.tsx` |
| Components | PascalCase | `CoursePlayer.tsx` |
| Hooks | camelCase, use prefix | `useCourse.ts` |
| Utils | kebab-case | `format-date.ts` |
| Tests | `.test.` suffix | `course.test.ts` |
| Styles | `.module.css` | `player.module.css` |

### Directories

- kebab-case for all directories
- Group by feature, not type
- Keep nesting to 3 levels max

### Variables & Functions

- camelCase for variables and functions
- PascalCase for types and interfaces
- UPPER_SNAKE_CASE for constants
- Boolean prefixes: `is`, `has`, `should`, `can`

## Commits

```
XX -- NEOT -- <imperative description>
```

Examples:
```
42 -- NEOT -- add quiz component
43 -- NEOT -- fix auth redirect loop
44 -- NEOT -- refactor section registry
```

## Code Style

### Imports

```typescript
// 1. External libraries
import { useState } from 'react';
import { prisma } from '@/lib/prisma';

// 2. Internal modules (aliased)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// 3. Relative imports
import { QuizCard } from './quiz-card';
import type { QuizProps } from './types';
```

### Components

```typescript
interface CoursePlayerProps {
  courseId: string;
  initialLesson?: string;
}

export function CoursePlayer({ courseId, initialLesson }: CoursePlayerProps) {
  // Implementation
}
```

### API Routes

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Logic
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Message' }, { status: 500 });
  }
}
```

## Database

- Table names: singular, PascalCase in Prisma (`Course`, `User`)
- Column names: camelCase in Prisma (`createdAt`, `studentId`)
- Always include `id`, `createdAt`, `updatedAt`
- Use relations, not foreign key IDs in queries
- Index columns used in WHERE/JOIN

## API Design

- RESTful routes
- JSON request/response
- Proper HTTP status codes
- Input validation on all mutations
- Error messages in consistent format

```json
{
  "success": false,
  "error": "Course not found",
  "code": "COURSE_NOT_FOUND"
}
```

## Testing

- Unit tests for utilities
- Integration tests for API routes
- Component tests for complex UI
- E2E tests for critical flows

## Documentation

- JSDoc for public functions
- README for complex modules
- Inline comments for non-obvious logic
- Update ASSIST docs when features change
