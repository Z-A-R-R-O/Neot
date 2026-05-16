# S-IMPL — Split Implementation

> Two devs, one phase, zero conflicts.

```
ASSIST/S-IMPL/
├── README.md
├── 01-track-a/checklist.md       ← Dev A
├── 02-track-b/checklist.md       ← Dev B
├── 03-merge/checklist.md         ← Together
└── 04-validation/checklist.md    ← Sign-off
```

### Track Isolation

| File | Owned By | Conflict Risk |
|------|----------|--------------|
| `web/src/lib/block-registry.ts` | Dev A creates first | None (new file) |
| `web/src/types/registry.ts` | Dev A | None (new file) |
| `web/src/components/blocks/text-block.tsx` | Dev A | None (add line at bottom) |
| `web/src/components/blocks/video-block.tsx` | Dev A | None (add line at bottom) |
| `web/src/components/blocks/quiz-block.tsx` | Dev A | None (add line at bottom) |
| `web/src/components/blocks/index.ts` | Dev A | None (new file) |
| `web/src/components/blocks/page-renderer.tsx` | Dev A | None (new file) |
| `web/src/components/blocks/block-renderer.tsx` | Dev A | Only this rewrites |
| `web/src/components/blocks/fallback-block.tsx` | Dev A | None (new file) |
| `web/prisma/schema.prisma` | Dev A | Append only |
| `web/src/lib/block-definitions-db.ts` | Dev A | None (new file) |
| `web/src/app/api/admin/block-definitions/route.ts` | Dev A | None (new file) |
| `web/src/app/providers.tsx` | Dev A | Add one import |
| `web/src/app/\[slug\]/page.tsx` | Dev B | None (new file) |
| `web/src/app/api/pages/\[slug\]/route.ts` | Dev B | None (new file) |
| `web/src/app/page.tsx` | Dev B | Rewrites homepage |
| `web/src/components/admin/pages/live-preview.tsx` | Dev B | Rewrites component |
| `web/src/lib/editor-registry.ts` | Dev B | None (new file) |
| `web/src/components/admin/pages/section-builder.tsx` | Dev B | Rewrites renderEditor() |
| `web/src/components/admin/pages/section-editors/*.tsx` | Dev B | Add one line each |

### Workflow

1. Dev A creates `block-registry.ts` & `page-renderer.tsx` first
2. Dev B pulls those before starting Track B
3. Both work in parallel on their own files
4. Merge track resolves anything (should be none)
5. Validation track signs off
