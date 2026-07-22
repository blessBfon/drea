<div align="center" >

<img src="docs/public/img/drea-logo.png" alt="drea" width="500" height="500" />

# drea

**Lightweight composition-based validation for JavaScript & TypeScript.**

[![npm](https://img.shields.io/badge/npm-drea%404.0.0-blue)](https://www.npmjs.com/package/drea)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-included-3178C6?logo=typescript&logoColor=white)](#)
[![license](https://img.shields.io/badge/license-MIT-green)](#)

📖 **Full documentation → [full-docs](https://drea-docs.netlify.app)**

</div>

---

A validation rule is just a function that returns `true` or `false`. That is the entire API surface you need to learn. v4 ships TypeScript types in the box — no `@types/drea` needed.

## Installation

```bash
npm install drea

or

npm install drea@4.0.0
```

## Quick Start

```ts
import { validateEntry, CustomClassicModel, None } from 'drea'

// Single value
validateEntry({
  entry: 'JohnDoe',
  RuleAndError: [
    { rule: (v) => typeof v === 'string', errorMsg: 'Must be a string' },
    { rule: (v) => v.length >= 5,         errorMsg: 'Too short — min 5 chars' }
  ]
})
// => { status: true, error: null }

// Schema model
const model = new CustomClassicModel({
  name: { rule: (v) => typeof v === 'string', errorMsg: 'Name must be a string' },
  age:  { rule: (v) => v >= 18,               errorMsg: 'Must be 18 or above' }
})

model.validate({ name: 'Alice', age: 25 })
// => { status: true, error: null, data: { name: 'Alice', age: 25 } }

model.validate({ name: null, age: 15 })
// => { status: false, error: { name: {...}, age: {...} }, data: null }
```

## `None` — Skip Validation

Set `rule: None` to tell drea to skip validation for a field entirely. The entry always passes. Best practice: set `errorMsg: null` alongside it — no error is ever produced, so no message is needed.

```ts
import { validateEntry, None } from 'drea'

validateEntry({
  entry: 'anything',
  RuleAndError: [{ rule: None, errorMsg: null }]
})
// => { status: true, error: null }
```

`None` works in every drea function — `validateEntry`, `validateMany`, `CustomClassicModel.validate`, and `CustomClassicModel.nestvalidate`.

## Built-in Validators

```ts
import {
  isUsernameValid,
  isEmailValid,
  isPhoneNumberValid,
  isPasswordValid,
  isRequired
} from 'drea'

isUsernameValid('JohnDoe')        // ✅ { status: true,  error: null }
isEmailValid('bad-email')         // ❌ { status: false, error: 'Invalid Email address' }
isPhoneNumberValid('237600000')   // ✅ { status: true,  error: null }
isPasswordValid('Abc123!')        // ❌ { status: false, error: 'Password must be atleast 8 characters long' }
isRequired('')                    // ❌ { status: false, error: 'This field is required' }
```

## Nested Validation

```ts
const model = new CustomClassicModel({
  user: {
    name: { rule: (v) => v.length > 2, errorMsg: 'Name too short' },
    age:  { rule: (v) => v >= 18,      errorMsg: 'Must be 18+' }
  }
})

model.nestvalidate({ user: { name: 'Al', age: 20 } })
// => {
//   status: false,
//   error: { user: { name: { status: false, error: 'Name too short', value: 'Al' } } },
//   data: null
// }
```

## File Validation (nestvalidate)

Use `__File()` to validate a `File` object as a single value inside `nestvalidate`. Without wrapping, drea would try to recurse into the File's properties.

```ts
import { __File, CustomClassicModel } from 'drea'

const schema = {
  avatar: [
    { rule: (v) => v instanceof File || v === null,                                  errorMsg: 'Must be a file' },
    { rule: (v) => v === null || ['image/jpeg', 'image/png'].includes(v.type),       errorMsg: 'JPG or PNG only' },
    { rule: (v) => v === null || v.size <= 6 * 1024 * 1024,                         errorMsg: 'Max 6 MB' }
  ]
}

const model = new CustomClassicModel(schema)
model.nestvalidate({ avatar: __File(fileFromInput) })
```

> `validate()` does not recurse into nested objects — pass raw `File` directly, no `__File` needed.

## Error Classes

```ts
import {
  ValidationError,    // ERR_VALIDATION    — base / fallback
  NullValueError,     // ERR_NULL_VALUE    — null or undefined received
  ArgumentTypeError,  // ERR_INVALID_ARGTYPE — wrong type received
  MissingKeyError,    // ERR_MISSING_KEY   — required key absent
  UnknownKeyError,    // ERR_UNKNOWN_KEY   — unrecognised key in data
  DuplicateKeyError   // ERR_DUPLICATE_KEY — key already in schema
} from 'drea'
```

Every guard error follows the pattern:
```
"Expected <type> for '<paramName>', got <received type>"
```

## URL Validation

```ts
import { URL } from 'drea'

new URL('https://example.com').verifyPattern() // true
new URL('https://api.example.com').verifyPattern({
  allowed_protocols: ['https'],
  allowed_domains:   ['api.example.com'],
  contain_query:     false
}) // true | false
```

## Runtime Schema Mutation

```ts
model.extend({ bio: { rule: /[\S]{1,100}/, errorMsg: 'Max 100 chars' } })
model.remove('bio')
model.swap({ email: { rule: (v) => /@/.test(v), errorMsg: 'Invalid email' } })
```

---

📖 **Full API reference, sandbox, and guides → [full-docs](https://drea-docs.netlify.app)**

📋 **[Changelog](./CHANGELOG.md)**

👤 **Author:** Bless B.

📄 **License:** MIT
