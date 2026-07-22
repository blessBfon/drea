import { PureObject } from './types.js';
/**
 * Asserts that `obj` is a plain JavaScript object.
 *
 * Rejects: `null`, `undefined`, arrays, `Date`, `Set`, `Map`,
 * functions, and class instances with custom prototypes.
 *
 * After this function returns (without throwing), TypeScript narrows
 * the type of `obj` to `PureObject`.
 *
 * **Called by:**
 * ```
 * CustomClassicModel constructor  → AssertPlainObject(schema_restr_model, 'schema_restr_model')
 * CustomClassicModel.validate()   → AssertPlainObject(obj, 'obj')
 * CustomClassicModel.nestvalidate → AssertPlainObject(obj, 'obj')
 * CustomClassicModel.extend()     → AssertPlainObject(ext_restr, 'ext_restr')
 * CustomClassicModel.swap()       → AssertPlainObject(new_restr, 'new_restr')
 * AssertOptionalPlainObject       → delegates here when value is not undefined
 * ```
 *
 * @param obj       - The value to assert.
 * @param paramName - Appears in the error description. Defaults to `'value'`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected plain object for '<paramName>', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE  (one per bad type)
 *   - `"Expected plain object for '<paramName>', got array"`
 *   - `"Expected plain object for '<paramName>', got Date"`
 *   - `"Expected plain object for '<paramName>', got Set"`
 *   - `"Expected plain object for '<paramName>', got Map"`
 *   - `"Expected plain object for '<paramName>', got function"`
 *   - `"Expected plain object for '<paramName>', got <typeof obj>"`
 *   - `"Expected plain object for '<paramName>', got class instance or custom prototype"`
 *
 * @example
 * // ✅ Passes silently
 * AssertPlainObject({ name: 'Alice' }, 'schema')
 *
 * @example
 * // ❌ Array
 * AssertPlainObject([{ name: 'Alice' }], 'schema')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected plain object for 'schema', got array" }
 *
 * @example
 * // ❌ null
 * AssertPlainObject(null, 'obj')
 * // throws NullValueError:
 * // { code: 'ERR_NULL_VALUE',
 * //   message: "Expected plain object for 'obj', got null or undefined" }
 *
 * @example
 * // ❌ Class instance
 * class MySchema {}
 * AssertPlainObject(new MySchema(), 'schema')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected plain object for 'schema', got class instance or custom prototype" }
 */
declare function AssertPlainObject(obj: unknown, paramName?: string): asserts obj is PureObject;
/**
 * Asserts that `obj` is either `undefined` (parameter omitted) **or** a plain object.
 * Delegates to {@link AssertPlainObject} for all non-undefined values.
 *
 * **Called by:** `URL.verifyPattern(extra_constraints?)` — constraints are optional.
 *
 * @param obj       - The value to assert. May be `undefined`.
 * @param paramName - Appears in the error description.
 *
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE (same conditions as AssertPlainObject)
 *   Only when `obj !== undefined`.
 *
 * @example
 * // ✅ undefined — passes silently
 * AssertOptionalPlainObject(undefined, 'extra_constraints')
 *
 * @example
 * // ✅ Valid plain object
 * AssertOptionalPlainObject({ allowed_protocols: ['https'] }, 'extra_constraints')
 *
 * @example
 * // ❌ Array passed instead of object
 * AssertOptionalPlainObject(['https'] as any, 'extra_constraints')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected plain object for 'extra_constraints', got array" }
 */
declare function AssertOptionalPlainObject(obj: unknown, paramName?: string): void;
/**
 * Asserts that `value` is a primitive string.
 *
 * After this function returns, TypeScript narrows the type of `value` to `string`.
 *
 * **Called by:**
 * ```
 * isUsernameValid(entry)    → AssertString(entry, 'username')
 * isEmailValid(entry)       → AssertString(entry, 'email')
 * isPhoneNumberValid(entry) → AssertString(entry, 'phonenumber')
 * isPasswordValid(entry)    → AssertString(entry, 'password')
 * isRequired(entry)         → AssertString(entry, 'isRequired entry')
 * AssertNonEmptyString      → delegates here first
 * Normalizer.URL (protocol) → AssertString(protocol, 'protocol')
 * ```
 *
 * @param value     - The value to assert.
 * @param paramName - Appears in the error description. Defaults to `'value'`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string for '<paramName>', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string for '<paramName>', got <typeLabel(value)>"`
 *
 * @example
 * // ✅ Passes
 * AssertString('johndoe', 'username')
 *
 * @example
 * // ❌ Number passed
 * AssertString(42 as any, 'username')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected string for 'username', got number" }
 *
 * @example
 * // ❌ null passed
 * AssertString(null as any, 'email')
 * // throws NullValueError:
 * // { code: 'ERR_NULL_VALUE', message: "Expected string for 'email', got null or undefined" }
 */
