# Documentation
# drea

**drea** is a lightweight composition-based JavaScript validation library for for **forging reusable validation rules**  or **building flexible validation models**. It works both in browsers and Node.js.

---

## ✨ Features

- ✅ Validate a single value with a function or regular expression.
- ✅ Validate multiple entries at once.
- ✅ Build schema-based validation models with `ClassicModel` or `CustomClassicModel`.
- ✅ Forge and reuse validation rules
- ✅ Lightweight and dependency-free
- ✅ Built-in validators for username, email, phone number, password, and required fields.
- ✅ URL validation.
- ✅ Sanitization of input.(as from `v3`)
- ✅ None type 
- ✅ Structured validation error objects introduced.
- ✅ Beginner-friendly syntax with explicit examples.
- ✅ Optional normalization utilities.


---


## 🧩 Installation

Install the latest version:

```bash
npm install drea
```

Or install a specific version:

```bash
npm install drea@3.0.0
```

---

---

## 🧠 Basic Validation with `validateEntry()`

`validateEntry()` validates a **single value** against one or more rules.

### 🔹 Parameters

- **entry**  
  The value to validate.  
  Can be a `string`, `number`, `array`, `object`, or a function returning any of these.

- **RuleAndError**  
  An array of rule objects:

```js
{
  rule: Function | RegExp | None,
  errorMsg: any
}
```

- `rule`: Validation logic (function, RegExp, or `None`[if rule is None then no-validation will be done on tha field])
- `errorMsg`: Returned when validation fails

---

## ✅ Example: Successful Validation

```js
import { validateEntry } from 'drea'

const username = "John Doe";

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

**Output:**
```js
{ status: true, error: null }
```

---

## ❌ Example: Failed Validation

```js
console.log(validateEntry({
  entry: 3434,
  RuleAndError: [
    {
      rule: (v) => typeof v === "string",
      errorMsg: "Must contain only letters"
    }
  ]
}));
```

**Output:**
```js
{ status: false, error: "Must contain only letters" }
```

---

## ⚠️ Notes

- If validation fails, `errorMsg` is returned as `error`
- `errorMsg` can be any type: `string`, `number`, `object`, `array`, or `null`
- To fix validation errors:
  - Ensure the input matches the expected type or format
  - Or adjust the validation rule

---

## 🛠️ Quick Fix Examples

Convert input to string:

```js
String(value)
```

Validate a number instead:

```js
rule: (v) => typeof v === "number"
```

### ✅ Example: Validating with more than one  rule
we can validate an entry with more than one rule

```js
const age = 20;//suppose age entered is 20

console.log(validateEntry({
  entry: age,
  RuleAndError: [
    { 
        rule:(v)=> typeof v === 'number',
        //if type of age is not a number errorMsg is returned as error 
        errorMsg: "age must be a number"},
    {
        rule:(v)=> v > 0,
        //if user enters a negative number errorMsg is returned as error
        errorMsg:"age cannot be negative"
    },
    {
        rule:(v)=> v >= 18, 
        //if user is not 18 and above errorMsg is returned as error
        errorMsg:"you must be above 18 years old"
    },
    {
        rule:(v)=> v < 120,
        //if user is enters anything above 120 errorMsg is retruned as error
        errorMsg:"you must be below 120 years old"
    }
  ]
}));
```
**Output:**
```js
//rule 1 passed ✅ as age is  number
//rule 2 passed ✅ as age is greater than zero
//rule 3 passed ✅ as age is above 18
//rule 4 passed ✅ as age is below 120 
{ status: true, error: null }
```


### ✅ Example: Validating with more than one  rule
we can validate an entry with more than one rule

```js
const age = 20;//suppose age entered is 20

console.log(validateEntry({
  entry: age,
  RuleAndError: [
    { 
        rule:(v)=> typeof v === 'number',
        //if type of age is not a number errorMsg is returned as error 
        errorMsg: "age must be a number"},
    {
        rule:(v)=> v > 0,
        //if user enters a negative number errorMsg is returned as error
        errorMsg:"age cannot be negative"
    },
    {
        rule:(v)=> v >= 18, 
        //if user is not 18 and above errorMsg is returned as error
        errorMsg:"you must be above 18 years old"
    },
    {
        rule:(v)=> v < 120,
        //if user is enters anything above 120 errorMsg is retruned as error
        errorMsg:"you must be below 120 years old"
    }
  ]
}));
```
**Output:**
```js
//rule 1 passed ✅ as age is  number
//rule 2 passed ✅ as age is greater than zero
//rule 3 passed ✅ as age is above 18
//rule 4 passed ✅ as age is below 120 
{ status: true, error: null }
```

Suppose age is now 17 but its below 18 

Let's see when age is a string instead
### 💥 Example: Validating with more than one rule
```js
const age = 17;

