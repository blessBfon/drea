<<<<<<< HEAD
# Documentation
# drea

**drea** is a lightweight JavaScript validation library for validating single values, multiple entries, and schema-based data using **predefined rules** or **custom models**. It works both in browsers and Node.js.

---

## ✨ Features

- ✅ Validate a single value with a function or regular expression.
- ✅ Validate multiple entries at once.
- ✅ Define schema-based validation with `ClassicModel` or `CustomClassicModel`.
- ✅ Built-in validators for username, email, phone number, password, and required fields.
- ✅ URL validation. (`v2`)
- ✅ Sanitization of input.(as from `v2`)
- ✅ StrictPassword() (as from `v2`)
- ✅ None type (as from `v2`)
- ✅ Structured validation error objects introduced.(`v2`)
- ✅ Beginner-friendly syntax with explicit examples.
- ✅ Optional normalization utilities.


---

## 🧩 Installation / Import

## installation

```js
npm install drea
````
OR

```js
 npm install drea@2.0.0
```
which will install the latest version. `v2.0.0`

## Introduction

## 🧠 1. Basic Validation with `validateEntry()`

`validateEntry()` is a function that validates a **single value** against one or more rules, by taking an object containing the `entry` and an array `RuleAndError` which contains an object comprising of the `rule` and  error message `errorMsg`.

`rule` can take either a boolean function or a regex (Regulare Expression) or `None` type (as from `v2`).

### ✅ Example: Successful Validation
```js
//validating against a single rule
import { validateEntry } from 'drea'
const username = "Fon Bless";

console.log(validateEntry({
  entry: username,
  RuleAndError: [
    {      
        rule: (v) => typeof v === "string",
         //if username is not a of string type errorMsg is returned as error 
        errorMsg: "Must be a string" }
  ]
}));

```

The entry is tested against the rule and if found valid an object is return like the one below

**Output:**
```js
{ status: true, error: null }
```

### 💥 Example: When entry invalid
```js
console.log(validateEntry({
  entry: 3434,
  RuleAndError: [
    { rule: (v) => typeof v === "string", errorMsg: "Must contain only letters" }
  ]
}));
```
**Note::** errorMsg is returned as error if entry did not follow the rule stated.

**Output:**
```js
{ status: false, error: "Must contain only letters" }
```
**✅ Fix:** Convert input to string or provide a valid string value.

**✅ Fix:** If validation was to test for a number change rule simply.

### ✅ Example: Validating with more than rule
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

Let's see when age is a string instead
### 💥 Example: age now is a string
```js
const age = '20';

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
//rule 1 failed  ❌ as age is not a number
//rule 2 ignored ➖ not tested
//rule 3 ignored ➖ not tested
//rule 4 ignored ➖ not tested
{ status: false, error: 'age must be a number' }
```

Suppose age is now 17 but its below 18 


Let's see when age is a string instead
### 💥 Example: Validating with more than rule
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
💠 _With this we can create an intelligent validation system that is rigid and also guide the user towards providing the right input._

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

console.log(isUsernameValid("FonBless")); // ✅ { status: true, error: null }
console.log(isUsernameValid("F!"));      // ❌ { status: false, error: 'Username must contain only letters' }
console.log(isUsernameValid("F h"));      // ❌ { status: false, error: 'Username must contain only letters' }
console.log(isUsernameValid("fon"));      // ❌ { status: false, error: 'Username is too small ' }
```
`future versions will improve the username builtin validator`.

### **Email**
🔍 Checks if the entry 
* matches the designed regex 

**Note::** previous regex used in `v1.0.7` was removed.

drea now uses a new function to specifically test for email addresses called `StrictEmail()`
```js
import { isEmailValid } from 'drea'

console.log(isEmailValid("test@example.com")); // ✅ { status: true, error: null }
console.log(isEmailValid("test@com"));         // ❌ { status: false, error: 'invalid email address' }
```
`future versions will improve the email address builtin validator`.

### **Phone Number**
🔍 Checks if the entry 
* is a string of numbers only (if dial codes are to be added donot include the `+` sign).
* length of string of numbers is between 3 and 12.

