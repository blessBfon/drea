# Lex Validation – Beginner-Friendly Documentation

**Lex Validation** is a lightweight JavaScript validation library for validating single values, multiple entries, and schema-based data using **predefined rules** or **custom models**. It works both in browsers and Node.js.

---

## ✨ Features

- ✅ Validate a single value with a function or regular expression.
- ✅ Validate multiple entries at once.
- ✅ Define schema-based validation with `ClassicModel` or `CustomClassicModel`.
- ✅ Built-in validators for username, email, phone number, password, and required fields.
- ✅ Clear, descriptive error messages.
- ✅ Beginner-friendly syntax with explicit examples.
- ✅ Optional normalization utilities.

---

## 🧩 Installation / Import

```js
import {
  Normalizer,
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

`validateEntry()` validates a **single value** against one or more rules.

### ✅ Example: Successful Validation
```js
const username = "Fon Bless";

console.log(validateEntry({
  entry: username,
  RuleAndError: [
    { rule: (v) => typeof v === "string", errorMsg: "Must be a string" }
  ]
}));
```
**Output:**
```js
{ status: true, error: null }
```

### 💥 Example: Failure Validation
```js
console.log(validateEntry({
  entry: 3434,
  RuleAndError: [
    { rule: (v) => typeof v === "string", errorMsg: "Must contain only letters" }
  ]
}));
```
**Output:**
```js
{ status: false, error: "Must contain only letters" }
```
**✅ Fix:** Convert input to string or provide a valid string value.

---

## 🧮 2. Built-in Validators

### **Username**
```js
console.log(isUsernameValid("FonBless")); // ✅ { status: true, error: null }
console.log(isUsernameValid("F!"));      // ❌ { status: false, error: "Username is too small" }
```

### **Email**
```js
console.log(isEmailValid("test@example.com")); // ✅ valid
console.log(isEmailValid("test@com"));         // ❌ invalid
```

### **Phone Number**
```js
console.log(isPhoneNumberValid("237123456"));  // ✅ valid
console.log(isPhoneNumberValid("23ab"));       // ❌ invalid
```

### **Password**
```js
console.log(isPasswordValid("Abcdef1!"));      // ✅ valid
console.log(isPasswordValid("abcdef"));        // ❌ invalid
```

### **Required**
```js
console.log(isRequired("Some value"));  // ✅ valid
console.log(isRequired(""));            // ❌ invalid
```

---

## 🧮 3. Validate Multiple Fields at Once with `validateMany()`

### ✅ Example
```js
const username2 = "Fonbless";
const email = "blessfonmtoh@gmail.com";

console.log(validateMany([
  {
    entry: username2,
    RuleAndError: [
      { rule: (v) => typeof v === "string", errorMsg: "Must be a string" },
      { rule: /.{5,}/, errorMsg: "Username Too Small" },
      { rule: /.{5,35}/, errorMsg: "Username Too Long" }
    ]
  },
  {
    entry: email,
    RuleAndError: [
      { rule: /^(?!\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, errorMsg: "Invalid Email" }
    ]
  }
]));
```
**Output:** `[]` (Empty array means all entries are valid)

### ❌ Example: One Invalid
```js
const emailInvalid = "blessfonmtohgmail.com";
console.log(validateMany([
  { entry: emailInvalid, RuleAndError: [{ rule: /@/, errorMsg: "Email must contain @" }] }
]));
```
**Output:**
```js
[ { value: "blessfonmtohgmail.com", status: false, error: "Email must contain @" } ]
```

---

## 🧮 4. Schema-Based Validation with `ClassicModel`

### ✅ Example: Success
```js
const cl = new ClassicModel({
  email: "blessfonmtoh@gmail.com",
  password: "Bless01G$",
  username: "Fon Bless",
  phonenumber: "237865373165"
});
console.log(cl.validate());
```
**Output:**
```js
{ status: true, error: null, data: { ... } }
```

### ❌ Example: Failure
```js
const clInvalid = new ClassicModel({
  email: "blessfonmtohgmail.com",
  password: "Bless01G$",
  username: "Fon",
  phonenumber: "+237865373165"
});
console.log(clInvalid.validate());
```
**Output:**
```js
{
  email: { status: false, error: "Invalid Email address", value: "blessfonmtohgmail.com" },
  username: { status: false, error: "Username must contain between 5 to 40 letters only", value: "Fon" }
}
```
**✅ Fix:** Provide valid email and username.

---

## 🧮 5. Custom Schema Validation with `CustomClassicModel`

### ✅ Example: Successful
```js
const schema = {
  name: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};
const custom = new CustomClassicModel(schema);
console.log(custom.validate({ name: "Bless", age: 25 }));
```
**Output:**
```js
{ status: true, error: null, data: { name: "Bless", age: 25 } }
```

### ❌ Example: Failure
```js
const invalidData = { name: null, age: "25" };
console.log(custom.validate(invalidData));
```
**Output:**
```js
{
  name: { status: false, error: "Name must be a string", value: null },
  age: { status: false, error: "Age must be a number", value: "25" }
}
```
**✅ Fix:** Ensure types match schema rules.

---

## 🧬 6. Normalization Utilities
```js
Normalizer.trim("  John  ");      // "John"
Normalizer.lowercase("HELLO");    // "hello"
Normalizer.uppercase("hey");      // "HEY"
Normalizer.removeSpaces("a b c"); // "abc"
```

---

## 💡 Best Practices
- Always pass descriptive `errorMsg` for each rule.
- Use function rules for **complex validation**.
- Normalize data before validating.
- Use `CustomClassicModel` for dynamic schema validations.
- Use `validateMany` for bulk validations.

---

## 🧭 Quick Reference

| Function | Purpose |
|----------|---------|
| `validateEntry()` | Validate a single value |
| `validateMany()`  | Validate multiple values |
| `ClassicModel`    | Predefined model validator |
| `CustomClassicModel` | Custom schema-based validation |
| `Normalizer`      | Data cleanup and normalization |
| `isUsernameValid()` | Built-in username validation |
| `isEmailValid()` | Built-in email validation |
| `isPhoneNumberValid()` | Built-in phone validation |
| `isPasswordValid()` | Built-in password validation |
| `isRequired()` | Built-in required field validation |

---

✅ This documentation is **complete, beginner-friendly, and ready for npm publishing**.