console.log(validateEntry({
  entry: age,
  RuleAndError: [
    { 
        rule:(v)=> typeof v === 'number',
        //if type of age is not a number errorMsg is returned as error 
        errorMsg: "age must be a number"},
    {
        rule:(v)=> v > 0,
        //if user enters a negative number errorMsg is returned as error
        errorMsg:"age cannot be negative"
    },
    {
        rule:(v)=> v >= 18, 
        //if user is not 18 and above errorMsg is returned as error
        errorMsg:"you must be above 18 years old"
    },
    {
        rule:(v)=> v < 120,
        //if user is enters anything above 120 errorMsg is retruned as error
        errorMsg:"you must be below 120 years old"
    }
  ]
}));
```

**Output:**
```js
//rule 1 passed  ✅ as age is a number
//rule 2 passed  ✅ as age is greater than zero
//rule 3 failed  ❌ as age is not 18 and above
//rule 4 ignored ➖ not tested
{ status: false, error: 'you must be above 18 years old' }
```

when entry is an array 
### 💥 Example: Validating the array with more than one rule
```js
import { validateEntry} from 'drea'

let colors = [null,'orange','pink',2]//this array contais a null element, string elements and a number
//length is 4

console.log(validateEntry({
        entry:colors,
        RuleAndError:[
        {
            rule:(v)=>!v.includes(null),
            errorMsg:"Colors array cannot contain a null element"
        },
        {
          rule:(v)=>v.everyItems((i)=>typeof i ==='string'),
          errorMsg:"Colors array must contain strings only"
        },
        {
          rule:(v)=>v.length===5,
          errorMsg:"5 Colors are needed"
        }]
        }))
``` 


**Output:**
```js
//rule 1 fails ❌ as array colors contains a null element, Other rules below it are ignored
{ status: false, error: 'Colors array cannot contain a null element' }
FIX
//if the null element is removed and replaced with the string 'yellow'

//rule 2 fails❌ as not all the elements in colors  are of type string, Other rules below it are ignored
{ status: false, error: 'Colors array must contain strings only' }
FIX
//if the number is removed and replaced with string 'black'

//rule 3 fails❌ as the length of the array colors is 4 not 5
{ status: false, error: '5 Colors are needed' }
//if another color is added 'green'

//we try runing that 
{ status:true, error:null }
```

### ✅ Example: Validating the array with more than one rule
```js

import { validateEntry} from 'drea'

let colors = ['yellow','orange','pink','black','green']

console.log(validateEntry({
        entry:colors,
        RuleAndError:[
        {
            rule:(v)=>!v.includes(null),
            errorMsg:"Colors array cannot contain a null element"
        },
        {
          rule:(v)=>v.every((i)=>typeof i ==='string'),
          errorMsg:"Colors array must contain strings only"
        },
        {
          rule:(v)=>v.length===5,
          errorMsg:"5 Colors are required"
        }]
        }))
``` 
**Output:**
```js
//All rule are passed
{ status:true, error:null }
```

```js
💠 _With this we can create an intelligent validation system that is rigid and also guide the user towards providing the right input._
```
---

## 🧮 2. Built-in Validators

*drea also provide some builtin validators suitable for quick use all which are built ontop of `validateEntry()`.*

⚠ Please know what they test before you use them

### **Username**
🔍 Checks if the entry  
* is a string containing only letters (even spaces are not considered).
* length is between 5 and 35.

```js
import {isUsernameValid} from 'drea'

console.log(isUsernameValid("JohnDoe")); // ✅ { status: true, error: null }
console.log(isUsernameValid("F!"));      // ❌ { status: false, error: 'Username must contain only letters' }
console.log(isUsernameValid("F h"));     // ❌ { status: false, error: 'Username must contain only letters' }
console.log(isUsernameValid("dan"));     // ❌ { status: false, error: 'Username is too small ' }
```

`future versions will improve the username builtin validator`.

---

### **Email**
🔍 Checks if the entry  
* matches the designed regex  


drea now uses a new function to specifically test for email addresses called `StrictEmail()`

```js
import { isEmailValid } from 'drea'

