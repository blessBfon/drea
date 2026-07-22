
## 🧮 3. `validateMany()`

Validates multiple entries in a single pass. All entries are evaluated even when one fails.

```typescript
import { validateMany } from 'drea'

validateMany([
  { entry: value1, RuleAndError: [...] },
  { entry: value2, RuleAndError: [...] }
])
// => []                                when all pass
// => [{ value, status: false, error }] one per failure
```

### ✅ All valid — empty array returned

```typescript
validateMany([
  { entry: 'johndoe',          RuleAndError: [{ rule: (v: string) => v.length >= 5, errorMsg: 'Too short' }] },
  { entry: 'john@example.com', RuleAndError: [{ rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMsg: 'Bad email' }] }
])
// => []
```

### ❌ One fails

```typescript
validateMany([
  { entry: 'johndoe',      RuleAndError: [{ rule: (v: string) => v.length >= 5, errorMsg: 'Too short' }] },
  { entry: 'johndoegmail', RuleAndError: [{ rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMsg: 'Bad email' }] }
])
// => [{ value: 'johndoegmail', status: false, error: 'Bad email' }]
```

---

