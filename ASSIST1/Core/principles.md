# AI Social OS — Engineering Principles

## Code Standards

### TypeScript

- Strict mode enabled — no `any` without explicit justification
- Prefer `interface` over `type` for object shapes
- Use `const` for all declarations unless reassignment is needed
- Explicit return types on functions
- Nullable types with `?` or `| null` — avoid `undefined` unless necessary

### React Components

- Functional components only — no class components
- Props typed with interfaces, named `{ComponentName}Props`
- Custom hooks for reusable logic, prefixed with `use`
- Keep components small — single responsibility
- Prefer composition over inheritance

### Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PostComposer` |
| Hooks | camelCase, use prefix | `useSocialAccounts` |
| Files | kebab-case | `post-composer.tsx` |
| Variables | camelCase | `postList` |
| Constants | UPPER_SNAKE_CASE | `MAX_POST_LENGTH` |
| Types/Interfaces | PascalCase | `PostData` |
| API routes | kebab-case | `/api/posts/[id]` |

### File Structure

```
src/
├── app/                    ← Next.js App Router pages
│   ├── (auth)/             ← Auth routes
│   ├── (dashboard)/        ← Dashboard routes
│   └── api/                ← API routes
├── components/             ← Reusable UI components
│   ├── ui/                 ← Primitive components (Button, Input)
│   ├── layout/             ← Layout components (Sidebar, Header)
│   ├── social/             ← Social platform components
│   ├── content/            ← Content management components
│   ├── analytics/          ← Analytics components
│   └── leads/              ← Lead management components
├── hooks/                  ← Custom React hooks
├── lib/                    ← Utilities, helpers, configs
│   ├── platforms/          ← Platform-specific integrations
│   ├── ai/                 ← AI content engine
│   └── analytics/          ← Analytics processing
├── prisma/                 ← Database schema, migrations
└── types/                  ← Shared TypeScript types
```

## Review Checklist

Before committing code, verify:

- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no warnings
- [ ] Component is responsive (mobile + desktop)
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard navigation
- [ ] Error handling: loading states, error boundaries, fallback UI
- [ ] No hardcoded values — use constants or env variables
- [ ] Database queries are indexed where needed
- [ ] API routes validate input, handle errors gracefully
- [ ] No secrets or keys in code
- [ ] Commit message follows convention

## Git Convention

```
XX -- AIOS -- <short description>
```

- XX = auto-incremented number
- One logical change per commit
- Write in imperative mood: "Add post composer" not "Added post composer"

## Security Rules

- Never commit `.env` files
- Store OAuth tokens encrypted in DB
- Validate all user input on server side
- Use parameterized queries (Prisma handles this)
- Set secure cookie flags for sessions
- Rate limit authentication and AI generation endpoints
- Never expose API keys to client

## Performance Rules

- Use `next/image` for all images
- Lazy load components below the fold
- Memoize expensive computations with `useMemo`
- Debounce AI generation inputs
- Index database columns used in WHERE/JOIN
- Paginate large lists (posts, analytics)
- Cache AI responses for identical requests
