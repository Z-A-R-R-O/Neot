# Engineering Standards

> Code conventions, review checklist, and architecture rules for the NEOT platform.

---

## 1. Code Conventions

### TypeScript

```typescript
// Use strict mode. No `any` unless absolutely necessary.
// Prefer `interface` over `type` for object shapes.
// Use `type` for unions, intersections, mapped types.

// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
}

type BlockType = 'text' | 'video' | 'quiz' | 'flashcard';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };

// ❌ Avoid
interface UserProfile {
  id: string;
  name: string;
  role: string;  // Use union type
}
```

### React / Next.js

```typescript
// App Router: Use server components by default.
// Only add 'use client' when you need interactivity.

// ✅ Page (server component):
export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);  // Direct DB call
  return <CourseDetail course={course} />;
}

// ✅ Client component only when needed:
'use client';
export function EnrollButton({ courseId }: { courseId: string }) {
  const { mutate } = useMutation(enrollInCourse);
  return <Button onClick={() => mutate(courseId)}>Enroll</Button>;
}
```

### File Structure per Feature

```
feature-name/
├── page.tsx           ← Route page (server component)
├── components/
│   ├── feature-widget.tsx    ← Client component
│   └── feature-detail.tsx
├── hooks/
│   └── useFeature.ts
└── types.ts
```

### Naming

```
Files:       kebab-case.tsx, kebab-case.ts
Components:  PascalCase.tsx
Hooks:       useCamelCase.ts
Functions:   camelCase()
Types:       PascalCase
Constants:   UPPER_SNAKE_CASE
CSS classes: tailwind classes only (no custom CSS files)
```

---

## 2. Component Patterns

### Component Signature

```typescript
// Every component accepts className for override
interface ComponentProps {
  className?: string;
  // ... specific props
}

export function Component({ className, ...props }: ComponentProps) {
  return <div className={cn('base-styles', className)}>{/* ... */}</div>;
}
```

### Data Fetching

```typescript
// Use TanStack Query for all client-side data fetching.
// Never use useEffect for data fetching.

// ✅
function CourseList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => api.getCourses(filters),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.length) return <EmptyState />;
  return data.map(course => <CourseCard key={course.id} course={course} />);
}
```

### State Management

```typescript
// Zustand for global state (auth, theme, editor).
// TanStack Query for server state.
// React state (useState) for local UI state.

// ✅ Zustand store (auth via local API)
export const useAuthStore = create<AuthStore>((set) => ({
  // See src/stores/authStore.ts for implementation
}));

// ✅ UI components via shadcn/ui (Radix Nova preset)
// Components are registry-managed at src/components/ui/
// Add new: npx shadcn@latest add <component>
// Never hand-roll Radix wrappers — use shadcn CLI instead
```

---

## 3. Database Rules

### Schema Management (Prisma + SQLite)

```prisma
// Schema: prisma/schema.prisma
// Push changes: npx prisma db push
// Generate client: npx prisma generate
// Config: prisma.config.ts (Prisma 7 style)

model Profile {
  id           String   @id           // UUID from crypto.randomUUID()
  email        String?                // Used as login identifier
  passwordHash String?  @map("password_hash")  // bcrypt hash
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  // ...
}
```

- Use `@map()` for snake_case column names in SQLite
- Always add `createdAt` and `updatedAt` on all tables
- Use `@default(uuid())` for primary keys (or generate from crypto in app code for Profile)
- Use `cascade` delete for child relations
- Access control is handled in API route handlers (no RLS with SQLite)
- No migrations yet — Prisma schema is source of truth; use `db push` during dev

---

## 4. API Route Standards

```typescript
// Each route handler:
// 1. Validate input (Zod)
// 2. Authenticate (session check)
// 3. Authorize (role check)
// 4. Execute
// 5. Return typed response

export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate
  const schema = z.object({ title: z.string().min(1).max(200) });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error }, { status: 400 });
  
  // Authenticate (local auth via Prisma sessions)
  import { getUser } from "@/lib/auth";
  const user = await getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Authorize
  if (user.role !== 'teacher') return Response.json({ error: 'Forbidden' }, { status: 403 });
  
  // Execute
  const course = await createCourse(parsed.data, user.id);
  
  // Return
  return Response.json(course, { status: 201 });
}
```

---

## 5. Error Handling Hierarchy

```
Layer              Strategy
─────────────────────────────────────────────
API Route          Zod validation → try/catch → typed error response
Server Component   try/catch → error.tsx boundary
Client Component   TanStack Query error state → <ErrorState /> with retry
UI Component       ErrorBoundary wrapper → fallback UI
Global             sentry.captureException() for unexpected errors
```

### Error State Component

```typescript
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <p className="text-lg text-gray-600">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
```

---

## 6. Testing Strategy

```
Unit Tests (Vitest):
  - Pure functions (calculations, transformations)
  - Custom hooks
  - Utility functions
  - API route handlers
  Target: > 80% coverage on lib/ and hooks/

Component Tests (Vitest + Testing Library):
  - UI primitives (button, input, dialog)
  - Interactive components (quiz block, course card)
  - Error/loading/empty states
  Target: All non-page components have render tests

E2E Tests (Cypress):
  - Auth flow (signup → login → logout)
  - Teacher flow (create course → add lesson → publish)
  - Student flow (browse → enroll → take lesson → complete quiz)
  - Purchase flow (marketplace → stripe → enrollment)
  Target: Critical paths covered in 5 specs
```

---

## 7. Performance Budgets

| Metric | Budget | Tool |
|--------|--------|------|
| Bundle (initial route) | < 100KB gzipped | Webpack Bundle Analyzer |
| FCP | < 1.5s | Lighthouse |
| LCP | < 2.5s | Lighthouse |
| TTI | < 3.0s | Lighthouse |
| Lighthouse score | > 90 | Lighthouse CI |
| API response (p95) | < 500ms | Sentry Performance |
| Image size (hero) | < 100KB | Manual |
| Image size (thumbnail) | < 20KB | Manual |

---

## 8. Code Review Checklist

Every PR must pass these checks:

```
□ TypeScript compiles with --strict (no errors)
□ Lint passes (no warnings)
□ Tests pass (new code has tests)
□ No console.log, debugger, TODO (use proper logging)
□ RLS policies exist for new tables
□ Zod validation on all API routes
□ Error states handled (loading, empty, error, offline)
□ Mobile responsive (test at 375px width)
□ Accessibility (keyboard nav, ARIA labels)
□ No secrets exposed (env vars only)
□ Performance (no unnecessary re-renders, large bundles)
```

---

## 9. Git Workflow

```
main          ← Production (deploys to Vercel production)
develop       ← Integration branch
feat/*        ← Feature branches (branch off develop)
fix/*         ← Bug fix branches
chore/*       ← Tooling, dependencies, CI

Commit messages:
  feat: Add quiz block with instant feedback
  fix: Prevent duplicate enrollment on rapid clicks
  chore: Upgrade Next.js to 14.2
  refactor: Extract block renderer into shared component
  docs: Update API endpoint documentation
```

---

## 10. Security Rules

```
□ All env vars validated at build time (Zod)
□ RLS on every table — never bypass from client
□ Service role key only in server-side code / server actions
□ Input sanitized via Zod before hitting DB
□ CSP headers set in middleware
□ CORS restricted to own domains
□ No secrets in client bundle
□ Rate limiting on auth and AI endpoints
□ Session tokens expire (1h default)
□ File uploads validated by type and size
```