declare function AssertString(value: unknown, paramName?: string): asserts value is string;
/**
 * Asserts that `value` is a string **and** non-empty after trimming.
 *
 * Delegates to {@link AssertString} first, then adds the blank-string check.
 * After this function returns, TypeScript narrows the type of `value` to `string`.
 *
 * **Called by:**
 * ```
 * URL constructor          → AssertNonEmptyString(url, 'url')
 * CustomClassicModel.remove→ AssertNonEmptyString(Key, 'Key')
 * Normalizer.URL           → AssertNonEmptyString(url, 'url')
 * ```
 *
 * @param value     - The value to assert.
 * @param paramName - Appears in the error description.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE   (from AssertString)
 *   `"Expected string for '<paramName>', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   - `"Expected string for '<paramName>', got <type>"` (from AssertString)
 *   - `"Expected non-empty string for '<paramName>', got empty string"`
 *
 * @example
 * // ✅ Passes
 * AssertNonEmptyString('bio', 'Key')
 *
 * @example
 * // ❌ Blank string
 * AssertNonEmptyString('   ', 'url')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected non-empty string for 'url', got empty string" }
 *
 * @example
 * // ❌ Number passed
 * AssertNonEmptyString(42 as any, 'Key')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected string for 'Key', got number" }
 */
declare function AssertNonEmptyString(value: unknown, paramName?: string): asserts value is string;
/**
 * Asserts that `value` is a JavaScript array.
 *
 * After this function returns, TypeScript narrows the type of `value` to `unknown[]`.
 *
 * **Called by:**
 * ```
 * AssertValidateManyInput  → AssertArray(schema, 'validateMany input')
 * AssertRuleAndErrorArray  → AssertArray(arr, 'RuleAndError')
 * ```
 *
 * @param value     - The value to assert.
 * @param paramName - Appears in the error description.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected array for '<paramName>', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected array for '<paramName>', got <typeLabel(value)>"`
 *
 * @example
 * // ✅ Passes
 * AssertArray([{ entry: 'x', RuleAndError: [] }], 'validateMany input')
 *
 * @example
 * // ❌ Object passed
 * AssertArray({ entry: 'x' } as any, 'validateMany input')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected array for 'validateMany input', got object" }
 */
declare function AssertArray(value: unknown, paramName?: string): asserts value is unknown[];
/**
 * Asserts that a single `rule` value is a valid drea rule type —
 * a `Function`, a `RegExp`, or the `None` sentinel.
 *
 * When `rule === None`, the assertion passes immediately without further checks.
 *
 * **Called by:** {@link AssertRuleAndErrorArray} — for every element in the array.
 *
 * @param rule  - The rule value to assert.
 * @param index - Position in the parent `RuleAndError` array.
 *   Used in the error description: `"at RuleAndError[<index>].rule"`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected function, RegExp, or None at RuleAndError[<index>].rule, got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected function, RegExp, or None at RuleAndError[<index>].rule, got <typeLabel(rule)>"`
 *
 * @example
 * // ✅ Function rule
 * AssertRule((v: string) => v.length > 4, 0)
 *
 * @example
 * // ✅ RegExp rule
 * AssertRule(/^[A-Za-z]+$/, 1)
 *
 * @example
 * // ✅ None sentinel — skips validation
 * AssertRule(None, 2)
 *
 * @example
 * // ❌ String passed as rule
 * AssertRule('v.length > 4' as any, 0)
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected function, RegExp, or None at RuleAndError[0].rule, got string" }
 */