console.log(isEmailValid("test@example.com")); // ✅ { status: true, error: null }
console.log(isEmailValid("test@com"));         // ❌ { status: false, error: 'invalid email address' }
```

`future versions will improve the email address builtin validator`.

---

### **Phone Number**
🔍 Checks if the entry  
* is a string of numbers only (if dial codes are to be added do not include the `+` sign).
* length is between 3 and 12.

```js
import { isPhoneNumberValid } from 'drea'

console.log(isPhoneNumberValid("237653793493")); // ✅ { status: true, error: null }
console.log(isPhoneNumberValid("23ab"));         // ❌ { status: false, error: 'Phone number must contain only digits' }
console.log(isPhoneNumberValid("23"));           // ❌ { status: false, error: 'Phone number is too small' }
console.log(isPhoneNumberValid("+237653793493"));// ❌ { status: false, error: 'Phone number must contain only digits' }
```

`future versions will improve the phone number builtin validator`.

---

### **Password**
🔍 Checks if the entry is a string containing at least:
* an uppercase letter  
* a lowercase letter  
* a number  
* a special character (?@!#$%&*)  
* minimum length of 8 characters  

```js
import { isPasswordValid } from 'drea'

console.log(isPasswordValid("Abcdef1!")); // ✅ { status: true, error: null }
console.log(isPasswordValid("Abcdef1"));  // ❌ { status: false, error: 'Password must be atleast 8 characters long' }
console.log(isPasswordValid("abcdef1"));  // ❌ { status: false, error: 'Password must contain atleast an uppercase letter' }
console.log(isPasswordValid("ABCDEF1!")); // ❌ { status: false, error: 'Password must contain atleast a lowercase letter' }
console.log(isPasswordValid("aBCDEFG!")); // ❌ { status: false, error: 'Password must contain atleast a number' }
```

`future versions will improve the password builtin validator`.

---

### **Required**
🔍 Checks if the entry is non-empty  
* string must not be empty  
* number is valid  

```js
import { isRequired } from 'drea'

console.log(isRequired("Some value")); // ✅ { status: true, error: null }
console.log(isRequired(""));           // ❌ { status: false, error: 'This field is required' }
console.log(isRequired());             // ❌ { status: false, error: 'Entry cannot be null' }
console.log(isRequired(1));            // ✅ { status: true, error: null }
```

---

## 🧮 3. Validate Multiple Fields at Once with `validateMany()`

*`validateMany()` is a function that can test one or more entries at once.*
*Think of it as  calling `validateEntry()` more than once with different entries.*

*`validateMany()` takes an array of objects, each object is similar to what `validateEntry()` takes.* 

### ✅ Example
```js
import { validateMany } from 'drea'

const username2 = "johndoe";
const email = "johndoe@gmail.com";

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

*So instead of validating 6 to ... with different `validateEntry()`, with `validateMany()`* 
*you can validate all at once.*

### ❌ Example: One Invalid
```js
import { validateMany } from 'drea'

const username2 = "johndoe";
const email = "johndoegmail.com";//missing an @

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
Incase of any invalid entry `validateMany()` returns an array of object(s). Each object comprises of `*value*` of the entry, `*status*` and `*error*` message from `*errorMsg*`

**Output:**
```js
[ { value: "johndoegmail.com", status: false, error: "Invalid Email" } ]
```

---

## 🧮 4. Schema-Based Validation with `ClassicModel`

`ClassicModel` provides a structured schema-based validation system for grouped data.

It validates multiple fields (email, password, username, phone number) in a single model.

---

## ⚙️ Usage

1. Create an instance with a data object  
2. Call `.validate()` method  

---

## ✅ Example: Success

```js
import { ClassicModel } from 'drea'

const cl = new ClassicModel({
  email: "JohnDoe@gmail.com",
  password: "Jode01G$",
  username: "John Doe",
  phonenumber: "237865373165"
});

