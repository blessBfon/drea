
### `nestvalidate()`

Recursively validates data objects with arbitrarily deep nesting. The error tree mirrors your data's shape exactly.

- **Unknown key at any depth** → `UnknownKeyError` thrown immediately (hard stop)
- **Nested object** → recurses one level deeper
- **Leaf value** → checked against rules and **collected**, so all failures are visible in one result

```typescript
// ✅ 1-level nesting
const model = new CustomClassicModel({
  student: {
    name: { rule: (v: string) => v.length > 4, errorMsg: 'Name is too short' },
    age:  { rule: (v: number) => v >= 18,      errorMsg: 'Must be above 18yrs' }
  }
})
model.nestvalidate({ student: { name: 'Bobby', age: 21 } })
// => { status: true, error: null, data: { student: { name: 'Bobby', age: 21 } } }

// ❌ Leaf fails — error tree mirrors data shape
model.nestvalidate({ student: { name: 'fon', age: 18 } })
// => {
//   status: false,
//   error: { student: { name: { status: false, error: 'Name is too short', value: 'fon' } } },
//   data: null
// }
```

**Level-2 deep nesting:**

```typescript
const m2 = new CustomClassicModel({
  company: {
    name: { rule: (v: string) => v.length > 2, errorMsg: 'Too short' },
    address: {
      city: { rule: (v: string) => v.length > 0,       errorMsg: 'City required' },
      zip:  { rule: (v: string) => /^\d{5}$/.test(v),  errorMsg: 'Zip must be 5 digits' }
    }
  }
})

// ❌ zip fails — error at result.error.company.address.zip
m2.nestvalidate({ company: { name: 'Acme', address: { city: 'Springfield', zip: 'ABCDE' } } })
// => { status: false, error: { company: { address: { zip: { status: false, error: 'Zip must be 5 digits', value: 'ABCDE' } } } }, data: null }
```

---

