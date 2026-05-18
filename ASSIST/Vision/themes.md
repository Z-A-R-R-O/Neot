# Theme Engine — Spec

## Overview

Multi-mode theming system supporting light, dark, custom, and white-label themes per tenant.

## Architecture

### CSS Variables

All theming uses CSS custom properties for runtime switching:

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-bg: #ffffff;
  --color-bg-secondary: #f3f4f6;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Theme Modes

| Mode | Description |
|------|-------------|
| Light | Default, high contrast |
| Dark | Inverted, reduced brightness |
| Custom | User-defined colors |
| White-label | Tenant-specific branding |

### Theme Switching

- User preference stored in profile
- System preference detection (`prefers-color-scheme`)
- URL parameter override for preview
- Smooth transition animation

### White-Label Support

- Per-tenant theme configuration
- Logo, favicon, brand colors
- Custom domain support
- Email template theming

## Implementation

```typescript
interface Theme {
  name: string;
  mode: 'light' | 'dark' | 'custom';
  colors: Record<string, string>;
  fonts: { sans: string; mono: string };
  radius: { sm: string; md: string; lg: string };
}
```

## Accessibility

- Minimum contrast ratio 4.5:1 (WCAG AA)
- Focus indicators visible in all themes
- No color-only information conveyance
- Test all themes with screen readers
