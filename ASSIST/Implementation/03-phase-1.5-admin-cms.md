# Phase 1.5: Admin CMS

> **Goal:** Admin can edit pages, manage themes, and control content — without code.

---

## Task 1.5.1 — Page Sections Schema + API

```
Files to create:
  web/src/app/api/admin/pages/route.ts
  web/src/app/api/admin/pages/[slug]/route.ts
  web/src/app/api/admin/pages/[slug]/sections/route.ts
  web/prisma/schema.prisma           ← CustomPage + PageSection models already in schema
```

Tables:
- `pages` (key, title, meta_description, is_published)
- `page_sections` (page_key, section_type, config JSONB, sort_order, is_active)

```typescript
interface SectionConfig {
  type: 'hero' | 'feature-grid' | 'course-carousel' | 'stats-bar'
      | 'testimonials' | 'cta-banner' | 'pricing-table' | 'faq'
      | 'blog-grid' | 'custom-html';
  props: Record<string, any>;
  styles?: { padding?: string; bgColor?: string; ... };
}
```

**Write:** API returns page with ordered sections. Admin can CRUD sections.
**Test:** Create page with 3 sections → GET returns them in order.

---

## Task 1.5.2 — Admin Dashboard Shell

```
Files to create:
  web/src/app/(admin)/layout.tsx
  web/src/app/(admin)/admin/page.tsx
  web/src/app/(admin)/admin/pages/page.tsx
  web/src/app/(admin)/admin/pages/[key]/edit/page.tsx
  web/src/components/admin/shell.tsx
  web/src/components/admin/sidebar.tsx
  web/src/components/admin/header.tsx
  web/src/hooks/useAdmin.ts
```

Nav: Dashboard, Pages, Themes, Learning Blocks, Users, Settings, AI Config.

**Write:** Admin shell with navigation. Dashboard shows platform metrics.
**Test:** Admin logs in → sees admin nav → navigates between sections.

---

## Task 1.5.3 — Section Builder (Drag-Drop)

```
Files to create:
  web/src/app/(admin)/admin/pages/[key]/edit/page.tsx
  web/src/components/admin/pages/section-builder.tsx
  web/src/components/admin/pages/section-palette.tsx
  web/src/components/admin/pages/section-wrapper.tsx
  web/src/components/admin/pages/section-editors/hero-editor.tsx
  web/src/components/admin/pages/section-editors/feature-grid-editor.tsx
  web/src/components/admin/pages/section-editors/stats-bar-editor.tsx
  web/src/components/admin/pages/section-editors/cta-editor.tsx
  web/src/components/admin/pages/section-editors/faq-editor.tsx
  web/src/components/admin/pages/section-editors/pricing-editor.tsx
  web/src/components/admin/pages/live-preview.tsx
  web/src/stores/pageBuilderStore.ts
```

| Section Type | Configurable Props |
|---|---|
| **Hero** | title, subtitle, CTA text/link, background (color/image/video), animation |
| **Feature Grid** | columns (2/3/4), cards (icon, title, description) |
| **Course Carousel** | heading, filter (popular/new/trending), count |
| **Stats Bar** | stat items (number, label, icon) |
| **Testimonials** | cards (avatar, name, text, rating), autoplay |
| **CTA Banner** | text, button text/link, background |
| **FAQ** | items (question, answer), accordion layout |
| **Pricing Table** | plans (name, price, features, CTA), highlight plan |
| **Custom HTML** | raw HTML / embed code |

**Write:** Admin adds sections → configures → preview updates live → saves → homepage reflects changes.
**Test:** Create hero with title + CTA → save → refresh homepage → hero renders.

---

## Task 1.5.4 — Themes Schema + API

```
Files to create:
  web/src/app/api/admin/themes/route.ts
  web/src/app/api/admin/themes/[id]/route.ts
  web/src/app/api/admin/themes/active/route.ts
  web/prisma/schema.prisma           ← SiteTheme model already in schema
```

```typescript
interface ThemeConfig {
  name: string;
  slug: string;
  colors: {
    primary: string; primaryLight: string; primaryDark: string;
    secondary: string; accent: string; background: string;
    backgroundAlt: string; surface: string; text: string;
    textSecondary: string; textOnPrimary: string;
    success: string; warning: string; error: string;
    border: string; divider: string; shadow: string;
  };
  typography: { headingFont: string; bodyFont: string; baseSize: number };
  radii: { sm: string; md: string; lg: string; xl: string; full: string };
  animations: { default: string; duration: number; pageTransition: string };
}
```

**Write:** 4 system themes pre-seeded (Kids, School, Dark, Gamified). Active theme readable via public API.
**Test:** GET `/api/admin/themes/active` returns current theme config.

---

## Task 1.5.5 — Theme Engine Implementation

```
Files to create:
  web/src/lib/theme/theme-provider.tsx
  web/src/lib/theme/theme-converter.ts
  web/src/lib/theme/useTheme.ts
  web/src/stores/themeStore.ts
```