```js
import { isPhoneNumberValid } from 'drea'

console.log(isPhoneNumberValid("237653731645"));  // ✅ { status: true, error: null }
console.log(isPhoneNumberValid("23ab"));  // ❌ { status: false, error: 'Phone number must contain only digits' }
console.log(isPhoneNumberValid("23"));  // ❌ { status: false, error: 'Phone number is too small' }
console.log(isPhoneNumberValid("+237653731645"));  // ❌ { status: false, error: 'Phone number must contain only digits' }

```
`future versions will improve the phone number builtin validator`.

### **Password**
🔍 Checks if the entry is a string containing atleast
* an uppercase
* a lowercase
* a number
* a special character (?@!#$%&*)
and must have a length 8 and above.
```js
import { isPasswordValid } from 'drea'

console.log(isPasswordValid("Abcdef1!"));     // ✅ { status: true, error: null }
console.log(isPasswordValid("Abcdef1"));        // ❌ { status: false, error: 'Password must be atleast 8 characters long' }
console.log(isPasswordValid("abcdef1"));        // ❌{status: false,error: 'Password must contain atleast an uppercase letter'}
console.log(isPasswordValid("Abcdef1"));        // ❌{status: false,error: 'Password must contain atleast an uppercase letter'}
console.log(isPasswordValid("ABCDEF1!"));        // ❌{status: false,error: 'Password must contain atleast a lowercase letter'}
console.log(isPasswordValid("aBCDEFG!"));        // ❌{ status: false, error: 'Password must contain atleast a number' }
```
`future versions will improve the phone number builtin validator`.

### **Required**
🔍 Checks if the entry is non-empty 
* if string then is must contain something
* is a number 
```js
import { isRequired } from 'drea'

console.log(isRequired("Some value"));  // ✅ { status: true, error: null }
console.log(isRequired(""));            // ❌ { status: false, error: 'This field is required' }
console.log(isRequired());            // ❌ { status: false, error: 'Entry cannot be null' }
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

*So instead of validating 6 to ... with different `validateEntry()`, with `validateMany()`* 
*you can validate all at once.*

### ❌ Example: One Invalid
```js
import { validateMany } from 'drea'

const username2 = "Fonbless";
const email = "blessfonmtohgmail.com";//missing an @

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
Incase of any invalid entry `validateMany()` returns an array of object(s). Each object comprises of *value* of the entry, *status* and *error* message from *errorMsg*

**Output:**
```js
[ { value: "blessfonmtohgmail.com", status: false, error: "Invalid Email" } ]
```

---


## 🧮 4. Schema-Based Validation with `ClassicModel`
*`ClassicModel` is a builtin description of how data will be organized and validated.*

**Usage**<br>
*1. Create an instance and place as constructor an object(which is the data)*<br>
*2. called .validate() method*

*`ClassicModel` accepts any combination of email, password, username, phonenumber* as entries.*

### ✅ Example: Success
```js
import { ClassicModel } from 'dea'
const cl = new ClassicModel({
  email: "blessfonmtoh@gmail.com",
  password: "Bless01G$",
  username: "Fon Bless",
  phonenumber: "237865373165"
});
console.log(cl.validate());
```
*`ClassicModel()` returns when data found valid an object comprising of **status**,**error*** *which is null and the **data** the object data itself.*

**Output:**
```js
{
  status: true,
  error: null,
  data: {
    username: 'Fon Bless',
    email: 'blessfonmtoh@gmail.com',
    password: 'Bless01G$',
    phonenumber: '237865373165'
  }
}
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
Compare to the `validateEntry()` or any function built ontop of `validateEntry()`, even though
`ClassicModel` also depends on `validateEntry()`, if any invalid entry is found, validation of the other entries **continues** till all entries are tested. Only invalid entries will be returned as we see below.

**Output:**
```js
/*
    entryname:{
        status,
        error,//builtin errormsg for invalid entries
        value//value of keyname
    }
*/
{
  username: {
    status: false,
    error: 'Username must contain between 5 to 40 letters only',
    value: 'Fon'
  },
  email: {
    status: false,
    error: 'Invalid Email address. Email must be of the form xyz@domain.tld',
    value: 'blessfonmtohgmail.com'
  },
  phonenumber: {
    status: false,
    error: 'Phonenumber must be between 4 to 15 digits',
    value: '+237865373165'
  }
}
```
**✅ Fix:** User should have provided a valid email, username and phonenumber.

**Note::** 
 `ClassicModel()` validates based on a builtin `schema_restr_model` schema restriction model.

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
console.log(custom.validate({ name: "Bless", age: 25 }));
```
 
**Output:**
```js
{ status: true, error: null, data: { name: "Bless", age: 25 } }
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

console.log(custom1.validate({ name: "Bless", age: 25 }));

console.log(custom2.validate({ title: "User", message: 'Message..' }));
```
 The return value of `CustomClassicModel()` is same as that of `ClassicModel()`

**Output:**
```js
{ status: true, error: null, data: { name: "Bless", age: 25 } }
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
  age: { status: false, error: "Age must be a number", value: "25" }
}
```
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
  error_description: "Unknown key 'message' not found in schema restrictions"
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
  error_description: "Unknown key 'bio' not found in schema restrictions"
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



**Note**::*`CustomeClassicModel()` is schema-based driven, meaning you can create a `schema_restr_model` and even extend it as you want but in as much as the fields of the data exists in the model they can validated else you may recieve keyname not found in the restr model.*



## 🧮 6. Url Valiadtion with  `URL` <sub>*as of `version 2.x.x`*</sub>

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
const isValid = new URL(
  "http://support.find.com:443///?draz=1#soccer"
).verifyPattern({
  allowed_protocols: ["http", "https"],
  contain_fragment: true,
  contain_query: true,
  allowed_ports: ["443", "80"],
  allowed_domains: [
    "support.find.com",
    "find.com",
    "google.com"
  ],
  contain_path: false,
  between: [40]
});

console.log(isValid); // true | false
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
| `contain_fragment`   | `boolean`  | Controls whether `#fragment` is allowed |
| `contain_query`      | `boolean`  | Controls whether `?query` parameters are allowed |
| `contain_path`       | `boolean`  | Controls whether path segments are allowed |
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

---
=======
# drea

**drea** is a lightweight JavaScript validation library for validating single values, multiple entries, and schema-based data using **predefined rules** or **custom models**. It works both in browsers and Node.js.

---

## ✨ Features

- ✅ Validate a single value with a function or regular expression.
- ✅ Validate multiple entries at once.
- ✅ Define schema-based validation with `ClassicModel` or `CustomClassicModel`.
- ✅ Built-in validators for username, email, phone number, password, and required fields.
- ✅ URL validation. (as from `v2`)
- ✅ Sanitization of input.(as from `v2`)
- ✅ StrictPassword() (as from `v2`)
- ✅ None type (as from `v2`)
- ✅ Clear, descriptive error messages.
- ✅ Beginner-friendly syntax with explicit examples.
- ✅ Optional normalization utilities.


---

## 🧩 Installation / Import

## installation

```js
npm install drea
````
OR

```js
 npm install drea@1.1.3
```
which will install the latest version. `v1.1.3`

## Introduction

## 🧠 1. Basic Validation with `validateEntry()`

`validateEntry()` is a function that validates a **single value** against one or more rules, by taking an object containing the `entry` and an array `RuleAndError` which contains an object comprising of the `rule` and  error message `errorMsg`.

`rule` can take either a boolean function or a regex (Regulare Expression) or `None` type (as from `v2`).

### ✅ Example: Successful Validation
```js
//validating against a single rule
import { validateEntry } from 'drea'
const username = "Fon Bless";

console.log(validateEntry({
  entry: username,
  RuleAndError: [
    {      
        rule: (v) => typeof v === "string",
         //if username is not a of string type errorMsg is returned as error 
        errorMsg: "Must be a string" }
  ]
}));

```

The entry is tested against the rule and if found valid an object is return like the one below

**Output:**
```js
{ status: true, error: null }
```

### 💥 Example: When entry invalid
```js
console.log(validateEntry({
  entry: 3434,
  RuleAndError: [
    { rule: (v) => typeof v === "string", errorMsg: "Must contain only letters" }
  ]
}));
```
**Note::** errorMsg is returned as error if entry did not follow the rule stated.

**Output:**
```js
{ status: false, error: "Must contain only letters" }
```
**✅ Fix:** Convert input to string or provide a valid string value.

**✅ Fix:** If validation was to test for a number change rule simply.

### ✅ Example: Validating with more than rule
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

Let's see when age is a string instead
### 💥 Example: age now is a string
```js
const age = '20';

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
//rule 1 failed  ❌ as age is not a number
//rule 2 ignored ➖ not tested
//rule 3 ignored ➖ not tested
//rule 4 ignored ➖ not tested
{ status: false, error: 'age must be a number' }
```

Suppose age is now 17 but its below 18 


Let's see when age is a string instead
### 💥 Example: Validating with more than rule
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
💠 _With this we can create an intelligent validation system that is rigid and also guide the user towards providing the right input._

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

console.log(isUsernameValid("FonBless")); // ✅ { status: true, error: null }
console.log(isUsernameValid("F!"));      // ❌ { status: false, error: 'Username must contain only letters' }
console.log(isUsernameValid("F h"));      // ❌ { status: false, error: 'Username must contain only letters' }
console.log(isUsernameValid("fon"));      // ❌ { status: false, error: 'Username is too small ' }
```
`future versions will improve the username builtin validator`.

### **Email**
🔍 Checks if the entry 
* matches the designed regex 

**Note::** previous regex used in `v1.0.7` was removed.

drea now uses a new function to specifically test for email addresses called `StrictEmail()`
```js
import { isEmailValid } from 'drea'

console.log(isEmailValid("test@example.com")); // ✅ { status: true, error: null }
console.log(isEmailValid("test@com"));         // ❌ { status: false, error: 'invalid email address' }
```
`future versions will improve the email address builtin validator`.

### **Phone Number**
🔍 Checks if the entry 
* is a string of numbers only (if dial codes are to be added donot include the `+` sign).
* length of string of numbers is between 3 and 12.

```js
import { isPhoneNumberValid } from 'drea'

console.log(isPhoneNumberValid("237653731645"));  // ✅ { status: true, error: null }
console.log(isPhoneNumberValid("23ab"));  // ❌ { status: false, error: 'Phone number must contain only digits' }
console.log(isPhoneNumberValid("23"));  // ❌ { status: false, error: 'Phone number is too small' }
console.log(isPhoneNumberValid("+237653731645"));  // ❌ { status: false, error: 'Phone number must contain only digits' }

```
`future versions will improve the phone number builtin validator`.

### **Password**
🔍 Checks if the entry is a string containing atleast
* an uppercase
* a lowercase
* a number
* a special character (?@!#$%&*)
and must have a length 8 and above.
```js
import { isPasswordValid } from 'drea'

console.log(isPasswordValid("Abcdef1!"));     // ✅ { status: true, error: null }
console.log(isPasswordValid("Abcdef1"));        // ❌ { status: false, error: 'Password must be atleast 8 characters long' }
console.log(isPasswordValid("abcdef1"));        // ❌{status: false,error: 'Password must contain atleast an uppercase letter'}
console.log(isPasswordValid("Abcdef1"));        // ❌{status: false,error: 'Password must contain atleast an uppercase letter'}
console.log(isPasswordValid("ABCDEF1!"));        // ❌{status: false,error: 'Password must contain atleast a lowercase letter'}
console.log(isPasswordValid("aBCDEFG!"));        // ❌{ status: false, error: 'Password must contain atleast a number' }
```
`future versions will improve the phone number builtin validator`.

### **Required**
🔍 Checks if the entry is non-empty 
* if string then is must contain something
* is a number 
```js
import { isRequired } from 'drea'

console.log(isRequired("Some value"));  // ✅ { status: true, error: null }
console.log(isRequired(""));            // ❌ { status: false, error: 'This field is required' }
console.log(isRequired());            // ❌ { status: false, error: 'Entry cannot be null' }
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

*So instead of validating 6 to ... with different `validateEntry()`, with `validateMany()`* 
*you can validate all at once.*

### ❌ Example: One Invalid
```js
import { validateMany } from 'drea'

const username2 = "Fonbless";
const email = "blessfonmtohgmail.com";//missing an @

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
Incase of any invalid entry `validateMany()` returns an array of object(s). Each object comprises of *value* of the entry, *status* and *error* message from *errorMsg*

**Output:**
```js
[ { value: "blessfonmtohgmail.com", status: false, error: "Invalid Email" } ]
```

---


## 🧮 4. Schema-Based Validation with `ClassicModel`
*`ClassicModel` is a builtin description of how data will be organized and validated.*

**Usage**<br>
*1. Create an instance and place as constructor an object(which is the data)*<br>
*2. called .validate() method*

*`ClassicModel` accepts any combination of email, password, username, phonenumber* as entries.*

### ✅ Example: Success
```js
import { ClassicModel } from 'dea'
const cl = new ClassicModel({
  email: "blessfonmtoh@gmail.com",
  password: "Bless01G$",
  username: "Fon Bless",
  phonenumber: "237865373165"
});
console.log(cl.validate());
```
*`ClassicModel()` returns when data found valid an object comprising of **status**,**error*** *which is null and the **data** the object data itself.*

**Output:**
```js
{
  status: true,
  error: null,
  data: {
    username: 'Fon Bless',
    email: 'blessfonmtoh@gmail.com',
    password: 'Bless01G$',
    phonenumber: '237865373165'
  }
}
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
Compare to the `validateEntry()` or any function built ontop of `validateEntry()`, even though
`ClassicModel` also depends on `validateEntry()`, if any invalid entry is found, validation of the other entries **continues** till all entries are tested. Only invalid entries will be returned as we see below.

**Output:**
```js
/*
    entryname:{
        status,
        error,//builtin errormsg for invalid entries
        value//value of keyname
    }
*/
{
  username: {
    status: false,
    error: 'Username must contain between 5 to 40 letters only',
    value: 'Fon'
  },
  email: {
    status: false,
    error: 'Invalid Email address. Email must be of the form xyz@domain.tld',
    value: 'blessfonmtohgmail.com'
  },
  phonenumber: {
    status: false,
    error: 'Phonenumber must be between 4 to 15 digits',
    value: '+237865373165'
  }
}
```
**✅ Fix:** User should have provided a valid email, username and phonenumber.

**Note::** 
 `ClassicModel()` validates based on a builtin `schema_restr_model` schema restriction model.

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
console.log(custom.validate({ name: "Bless", age: 25 }));
```
 
**Output:**
```js
{ status: true, error: null, data: { name: "Bless", age: 25 } }
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

console.log(custom1.validate({ name: "Bless", age: 25 }));

console.log(custom2.validate({ title: "User", message: 'Message..' }));
```
 The return value of `CustomClassicModel()` is same as that of `ClassicModel()`

**Output:**
```js
{ status: true, error: null, data: { name: "Bless", age: 25 } }
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
  age: { status: false, error: "Age must be a number", value: "25" }
}
```
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
{
  error_code: 463,
  error_name: 'IllegalArgument',
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
{
  error_code: 470,
  error_name: 'KeyExistenceError',
  error_description: "Unknown key 'message' not found in schema restrictions"
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
{
  error_code: 442,
  error_name: 'DuplicateKeyError',
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
{
  error_code: 470,
  error_name: 'KeyExistenceError',
  error_description: "Unknown key 'bio' not found in schema restrictions"
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
{
  error_code: 470,
  error_name: 'KeyExistenceError',
  error_description: "Unknown key 'bio' not found in schema restrictions"
}
```
As expected because the 'age' field was not found in the `new_schema_restr_model`.

**✅ Fix:** Always make sure when a `schema_restr_model` is replaced a `new_schema_restr_model` the field names of the data matches or exists in the `new_schema_restr_model`.



**Note**::*`CustomeClassicModel()` is schema-based driven, meaning you can create a `schema_restr_model` and even extend it as you want but in as much as the fields of the data exists in the model they can validated else you may recieve keyname not found in the restr model.*



## 🧮 6. Url Valiadtion with  `URL` <sub>*as of `version 2.x.x`*</sub>

*`URL` is a class that help us check the validity of a url.*

### ✅ Example: Successful
```js
import { URL } from 'drea'

```
 
**Output:**
```js

```




>>>>>>> 430378da2165b2b0040abee842d645349254965f
