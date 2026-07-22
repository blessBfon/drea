
### 📁 `__File` — File Validation in `nestvalidate()`

> **Applies to `nestvalidate()` only.** `validate()` does not recurse into nested objects — pass a raw `File` directly with no wrapper needed.

`File` objects are JavaScript objects. Without a wrapper, `nestvalidate` would detect a `File` as a nested structure and try to recurse into its DOM properties. `__File()` wraps the file and tells drea: **treat this as a single value, not a nested object**.

```typescript
import { __File, CustomClassicModel } from 'drea'

const schema = {
  avatar: [
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
  ]
}

const model = new CustomClassicModel(schema)

// ✅ Wrap with __File before passing to nestvalidate
model.nestvalidate({ avatar: __File(fileFromInput) })

// ✅ null (no file selected) — pass directly, no __File needed
model.nestvalidate({ avatar: null })
```

**File constructor reminder:**

```typescript
// new File(fileBits, fileName, options?)
const file = new File([new ArrayBuffer(2 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' })
```

**Guard:** `AssertDreaFile(v, 'v')` runs inside `__File` — rejects anything that is not a `File` instance.

```typescript
__File('path/to/file.jpg' as any)
// throws ArgumentTypeError: "Expected File instance for 'v', got string"
```

---
