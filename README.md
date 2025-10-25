
**📘 Lex Validation** is a lightweight and flexible JavaScript validation library designed to simplify data validation using rules, schemas, and models.  
It allows you to validate single entries, multiple entries, and even create reusable validation models with customizable rules.

---

## ✨ Features

- ✅ Validate a single field with a function or regular expression rule  
- ✅ Validate multiple entries at once  
- ✅ Define schema-based validation using ClassicModel or CustomClassicModel  
- ✅ Built-in validators for username, email, phone number, password, and required fields  
- ✅ Automatically return clear error messages  
- ✅ Works in browsers and Node.js  
- ✅ Beginner-friendly syntax  

---

## 🧩 Installation / Import

```js
import {
  normalizer,
  validateMany,
  validateEntry,
  ClassicModel,
  CustomClassicModel,
  isUsernameValid,
  isEmailValid,
  isPhoneNumberValid,
  isPasswordValid,
  isRequired
} from "./Lex.js";
```

---

## 🧠 1. Basic Validation with `validateEntry()`

The `validateEntry()` function checks a single value (`entry`) against one or more rules.  
Each rule can be a function that returns a boolean or a regular expression.

### ✅ Example 1 — Passing a Function Rule

```js
const username = "Fon Bless";

console.log(validateEntry({
  entry: username,
  RuleAndError: [
    {
      rule: (v) => typeof v === "string",
      errorMsg: "Must be a string"
    }
  ]
}));
```

**Expected Output**

```js
{ status: true, error: null }
```

### 💥 Example (Failure Case)

```js
console.log(validateEntry({
  entry: 3434,
  RuleAndError: [
    {
      rule: (v) => typeof v === "string",
      errorMsg: "must contain only letters"
    }
  ]
}));
```

**Output**

```js
{ status: false, error: "must contain only letters" }
```

---

## 🧮 2. Validating Multiple Fields with `validateMany()`

`validateMany()` runs validation on multiple entries at once.  
Each entry has its own `RuleAndError` array, similar to `validateEntry()`.

### ✅ Example — Mixed Field Validation

```js
const username2 = "Fonbless"; // too short
const email = "blessfonmtoh@gmail.com";

console.log(validateMany([
  {
    entry: username2,
    RuleAndError: [
      { rule: (v) => typeof v === "string", errorMsg: "must contain only letters" },
      { rule: /.{5,}/, errorMsg: "Username Too small" },
      { rule: /.{5,35}/, errorMsg: "Username Too long" }
    ]
  },
  {
    entry: email,
    RuleAndError: [
      { rule: /^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, errorMsg: "Invalid Email. Email must be of form xyz@domain.tld" }
    ]
  }
]));
```

**Successful Result Example**

```js
{ status: true, error: null }
```

**Failure Example**  
If email was `"blessfonmtohgmail.com"` (missing `@`):

```js
{ status: false, error: "Invalid Email. Email must be of form xyz@domain.tld" }
```

---

## 🧮 3. Built-in Validators

Lex Validation comes with pre-defined validators for common fields:

```js
isUsernameValid("JohnDoe");  // { status: true, error: null }
isUsernameValid("JD");       // { status: false, error: "Username is too small" }

isEmailValid("test@example.com"); // { status: true, error: null }
isEmailValid("test.com");         // { status: false, error: "Invalid Email address" }

isPhoneNumberValid("123456");     // { status: true, error: null }
isPhoneNumberValid("12ab");       // { status: false, error: "Phone number must contain only digits" }

isPasswordValid("Abc123$%");      // { status: true, error: null }
isPasswordValid("abc");           // { status: false, error: "Password must be at least 8 characters long" }

isRequired("");                   // { status: false, error: "This field is required" }
isRequired("Filled");             // { status: true, error: null }
```

---

## 🧮 4. Schema-Based Validation with `ClassicModel`

`ClassicModel` is perfect for fixed, predefined field structures like a user registration form.

```js
const cl = new ClassicModel({
  email: "blessfonmtohgmail.com",   // invalid email
  password: "bless01gG$",
  username: "Fon bless",
  PhoneNumber: "+237865373165"
});

console.log(cl.validate());
```

**Expected Output (Failure)**

```js
{
  email: {
    status: false,
    error: "Invalid Email address",
    value: "blessfonmtohgmail.com"
  }
}
```

**Successful Validation Example**

```js
const cl2 = new ClassicModel({
  email: "blessfonmtoh@gmail.com",
  password: "bless01gG$",
  username: "Fon bless",
  PhoneNumber: "+237865373165"
});

console.log(cl2.validate());
```

```js
{
  status: true,
  error: null,
  data: {
    email: "blessfonmtoh@gmail.com",
    password: "bless01gG$",
    username: "Fon bless",
    PhoneNumber: "+237865373165"
  }
}
```

---

## 🧮 5. Custom Schema Validation with `CustomClassicModel`

`CustomClassicModel` lets you define your own schema and rules dynamically.  

```js
const schema_restr_model = {
  name: { rule: (v) => typeof v === "string", errorMsg: "name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "must be an integer" },
  description: { rule: (v) => v.length <= 10, errorMsg: "description cannot exceed 10 characters" }
};

const ccl = new CustomClassicModel(schema_restr_model);

const data = {
  name: null,  // ❌ invalid
  age: "20",   // ❌ invalid
  description: "Testing to see if this custom made class works" // ❌ too long
};

console.log(ccl.validate(data));
```

**Failure Output**

```js
{
  name: { status: false, error: "name must be a string", value: null },
  age: { status: false, error: "must be an integer", value: "20" },
  description: { status: false, error: "description cannot exceed 10 characters", value: "Testing to see if this custom made class works" }
}
```

**Success Example**

```js
const validData = { name: "Bless", age: 20, description: "Good test" };
console.log(ccl.validate(validData));
```

```js
{
  status: true,
  error: null,
  data: { name: "Bless", age: 20, description: "Good test" }
}
```

---

## 🧬 6. Normalization (Optional Utility)

```js
normalizer.trim("  John  ");     // "John"
normalizer.lowercase("HELLO");   // "hello"
normalizer.uppercase("hey");     // "HEY"
normalizer.removeSpaces("a b c"); // "abc"
```

---

## 💡 Best Practices

- Always provide a clear `errorMsg` with every rule  
- Prefer function rules for complex validations  
- Chain multiple rules inside one `RuleAndError` array  
- Use `CustomClassicModel` for dynamic validation systems  
- Always trim and normalize data before validation  

---

## 🧭 Quick Reference

| Function | Purpose |
|----------|---------|
| `validateEntry()` | Validate one field |
| `validateMany()`  | Validate multiple fields at once |
| `ClassicModel`    | Predefined model validator |
| `CustomClassicModel` | Schema-based dynamic validator |
| `normalizer`      | Utility for string cleanup |
| `isUsernameValid()` | Built-in username validation |
| `isEmailValid()` | Built-in email validation |
| `isPhoneNumberValid()` | Built-in phone number validation |
| `isPasswordValid()` | Built-in password validation |
| `isRequired()` | Built-in required field validation |

---

## 🏁 Final Notes

Lex Validation is built for clarity and flexibility.  
Whether you’re validating a single form
