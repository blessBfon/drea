
## 🧠 1. `validateEntry()`

Validates a single value against one or more `{rule, errorMsg}` pairs.

Rules are evaluated in order — validation **stops at the first failure**.

```typescript
import { validateEntry } from 'drea'

validateEntry({
  entry: value,
  RuleAndError: [
    { rule: Function | RegExp | None, errorMsg: any },
  ]
})
// => { status: boolean, error: any | null }
```

### ✅ Success

```typescript
validateEntry({
  entry: 'JohnDoe',
  RuleAndError: [{ rule: (v: unknown) => typeof v === 'string', errorMsg: 'Must be a string' }]
})
// => { status: true, error: null }
```

### ❌ Failure — stops at first failing rule

```typescript
validateEntry({
  entry: 17,
  RuleAndError: [
    { rule: (v: number) => typeof v === 'number', errorMsg: 'Must be a number' },
    { rule: (v: number) => v >= 18,               errorMsg: 'Must be 18 or above' }
  ]
})
// rule 1 ✅   rule 2 ❌ — stops here
// => { status: false, error: 'Must be 18 or above' }
```

### Notes

- `entry` can be any type — string, number, array, object, function output
- `RegExp` rules require `entry` to be a string
- `rule` functions must return a boolean
- `errorMsg` can be any type — string, number, object, array, or null

---
