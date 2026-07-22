
## ⊘ 2. `None` — Skip Validation

`None` is a special sentinel that tells drea to **skip all validation** for a field. When a rule is set to `None`, the entry always passes — no rule is evaluated, no error is recorded.

```typescript
import { None } from 'drea'
```

> 💡 **Best practice:** when using `None` as a rule, set `errorMsg: null`. Since no validation runs, no error message will ever surface — a `null` errorMsg makes the intent explicit and keeps your schema clean.

### ✅ Example with `validateEntry()`

```typescript
import { validateEntry, None } from 'drea'

// Rule is None — validation is skipped, entry always passes
validateEntry({
  entry: 'anything at all',
  RuleAndError: [{ rule: None, errorMsg: null }]
})
// => { status: true, error: null }

// Even values that would normally fail pass when rule is None
validateEntry({
  entry: 12345,
  RuleAndError: [{ rule: None, errorMsg: null }]
})
// => { status: true, error: null }
```

### ✅ `None` in a schema

`None` works in every drea function — `validate()`, `nestvalidate()`, and `validateMany()`:

```typescript
import { CustomClassicModel, None } from 'drea'

const schema = {
  username:   { rule: (v: string) => v.length >= 5, errorMsg: 'Too short' },
  internalId: { rule: None, errorMsg: null }  // ← always passes, never validated
}

const model = new CustomClassicModel(schema)

model.validate({ username: 'Alice', internalId: 'sys-00191' })
// => { status: true, error: null, data: { username: 'Alice', internalId: 'sys-00191' } }

// Works even with values that look invalid — None skips all checks
model.validate({ username: 'Alice', internalId: null })
// => { status: true, error: null, data: { username: 'Alice', internalId: null } }
```

### ✅ `None` in a multi-rule array

When `None` appears inside a `RuleAndError[]` array, only that specific rule slot is skipped — any rules before and after it are still evaluated:

```typescript
validateEntry({
  entry: 'hello',
  RuleAndError: [
    { rule: None,                              errorMsg: null },        // ← skipped
    { rule: (v: string) => v.length > 3,      errorMsg: 'Too short' }  // ← still runs
  ]
})
// => { status: true, error: null }
```

> ⚠️ `None` is only valid as a `rule` value. Passing `None` as the `entry` itself throws `ArgumentTypeError: "entry cannot be of None type."`.

> 💡 **Tip:** `None` is especially useful in large reusable schemas where certain fields should always pass for a specific use case — without creating a separate schema or splitting your validation into multiple passes.

---
