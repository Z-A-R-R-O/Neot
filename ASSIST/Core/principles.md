# NEOT — Engineering Principles

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
| Components | PascalCase | `StudentDashboard` |
| Hooks | camelCase, use prefix | `useAuth` |
| Files | kebab-case | `student-dashboard.tsx` |
| Variables | camelCase | `courseList` |
| Constants | UPPER_SNAKE_CASE | `MAX_ATTEMPTS` |
| Types/Interfaces | PascalCase | `CourseData` |
| API routes | kebab-case | `/api/courses/[id]` |

### File Structure

```
src/
├── app/                    ← Next.js App Router pages
│   ├── (auth)/             ← Auth routes (grouped)
│   ├── (dashboard)/        ← Dashboard routes
│   └── api/                ← API routes
├── components/             ← Reusable UI components
│   ├── ui/                 ← Primitive components (Button, Input)
│   ├── layout/             ← Layout components (Header, Sidebar)
│   └── features/           ← Feature-specific components
├── hooks/                  ← Custom React hooks
├── lib/                    ← Utilities, helpers, configs
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
XX -- NEOT -- <short description>
```

- XX = auto-incremented number from `git-helper.ps1`
- One logical change per commit
- Write in imperative mood: "Add quiz component" not "Added quiz component"

## Security Rules

- Never commit `.env` files
- Hash passwords with bcrypt (min 10 rounds)
- Validate all user input on server side
- Use parameterized queries (Prisma handles this)
- Set secure cookie flags for sessions
- Rate limit authentication endpoints

## Performance Rules

- Use `next/image` for all images
- Lazy load components below the fold
- Memoize expensive computations with `useMemo`
- Debounce search inputs and frequent events
- Index database columns used in WHERE/JOIN
- Paginate large lists — never load all records at once
