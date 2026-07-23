
### 📁 `__File` — File Validation in `nestvalidate()`

> **Applies to `nestvalidate()` only.** `validate()` does not recurse into nested objects — pass a raw `File` directly with no wrapper needed.

`File` objects are JavaScript objects. Without a wrapper, `nestvalidate` would detect a `File` as a nested structure and try to recurse into its DOM properties. `__File()` wraps the file schema or RuleAndError[] and tells drea: **treat this as a single value, not a nested object**.

```typescript
import { __File, CustomClassicModel } from 'drea'

const schema = {
  avatar: __File([
    {
      rule: (v: File | null) => v instanceof File || v === null,
      errorMsg: 'Please select an image'
    },
    {
      rule: (v: File | null) => v === null || ['image/jpeg','image/png','image/webp'].includes(v.type),
      errorMsg: 'Only JPG, PNG, or WebP accepted'
    },
    {
      rule: (v: File | null) => v === null || v.size <= 6 * 1024 * 1024,
      errorMsg: 'Max file size is 6 MB'
    }
  ])
}

const model = new CustomClassicModel(schema)

// ✅ Wrap with __File around the field's value in the schema before passing to nestvalidate
model.nestvalidate({ avatar: fileFromInput })

// ✅ null (no file selected) — pass directly, when using __mayFile() instead of __File() as it allows the possibillity of passing a null value
model.nestvalidate({ avatar: null })
```

---
