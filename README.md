# lex-validation[Uploading lex_validation_docs.md…]()# 📘 Lex Validation – Beginner-Friendly Documentation

Lex Validation is a lightweight and flexible JavaScript validation library designed to simplify data validation using **rules, schemas, and models**.  
It allows you to validate single entries, multiple entries, and even create reusable validation models with customizable rules.

---

## ✨ Features

✅ Validate a single field with a **function** or **regular expression** rule  
✅ Validate multiple entries at once  
✅ Define **schema-based validation** using `ClassicModel` or `CustomClassicModel`  
✅ Automatically return clear error messages  
✅ Works in browsers and Node.js  
✅ Beginner-friendly syntax

---

## 🧩 Installation / Import

```js
import {
  normalizer,
  validateMany,
  validateEntry,
  ClassicModel,
  CustomClassicModel
} from "./Lex.js";
```

---

## 🧠 1. Basic Validation with `validateEntry()`

The `validateEntry()` function checks a single value (entry) against one or more rules.  
Each rule can be a **function** that returns a boolean or a **regular expression**.

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

**✅ Expected Output**
```js
{ status: true, error: null }
```

**💥 Example (Failure Case)**

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

**❌ Output**
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
      {
        rule: (v) => typeof v === "string",
        errorMsg: "must contain only letters"
      },
      {
        rule: /.{5,}/,
        errorMsg: "Username Too small"
      },
      {
        rule: /.{5,35}/,
        errorMsg: "Username Too long"
      }
    ]
  },
  {
    entry: email,
    RuleAndError: [
      {
        rule: /^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        errorMsg: "Invalid Email. Email must be of form xyz@domain.tld"
      }
    ]
  }
]));
```

**✅ Successful Result Example**
```js
{ status: true, error: null }
```

**❌ Example When One Fails**
If `email` was `"blessfonmtohgmail.com"` (missing `@`):
```js
{ status: false, error: "Invalid Email. Email must be of form xyz@domain.tld" }
```

---

## 🭱 3. Schema-Based Validation with `ClassicModel`

`ClassicModel` is perfect for fixed, predefined field structures like a user registration form.

### Example

```js
const cl = new ClassicModel({
  email: "blessfonmtohgmail.com",   // invalid email
  password: "bless01gG$",
  username: "Fon bless",
  PhoneNumber: "+237865373165"
});

console.log(cl.validate());
```

**❌ Expected Output**
```js
{
  status: false,
  error: {
    email: "Invalid email format"
  }
}
```

If the data was valid:
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

## 🧮 4. Custom Schema Validation with `CustomClassicModel`

`CustomClassicModel` lets you define your **own schema and rules** dynamically.  
This is great for projects where validation logic varies by context.

### Example

```js
const schema_restr_model = {
  name: {
    rule: (v) => typeof v === "string",
    errorMsg: "name must be a string"
  },
  age: {
    rule: (v) => typeof v === "number",
    errorMsg: "must be an integer"
  },
  description: {
    rule: (v) => v.length <= 10,
    errorMsg: "description cannot exceed 10 characters"
  }
};

const ccl = new CustomClassicModel(schema_restr_model);

const data = {
  name: null,  // ❌ invalid
  age: "20",   // ❌ invalid
  description: "Testing to see if this custom made class works" // ❌ too long
};

console.log(ccl.validate(data));
```

**❌ Output**
```js
{
  status: false,
  error: {
    name: "name must be a string",
    age: "must be an integer",
    description: "description cannot exceed 10 characters"
  }
}
```

**✅ When Corrected**
```js
const validData = {
  name: "Bless",
  age: 20,
  description: "Good test"
};

console.log(ccl.validate(validData));
```

**✅ Output**
```js
{
  status: true,
  error: null,
  data: {
    name: "Bless",
    age: 20,
    description: "Good test"
  }
}
```

---

## 🧬 5. Normalization (Optional Utility)

You can use the `normalizer` utilities (if imported) to clean data before validation:

```js
normalizer.trim("  John  ");     // "John"
normalizer.lowercase("HELLO");   // "hello"
normalizer.uppercase("hey");     // "HEY"
normalizer.removeSpaces("a b c"); // "abc"
```

---

## 🗾 Example Full Output Summary

| Validation | Input | Output |
|-------------|--------|---------|
| `validateEntry` (success) | `"Fon Bless"` | `{ status:true, error:null }` |
| `validateEntry` (fail) | `3434` | `{ status:false, error:"must contain only letters" }` |
| `validateMany` (fail) | `"blessfonmtohgmail.com"` | `{ status:false, error:"Invalid Email..." }` |
| `ClassicModel` (fail) | invalid email | `{ status:false, error:{email:"Invalid email format"} }` |
| `CustomClassicModel` (success) | valid data | `{ status:true, error:null, data:{...} }` |

---

## 💡 Best Practices

- Always pass a clear `errorMsg` with every rule.
- Prefer function rules for complex validation (e.g., age range, custom logic).
- Chain multiple rules inside one `RuleAndError` array.
- Use `CustomClassicModel` for dynamic validation systems.
- Always trim and normalize data before validation for consistency.

---

## 🧭 Quick Reference

| Function | Purpose |
|-----------|----------|
| `validateEntry()` | Validate one field |
| `validateMany()` | Validate multiple fields at once |
| `ClassicModel` | Predefined model validator |
| `CustomClassicModel` | Schema-based dynamic validator |
| `normalizer` | Utility for string cleanup |

---

## 🏁 Final Notes

Lex Validation is built for **clarity and flexibility**.  
Whether you’re validating a single form field or building an entire schema validator, this library gives you the control and structure to do it cleanly.



A schema-based and functional validation library for JavaScript.