declare function AssertRule(rule: unknown, index: number): void;
/**
 * Asserts that `arr` is a well-formed `RuleAndError` array.
 *
 * A valid array:
 * - Is an array (not null, not a plain object)
 * - Contains at least one element
 * - Every element is a plain object with both `rule` and `errorMsg` keys
 * - Every `rule` passes {@link AssertRule} (`Function`, `RegExp`, or `None`)
 *
 * `errorMsg` is **intentionally not type-checked** — drea allows any value.
 *
 * **Called by:**
 * ```
 * validateEntry()         → AssertRuleAndErrorArray(RuleAndError)
 * AssertValidateEntryInput→ delegates here
 * ```
 *
 * @param arr - The `RuleAndError` value to assert.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   - When `arr` is null/undefined
 *   - When an element is null/undefined
 *   - When a `rule` is null/undefined (via AssertRule)
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   - `"Expected array for 'RuleAndError', got <type>"`
 *   - `"Expected non-empty array for 'RuleAndError', got empty array"`
 *   - `"Expected plain object at RuleAndError[<i>], got <type>"`
 * @throws {MissingKeyError}   code: ERR_MISSING_KEY
 *   - `"Missing 'rule' property at RuleAndError[<i>]"`
 *   - `"Missing 'errorMsg' property at RuleAndError[<i>]"`
 *
 * @example
 * // ✅ Passes
 * AssertRuleAndErrorArray([
 *   { rule: (v: string) => v.length > 4, errorMsg: 'Too short' },
 *   { rule: /^[A-Z]/,                    errorMsg: 'Must start uppercase' }
 * ])
 *
 * @example
 * // ❌ Empty array
 * AssertRuleAndErrorArray([])
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected non-empty array for 'RuleAndError', got empty array" }
 *
 * @example
 * // ❌ Missing 'rule' key
 * AssertRuleAndErrorArray([{ errorMsg: 'oops' }] as any)
 * // throws MissingKeyError:
 * // { code: 'ERR_MISSING_KEY',
 * //   message: "Missing 'rule' property at RuleAndError[0]" }
 */
declare function AssertRuleAndErrorArray(arr: unknown): void;
/**
 * Asserts that the argument passed to `validateEntry()` is fully well-formed.
 *
 * Checks in order:
 * 1. `input` is a plain object ({@link AssertPlainObject})
 * 2. `input.entry` key exists
 * 3. `input.RuleAndError` key exists
 * 4. `input.RuleAndError` is valid ({@link AssertRuleAndErrorArray})
 *
 * **Called by:** {@link AssertValidateManyInput} — for every element.
 *
 * @param input - The argument passed to `validateEntry()`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 * @throws {MissingKeyError}   code: ERR_MISSING_KEY
 *   - `"Missing 'entry' property in validateEntry input object"`
 *   - `"Missing 'RuleAndError' property in validateEntry input object"`
 *
 * @example
 * // ✅ Passes
 * AssertValidateEntryInput({
 *   entry: 'john',
 *   RuleAndError: [{ rule: (v: string) => v.length > 3, errorMsg: 'Short' }]
 * })
 *
 * @example
 * // ❌ Missing 'entry' key
 * AssertValidateEntryInput({
 *   RuleAndError: [{ rule: (v: string) => v.length > 3, errorMsg: 'Short' }]
 * } as any)
 * // throws MissingKeyError:
 * // { code: 'ERR_MISSING_KEY',
 * //   message: "Missing 'entry' property in validateEntry input object" }
 */
declare function AssertValidateEntryInput(input: unknown): void;
/**
 * Asserts that the argument passed to `validateMany()` is a non-empty array
 * of fully well-formed `validateEntry` input objects.
 *
 * Runs {@link AssertValidateEntryInput} on every element. When an element fails,
 * the element's index is prepended to the description so the caller knows exactly
 * which entry caused the issue.
 *
 * **Called by:** `validateMany(schema)`.
 *
 * @param arr - The argument passed to `validateMany()`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected array for 'validateMany input', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   - `"Expected array for 'validateMany input', got <type>"`
 *   - `"Expected non-empty array for 'validateMany input', got empty array"`
 *   - `"At validateMany[<i>]: <original description>"`
 * @throws {MissingKeyError}   code: ERR_MISSING_KEY
 *   `"At validateMany[<i>]: <original description>"`
 *
 * @example
 * // ✅ Passes
 * AssertValidateManyInput([
 *   { entry: 'john', RuleAndError: [{ rule: (v: string) => v.length > 3, errorMsg: 'Short' }] }
 * ])
 *
 * @example
 * // ❌ Second element missing RuleAndError
 * AssertValidateManyInput([
 *   { entry: 'john', RuleAndError: [{ rule: (v: string) => v.length > 3, errorMsg: 'Short' }] },
 *   { entry: 42 } as any
 * ])
 * // throws MissingKeyError:
 * // { code: 'ERR_MISSING_KEY',
 * //   message: "At validateMany[1]: Missing 'RuleAndError' property in validateEntry input object" }
 *
 * @example
 * // ❌ Empty array
 * AssertValidateManyInput([])
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected non-empty array for 'validateMany input', got empty array" }
 */
