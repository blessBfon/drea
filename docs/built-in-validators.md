## 🧮 4. Built-in Validators

All built-in validators call `AssertString` first — passing a non-string throws before any rule runs.

### `isUsernameValid(entry: string)`
Letters, hyphens, spaces only — length 5-35.

```typescript
isUsernameValid('JohnDoe')  // ✅ { status: true,  error: null }
isUsernameValid('F!')        // ❌ { status: false, error: 'Username must contain only letters' }
isUsernameValid(42 as any)  // 🛡️ throws ArgumentTypeError
```

### `isEmailValid(entry: string)`
Matches `StrictEmail` pattern — format `xyz@domain.tld`.

```typescript
isEmailValid('test@example.com') // ✅ { status: true,  error: null }
isEmailValid('test@com')         // ❌ { status: false, error: 'Invalid Email address' }
```

### `isPhoneNumberValid(entry: string)`
Digits only (no `+`), length 3-12.

```typescript
isPhoneNumberValid('237653793493')  // ✅ { status: true,  error: null }
isPhoneNumberValid('+237653793493') // ❌ { status: false, error: 'Phone number must contain only digits' }
```

### `isPasswordValid(entry: string)`
Min 8 chars, uppercase, lowercase, digit, special char (`?@!#$%&*`).

```typescript
isPasswordValid('Abcdef1!')  // ✅ { status: true,  error: null }
isPasswordValid('abcdef1!')  // ❌ { status: false, error: 'Password must contain atleast an uppercase letter' }
```

### `isRequired(entry: string)`
String must be non-empty after trimming.

```typescript
isRequired('Some value') // ✅ { status: true,  error: null }
isRequired('')           // ❌ { status: false, error: 'This field is required' }
```

---