console.log(cl.validate());
```
```js
Output
{
  status: true,
  error: null,
  data: {
    email: "JohnDoe@gmail.com",
    password: "Jode01G$",
    username: "John Doe",
    phonenumber: "237865373165"
  }
}
```

## ❌ Example: Failure
```js
const clInvalid = new ClassicModel({
  email: "johndoegmail.com",
  password: "doed01G$",
  username: " John",
  phonenumber: "+237865373165"
});

console.log(clInvalid.validate());
```
🧠 Behavior

Unlike validateEntry(), ClassicModel validates all fields even if one fails.

It returns a full report of invalid fields instead of stopping at the first error.
```js
Output
{
  status: false,
  username: {
    status: false,
    error: 'Username must contain between 5 to 40 letters only',
    value: 'John'
  },
  email: {
    status: false,
    error: 'Invalid Email address. Email must be of the form xyz@domain.tld',
    value: 'johndoe@gmail.com'
  },
  phonenumber: {
    status: false,
    error: 'Phonenumber must be between 4 to 15 digits',
    value: '+237865373165'
  }
}
```
---


## 🧮 5. Custom Schema Validation with `CustomClassicModel`
*`CustomClassicModel` is a custom class model that allows us to create our own restriction* *model of how data will be organized and validated. It's quite similar to `ClassicModel` and* *in addition allows us to creats our own `schema_restr_model`.*

### ✅ Example: Successful
```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};
const custom = new CustomClassicModel(schema);
console.log(custom.validate({ name: "JoeBless", age: 25 }));
```
 
**Output:**
```js
{ status: true, error: null, data: { name: "JoeBless", age: 25 } }
```
*We can create any schema restriction of our own*
```js
import { CustomClassicModel } from 'drea'

const schema1 = {
  name: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};

const schema2 = {
  title: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
  message: { rule: /[\S]{1,100}/, errorMsg: "Message cannot exceed 100 characters" }
};

const custom1 = new CustomClassicModel(schema1);//using schema1
const custom2 = new CustomClassicModel(schema2);//using schema2

console.log(custom1.validate({ name: "Janet", age: 25 }));

console.log(custom2.validate({ title: "User", message: 'Message..' }));
```
 The return value of `CustomClassicModel()` is same as that of `ClassicModel()`

**Output:**
```js
{ status: true, error: null, data: { name: "Janet", age: 25 } }
{
  status: true,
  error: null,
  value: { title: 'User', message: 'Message..' }
}
```

### ❌ Example: Invalid entries
```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};
const custom = new CustomClassicModel(schema);

const invalidData = { name: null, age: "25" };
console.log(custom.validate(invalidData));
```
*Incase of any invalid entry it follows same concept as `ClassicModel()`*

**Output:**
```js
{
  name: { status: false, error: "Name must be a string", value: null },
  age: { status: false, error: "Age must be a number", value: "25" },
  status:false
}
```

### ✅ Example: When name is an Object 
```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v) => typeof v.firstname === "string" && typeof v.lastname === "string", 
  errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};
const custom = new CustomClassicModel(schema);

const validData = { name: {
                      firstname:"john",
                      lastname:"doe"
                      },
                      age: 25 };
console.log(custom.validate(validData));
```
*Incase of any invalid entry it follows same concept as `ClassicModel()`*

**Output:**
```js
{
  status: true,
  error: null,
  value: { name: { firstname: 'john', lastname: 'doe' }, age: 25 }
}
```
- `errorMsg` can be any type: `string`, `number`, `object`, `array`, or `null`
## 🚀 New Feature: Multi-Rule Validation per Entry (RuleAndError[] Support)

We’ve introduced a powerful upgrade to `CustomClassicModel`:  
you can now assign **multiple validation rules per single field** using a `RuleAndError[]` structure.

This allows deep validation of nested or structured data with cleaner and more expressive schemas.

---

## 🧩 What’s New?

Each entry can now accept:

- A single rule object  
- OR an array of rules (`RuleAndError[]`)

Each rule contains:
- `rule` → validation function  
- `errorMsg` → error returned if rule fails  

---

## 🧪 Example

```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: [
    {
      rule: (v) => typeof v.firstname === "string",
      errorMsg: "firstname must be a string"
    },
    {
      rule: (v) => typeof v.lastname === "string",
      errorMsg: "lastname must be a string"
    }
  ],
  age: {
    rule: (v) => typeof v === "number",
    errorMsg: "Age must be a number"
  }
};

const custom = new CustomClassicModel(schema);

