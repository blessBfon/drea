### `extend()` / `remove()` / `swap()`

Runtime schema mutation.

```typescript
// Add new fields
model.extend({ bio: { rule: /[\S]{1,100}/, errorMsg: 'Bio max 100 chars' } })

// Drop a field
model.remove('bio')

// Replace entire schema
model.swap({ email: { rule: (v: string) => /@/.test(v), errorMsg: 'Invalid email' } })
```

---
