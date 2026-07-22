
## 🆚 Why drea

| | **drea** | Joi | Yup | Zod | AJV |
|---|---|---|---|---|---|
| **Rule syntax** | Plain function, `RegExp`, or `None` | Chainable DSL | Chainable DSL | Chainable DSL | JSON Schema spec |
| **TypeScript types** | ✅ Bundled in v4 | Via @types | Via @types | Built-in | Via @types |
| **Type-narrowing guards** | ✅ `asserts value is T` | ❌ | ❌ | Partial (parse-based) | ❌ |
| **Dependencies** | **Zero** | Several | Several | Zero | Several |
| **Partial-payload matching** | ✅ Automatic | Needs `.optional()` | Needs `.optional()` | Needs `.optional()` | Needs `"required"` array |
| **Runtime schema mutation** | `extend()` `remove()` `swap()` | ✗ | ✗ | ✗ | ✗ |
| **"Expected X, got Y" messages** | ✅ Every guard | ❌ | ❌ | Partial | ❌ |
| **Recursive nested schemas** | `nestvalidate()` | ✅ | ✅ | ✅ | ✅ |
| **Skip validation sentinel** | ✅ `None` | ❌ | ❌ | ❌ | ❌ |
| **File validation helper** | ✅ `__File()` | ❌ | ❌ | ❌ | ❌ |

---