const validData = {
  name: {
    firstname: "john",
    lastname: "doe"
  },
  age: 25
};

console.log(custom.validate(validData));
```
✅ Output (Valid Data)

```js
{
  status: true,
  error: null,
  value: {
    name: { firstname: "john", lastname: "doe" },
    age: 25
  }
}
```

## 🚀 Advanced Example: Nested Validation with Arrays + Objects

This feature fully supports **complex nested structures**, including arrays, objects, and mixed types inside a single field.

Below is a real-world example using a **Salary schema** with multiple layered validation rules.

---

## 💰 Example 1: Salary Validation (Multi-Rule Array Field)

```js
import { CustomClassicModel } from 'drea'

const schema = {
  Salary: [
    {
      rule: (v) =>
        v.period.length > 0 &&
        v.currency.length > 0 &&
        v.ranges.every(i => i != null),
      errorMsg: "All Salary Informations are required"
    },
    {
      rule: (v) => v.period.length > 0,
      errorMsg: "Salary Period is required"
    },
    {
      rule: (v) => v.currency.length > 0,
      errorMsg: "Salary Currency is required"
    },
    {
      rule: (v) => v.ranges[0] >= 0 && v.ranges[1] >= 0,
      errorMsg: "Salary range cannot be negative"
    },
    {
      rule: (v) => v.ranges[0] != null && v.ranges[1] != null,
      errorMsg: "Salary range is required"
    },
    {
      rule: (v) => v.ranges[0] < v.ranges[1],
      errorMsg: "Incorrect Salary Range"
    }
  ]
}

const model = new CustomClassicModel(schema)

const data = {
  Salary: {
    period: "monthly",
    currency: "USD",
    ranges: [50000, 2000]
  }
}

console.log(model.validate(data))
✅ Output (Valid)
{
  status: true,
  error: null,
  value: {
    Salary: {
      period: "monthly",
      currency: "USD",
      ranges: [500, 2000]
    }
  }
}
```
### ⚠ Example: Under Salary Validation 
Let's switch the ranges 
```js
//Build schema once re-use anywhere
const data = {
  Salary: {
    period: "monthly",
    currency: "USD",
    ranges: [50000, 2000]//We expect this to fail
  }
}

console.log(model.validate(data))
```
Output
```js
{
  Salary: {
    status: false,
    error: 'Incorrect Salary Range',
    value: { period: 'monthly', currency: 'USD', ranges: [Array] }
  },
  status: false
}
```

✅ Example 2: Nested Object Validation (Complex Structure)

This shows validation of a job posting object containing nested fields and mixed types.

```js
import { CustomClassicModel } from 'drea'

const schema = {
  job: [
    {
      rule: (v) => typeof v.title === "string",
      errorMsg: "Job title must be a string"
    },
    {
      rule: (v) => Array.isArray(v.skills) && v.skills.length > 0,
      errorMsg: "At least one skill is required"
    },
    {
      rule: (v) => typeof v.company.name === "string",
      errorMsg: "Company name must be a string"
    },
    {
      rule: (v) => v.salary.ranges[0] < v.salary.ranges[1],
      errorMsg: "Invalid salary range"
    }
  ]
}

const model = new CustomClassicModel(schema)

const data = {
  job: {
    title: "Frontend Developer",
    skills: ["Vue", "JavaScript"],
    company: {
      name: "TechCorp"
    },
    salary: {
      period: "monthly",
      currency: "USD",
      ranges: [1000, 3000]
    }
  }
}

console.log(model.validate(data))

