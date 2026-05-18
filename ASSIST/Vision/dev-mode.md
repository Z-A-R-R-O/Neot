# Visual Experience Engine (Dev Mode) — Spec

## Overview

Real-time UI customization system that allows non-technical users to modify layout, styling, and content without code.

## Core Concepts

### Block Registry

Every UI element is a registered block with configurable properties:

```typescript
interface Block {
  id: string;
  type: 'hero' | 'card' | 'grid' | 'list' | 'nav' | 'footer' | 'form';
  props: Record<string, unknown>;
  children?: Block[];
  styles: Record<string, string>;
}
```

### Properties Panel

Side panel for editing selected block:

- Color pickers
- Spacing controls (margin, padding)
- Typography settings
- Layout options (flex, grid)
- Content editing
- Visibility toggles

### Live Preview

- Real-time updates as properties change
- Responsive preview (mobile, tablet, desktop)
- Undo/redo history
- Compare with original

### Publishing

- Draft mode (changes not live)
- Preview link for review
- Publish with version tracking
- Rollback to previous versions

## User Flow

```
Enable Dev Mode → Select Element → Edit Properties → Preview → Save Draft → Publish
```

## Technical Implementation

- Overlay system for block selection
- Zustand store for draft changes
- CSS variable injection for styling
- Serialization for save/load
- Permission gating (admin/teacher only)

## Safety

- Cannot break core functionality
- Validation on property changes
- Sandbox mode for testing
- Audit log of all changes
