## 🧮 7. `CustomClassicModel`

Define your own schema and validate any plain-object data against it.

```typescript
import { CustomClassicModel } from 'drea'
```

Each schema entry is either a `{rule, errorMsg}` object or an array for multi-rule fields.

```typescript
// ✅ Valid constructor
const model = new CustomClassicModel({
  name: { rule: (v: unknown) => typeof v === 'string', errorMsg: 'Must be a string' },
  age:  { rule: (v: unknown) => typeof v === 'number', errorMsg: 'Must be a number' }
})

// 🛡️ Array passed as schema — throws immediately
new CustomClassicModel([{ name: {} }] as any)
// throws ArgumentTypeError: "Expected plain object for 'schema_restr_model', got array"
```

---