```
Output:
```js
{
  status: true,
  error: null,
  value: {
    job: {
      title: 'Frontend Developer',
      skills: [Array],
      company: [Object],
      salary: [Object]
    }
  }
}
```
> ⚠️ **Console Display Notice**
>
> When working with nested objects or arrays, you may see outputs like:
>
> ```js
> ranges: [Array]
> ```
>
> This is **not an error**. It simply means the console has **collapsed nested data** for readability.

---

### 🔍 How to view full data

**1. Expand in DevTools**
- Click the ▶ arrow next to the object in your console to reveal full structure.

**2. Use `JSON.stringify` (recommended for full view)**

```js 
console.log(JSON.stringify(result, null, 2));
💡 Important
```

Output 
```js
{
  "status": true,
  "error": null,
  "value": {
    "job": {
      "title": "Frontend Developer",
      "skills": [
        "Vue",
        "JavaScript"
      ],
      "company": {
        "name": "TechCorp"
      },
      "salary": {
        "period": "monthly",
        "currency": "USD",
        "ranges": [
          1000,
          3000
        ]
      }
    }
  }
}
```

The actual data is fully preserved.
Only the console representation is shortened, not the value itself.

> 🧠 **Schema Flexibility Notice**
>
> In `drea`, schemas are **not required to match data 1-to-1 in size or completeness**.
>
> You can define a single, extensive schema and reuse it across multiple data structures—even if each data object only contains a subset of the fields.

---

### 🔁 Key Idea

- A schema can contain **more fields than the data**
- Validation only applies to **fields present in the data object**
- Missing schema fields in the data are simply **ignored**
- This allows **one reusable schema for multiple data shapes**

---

### 🧩 Example Concept

You might have:

- Data A → `{ name, age }`
- Data B → `{ email, password }`
- Data C → `{ name, email, salary }`

All of them can still use:

```js
const schema = {
  name: {...},
  age: {...},
  email: {...},
  password: {...},
  salary: {...}
}
```
Each data object is validated only against its existing fields, not the entire schema.
> ⚠️ **Major Note:** If the data object contains a field that is not defined in the schema, an error will be thrown `UnknownKeyError` because the schema does not recognize that key. Ensure all data fields are explicitly declared in the schema.

### 💡 Why this matters

This approach allows you to:

* Reuse a single validation model 
* Support multiple forms / payloads 
* Avoid rewriting schemas per data type 
* Keep validation logic centralized and scalable 

### 🧠 What This Demonstrates

✔ Nested object validation (company.name)  
✔ Array validation (skills)  
✔ Deep object chaining (salary.ranges)  
✔ Multi-rule per field support  
✔ Real-world schema modeling  

### 📌 Key Takeaway

This update enables production-level schema validation, making it possible to:

* Validate APIs
* Validate forms
* Validate nested backend payloads
* Enforce strict business rules cleanly

Without writing repetitive validation logic.


🧠 Behavior
* All rules inside a field are evaluated
* Validation stops per field once a rule fails
* Structure remains consistent with ClassicModel
* Ideal for nested objects and complex schemas
📌 Summary

This update introduces:

✔ Multiple rules per field
✔ Nested object validation support
✔ Cleaner schema design
✔ Scalable validation logic

---


### ⚠ Example: Invalid Constructor type
*An error is thrown when we introduce a non-object type as our `schema_restr_model` when creating the instance.*

```js
import { CustomClassicModel } from 'drea'

const schema = [{
  name: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
}];//schema is not suppose to be an array 

const custom = new CustomClassicModel(schema);

const invalidData = { name: "null",
                     age: 25,
                    };
console.log(custom.validate(invalidData));
```


**Output:**
```js
ArgumentTypeError:{
  error_code:"ERR_INVALID_ARGTYPE"
  error_description: 'constructor must take an object'
}
```
**✅ Fix:** Always make sure the the `schema_restr_model` is an object.


### ⚠ Example: Invalid key
*An error is thrown when we introduce a keyname that our `schema_restr_model` schema is unable to identify.*

```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v) => typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v) => typeof v === "number", errorMsg: "Age must be a number" }
};
const custom = new CustomClassicModel(schema);

const invalidData = { name: "null",
                     age: 25,
                     message:"Message..."//'message' field does not exist
                    };
console.log(custom.validate(invalidData));
```


**Output:**
```js
UnknownKeyError:{
  error_code:"ERR_UNKNOWN_KEY"
  error_description: "key 'message' not found in schema restriction"
}
```
**✅ Fix:** Always make sure the the `schema_restr_model` contains the field names that your data will have.

### *Additional functionality*
*`CustomClassicModel`provides the ability to extend our `schema_restr_model` by calling the `extend(new_schema)` method.*


```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v)=>typeof v === "number", errorMsg: "Age must be a number" }
};

const ext_schema = {
    bio:{rule:/[\S]{1,100}/,errorMsg:"Bio cannot exceed 100 characters"}
}
const custom = new CustomClassicModel(schema);

custom.extend(ext_schema)

const invalidData = { 
                    name: "null",
                    age: 25,
                    bio:"Bio......"
                    };
