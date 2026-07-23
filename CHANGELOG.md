# Changelog

All notable changes to **drea** are documented here.
Full documentation → [dreav4.dev](https://dreav4.dev) *(replace with your deployed URL)*

---
## [4.1.0] - Wrapper functions 

### 🚨 Breaking Changes
- Wrapper functions `__File()` and `__mayFile()` are not allowed to wrap the data object anymore, they should use on the schema to wrap the RuleAndError of the field whose mirror on the data object is either a file or null

## [4.0.0] – TypeScript Support, File Validation & Full Guard System

### 🚀 Highlights
- **First-class TypeScript support** shipped directly in the package — no `@types/drea` needed.
- **`__File` utility** — validate `File` objects as atomic entities inside `nestvalidate()`.
- **Full guard system** — every public function now calls a dedicated type-narrowing guard before any validation logic runs. Every guard error follows `"Expected X for 'paramName', got Y"`.
- **`None` type** — set `rule: None` to explicitly skip validation for any entry or field.

### ✨ New Features
- TypeScript types bundled with the package (`PureObject`, `SchemaRestriction`, `ModelResultObj<T>`, `DreaFileWrapper`, `RuleAndError_t`, `Err`, and more)
- Generic return types on `validate<T>` and `nestvalidate<T>` — result type is inferred from input
- `asserts value is T` return types on all guards for compile-time type narrowing
- `__File(file)` — wraps a `File` instance so `nestvalidate` treats it as a leaf, not a nested object
- `isDreaFile(v)` — internal brand check (used by `hasNest`)
- `AssertDreaFile(v, paramName?)` — guard that asserts `v instanceof File`
- `DreaFileWrapper` opaque type for TypeScript users

### 🛡️ Guard System (new in v4)
Every public surface now has a dedicated guard called as its very first action:

| Function / Method | Guard |
|---|---|
| `new URL(url)` | `AssertNonEmptyString` |
| `URL.verifyPattern(constraints?)` | `AssertOptionalPlainObject` |
| `validateEntry({entry, RuleAndError})` | `AssertRuleAndErrorArray` |
| `isUsernameValid` / `isEmailValid` / `isPhoneNumberValid` / `isPasswordValid` | `AssertString` |
| `isRequired(entry)` | `AssertStringOrNumber` |
| `validateMany(schema)` | `AssertValidateManyInput` |
| `new CustomClassicModel(schema)` | `AssertPlainObject` |
| `CustomClassicModel.validate(obj)` | `AssertPlainObject` |
| `CustomClassicModel.nestvalidate(obj)` | `AssertPlainObject` |
| `CustomClassicModel.extend(ext)` | `AssertPlainObject` |
| `CustomClassicModel.remove(key)` | `AssertNonEmptyString` |
| `CustomClassicModel.swap(restr)` | `AssertPlainObject` |
| `__File(v)` | `AssertDreaFile` |

### 🐛 Bug Fixes
- Fixed `hasNest(null)` returning `true` due to `typeof null === 'object'` — null is now correctly treated as a leaf
- Fixed `DreaFileWrapper` not being unwrapped before `validateEntry` receives it — rules now receive the real `File` instance, so `v instanceof File`, `v.type`, `v.size`, and `v.name` all work correctly
- Fixed `error.code` vs `error.error_code` property mismatch in catch-block checks

### 📦 Migration from v3 (JavaScript)
No breaking changes. Everything from v3 continues to work. TypeScript users simply gain types automatically.

### 📦 Migration for TypeScript Users
```bash
npm install drea@4
```
```ts
import { validateEntry, CustomClassicModel, None, __File } from 'drea'
// Types are included — no @types/drea needed
```

---

## [3.0.1] – Consistent Result Shape

### 🛠 Improvements
- `ClassicModel` and `CustomClassicModel` now return a consistent `{ status, data, error }` object on every call
- `status` is always `true` or `false` — never `undefined`
- `data` is the validated object on success, `null` on failure
- `error` is a per-field error map on failure, `null` on success

---

## [3.0.0] – Nested Validation, Multi-Rule Fields & None Type

### 🚨 Breaking Changes
- `between` in `URL.verifyPattern()` now treats a single-element array as **maximum** (was minimum)
- Fixed a bug that prevented using only one constraint in `verifyPattern()`
- `null` entries are now accepted by `validateEntry()`
- `status` is always a boolean — never `undefined`

### ✨ New Features
- **`RuleAndError[]`** — one field can now have multiple `{rule, errorMsg}` pairs. Validation stops at the first failure, giving you ordered, granular error messages
- **`None` type** — set `rule: None` to skip validation for any field entirely. Best practice: set `errorMsg: null` alongside it
- **`nestvalidate()`** — recursively validates deeply nested plain objects. The error tree mirrors your data's shape exactly — a failure at `data.company.address.zip` appears at `result.error.company.address.zip`

### 🛠 Improvements
- More predictable validation flow
- Cleaner error semantics
- Improved documentation and examples

---

## [2.0.0] – Structured Error Objects & URL Validator

### 🚨 Breaking Changes
- Structured error objects introduced with `error_code` / `error_description`
- Unknown schema keys now throw `UnknownKeyError` (code: `ERR_UNKNOWN_KEY`)
- Strict type enforcement on all constraint arguments
- `null` and `undefined` values explicitly rejected where not allowed

### ✨ New Features
- Custom error classes: `ArgumentTypeError`, `UnknownKeyError`, `NullValueError`, `DuplicateKeyError`, `MissingKeyError`, `ValidationError`
- Schema-driven constraint validation
- **`URL` class** — lightweight structural URL/URI pattern validator with opt-in constraint rules (`allowed_protocols`, `allowed_domains`, `allowed_ports`, `contain_query`, `contain_fragment`, `contain_path`, `between`)
- Clearer, developer-friendly error messages

### 🛠 Improvements
- Predictable validation flow
- Clean error semantics
- Full documentation and examples

### ⚠️ Migration Notes
- Update error handling to read `error.code` (populated from `error_code`)
- Ensure constraint objects only contain supported keys