```typescript
function ThemeProvider({ children }) {
  const { data: theme } = useQuery({
    queryKey: ['activeTheme'],
    queryFn: () => api.get('/api/admin/themes/active'),
    staleTime: 1000 * 60 * 60,
  });
  const cssVars = convertThemeToCSS(theme?.config);
  return <div style={cssVars as React.CSSProperties}>{children}</div>;
}
```

Generated CSS variables: `--color-primary`, `--font-heading`, `--radius-md`, `--animation-duration`.

**Write:** All UI components use CSS variables. Switching theme instantly changes colors/typography.
**Test:** Switch Kids → Dark → entire app re-colors without page reload.

---

## Task 1.5.6 — Theme Editor UI

```
Files to create:
  web/src/app/(admin)/admin/themes/page.tsx
  web/src/app/(admin)/admin/themes/[id]/edit/page.tsx
  web/src/components/admin/themes/theme-card.tsx
  web/src/components/admin/themes/theme-editor.tsx
  web/src/components/admin/themes/color-picker.tsx
  web/src/components/admin/themes/font-selector.tsx
  web/src/components/admin/themes/animation-config.tsx
  web/src/components/admin/themes/live-preview-panel.tsx
```

Split pane: Settings (Colors, Typography, Radii, Animations) + Live preview of sample page.

**Write:** Admin edits colors → preview updates in real-time → saves → theme available for switching.
**Test:** Change primary to red → preview updates → save → homepage buttons are red.

---

## Task 1.5.7 — Theme Inheritance Chain

```
File to create:
  web/src/lib/theme/theme-resolver.ts
```

Resolution order: System default → Global active → Course override → Student personalization → Block-type override.

**Write:** Theme respects inheritance chain. Course override changes appearance for that course only.
**Test:** Set course theme → student sees different colors in that course vs. dashboard.

---

## Task 1.5.8 — Block Library Management

```
Files to create:
  web/src/app/(admin)/admin/blocks/page.tsx
  web/src/app/(admin)/admin/blocks/[id]/edit/page.tsx
  web/src/components/admin/blocks/block-library.tsx
  web/src/components/admin/blocks/block-type-editor.tsx
  web/src/components/admin/blocks/block-field-editor.tsx
  web/src/components/admin/blocks/block-version-history.tsx
  web/src/app/api/admin/blocks/route.ts
  web/src/app/api/admin/blocks/[id]/route.ts
```

Admin can: define block schemas, edit fields, version blocks, set block-level styles, test rendering.

**Write:** Block library shows all block types. Admin can edit schema and see version history.
**Test:** Edit quiz block setting → new lessons use updated behavior.

---

## Task 1.5.9 — User Management

```
Files to create:
  web/src/app/(admin)/admin/users/page.tsx
  web/src/app/(admin)/admin/users/[id]/page.tsx
  web/src/components/admin/users/user-table.tsx
  web/src/components/admin/users/user-filters.tsx
  web/src/components/admin/users/user-actions.tsx
  web/src/app/api/admin/users/route.ts
  web/src/app/api/admin/users/[id]/route.ts
```

Features: search, filter by role/status, bulk actions (suspend/activate/change role), user detail with activity log.

**Write:** Admin finds any user, views activity, manages account.
**Test:** Search for student → view enrollments → suspend account.

---

## Task 1.5.10 — Media Library

```
Files to create:
  web/src/app/(admin)/admin/media/page.tsx
  web/src/components/admin/media/media-grid.tsx
  web/src/components/admin/media/media-uploader.tsx
  web/src/components/admin/media/media-detail.tsx
  web/src/app/api/admin/media/route.ts
```

Features: drag-drop upload, grid/list view, search by filename, filter by type, copy URL, delete, usage tracking.

**Write:** Admin uploads image → appears in library → copy URL → use in lesson editor.
**Test:** Upload PNG → see in grid → copy URL → paste in text block → renders.

---

## Task 1.5.11 — Platform Settings

```
Files to create:
  web/src/app/(admin)/admin/settings/page.tsx
  web/src/components/admin/settings/general-settings.tsx
  web/src/components/admin/settings/auth-settings.tsx
  web/src/components/admin/settings/email-settings.tsx
  web/src/components/admin/settings/payment-settings.tsx
  web/src/components/admin/settings/storage-settings.tsx
  web/src/components/admin/settings/security-settings.tsx
  web/src/app/api/admin/settings/route.ts
  web/src/lib/supabase/queries/admin/settings.ts
```

Settings stored in `platform_settings` (key-value JSONB): General, Auth, Email, Payments, Storage, Security.

**Write:** Admin changes platform name → appears in header. Enables OAuth → login page shows provider.
**Test:** Change name from "NEOT" to "LearnWell" → refresh → name updated.

---

## Phase 1.5 Validation Gate

- [x] Page builder creates editable homepage sections (6+ types)
- [x] Theme switching changes entire app appearance instantly
- [x] Theme editor with live preview works
- [x] CSS variable system fully functional
- [x] Block library management works
- [x] User management (search, filter, suspend) works
- [x] Media library upload/download works
- [x] Platform settings persist and affect the app
- [x] Admin dashboard shows real analytics
- [x] All admin pages load under 2s

> **Phase 1.5 Complete** ✅ → Move to `04-phase-1.75-dynamic-renderer.md`