console.log(custom.validate(invalidData));
```
**Note**:: Make sure the fields in the extended schema does not already exist in the previous schema

**Output:**
```js
{
  status: true,
  error: null,
  value: { name: 'null', age: 25, bio: 'Bio......' }
}
```

### ⚠ Example: Duplicate key
*An error is thrown whenever we extend a schema and there's duplicate key present.*

```js
import { CustomClassicModel } from './drea.js'

const schema = {
  name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v)=>typeof v === "number", errorMsg: "Age must be a number" }
};

const ext_schema = {
    name:{rule:/^[A-Za-z]+$/,errorMsg:'Username must contain letters only'},//duplicate key
    bio:{rule:/[\S]{1,100}/,errorMsg:"Bio cannot exceed 100 characters"}
}
const custom = new CustomClassicModel(schema);

custom.extend(ext_schema)

const invalidData = { 
                    name: "null",
                    age: 25,
                    bio:"Bio......"
                    };
console.log(custom.validate(invalidData));
```


**Output:**
```js
DuplicateKeyError:{
  error_code:"ERR_DUPLICATE_KEY"
  error_descritpion: "Duplicate key 'name' already exists in schema"
}
```
**✅ Fix:** Always make sure the extended schema restricton model `ext_schema_restr_model` 
does not have a duplicate key.

*`CustomClassicModel`provides the ability to remove a field from  our `schema_restr_model` by calling the `remove('fieldname')` method.*


```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v)=>typeof v === "number", errorMsg: "Age must be a number" }
};

const ext_schema = {
    bio:{rule:/[\S]{1,100}/,errorMsg:"Bio cannot exceed 100 characters"}
}
const custom = new CustomClassicModel(schema);

custom.extend(ext_schema)
custom.remove('bio')//bio field is removed hence validation will be done without it
//we expect a KeyExistenceError

const invalidData = { 
                    name: "null",
                    age: 25,
                    bio:"Bio......"
                    };
console.log(custom.validate(invalidData));
```
**Output:**
```js
UnknownKeyError:{
  error_code: "ERR_UNKNOWN_KEY"
  error_description: "key 'bio' not found in schema restriction"
}
```
As expected because the 'bio' field was removed.

**✅ Fix:** Always make sure when a field is removed from the `schema_restr_model`, the data should not expect a validation of that field as they field doesn't exist anymore.



*`CustomClassicModel` also provides the ability to swap `schema_restr_model` by calling.*

```js
import { CustomClassicModel } from 'drea'

const schema = {
  name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
  age: { rule: (v)=>typeof v === "number", errorMsg: "Age must be a number" }
};

const new_schema = {
    name: { rule: (v)=>typeof v === "string", errorMsg: "Name must be a string" },
    bio:{rule:/[\S]{1,100}/,errorMsg:"Bio cannot exceed 100 characters"}
}
const custom = new CustomClassicModel(schema);


custom.swap(new_schema)//schema is swap and enw_schema will be use
//Expect KeyExistenceError as some of the fields will not exist like 'age'

const invalidData = { 
                    name: "null",
                    age: 25,
                    bio:"Bio......"
                    };
console.log(custom.validate(invalidData));
```
**Output:**
```js
UnknownKeyError:{
  error_code: "ERR_UNKNOWN_KEY"
  error_description: "Unknown key 'bio' not found in schema restrictions"
}
```
As expected because the 'age' field was not found in the `new_schema_restr_model`.

**✅ Fix:** Always make sure when a `schema_restr_model` is replaced a `new_schema_restr_model` the field names of the data matches or exists in the `new_schema_restr_model`.



**Note**::*`CustomeClassicModel()` is schema-based driven, meaning you can create a `schema_restr_model` and even extend it as you want but in as much as the fields of the data exists in the model they can validated else you may recieve keyname not found error in the restr model.*



## 🧮 6. Url Valiadtion with  `URL` 

*`URL` A lightweight, extensible URL / URI pattern validation utility designed to verify URLs against a base pattern and optional constraint rules.*

*This validator focuses on structural correctness and rule-based filtering, making it useful for eliminating malformed and suspicious URLs early in your validation pipeline.*

⚠️ *Important: This library validates URL patterns, not trust, reachability, or safety.*

### ✅ Example: Successful (not Recommended)
```js
import { URL } from 'drea'
const isValid = new URL("http://example.com").verifyPattern();

