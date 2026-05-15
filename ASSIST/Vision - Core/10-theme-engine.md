# Theme Engine — Detailed Specification

## Overview
The theme engine allows admins to create completely different visual experiences from the same backend. This enables multi-mode operation: one platform, many faces.

## Theme Architecture

```
Theme Config (JSON)
    ↓
CSS Variables Generation
    ↓
Component-Level Overrides
    ↓
Block-Level Style Application
    ↓
Runtime Rendering
```

## Theme Configuration Schema

```typescript
interface ThemeConfig {
  name: string;
  slug: string;
  description?: string;
  
  colors: {
    primary: string;         // Main brand color
    primaryLight: string;    // Lighter variant
    primaryDark: string;     // Darker variant
    secondary: string;       // Secondary brand color
    accent: string;          // Accent/highlight color
    background: string;      // Page background
    backgroundAlt: string;   // Card/section background
    surface: string;         // Component surface
    text: string;            // Primary text
    textSecondary: string;   // Secondary text
    textOnPrimary: string;   // Text on primary bg
    success: string;         // Correct answers, progress
    warning: string;         // Warnings, alerts
    error: string;           // Errors, wrong answers
    border: string;          // Border colors
    divider: string;         // Dividers
    shadow: string;          // Box shadow color
  };
  
  typography: {
    headingFont: string;     // Font family for headings
    bodyFont: string;        // Font family for body text
    baseSize: number;        // Base font size in px
    scaleRatio: number;      // Typography scale ratio
    lineHeight: number;      // Base line height
    fontWeightHeading: number;
    fontWeightBody: number;
  };
  
  radii: {
    sm: string;              // Small radius (buttons)
    md: string;              // Medium radius (cards)
    lg: string;              // Large radius (modals)
    xl: string;              // Extra large (hero sections)
    full: string;            // Fully rounded (pill shapes)
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  
  animations: {
    default: string;         // 'smooth' | 'bouncy' | 'snappy' | 'none'
    duration: number;        // ms
    easing: string;          // CSS easing function
    pageTransition: string;  // 'fade' | 'slide' | 'scale' | 'none'
    hoverEffect: string;     // 'lift' | 'glow' | 'underline' | 'none'
    buttonEffect: string;    // 'scale' | 'ripple' | 'none'
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  layout: {
    maxWidth: string;        // Container max width
    sidebarWidth: string;    // Sidebar width (if used)
    headerHeight: string;    // Header height
    gap: string;             // Default grid gap
    borderRadius: string;    // Default corner radius
  };
  
  components: {
    button: ComponentStyle;
    card: ComponentStyle;
    input: ComponentStyle;
    modal: ComponentStyle;
    lesson: LessonStyle;
    quiz: QuizStyle;
  };
}

interface ComponentStyle {
  variant: 'filled' | 'outlined' | 'ghost' | 'underlined';
  borderRadius: string;
  padding: string;
  fontSize: string;
  animation?: string;
}

interface LessonStyle {
  playerWidth: 'full' | 'contained' | 'narrow';
  showProgress: boolean;
  showTimer: boolean;
  notePosition: 'side' | 'bottom' | 'modal';
  blockSpacing: string;
}

interface QuizStyle {
  layout: 'vertical' | 'horizontal' | 'grid';
  showTimer: boolean;
  showProgressBar: boolean;
  feedbackStyle: 'toast' | 'inline' | 'modal';
  transitionType: 'slide' | 'fade' | 'flip';
}
```

## Built-in Themes

### 1. Kids Mode (Default for ages 5-10)

```
Kids Mode Theme:
  Colors:
    Primary:    #7C3AED (Purple - playful)
    Secondary:  #F59E0B (Amber - warm)
    Accent:     #10B981 (Green - growth)
    Background: #FFF7ED (Warm white)
    
  Typography:
    Heading: 'Fredoka One', cursive (Rounded, playful)
    Body:    'Nunito', sans-serif (Friendly, readable)
    
  Radii: 12px (Everything is rounded, safe)
  
  Animations:
    Default: 'bouncy' (Fun, energetic)
    Duration: 400ms (Slower for kids)
    
  Features:
    - Large, tappable buttons (min 48px)
    - Emoji icons everywhere
    - Colorful progress bars
    - Celebration animations on completion
    - Sparkle effects on achievements
    - Read-aloud option (text-to-speech)
```

### 2. School Mode (Ages 11-18)

```
School Mode Theme:
  Colors:
    Primary:    #2563EB (Blue - academic)
    Secondary:  #059669 (Green - progress)
    Accent:     #D97706 (Gold - achievement)
    Background: #FFFFFF (Clean white)
    
  Typography:
    Heading: 'Inter', sans-serif (Modern, clean)
    Body:    'Inter', sans-serif (Professional)
    
  Radii: 8px (Moderate, professional)
  
  Animations:
    Default: 'smooth' (Professional)
    Duration: 250ms (Faster, efficient)
    
  Features:
    - Clean, minimal interface
    - Progress metrics visible
    - Score-focused display
    - Less gamification
    - Study timer integration
    - Note-taking optimized layout
```

### 3. Dark Minimal Mode (Ages 16+ / Night Mode)

