## 🛡️ Guard System

Every public function and method calls a dedicated type guard **before** its logic runs. Every guard error follows the pattern:

```
"Expected <type> for '<paramName>', got <received type>"
```

| Public surface | Guard called |
|---|---|
| `new URL(url)` | `AssertNonEmptyString(url, 'url')` |
| `URL.verifyPattern(constraints?)` | `AssertOptionalPlainObject(extra_constraints, 'extra_constraints')` |
| `validateEntry({entry, RuleAndError})` | `AssertRuleAndErrorArray(RuleAndError)` |
| `isUsernameValid(entry)` | `AssertString(entry, 'username')` |
| `isEmailValid(entry)` | `AssertString(entry, 'email')` |
| `isPhoneNumberValid(entry)` | `AssertString(entry, 'phonenumber')` |
| `isPasswordValid(entry)` | `AssertString(entry, 'password')` |
| `isRequired(entry)` | `AssertString(entry, 'isRequired entry')` |
| `validateMany(schema)` | `AssertValidateManyInput(schema)` |
| `Normalizer.URL(url, protocol?)` | `AssertNonEmptyString(url, 'url')` |
| `new CustomClassicModel(schema)` | `AssertPlainObject(schema_restr_model, 'schema_restr_model')` |
| `CustomClassicModel.validate(obj)` | `AssertPlainObject(obj, 'obj')` |
| `CustomClassicModel.nestvalidate(obj)` | `AssertPlainObject(obj, 'obj')` |
| `CustomClassicModel.extend(ext)` | `AssertPlainObject(ext_restr, 'ext_restr')` |
| `CustomClassicModel.remove(key)` | `AssertNonEmptyString(Key, 'Key')` |
| `CustomClassicModel.swap(restr)` | `AssertPlainObject(new_restr, 'new_restr')` |
| `__File(v)` | `AssertDreaFile(v, 'v')` |

### Type narrowing (TypeScript)

Guards use `asserts value is T` — the compiler narrows the type after a successful guard call:

```typescript
function process(value: unknown) {
  AssertString(value, 'value')
  value.toLowerCase() // ✅ TypeScript knows: value is string
}
```

---
