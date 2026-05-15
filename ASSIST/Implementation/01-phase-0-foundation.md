# Phase 0: Foundation

> **Goal:** Deployed Next.js app with Prisma + SQLite backend, auth UI, and CI/CD.

---

## Task 0.1 — Project Scaffolding

```
Files to create:
  web/package.json
  web/tsconfig.json
  web/next.config.js
  web/tailwind.config.ts
  web/postcss.config.js
  web/.env.local.example
  web/.eslintrc.json
  web/.prettierrc
  web/src/app/layout.tsx              ← Root layout with fonts + metadata
  web/src/app/page.tsx                ← Landing/homepage placeholder
  web/src/app/globals.css             ← Tailwind directives + CSS vars
  web/public/fonts/                   ← Variable font files
```

Setup:
```bash
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir
npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query zustand
npm install framer-motion lucide-react clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-toast
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install -D @types/node prettier prettier-plugin-tailwindcss
```

**Write:** `npm run dev` starts without errors. Blank page loads.
**Test:** `npm run dev` → http://localhost:3000 renders "NEOT" text.

---

## Task 0.2 — Tailwind Design System

```
Files to modify:
  web/tailwind.config.ts              ← Custom colors, fonts, animations
  web/src/app/globals.css             ← CSS variables for theme engine prep
  web/src/lib/utils.ts                ← cn() utility (clsx + tailwind-merge)
```

```typescript
// tailwind.config.ts additions
colors: {
  primary: { 50: '#faf5ff', ..., 900: '#4c1d95' },
  secondary: { ... },
  accent: { ... },
}
fontFamily: {
  heading: ['Fredoka One', 'cursive'],
  body: ['Nunito', 'sans-serif'],
}
```

**Write:** All components use `cn()` for className merging. CSS variables exist.
**Test:** Test component renders with primary color and heading font.

---

## Task 0.3 — Supabase Project Setup

```
Files to create:
  web/supabase/config.toml
  web/supabase/migrations/001_core_schema.sql
  web/supabase/seed.sql
  web/src/lib/supabase/client.ts      ← Browser client
  web/src/lib/supabase/server.ts      ← Server client (App Router)
  web/src/lib/supabase/middleware.ts   ← Auth middleware
  web/src/middleware.ts               ← Next.js middleware for auth
```

Schema per `Vision - Core/07-backend-infrastructure.md`:
- `profiles` table (extends `auth.users`)
- RLS policies for profiles
- Storage bucket: `avatars`, `thumbnails`, `videos`, `uploads`

**Write:** Supabase project linked. `profiles` table exists with RLS. Storage buckets created.
**Test:** `npx supabase db dump` shows core tables.

---

## Task 0.4 — CI/CD Pipeline

```
Files to create:
  .github/workflows/ci.yml           ← Lint + typecheck + test on PR
  .github/workflows/deploy.yml       ← Deploy to Vercel on push to main
  web/vercel.json                     ← Vercel config
```

**Write:** Every PR gets auto-linted. Push to `main` deploys to Vercel.
**Test:** Push to `main` → Vercel deployment succeeds → URL accessible.

---

## Task 0.5 — Directus CMS Installation

```
Files to create:
  directus/docker-compose.yml
  directus/Dockerfile
  directus/directus.config.js
  directus/extensions/                ← Custom extensions directory
```

```yaml
services:
  directus:
    image: directus/directus:10
    ports: ["8055:8055"]
    environment:
      DB_CLIENT: postgres
      DB_HOST: ${SUPABASE_DB_HOST}
      DB_PORT: 5432
      DB_DATABASE: postgres
      DB_USER: ${SUPABASE_DB_USER}
      DB_PASSWORD: ${SUPABASE_DB_PASSWORD}
      PUBLIC_URL: "https://cms.neot-learning.com"
      KEY: ${DIRECTUS_SECRET}
      SECRET: ${DIRECTUS_SECRET}
```

**Write:** Directus accessible at https://cms.neot-learning.com with admin account.
**Test:** Login to Directus, create a test collection, see it in the database.

---

## Task 0.6 — Auth UI (Login/Signup)

```
Files to create:
  web/src/app/(auth)/login/page.tsx
  web/src/app/(auth)/signup/page.tsx
  web/src/app/(auth)/forgot-password/page.tsx
  web/src/app/(auth)/callback/route.ts        ← OAuth callback
  web/src/components/ui/input.tsx
  web/src/components/ui/label.tsx
  web/src/components/ui/button.tsx
  web/src/components/ui/card.tsx
  web/src/components/auth/login-form.tsx
  web/src/components/auth/signup-form.tsx     ← Age-gated: <13, 13-18, 18+
  web/src/components/auth/social-buttons.tsx  ← Google OAuth button
  web/src/hooks/useAuth.ts
  web/src/stores/authStore.ts
```

**Write:** User can register, confirm email, login, and logout. Profiles auto-created.
**Test:** Cypress: signup → confirm → login → see profile. Google OAuth works.

---

## Task 0.7 — Auth Middleware + Route Protection

