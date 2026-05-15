# Phase: UI Transformation — Premium Redesign

> **Next:** See `12-phase-2.5-dev-mode.md` for Phase 2.5 (Dev Mode / Visual Experience Engine). The new design system established here (glass, glow, dark palette, motion) becomes the visual foundation for the Dev Mode overlay UI.

> **Goal:** Move from "website" to "experience". Dark-mode-first, cinematic, premium aesthetic inspired by Apple/Linear/Stripe design language.

---

## Design Principles

1. **Dark mode first** — Deep charcoal base, glass surfaces, accent glow
2. **Typography-driven** — Massive headlines, tight leading, muted supporting text
3. **Motion as language** — Scroll reveals, staggered entrances, micro-interactions
4. **Depth over flatness** — Glassmorphism, layered surfaces, gradient borders
5. **Confidence through restraint** — Breathing room, intentional whitespace, minimal chrome

## Visual System

### Palette
- Base: `#0B0D10` (deep charcoal)
- Surface: `#111315` (soft black)
- Elevated: `#171A1F` (card surfaces)
- Accent: `#4F7CFF` (electric blue)
- Text primary: `#F5F7FA`
- Text secondary: `#9BA3AF`
- Borders: `rgba(255,255,255,0.08)`
- Glow: `rgba(79,124,255,0.25)`

### Typography
- Headlines: Geist (already loaded via next/font)
- Body: Inter (add via next/font)
- Hero title: 72–96px desktop, weight 700–800, tight line-height
- Supporting: 18–20px, max-width 600px, muted opacity

---

## Task UI.1 — Foundation: Palette + Globals

```
Files to modify:
  web/src/app/globals.css
  web/tailwind.config.ts
```

- [x] Replace beige/light palette with dark charcoal premium palette
- [x] Add CSS custom properties: glass, glow, noise, gradient utilities
- [x] Add @keyframes for float, shimmer, aurora animations
- [x] Update tailwind colors, fontFamily, extend with new utilities
- [x] Add smooth scroll behavior, selection color, focus ring

---

## Task UI.2 — Motion System

```
Files to create:
  web/src/components/ui/motion.tsx   ← Framer Motion wrapper components
```

Reusable animation primitives:
- `FadeIn` — fade + translateY entrance
- `StaggerContainer` + `StaggerItem` — staggered children
- `ScaleOnHover` — card hover scale
- `GlowOnHover` — magnetic glow effect
- `Counter` — animated number counter

---

## Task UI.3 — Premium Navigation

```
Files to create:
  web/src/components/layout/public-header.tsx  ← Floating glass navbar
```

- Floating navbar with backdrop-blur
- Transparent → glass on scroll transition
- NEOT logo + nav links + CTA button
- Mobile hamburger with smooth overlay
- Scroll-reactive with thin border

---

## Task UI.4 — Cinematic Hero

```
Files to rewrite:
  web/src/components/blocks/sections/hero-section.tsx
```

- Split layout: left text stack, right visual area
- Massive headline (72px) with gradient text
- Animated background: radial gradients + floating particles
- Glass CTA buttons with glow hover
- Floating "knowledge node" decorative elements
- Eyebrow label with accent dot

---

## Task UI.5 — Premium Feature Grid

```
Files to rewrite:
  web/src/components/blocks/sections/feature-grid-section.tsx
```

- Asymmetrical grid (one large + two stacked)
- Glass cards with gradient border
- Hover: elevation, glow, scale
- Animated icon containers with accent glow
- Staggered entrance animation

---

## Task UI.6 — Animated Stats Bar

```
Files to rewrite:
  web/src/components/blocks/sections/stats-bar-section.tsx
```

- Floating counters with animated increment
- Glowing numbers with backdrop blur
- Staggered entrance
- Integrated gradient background

---

## Task UI.7 — Premium CTA Banner

```
Files to rewrite:
  web/src/components/blocks/sections/cta-banner-section.tsx
```

- Glass gradient background
- Glow border
- Premium buttons with depth
- Subtle animated background

---

## Task UI.8 — Testimonials

```
Files to rewrite:
  web/src/components/blocks/sections/testimonials-section.tsx
```

- Floating testimonial cards with glass effect
- Avatar + name/role
- Hover elevation
- Carousel-like staggered display

---

## Task UI.9 — Public Layout Integration

```
Files to create:
  web/src/components/layout/public-layout.tsx  ← Wraps public pages
  Files to modify:
  web/src/app/layout.tsx                       ← Use Inter font
```

- Public layout with public-header
- Wraps / and /[slug] pages
- Consistent premium shell

---

## Validation Gate

- [ ] `typecheck` passes with zero errors
- [ ] `next build` compiles successfully
- [ ] Homepage renders with premium dark palette
- [ ] Navbar: floating, glass, scroll-reactive
- [ ] Hero: cinematic with split layout + animated bg
- [ ] Feature grid: asymmetric, glass cards, glow hover
- [ ] Stats: animated counters
- [ ] CTA: premium glass gradient
- [ ] Mobile responsive at 375px
- [ ] All existing section functionality preserved (admin still works)
