## ⚡ Quick Start

```typescript
import { validateEntry, CustomClassicModel, None } from 'drea'

// Single value
validateEntry({
  entry: 'JohnDoe',
  RuleAndError: [
    { rule: (v: unknown) => typeof v === 'string', errorMsg: 'Must be a string' },
    { rule: (v: string)  => v.length >= 5,         errorMsg: 'Too short' }
  ]
})
// => { status: true, error: null }

// Schema model
const model = new CustomClassicModel({
  name: { rule: (v: unknown) => typeof v === 'string', errorMsg: 'Must be a string' },
  age:  { rule: (v: unknown) => typeof v === 'number', errorMsg: 'Must be a number' }
})

model.validate({ name: 'Alice', age: 25 })
// => { status: true, error: null, data: { name: 'Alice', age: 25 } }
```

---
