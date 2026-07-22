
### `validate()`

Validates a flat data object. All fields are evaluated even when one fails.

```typescript
// ✅ All valid
model.validate({ name: 'Alice', age: 30 })
// => { status: true, error: null, data: { name: 'Alice', age: 30 } }

// ❌ Multiple failures — all reported
model.validate({ name: null, age: '30' })
// => {
//   status: false,
//   error: {
//     name: { status: false, error: 'Must be a string', value: null },
//     age:  { status: false, error: 'Must be a number', value: '30' }
//   },
//   data: null
// }
```

**Multi-rule per field:**

```typescript
const model = new CustomClassicModel({
  password: [
    { rule: (v: string) => v.length >= 8,     errorMsg: 'Too short' },
    { rule: (v: string) => /[A-Z]/.test(v),   errorMsg: 'Needs uppercase' },
    { rule: (v: string) => /[0-9]/.test(v),   errorMsg: 'Needs a digit' }
  ]
})
model.validate({ password: 'abc' })
// => { status: false, error: { password: { status: false, error: 'Too short', value: 'abc' } }, data: null }
```

**Partial-payload matching** — schema fields absent from data are silently ignored:

```typescript
const big = new CustomClassicModel({
  name: { rule: (v: unknown) => typeof v === 'string', errorMsg: '...' },
  age:  { rule: (v: unknown) => typeof v === 'number', errorMsg: '...' },
  role: { rule: (v: unknown) => typeof v === 'string', errorMsg: '...' }
})

// Only 'name' and 'age' present — 'role' silently skipped
big.validate({ name: 'Alice', age: 30 })
// => { status: true, error: null, data: { name: 'Alice', age: 30 } }
```

---