declare function AssertValidateManyInput(arr: unknown): void;
/**
 * Asserts that `value` is a string **or** a number.
 *
 * This is the only guard that accepts two types. It exists for use cases
 * where both strings and numbers are valid inputs (e.g. a hypothetical
 * extended `isRequired` that accepts numbers). It is exported for
 * completeness and external use.
 *
 * After this function returns, TypeScript narrows `value` to `string | number`.
 *
 * @param value     - The value to assert.
 * @param paramName - Appears in the error description. Defaults to `'value'`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string or number for '<paramName>', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string or number for '<paramName>', got <typeLabel(value)>"`
 *
 * @example
 * // ✅ String
 * AssertStringOrNumber('hello', 'field')
 *
 * @example
 * // ✅ Number
 * AssertStringOrNumber(42, 'field')
 *
 * @example
 * // ❌ Boolean
 * AssertStringOrNumber(true as any, 'field')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected string or number for 'field', got boolean" }
 *
 * @example
 * // ❌ null
 * AssertStringOrNumber(null as any, 'field')
 * // throws NullValueError:
 * // { code: 'ERR_NULL_VALUE',
 * //   message: "Expected string or number for 'field', got null or undefined" }
 */
declare function AssertStringOrNumber(value: unknown, paramName?: string): asserts value is string | number;
/**
 * Asserts that `v` is a genuine `File` instance.
 *
 * After this function returns, TypeScript narrows the type of `v` to `File`.
 *
 * This guard runs as the very first action inside {@link __File}, ensuring
 * the file wrapper is never created around a non-file value. This protects
 * `nestvalidate` rule functions from receiving unexpected types when they
 * access `v instanceof File`, `v.type`, `v.size`, `v.name`, or any other
 * `File`-specific property.
 *
 * **Called by:** `__File(v)` — `AssertDreaFile(v, 'v')`
 *
 * @param v         - The value to assert.
 * @param paramName - Appears in the error description. Defaults to `'value'`.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected File instance for '<paramName>', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected File instance for '<paramName>', got <type>"`
 *
 * @remarks
 * `File` is a DOM global (`lib: ["DOM"]` in `tsconfig.json`). In Node.js
 * environments it is available from v20 onward. For earlier Node.js versions,
 * use a polyfill such as `formdata-node` and include its types.
 *
 * @example
 * // ✅ Passes — real File instance
 * AssertDreaFile(new File([''], 'avatar.png', { type: 'image/png' }), 'v')
 *
 * @example
 * // ❌ String passed
 * AssertDreaFile('path/to/file.png', 'v')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected File instance for 'v', got string" }
 *
 * @example
 * // ❌ Plain object passed (e.g. a Multer file object from Node.js)
 * AssertDreaFile({ fieldname: 'avatar', originalname: 'photo.png', size: 1024 }, 'v')
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected File instance for 'v', got object" }
 *
 * @example
 * // ❌ null passed
 * AssertDreaFile(null, 'v')
 * // throws NullValueError:
 * // { code: 'ERR_NULL_VALUE',
 * //   message: "Expected File instance for 'v', got null or undefined" }
 */
declare function AssertDreaFile(v: unknown, paramName?: string): asserts v is File;
declare function AssertMayDreaFile(v: unknown, paramName?: string): asserts v is File | null;
export { AssertPlainObject, AssertOptionalPlainObject, AssertString, AssertNonEmptyString, AssertArray, AssertRule, AssertRuleAndErrorArray, AssertValidateEntryInput, AssertValidateManyInput, AssertStringOrNumber, AssertDreaFile, AssertMayDreaFile };
//# sourceMappingURL=guard.d.ts.map