console.log(isValid); // true | false


```
 
**Output:**
```js
true
```

## Why this is NOT enough

While this checks that the URL looks structurally valid, it:
- Does not verify domain legitimacy
- Does not block fake or malicious domains
- Does not enforce protocol, port, or component rules
- Relying on pattern-only validation is unsafe and should never be used alone in production systems.```



### ✅ Example: Successful (Recommended)
```js
import { URL } from 'drea'
const isValid = new URL("http://example.com").verifyPattern();

console.log(isValid); // true | false

const isValid_ = new URL("http://support.find.com:443///?draz=1#soccer").verifyPattern({
              allowed_protocols: ["http", "https"],// accepts any url with protocols http or https
              contain_fragment: true, //accepts url if it contains fragment part [url must contain fragment]
              contain_query: true,//accepts url if it contains query part [ url must contain query ]
              allowed_ports: ["443", "80"], //accepts url with ports 433 or 83 (must be present on it)
              allowed_domains: [
                "support.find.com",
                "find.com",
                "google.com"
              ],//accepts url if it contains one of those domains
              contain_path: false, //rejects url if it contains path [url should not contain path]
              between:[40]//maxlength is 40 characters and min length is 0 characters [Need Normalization First]
 });

console.log(isValid_); // ---> Boolean
//

```
**Output:**
```js
  true
``` 
## Why this is better

Using restrictions allows you to:

- Reject unexpected protocols
- Whitelist known domains
- Enforce required or forbidden URL components
- Reduce false positives
- Eliminate most malformed or fake URLs early

## ⚠️ Important Disclaimer

This validator **does NOT guarantee 100% URL or URI validity**.

It:

- ❌ Does not verify DNS records  
- ❌ Does not check domain ownership  
- ❌ Does not detect phishing or malware  
- ❌ Does not guarantee reachability  

### ✅ Best Practice

Use this validator as **one layer** in a broader validation strategy, alongside:

- DNS checks
- Reputation services
- Content inspection
- Rate limiting
- Allow-listing / deny-listing

> Pattern validation is a **strong first line of defense**, not a complete solution.

---

## Supported Restrictions

| Restriction Name      | Value Type | What It Validates |
|----------------------|------------|-------------------|
| `allowed_protocols`  | `string[]` | Ensures the URL scheme (e.g. `http`, `https`) is allowed |
| `allowed_ports`      | `string[]` | Ensures the URL contains a port and it matches allowed values |
| `allowed_domains`    | `string[]` | Whitelists acceptable domain names (case-insensitive) |
| `contain_fragment`   | `boolean`  | Controls whether `#fragment` is allowed or not|
| `contain_query`      | `boolean`  | Controls whether `?query` parameters are allowed or not |
| `contain_path`       | `boolean`  | Controls whether path segments are allowed or not |
| `between`            | `number[]` | Enforces minimum or min/max URL length |

### `between` examples

```js
between: [40]        // minimum length of 40
between: [40, 200]  // length must be between 40 and 200
```
## Validation Error Reference

This library uses **explicit, structured error objects** to make validation failures
predictable, debuggable, and frontend-friendly.  
Each error includes a **clear name**, a **machine-readable error code**, and a **human-readable description**.

---

### Error Types

| Error Name | Error Code | Why This Error Occurs |
|-----------|-----------|------------------------|
| `ValidationError` | `ERR_VALIDATION` | Base validation error used as the foundation for all validation-related failures |
| `DuplicateKeyError` | `ERR_DUPLICATE_KEY` | Thrown when a key appears more than once where uniqueness is required |
| `ArgumentTypeError` | `ERR_INVALID_ARGTYPE` | Thrown when a value does not match the expected data type |
| `MissingKeyError` | `ERR_MISSING_KEY` | Thrown when a required key is missing from the input |
| `UnknownKeyError` | `ERR_UNKNOWN_KEY` | Thrown when an unsupported or unrecognized key is provided |
| `NullValueError` | `ERR_NULL_VALUE` | Thrown when a value is `null` or `undefined` but is required |




> 🚀 **Coming Soon: `drea-ts`**
>
> A fully TypeScript-native version of `drea` is on the way.
>
> Expect stronger type safety, better IntelliSense, and improved developer experience — built specifically for TS-first projects.
---
