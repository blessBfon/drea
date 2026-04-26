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
- Builtin URL class a pattern validation utility focusing on structural correctness and rule-based filtering, making it useful for eliminating malformed and suspicious URLs early in your validation pipeline.

### 🛠 Improvements
- More predictable validation flow
- Cleaner error semantics
- Improved documentation and examples

### ⚠️ Migration Notes
- Update error handling logic to read `error.code`
- Ensure constraint objects only contain supported keys

## [3.0.0] – Major Validation Engine Upgrade

### 🚨 Breaking Changes
- The `between` property of the verfiyPattern method of URL class will now take if array is just one
value as maximum instead of minimum.
- Fix a bug caused by URL class which prevented the user from using atmost one constraint.
- Drea can accept null entries
- No more undefined status when invalid entries are found when validating data aginst a schema
status will either true if data is valid or false (with the appropriate field/value causing the 
error)

### ✨ New Features
- Introduced RuleAndError array which will be used to embed one or more rule and errorMsg objects,
    Now we can build a schema model where an entry can have multiple constraints ([{rule1,errorMsg1},{rule2,errorMsg2},{rule3,errorMsg3}...]) 
- Nested validation in the CCL where even nested objects can be validated
- `None` type introduced. Use this to skip validation.

### 🛠 Improvements
- More predictable validation flow
- Cleaner error semantics
- Improved documentation and examples
