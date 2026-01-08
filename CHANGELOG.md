## [2.0.0] – Major Validation Engine Upgrade

### 🚨 Breaking Changes
- Introduced structured validation error objects with error codes
- Unknown restriction keys now throw `ERR_UNKNOWN_KEY`
- Strict argument type enforcement for all constraints
- Null and empty values are explicitly rejected where not allowed

### ✨ New Features
- Custom error classes (`ArgumentTypeError`, `UnknownKeyError`, `NullValueError`, etc.)
- Schema-driven constraint validation
- Improved developer experience with clearer error messages

### 🛠 Improvements
- More predictable validation flow
- Cleaner error semantics
- Improved documentation and examples

### ⚠️ Migration Notes
- Update error handling logic to read `error.code`
- Ensure constraint objects only contain supported keys