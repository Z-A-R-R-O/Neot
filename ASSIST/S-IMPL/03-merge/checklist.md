# Merge — Integration

> Run together after both tracks done. Fix issues, verify everything connects.

---

## Merge

```
[ ] Both tracks committed to same branch
[ ] git pull — latest from both devs
[ ] Resolve any conflicts (should be zero — file isolation by design)
```

## Integration Tests

```
[ ] npm run typecheck — zero errors
[ ] npm run build — succeeds
[ ] npm run test — all passing
[ ] blockRegistry.has("text") === true
[ ] blockRegistry.has("video") === true
[ ] blockRegistry.has("quiz") === true
[ ] Homepage / renders from DB schema
[ ] /about (published) renders correctly
[ ] /courses still works (existing functionality)
[ ] /lessons/{id} player works (blocks via registry)
[ ] Admin page builder → palette shows sections → preview matches public
[ ] Admin theme editor → colors change → CSS vars update
[ ] Block definitions API returns records from DB
```

**Commit:** `S-IMPL: Merge tracks A+B, all checks passing`
