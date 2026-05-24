# AI Social OS — Conventions

## Naming

### Files

| Type | Convention | Example |
|------|-----------|---------|
| Pages | kebab-case | `post-composer.tsx` |
| Components | PascalCase | `PostComposer.tsx` |
| Hooks | camelCase, use prefix | `useSocialAccounts.ts` |
| Utils | kebab-case | `format-date.ts` |
| Tests | `.test.` suffix | `post-composer.test.ts` |
| Styles | `.module.css` | `composer.module.css` |

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
XX -- AIOS -- <imperative description>
```

Examples:
```
01 -- AIOS -- add post composer component
02 -- AIOS -- implement OAuth for Instagram
03 -- AIOS -- add AI caption generation
```

## Code Style

### Imports

```typescript
// 1. External libraries
import { useState } from 'react';
import { prisma } from '@/lib/prisma';

// 2. Internal modules (aliased)
import { Button } from '@/components/ui/button';
import { useSocialAccounts } from '@/hooks/use-social-accounts';

// 3. Relative imports
import { PostCard } from './post-card';
import type { PostProps } from './types';
```

### Components

```typescript
interface PostComposerProps {
  initialContent?: string;
  selectedPlatforms?: string[];
  onPublish: (post: PostData) => Promise<void>;
}

export function PostComposer({ initialContent, selectedPlatforms, onPublish }: PostComposerProps) {
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

- Table names: singular, PascalCase in Prisma (`Post`, `SocialAccount`)
- Column names: camelCase in Prisma (`createdAt`, `platformAccountId`)
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
  "error": "Post not found",
  "code": "POST_NOT_FOUND"
}
```

## Testing

- Unit tests for utilities
- Integration tests for API routes
- Component tests for complex UI
- E2E tests for critical flows (post → publish → analytics)

## Documentation

- JSDoc for public functions
- README for complex modules
- Inline comments for non-obvious logic
- Update ASSIST1 docs when features change