```
Dark Minimal Theme:
  Colors:
    Primary:    #818CF8 (Indigo - calm)
    Secondary:  #34D399 (Teal - accent)
    Accent:     #F472B6 (Pink - highlight)
    Background: #0F172A (Dark navy)
    Surface:    #1E293B (Slate)
    Text:       #F1F5F9 (White-ish)
    
  Typography:
    Heading: 'Plus Jakarta Sans', sans-serif
    Body:    'Plus Jakarta Sans', sans-serif
    
  Radii: 6px (Subtle)
  
  Animations:
    Default: 'none' (Battery saving)
    
  Features:
    - Eye-strain reduction
    - Low brightness mode
    - Minimal distractions
    - Focus-first layout
    - Battery efficient
    - Great for late-night studying
```

### 4. Gamified Mode (Optional, engagement-focused)

```
Gamified Mode Theme:
  Colors:
    Primary:    #EF4444 (Red - energy)
    Secondary:  #F59E0B (Gold - rewards)
    Accent:     #8B5CF6 (Purple - rare)
    Background: #1C1917 (Dark - dramatic)
    
  Typography:
    Heading: 'Press Start 2P', display (Retro game)
    Body:    'Space Grotesk', sans-serif
    
  Radii: 4px (Sharp, game-like)
  
  Animations:
    Default: 'snappy' (Game-like)
    Duration: 150ms (Quick feedback)
    
  Features:
    - XP pop-ups with particle effects
    - Level-up animations
    - Combo counter display
    - Critical hit effects on perfect scores
    - Sound effects (configurable)
    - Progress bars as health bars
    - Achievements as trophies
```

## Theme Application

### In the Student App

```typescript
// Theme provider that wraps the entire app
function ThemeProvider({ children }) {
  const { data: activeTheme } = useQuery({
    queryKey: ['activeTheme'],
    queryFn: () => api.get('/admin/themes/active'),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  return (
    <ThemeContext.Provider value={activeTheme}>
      <div style={generateCSSVariables(activeTheme.config)}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Generates CSS variables from theme config
function generateCSSVariables(config: ThemeConfig): React.CSSProperties {
  return {
    '--color-primary': config.colors.primary,
    '--color-primary-light': config.colors.primaryLight,
    '--color-background': config.colors.background,
    '--font-heading': config.typography.headingFont,
    '--radius-md': config.radii.md,
    '--animation-duration': `${config.animations.duration}ms`,
    // ... more variables
  } as React.CSSProperties;
}
```

### Theme Switching (Runtime)

```
Admin switches theme from Kids → School
  ↓
  Directus API returns new theme config
  ↓
  CSS variables update (no page reload)
  ↓
  Tailwind classes resolve to new values
  ↓
  Framer Motion switches animation presets
  ↓
  Components re-render with new styles
  ↓
  Experience changes instantly
```

## Theme Inheritance & Overrides

```
Global Theme Config
    ↓
Course-Specific Override (teacher sets)
    ↓
Student Personalization (optional)
    ↓
Block-Type Overrides (quiz theme differs)
    ↓
Final Rendered Styles
```

### Admin Theme Editor UI

```
┌─────────────────────────────────────────────────────────────┐
│  🎨 Theme Editor: Kids Mode (v2)            [Save] [Publish]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────────────────────────────────────┐  │
│  │ 👁 Preview │ │  📝 Settings                            │  │
│  │            │ │  Name: [Kids Mode                     ] │  │
│  │  [Phone]   │ │  Description: [Playful theme for kids ] │  │
│  │  [Tablet]  │ │                                          │  │
│  │  [Desktop] │ │  🎨 Colors                              │  │
│  │            │ │  ┌──────────────────────────────────┐   │  │
│  │  [Preview  │ │  │ Primary     [🟣 #7C3AED] [Pick] │   │  │
│  │  Panel]    │ │  │ Secondary   [🟡 #F59E0B] [Pick] │   │  │
│  │            │ │  │ Accent      [🟢 #10B981] [Pick] │   │  │
│  └──────────┘ │  │ Background  [⚪ #FFF7ED] [Pick] │   │  │
│               │  │ ...                                │   │  │
│               │  └──────────────────────────────────┘   │  │
│               │                                          │  │
│               │  🔤 Typography                           │  │
│               │  Heading: [Fredoka One ▼] [Weight: 700] │  │
│               │  Body:    [Nunito ▼]       [Weight: 400]│  │
│               │                                          │  │
│               │  ✨ Animations                           │  │
│               │  Style: [Bouncy ▼]  Speed: [400ms ▼]   │  │
│               │  ┌─ Page Transition                      │  │
│               │  │  ● Fade  ○ Slide  ○ Scale  ○ None    │  │
│               │  └──────────────────────────────────────  │  │
│               └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

- Theme config is **cached in localStorage** (24-hour TTL)
- CSS variables are **static** — no runtime JS style computation
- Animations use **GPU-accelerated** properties (transform, opacity)
- Theme switching is a **CSS variable swap** — no re-render of components
- Heavy themes (gamified) are **lazy-loaded** on demand
- Base theme is **< 2KB** (critical CSS inlined)
- Full theme CSS is **split per-mode** and loaded on demand
- Animations respect `prefers-reduced-motion` for accessibility
