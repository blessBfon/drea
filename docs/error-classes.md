
## 🚨 Error Classes

```typescript
import {
  ValidationError,   // ERR_VALIDATION     — base / fallback error
  NullValueError,    // ERR_NULL_VALUE      — null or undefined received
  ArgumentTypeError, // ERR_INVALID_ARGTYPE — wrong type received
  MissingKeyError,   // ERR_MISSING_KEY     — required key absent
  UnknownKeyError,   // ERR_UNKNOWN_KEY     — unrecognised key in data
  DuplicateKeyError  // ERR_DUPLICATE_KEY   — key already exists in schema
} from 'drea'
```

```typescript
try {
  model.validate(null as any)
} catch (err) {
  if (err instanceof NullValueError) {
    console.log(err.code)    // 'ERR_NULL_VALUE'
    console.log(err.message) // "Expected plain object for 'obj', got null or undefined"
    console.log(err.name)    // 'NullValueError'
  }
}
```

> **Note:** error instances carry `.code` (not `.error_code`). The constructor argument has `error_code` but the class sets `this.code = err.error_code`.

---