```
Files to modify:
  web/src/middleware.ts               ← Redirect unauthenticated users
  web/src/lib/supabase/middleware.ts   ← Session refresh
```

Protected routes: `/(dashboard)/*`, `/(teacher)/*`, `/(admin)/*`.
Public routes: `/login`, `/signup`, `/forgot-password`, `/`.

**Write:** Unauthenticated users cannot access `/dashboard`. Logged-in users redirected from `/login`.
**Test:** `/dashboard` without auth → redirects to `/login`. `/login` with auth → redirects to `/dashboard`.

---

## Task 0.8 — Role Management & Onboarding

```
Files to create:
  web/src/app/(auth)/onboarding/page.tsx
  web/src/components/auth/role-selector.tsx
  web/src/components/auth/onboarding-flow.tsx
  web/src/app/api/auth/role/route.ts
```

Flow: First login → `/onboarding` → select role → fill profile → role-specific dashboard.
- Student: age group, grade, interests
- Teacher: subjects, grade levels
- Parent: child link code or email

**Write:** First-time user sees onboarding. After completion, redirected to role-specific dashboard.
**Test:** New signup → `/onboarding` → select Teacher → see teacher dashboard placeholder.

---

## Task 0.9 — Primitive UI Components

```
Files to create:
  web/src/components/ui/avatar.tsx
  web/src/components/ui/badge.tsx
  web/src/components/ui/dialog.tsx
  web/src/components/ui/dropdown-menu.tsx
  web/src/components/ui/progress.tsx
  web/src/components/ui/skeleton.tsx
  web/src/components/ui/toast.tsx
  web/src/components/ui/tabs.tsx
  web/src/components/ui/tooltip.tsx
  web/src/components/ui/select.tsx
  web/src/components/ui/textarea.tsx
```

Radix-based with Tailwind styling. Each supports: `size` (sm/md/lg), `variant`, `className` override via `cn()`.

**Write:** All components accessible (keyboard, screen reader). Consistent styling.
**Test:** Tab through each component. Focus ring visible. ARIA attributes present.

---

## Task 0.10 — Layout Shell Components

```
Files to create:
  web/src/components/layout/shell.tsx
  web/src/components/layout/sidebar.tsx
  web/src/components/layout/header.tsx
  web/src/components/layout/mobile-nav.tsx
  web/src/components/layout/app-layout.tsx
  web/src/app/(dashboard)/layout.tsx
  web/src/app/(dashboard)/dashboard/page.tsx  ← Placeholder
```

Nav items per role:
- Student: Home, My Courses, Achievements, Leaderboard
- Teacher: Dashboard, My Courses, Analytics, Students
- Parent: Overview, Children, Reports, Settings
- Admin: Dashboard, Pages, Themes, Blocks, Users, Settings

**Write:** Each role sees role-specific sidebar. Mobile responsive with hamburger menu.
**Test:** Login as student → see student nav links. Login as teacher → see teacher nav links.

---

## Task 0.11 — Error Handling & States

```
Files to create:
  web/src/components/ui/error-boundary.tsx
  web/src/components/ui/empty-state.tsx
  web/src/components/ui/loading-screen.tsx
  web/src/hooks/useOnlineStatus.ts
  web/src/components/layout/offline-banner.tsx
```

**Write:** API failure shows error with retry. Empty state shows illustration + CTA. Offline banner shows when disconnected.
**Test:** Simulate network offline → banner shows. Simulate API error → error state with retry.

---

## Task 0.12 — Supabase Types + Query Layer

```
Files to create:
  web/src/types/database.ts         ← Generated Supabase types
  web/src/types/blocks.ts           ← Block schema types
  web/src/types/gamification.ts
  web/src/types/admin.ts
  web/src/lib/supabase/queries.ts   ← Typed query helpers
  web/src/lib/supabase/admin-client.ts
```

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

**Write:** All DB queries are fully typed. No raw SQL outside queries file.
**Test:** TypeScript compilation passes with `--strict`.

---

## Task 0.13 — TanStack Query Setup

```
Files to create:
  web/src/lib/providers.tsx
  web/src/app/providers.tsx
```

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Write:** All pages wrapped in providers. React Query Devtools available in development.
**Test:** Component uses `useQuery` → data loads → cached → second load instant.

---

## Task 0.14 — Environment Variable Validation

```
Files to create:
  web/src/lib/env.ts
```

```typescript
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  ...
});
```

**Write:** App fails to build if required env vars are missing.
**Test:** Remove required var → build fails with clear error.

---

## Phase 0 Validation Gate

- [x] `npm run dev` starts without errors
- [x] Homepage loads at localhost:3000
- [x] Prisma SQLite database created (prisma/dev.db)
- [x] Auth UI renders (login/signup/forgot-password pages)
- [x] Role-based onboarding flow works
- [x] Role-based sidebar navigation
- [x] All UI primitives render correctly
- [x] Mobile-responsive layout
- [x] Loading/empty/error states visible
- [x] Offline banner appears when disconnected
- [x] Supabase can be added later by setting env vars

> **Phase 0 Complete** ✅ → Move to `02-phase-1-core-learning.md`
