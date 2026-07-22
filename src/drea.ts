/*
 * drea Validation Library
 * Author: Bless B.
 * Version: 4.0.0
 * Description: Lightweight schema-based validation and normalisation system for Javascript and TypeScript.
 * License: MIT
 *
 * Guard call map — every public surface and its first-line guard:
 *
 *   URL constructor(url)              → AssertNonEmptyString(url, 'url')
 *   URL.verifyPattern(constraints?)   → AssertOptionalPlainObject(extra_constraints, 'extra_constraints')
 *   validateEntry({entry,RuleAndError})→ AssertRuleAndErrorArray(RuleAndError)
 *   isUsernameValid(entry)            → AssertString(entry, 'username')
 *   isEmailValid(entry)               → AssertString(entry, 'email')
 *   isPhoneNumberValid(entry)         → AssertString(entry, 'phonenumber')
 *   isPasswordValid(entry)            → AssertString(entry, 'password')
 *   isRequired(entry)                 → AssertString(entry, 'isRequired entry')
 *   validateMany(schema)              → AssertValidateManyInput(schema)
 *   Normalizer.URL(url, protocol?)    → AssertNonEmptyString(url, 'url')
 *                                        AssertString(protocol, 'protocol') [if present]
 *   CustomClassicModel(schema)        → AssertPlainObject(schema_restr_model, 'schema_restr_model')
 *   CustomClassicModel.validate(obj)  → AssertPlainObject(obj, 'obj')
 *   CustomClassicModel.nestvalidate() → AssertPlainObject(obj, 'obj')
 *   CustomClassicModel.extend(ext)    → AssertPlainObject(ext_restr, 'ext_restr')
 *   CustomClassicModel.remove(key)    → AssertNonEmptyString(Key, 'Key')
 *   CustomClassicModel.swap(restr)    → AssertPlainObject(new_restr, 'new_restr')
 *
 * All guards are defined at the bottom of this file.
 * To move them, cut everything below the "GUARD FUNCTIONS" banner
 * and paste into ./utils.ts, then import them here.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────────────────────

// AssertPlainObject is NO LONGER imported from Utilities —
// it is defined at the bottom of this file alongside the other guards.
import {
    CheckWithConstraints,
    CheckForDuplicates,
    removeK,
    CheckForRuleAndError,
    StrictEmail,
    isDreaFile,
    hasNest
} from './utils.js'

import{
      AssertPlainObject,
    AssertOptionalPlainObject,
    AssertString,
    AssertNonEmptyString,
    AssertArray,
    AssertRule,
    AssertRuleAndErrorArray,
    AssertValidateEntryInput,
    AssertValidateManyInput,
    AssertStringOrNumber
} from './guard.js'

import{
    ArgumentTypeError,
    NullValueError,
    UnknownKeyError,
    MissingKeyError,
    DuplicateKeyError,
    ValidationError
} from './errors.js'

import {
    Err,
    None,
    ExtraConstraints,
    ValidateEntry_r,
    ValidateEntry_p,
    RuleAndError_t,
    ValidateMany_r,
    SchemaRestriction,
    ModelErrorObj,
    ModelResultObj,
    PureObject,
    DreaFileWrapper,
    MayDreaFileWrapper,
} from './types.js'



// ─────────────────────────────────────────────────────────────────────────────
// URL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Structural URL / URI pattern validator.
 *
 * Validates a URL against a base regex pattern and an optional set of
 * constraint rules (protocol, domain, port, path, fragment, query, length).
 *
 * ⚠️ **This validator checks structural pattern only.** It does not verify DNS
 * records, domain ownership, reachability, or safety. Always combine with
 * reputation services, DNS checks, and allow/deny-lists in production.
 *
 * @class URL
 *
 * @example
 * // Pattern-only (structural check)
 * new URL('http://example.com').verifyPattern() // true
 *
 * @example
 * // With restriction constraints (recommended)
 * new URL('http://support.find.com:443///?draz=1#soccer').verifyPattern({
 *   allowed_protocols: ['http', 'https'],
 *   contain_fragment:  true,
 *   contain_query:     true,
 *   allowed_ports:     ['443', '80'],
 *   allowed_domains:   ['support.find.com', 'find.com', 'google.com'],
 *   contain_path:      false,
 *   between:           [40]
 * }) // true
 */
class URL {
    url: string
    /** @private Base regex — matches any structurally valid URI / URL */
    major_url_regex = /\b(?:[a-zA-Z][a-zA-Z0-9+.-]*):\/{2}?(?:[^\s\$.?#].[^\s]*)\b/

    /**
     * Creates a new URL validator instance.
     *
     * **Guard:** `AssertNonEmptyString(url, 'url')` runs first —
     * rejects non-strings, empty/whitespace-only strings, and null/undefined
     * before any regex is applied.
     *
     * @param {string} url - The URL string to validate. Must be a non-empty string.
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected string for 'url', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   - `"Expected string for 'url', got <type>"`
     *   - `"Expected non-empty string for 'url', got empty string"`
     *
     * @example
     * // ✅ Valid
     * new URL('https://example.com')
     *
     * @example
     * // 🛡️ Guard — number passed
     * new URL(42 as any)
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected string for 'url', got number" }
     *
     * @example
     * // 🛡️ Guard — empty string
     * new URL('   ')
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected non-empty string for 'url', got empty string" }
     */
    constructor(url: string) {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertNonEmptyString(url, 'url')
        // ─────────────────────────────────────────────────────────────────
        this.url = url.toLowerCase().trim()
    }

    /**
     * Verifies the URL against the base pattern and optional constraint rules.
     *
     * When `extra_constraints` is omitted, `null`, or an empty object,
     * only the base URL pattern is checked. When constraints are provided,
     * the URL must satisfy every specified constraint in addition to the
     * base pattern.
     *
     * **Guard:** `AssertOptionalPlainObject(extra_constraints, 'extra_constraints')` —
     * `extra_constraints` is optional (undefined is allowed), but if provided
     * it must be a plain object.
     *
     * @param {ExtraConstraints} [extra_constraints] - Optional constraint rules.
     *
     * @param {string[]}  [extra_constraints.allowed_protocols] - Accepted schemes (e.g. `['http','https']`)
     * @param {boolean}   [extra_constraints.contain_fragment]  - Require (`true`) or forbid (`false`) `#fragment`
     * @param {boolean}   [extra_constraints.contain_query]     - Require (`true`) or forbid (`false`) `?query`
     * @param {string[]}  [extra_constraints.allowed_ports]     - Accepted port numbers (URL must carry a port)
     * @param {number[]}  [extra_constraints.between]           - `[min]` or `[min, max]` character length
     * @param {string[]}  [extra_constraints.allowed_domains]   - Whitelisted domains (case-insensitive)
     * @param {boolean}   [extra_constraints.contain_path]      - Require (`true`) or forbid (`false`) path segments
     *
     * @returns {boolean} `true` when the URL matches the base pattern and all constraints.
     *
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   `"Expected plain object for 'extra_constraints', got <type>"`
     *   (only when a non-plain-object, non-undefined value is passed)
     *
     * @example
     * // ✅ No constraints — pattern only
     * new URL('http://example.com').verifyPattern() // true
     *
     * @example
     * // ✅ With constraints
     * new URL('https://api.example.com').verifyPattern({
     *   allowed_protocols: ['https'],
     *   allowed_domains: ['api.example.com']
     * }) // true
     *
     * @example
     * // ❌ Pattern does not match
     * new URL('not-a-url').verifyPattern() // false
     *
     * @example
     * // 🛡️ Guard — array passed as constraints
     * new URL('https://example.com').verifyPattern(['https'] as any)
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE',
     * //   message: "Expected plain object for 'extra_constraints', got array" }
     */
    verifyPattern(extra_constraints?: ExtraConstraints): boolean {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertOptionalPlainObject(extra_constraints, 'extra_constraints')
        // ─────────────────────────────────────────────────────────────────

        if (extra_constraints === null || extra_constraints === undefined) {
            return this.major_url_regex.test(this.url)
        }

        if (Object.keys(extra_constraints).length < 1) {
            return this.major_url_regex.test(this.url)
        }

        if (this.major_url_regex.test(this.url)) {
            try {
                return CheckWithConstraints(this.url, extra_constraints)
            } catch (error) {
                throw error
            }
        }

        return false
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// validateEntry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates a single value against one or more `{rule, errorMsg}` pairs.
 *
 * Rules are evaluated **in order**. Validation stops at the first failure —
 * subsequent rules in the same array are not evaluated. This lets you
 * front-load cheap checks (type, null) before expensive ones (regex, async).
 *
 * **Guard:** `AssertRuleAndErrorArray(RuleAndError)` — confirms every element
 * of the rule array is a plain object with a `rule` (`Function | RegExp | None`)
 * and an `errorMsg` key before any rule is run against the entry.
 *
 * @param {{ entry: any, RuleAndError: RuleAndError_t[] }} param0
 * @param {*}              param0.entry        The value to validate.
 *   Accepts any type — string, number, array, object, function output.
 *   Must not be the `None` sentinel.
 * @param {RuleAndError_t[]} param0.RuleAndError Ordered array of `{rule, errorMsg}` objects.
 *   `rule` is a `Function` (must return `boolean`), `RegExp` (entry must be string),
 *   or `None` (always passes). `errorMsg` can be any type.
 *
 * @returns {ValidateEntry_r} `{ status: true, error: null }` when all rules pass.
 *   `{ status: false, error: <errorMsg> }` at the first failing rule.
 *
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   - `"entry cannot be of None type."` — `None` passed as the entry itself
 *   - `"Entry must be a string when using a RegExp rule."` — non-string entry with a RegExp rule
 *   - `"Rule '<fn>' function must return a boolean value."` — rule function returns non-boolean
 *   - Guard errors from {@link AssertRuleAndErrorArray} (malformed rule array)
 *
 * @example
 * // ✅ Valid entry
 * validateEntry({
 *   entry: 'JohnDoe',
 *   RuleAndError: [{ rule: (v) => typeof v === 'string', errorMsg: 'Must be a string' }]
 * })
 * // => { status: true, error: null }
 *
 * @example
 * // ❌ Rule fails
 * validateEntry({
 *   entry: 17,
 *   RuleAndError: [
 *     { rule: (v: number) => typeof v === 'number', errorMsg: 'Must be a number' },
 *     { rule: (v: number) => v >= 18,               errorMsg: 'Must be 18 or above' }
 *   ]
 * })
 * // rule 1 ✅   rule 2 ❌ — stops here
 * // => { status: false, error: 'Must be 18 or above' }
 *
 * @example
 * // 🛡️ Guard — malformed rule (string instead of function)
 * validateEntry({
 *   entry: 'Alice',
 *   RuleAndError: [{ rule: 'v.length > 3' as any, errorMsg: 'Too short' }]
 * })
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected function, RegExp, or None at RuleAndError[0].rule, got string" }
 */
const validateEntry = ({ entry, RuleAndError = [] }: ValidateEntry_p): ValidateEntry_r => {
    // ── Guard ─────────────────────────────────────────────────────────────
     AssertValidateEntryInput({ entry, RuleAndError })
    // ─────────────────────────────────────────────────────────────────────

    try {
        // Runtime safe guard — entry can never be None
        if (entry === None) {
            throw new ArgumentTypeError({
                error_code: 'ERR_INVALID_ARGTYPE',
                error_description: 'entry cannot be of None type.'
            })
        }

        if (typeof entry === 'function') {
            entry = entry()
        }

                //If the entry is passed as a function 
        if(typeof entry === 'function'){
           // An argument to __File or __mayFile wrapper then it will be extracted
            if( (entry as DreaFileWrapper).__isDreaFile || 
             (entry as MayDreaFileWrapper).__isDreaMayFile  ){
                entry = entry()
            }
        }  //[Would be simplified later]


        for (const { rule, errorMsg } of RuleAndError) {
            let isInputValid = false

            if (rule instanceof RegExp) {
                if (typeof entry === 'string') {
                    isInputValid = rule.test(entry)
                } else {
                    throw new ArgumentTypeError({
                        error_code: 'ERR_INVALID_ARGTYPE',
                        error_description: 'Entry must be a string when using a RegExp rule.'
                    })
                }
            } else if (typeof rule === 'function') {
                if (typeof rule(entry) === 'boolean') {
                    isInputValid = rule(entry)
                } else {
                    throw new ArgumentTypeError({
                        error_code: 'ERR_INVALID_ARGTYPE',
                        error_description: `Rule '${rule}' function must return a boolean value.`
                    })
                }
            } else if (rule === None) {
                isInputValid = true
            } else {
                isInputValid = false
            }

            if (isInputValid === false) {
                return { status: false, error: errorMsg }
            }
        }

        return { status: true, error: null }
    } catch (error) {
        throw error
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// Built-in Validators
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates a username against drea's built-in username rules.
 *
 * Checks (in order — stops at first failure):
 * 1. Letters only (a-z, A-Z, hyphens, and spaces via `/^[A-Za-z\s-]+$/`)
 * 2. Minimum length of 5 characters
 * 3. Maximum length of 35 characters
 *
 * **Guard:** `AssertString(entry, 'username')` — rejects non-strings and
 * null/undefined before any rule runs.
 *
 * @param {string} entry - The username to validate.
 *
 * @returns {ValidateEntry_r}
 *   `{ status: true, error: null }` on success.
 *   `{ status: false, error: string }` on the first failing rule.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string for 'username', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string for 'username', got <type>"`
 *
 * @example
 * isUsernameValid('JohnDoe') // ✅ { status: true,  error: null }
 * isUsernameValid('F!')      // ❌ { status: false, error: 'Username must contain only letters' }
 * isUsernameValid('dan')     // ❌ { status: false, error: 'Username is too small' }
 * isUsernameValid(42 as any) // 🛡️ throws ArgumentTypeError
 */
const isUsernameValid = (entry: string): ValidateEntry_r => {
    // ── Guard ─────────────────────────────────────────────────────────────
    AssertString(entry, 'username')
    // ─────────────────────────────────────────────────────────────────────

    const RuleAndError: RuleAndError_t[] = [
        { rule: /^[A-Za-z\s-]+$/, errorMsg: 'Username must contain only letters' },
        { rule: /^.{5,}$/,        errorMsg: 'Username is too small' },
        { rule: /^.{5,35}$/,      errorMsg: 'Username is too long' }
    ]

    return validateEntry({ entry, RuleAndError })
}

/**
 * Validates an email address against drea's built-in `StrictEmail` pattern.
 *
 * **Guard:** `AssertString(entry, 'email')`.
 *
 * @param {string} entry - The email address to validate.
 *
 * @returns {ValidateEntry_r}
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string for 'email', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string for 'email', got <type>"`
 *
 * @example
 * isEmailValid('test@example.com') // ✅ { status: true,  error: null }
 * isEmailValid('test@com')         // ❌ { status: false, error: 'Invalid Email address' }
 * isEmailValid(null as any)        // 🛡️ throws NullValueError
 */
const isEmailValid = (entry: string): ValidateEntry_r => {
    // ── Guard ─────────────────────────────────────────────────────────────
    AssertString(entry, 'email')
    // ─────────────────────────────────────────────────────────────────────

    const RuleAndError: RuleAndError_t[] = [
        { rule: StrictEmail, errorMsg: 'Invalid Email address' }
    ]

    return validateEntry({ entry, RuleAndError })
}

/**
 * Validates a phone number against drea's built-in rules.
 *
 * Checks (in order):
 * 1. Digits only — no `+` prefix, no spaces (`/^[0-9]+$/`)
 * 2. Minimum length of 3 digits
 * 3. Maximum length of 12 digits
 *
 * **Guard:** `AssertString(entry, 'phonenumber')`.
 *
 * @param {string} entry - The phone number (digits only, omit the `+`).
 *
 * @returns {ValidateEntry_r}
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string for 'phonenumber', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string for 'phonenumber', got <type>"`
 *
 * @example
 * isPhoneNumberValid('237653793493')  // ✅ { status: true,  error: null }
 * isPhoneNumberValid('+237653793493') // ❌ { status: false, error: 'Phone number must contain only digits' }
 * isPhoneNumberValid('23')            // ❌ { status: false, error: 'Phone number is too small' }
 * isPhoneNumberValid(237 as any)      // 🛡️ throws ArgumentTypeError
 */
const isPhoneNumberValid = (entry: string): ValidateEntry_r => {
    // ── Guard ─────────────────────────────────────────────────────────────
    AssertString(entry, 'phonenumber')
    // ─────────────────────────────────────────────────────────────────────

    const RuleAndError: RuleAndError_t[] = [
        { rule: /^[0-9]+$/,   errorMsg: 'Phone number must contain only digits' },
        { rule: /^.{3,}$/,    errorMsg: 'Phone number is too small' },
        { rule: /^.{3,12}$/,  errorMsg: 'Phone number is too long' }
    ]

    return validateEntry({ entry, RuleAndError })
}

/**
 * Validates a password against drea's built-in strength rules.
 *
 * Checks (in order — stops at first failure):
 * 1. Minimum length of 8 characters
 * 2. At least one uppercase letter
 * 3. At least one lowercase letter
 * 4. At least one digit
 * 5. At least one special character from `?@!#$%&*` or whitespace
 *
 * **Guard:** `AssertString(entry, 'password')`.
 *
 * @param {string} entry - The password to validate.
 *
 * @returns {ValidateEntry_r}
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string for 'password', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string for 'password', got <type>"`
 *
 * @example
 * isPasswordValid('Abcdef1!') // ✅ { status: true,  error: null }
 * isPasswordValid('abcdef1!') // ❌ { status: false, error: 'Password must contain atleast an uppercase letter' }
 * isPasswordValid(true as any)// 🛡️ throws ArgumentTypeError
 */
const isPasswordValid = (entry: string): ValidateEntry_r => {
    // ── Guard ─────────────────────────────────────────────────────────────
    AssertString(entry, 'password')
    // ─────────────────────────────────────────────────────────────────────

    const RuleAndError: RuleAndError_t[] = [
        { rule: /^.{8,}$/,       errorMsg: 'Password must be atleast 8 characters long' },
        { rule: /[A-Z]/,         errorMsg: 'Password must contain atleast an uppercase letter' },
        { rule: /[a-z]/,         errorMsg: 'Password must contain atleast a lowercase letter' },
        { rule: /[0-9]/,         errorMsg: 'Password must contain atleast a number' },
        { rule: /[?@!#$%&*\s]/,  errorMsg: 'Password must contain atleast a symbol' }
    ]

    return validateEntry({ entry, RuleAndError })
}

/**
 * Checks that a string entry is non-empty (required field check).
 *
 * **Guard:** `AssertString(entry, 'isRequired entry')` — rejects non-strings,
 * null, and undefined before the rule runs.
 *
 * @param {string} entry - The value to check for presence.
 *
 * @returns {ValidateEntry_r}
 *   `{ status: true,  error: null }` when non-empty.
 *   `{ status: false, error: 'This field is required' }` when empty/blank.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected string for 'isRequired entry', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected string for 'isRequired entry', got <type>"`
 *
 * @example
 * isRequired('Some value') // ✅ { status: true,  error: null }
 * isRequired('')           // ❌ { status: false, error: 'This field is required' }
 * isRequired(1 as any)     // 🛡️ throws ArgumentTypeError (string only — use validateEntry for numbers)
 */
const isRequired = (entry: string): ValidateEntry_r => {
    // ── Guard ─────────────────────────────────────────────────────────────
    AssertString(entry, 'isRequired entry')
    // ─────────────────────────────────────────────────────────────────────

    const RuleAndError: RuleAndError_t[] = [
        {
            rule: (val: string) => val != null && String(val).trim() !== '',
            errorMsg: 'This field is required'
        }
    ]

    return validateEntry({ entry, RuleAndError })
}


// ─────────────────────────────────────────────────────────────────────────────
// validateMany
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates multiple entries in a single pass.
 *
 * Equivalent to calling `validateEntry()` for each element of the array.
 * All entries are evaluated regardless of whether earlier ones fail, so the
 * returned array is a complete per-entry failure report (unlike `validateEntry`
 * which stops at the first failing rule within a single field).
 *
 * **Guard:** `AssertValidateManyInput(schema)` runs first — confirms the
 * outer argument is a non-empty array, then runs `AssertValidateEntryInput`
 * on every element. If an element fails, its index is prepended to the
 * error description so the caller knows exactly which entry caused the issue.
 *
 * @param {ValidateEntry_p[]} schema - Array of `validateEntry`-shaped input objects.
 *
 * @returns {ValidateMany_r[] | []}
 *   `[]` (empty array) when every entry passes.
 *   An array of `{ value, status: false, error }` objects — one per failing entry.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected array for 'validateMany input', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   - `"Expected array for 'validateMany input', got <type>"`
 *   - `"Expected non-empty array for 'validateMany input', got empty array"`
 *   - `"At validateMany[<i>]: <original description>"` — element-level failure
 * @throws {MissingKeyError}   code: ERR_MISSING_KEY
 *   `"At validateMany[<i>]: <original description>"`
 *
 * @example
 * // ✅ All valid — returns empty array
 * validateMany([
 *   { entry: 'johndoe',          RuleAndError: [{ rule: (v: string) => v.length >= 5, errorMsg: 'Too short' }] },
 *   { entry: 'john@example.com', RuleAndError: [{ rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMsg: 'Bad email' }] }
 * ])
 * // => []
 *
 * @example
 * // ❌ One fails
 * validateMany([
 *   { entry: 'johndoe',       RuleAndError: [{ rule: (v: string) => v.length >= 5, errorMsg: 'Too short' }] },
 *   { entry: 'johndoegmail.com', RuleAndError: [{ rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMsg: 'Bad email' }] }
 * ])
 * // => [{ value: 'johndoegmail.com', status: false, error: 'Bad email' }]
 *
 * @example
 * // 🛡️ Guard — missing RuleAndError on second element
 * validateMany([
 *   { entry: 'john', RuleAndError: [{ rule: (v: string) => v.length > 3, errorMsg: 'Short' }] },
 *   { entry: 42 } as any
 * ])
 * // throws MissingKeyError:
 * // { code: 'ERR_MISSING_KEY',
 * //   message: "At validateMany[1]: Missing 'RuleAndError' property in validateEntry input object" }
 */
const validateMany = (schema: ValidateEntry_p[]): ValidateMany_r[] | [] => {
    // ── Guard ─────────────────────────────────────────────────────────────
    AssertValidateManyInput(schema)
    // ─────────────────────────────────────────────────────────────────────

    const InvalidArray: ValidateMany_r[] = []

    try {
        for (const { entry, RuleAndError = [] } of schema) {
            const { status, error } = validateEntry({ entry, RuleAndError })
            if (!status) {
                InvalidArray.push({ value: entry, status, error })
            }
        }

        return InvalidArray
    } catch (error: any) {
        if (
            error.code === 'ERR_UNKNOWN_KEY' ||
            error.code === 'ERR_INVALID_ARGTYPE' ||
            error.code === 'ERR_NULL_VALUE'
        ) {
            throw error
        } else {
            throw new ValidationError({
                error_code: 'ERR_VALIDATION',
                error_description: error.message
            })
        }
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// Normalizer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Static collection of input normalisation utilities.
 *
 * All static methods are pure — they do not mutate the original value.
 * Most methods silently pass through non-string inputs without throwing
 * (they apply the transformation only when the type is correct), except
 * `toNumber`, `toString`, and `URL` which apply universally or have
 * dedicated guards.
 *
 * @class Normalizer
 */
class Normalizer {
    constructor() { }

    /** Trims leading/trailing whitespace. No-op for non-strings. */
    static trim(value: string): string {
        return typeof value === 'string' ? value.trim() : value
    }

    /** Converts to lowercase. No-op for non-strings. */
    static lowercase(value: string): string {
        return typeof value === 'string' ? value.toLowerCase() : value
    }

    /** Converts to uppercase. No-op for non-strings. */
    static uppercase(value: string): string {
        return typeof value === 'string' ? value.toUpperCase() : value
    }

    /** Coerces value to number via `Number()`. */
    static toNumber(value: string): number {
        return Number(value)
    }

    /** Coerces value to string via `String()`. */
    static toString(value: string | number): string {
        return String(value)
    }

    /** Removes all whitespace characters from a string. No-op for non-strings. */
    static removeSpaces(value: string): string {
        return typeof value === 'string' ? value.replace(/\s+/g, '') : value
    }

    /**
     * Normalises a URL to a canonical `protocol://domain.tld[/path...]` shape.
     *
     * - Strips `www.` and replaces it with the given (or default `https://`) protocol.
     * - Removes port numbers while preserving the rest of the URL.
     * - Validates the resulting shape via the `URL` class before returning.
     *
     * ⚠️ **Current limitations:** does not resolve dot-segments, collapse multiple
     * slashes, normalise percent-encoding, or handle `user:pass@host` authority.
     *
     * **Guards:**
     * - `AssertNonEmptyString(url, 'url')` — url must be a non-empty string.
     * - `AssertString(protocol, 'protocol')` — only when protocol is provided.
     *
     * @param {string}  url       - The URL string to normalise.
     * @param {string} [protocol] - Optional protocol override (e.g. `'http'`, `'ftp'`).
     *   Defaults to `'https'` when omitted.
     *
     * @returns `{ status: true, url: string }` on success.
     *   `{ status: false, url: string }` or `{ status: false, error: string }` on failure.
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected string for 'url', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   - `"Expected non-empty string for 'url', got empty string"`
     *   - `"Expected string for 'protocol', got <type>"`
     *
     * @example
     * Normalizer.URL('www.example.com')
     * // => { status: true, url: 'https://example.com' }
     *
     * @example
     * Normalizer.URL('www.example.com', 'http')
     * // => { status: true, url: 'http://example.com' }
     *
     * @example
     * Normalizer.URL(null as any)
     * // 🛡️ throws NullValueError:
     * // { code: 'ERR_NULL_VALUE', message: "Expected string for 'url', got null or undefined" }
     */
    static URL(url: string, protocol?: string) {
        // ── Guards ────────────────────────────────────────────────────────
        AssertNonEmptyString(url, 'url')
        if (protocol !== undefined) AssertString(protocol, 'protocol')
        // ─────────────────────────────────────────────────────────────────

        url = url.toLowerCase().trim()
        protocol = protocol?.toLowerCase().trim()

        let splitted_value = url.split(':')

        if (splitted_value.length === 3 || splitted_value.length === 2) {
            url =
                splitted_value.length === 3
                    ? splitted_value[0] + ':' + splitted_value[1]
                    : splitted_value[0]

            let indexOf_first_slash_after_port: number | null = null
            if (splitted_value.length === 3) {
                indexOf_first_slash_after_port = splitted_value[2].indexOf('/')
                url = url + splitted_value[2].slice(indexOf_first_slash_after_port)
            } else {
                indexOf_first_slash_after_port = splitted_value[1].indexOf('/')
                url = url + splitted_value[1].slice(indexOf_first_slash_after_port)
            }

            splitted_value = url.split(':')
        }

        if (splitted_value.length === 2) {
            if (url.startsWith(splitted_value[0] + '://www.', 0)) {
                url = url.replace(`${splitted_value[0]}://www.`, `${splitted_value[0]}://`)
                return new URL(url).verifyPattern()
                    ? { status: true, url }
                    : { status: false, url: 'Url pattern not valid' }
            } else if (url.startsWith(splitted_value[0] + '://', 0)) {
                return new URL(url).verifyPattern()
                    ? { status: true, url }
                    : { status: false, url: 'Url pattern not valid' }
            } else {
                return { status: false, error: 'Url pattern not valid' }
            }
        } else if (splitted_value.length === 1) {
            if (url.startsWith('www.', 0)) {
                url = url.replace('www.', protocol ? `${protocol}://` : 'https://')
                return new URL(url).verifyPattern()
                    ? { status: true, url }
                    : { status: false, url: 'Url pattern not valid' }
            } else {
                url = protocol ? `${protocol}://` + url : `https://` + url
                return new URL(url).verifyPattern()
                    ? { status: true, url }
                    : { status: false, url: 'Url pattern not valid' }
            }
        }

        return { status: false, error: 'Url pattern not valid' }
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// CustomClassicModel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @class CustomClassicModel
 * @classdesc
 * A schema-driven validation model that accepts a user-defined
 * `schema_restr_model` and validates any plain-object data against it.
 *
 * Each schema entry is either:
 * - A single `{rule, errorMsg}` object, or
 * - An array `[{rule, errorMsg}, ...]` for multi-rule per field.
 *
 * A `rule` may be a `Function` (must return `boolean`), a `RegExp`, or
 * the `None` sentinel (which skips validation for that field).
 * `errorMsg` accepts any type.
 *
 * **Partial-payload matching:** fields in the schema but absent from the data
 * are silently ignored — no `.optional()` marking needed. The inverse is not
 * permitted: a data field absent from the schema throws `UnknownKeyError`.
 *
 * **Guards at method boundaries:**
 * ```
 * constructor    → AssertPlainObject(schema_restr_model, 'schema_restr_model')
 * validate()     → AssertPlainObject(obj, 'obj')
 * nestvalidate() → AssertPlainObject(obj, 'obj')
 * extend()       → AssertPlainObject(ext_restr, 'ext_restr')
 * remove()       → AssertNonEmptyString(Key, 'Key')
 * swap()         → AssertPlainObject(new_restr, 'new_restr')
 * ```
 *
 * @param {SchemaRestriction} schema_restr_model
 *   Plain object mapping field names to `{rule, errorMsg}` or
 *   `[{rule, errorMsg}...]`. Must not be `null`, an array, or any non-object.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected plain object for 'schema_restr_model', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected plain object for 'schema_restr_model', got <type>"`
 *
 * @example
 * // ✅ Valid
 * const model = new CustomClassicModel({
 *   name: { rule: (v: string) => typeof v === 'string', errorMsg: 'Must be a string' },
 *   age:  { rule: (v: number) => typeof v === 'number', errorMsg: 'Must be a number' }
 * })
 *
 * @example
 * // 🛡️ Array passed as schema
 * new CustomClassicModel([{ name: {} }] as any)
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected plain object for 'schema_restr_model', got array" }
 */
class CustomClassicModel {
    error: ModelErrorObj = {}
    schema_restr_model: SchemaRestriction = {}

    constructor(schema_restr_model: SchemaRestriction) {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertPlainObject(schema_restr_model, 'schema_restr_model')
        // ─────────────────────────────────────────────────────────────────
        this.schema_restr_model = schema_restr_model
    }

    // ─────────────────────────────────────────────────────────────────────
    // nestvalidate
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Recursively validates a data object against `this.schema_restr_model`.
     *
     * For every `[key, value]` pair in `obj`:
     *
     * - **Unknown key** → `UnknownKeyError` thrown immediately (hard stop at any depth).
     * - **Nested object** (`this.hasNest(value) === true`) → the schema entry is treated as
     *   a sub-schema and a fresh `new CustomClassicModel(schema[key]).validate(value)` call
     *   recurses one level deeper. Errors attach under `this.error[key]` as-is, so the
     *   **error tree mirrors the data's own shape** with no flattening.
     * - **Leaf value** → checked against `{rule, errorMsg}` or `[{rule, errorMsg}...]`.
     *   Leaf failures are **collected**, not thrown — every failing field is visible in one result.
     *
     * **Guard:** `AssertPlainObject(obj, 'obj')` runs first — rejects arrays, `Date`, `Set`,
     * `Map`, functions, class instances, and null/undefined before the loop starts.
     *
     * @template T extends PureObject
     * @param {T}      obj - Data object to validate. Must be a plain object.
     * @param {number} [n=1] - Recursion depth. Reserved for future cycle-detection; unused now.
     *
     * @returns {ModelResultObj<T>}
     *   - `{ status: true,  error: null,        data: obj }` — all fields pass.
     *   - `{ status: false, error: <error map>,  data: null }` — one or more fail.
     *     Error map mirrors data shape exactly.
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected plain object for 'obj', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   `"Expected plain object for 'obj', got <type>"`
     * @throws {ValidationError}   code: ERR_VALIDATION
     *   When `schema_restr_model` is empty or an unclassified error is re-wrapped.
     * @throws {UnknownKeyError}   code: ERR_UNKNOWN_KEY
     *   `"key '<key>' not found in schema restriction"` — at any nesting depth.
     *
     * @example
     * // ✅ 1-level nesting
     * const model = new CustomClassicModel({
     *   student: {
     *     name: { rule: (v: string) => v.length > 4, errorMsg: 'Name is too short' },
     *     age:  { rule: (v: number) => v >= 18,      errorMsg: 'Must be above 18yrs' }
     *   }
     * })
     * model.nestvalidate({ student: { name: 'Bobby', age: 21 } })
     * // => { status: true, error: null, data: { student: { name: 'Bobby', age: 21 } } }
     *
     * @example
     * // ❌ Leaf rule fails — error mirrors data shape
     * model.nestvalidate({ student: { name: 'fon', age: 18 } })
     * // => {
     * //   status: false,
     * //   error: { student: { name: { status: false, error: 'Name is too short', value: 'fon' } } },
     * //   data: null
     * // }
     *
     * @example
     * // ❌ Level-2 deep nesting (company → address → zip)
     * const m2 = new CustomClassicModel({
     *   company: {
     *     address: {
     *       zip: { rule: (v: string) => /^\d{5}$/.test(v), errorMsg: 'Zip must be 5 digits' }
     *     }
     *   }
     * })
     * m2.nestvalidate({ company: { address: { zip: 'ABCDE' } } })
     * // => {
     * //   status: false,
     * //   error: { company: { address: { zip: { status: false, error: 'Zip must be 5 digits', value: 'ABCDE' } } } },
     * //   data: null
     * // }
     *
     * @example
     * // 🛡️ Guard — null passed
     * model.nestvalidate(null as any)
     * // throws NullValueError:
     * // { code: 'ERR_NULL_VALUE', message: "Expected plain object for 'obj', got null or undefined" }
     *
     * @example
     * // 🛡️ Guard — array passed
     * model.nestvalidate([{ student: {} }] as any)
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected plain object for 'obj', got array" }
     */
    nestvalidate<T extends PureObject>(obj: T, n = 1): ModelResultObj<T> {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertPlainObject(obj, 'obj')
        // ─────────────────────────────────────────────────────────────────
        this.error = {}

        try {
            if (Object.keys(this.schema_restr_model).length === 0) {
                throw new ValidationError({
                    error_code: 'ERR_VALIDATION',
                    error_description: 'Missing schema restriction model'
                })
            }

            for (const [key, value] of Object.entries(obj)) {
                if (
                    this.schema_restr_model[key] === undefined ||
                    this.schema_restr_model[key] === null ||
                    !this.schema_restr_model[key]
                ) {
                    throw new UnknownKeyError({
                        error_code: 'ERR_UNKNOWN_KEY',
                        error_description: `key '${key}' not found in schema restriction`
                    })
                }
                /* BUG:::> If a field in the data obj is null meaning it has no nest then
                its mirror in the schema restr model should have RuleAndError|%[]; but if it (its mirror in the schema restr model) has a 
                a nested schema_restr object then you may recieve a MissingKeyError (rule key missing). 
                Note:: The shema_restr model declares the shape of the data obj so its expected that the shape of obj and that
                of the schema restr should match ifa field is suppose to be null then in the schema restr it should 
                have a RuleAndError|%[]; not a nested schema object. But the good thing about the schema_Restr model here is 
                that you create a giant model but the dataobj can fit a portion of it 
                 */
                if (!hasNest(value)) {
                    if (CheckForRuleAndError(this.schema_restr_model[key]).status) {
                        const { status, error } = validateEntry({
                            entry: value,
                            RuleAndError: Array.isArray(this.schema_restr_model[key])
                                ? this.schema_restr_model[key]
                                : [this.schema_restr_model[key]] as RuleAndError_t[]
                        })

                        if (!status) {
                            this.error[key] = { status, error, value }
                        }
                    }
                } 
                else {
                    const nestV = (new CustomClassicModel(this.schema_restr_model[key] as SchemaRestriction))
                                                                    .nestvalidate(value as PureObject)
                    if (nestV.error) {
                        this.error[key] = nestV.error
                    }
                }
            }

            if (Object.keys(this.error).length > 0) {
                return { error: this.error, status: false, data: null }
            }

            return { status: true, error: null, data: obj }
        } catch (error: any) {
            if (error.code !== 'ERR_VALIDATION') throw error
            else {
                throw new ValidationError({
                    error_code: 'ERR_VALIDATION',
                    error_description: error.message
                })
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // validate
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Validates a flat (non-nested) data object against `this.schema_restr_model`.
     *
     * Unlike `nestvalidate`, `validate` does not recurse into nested objects.
     * A field whose value is a plain object is checked against its schema entry
     * as-is using the rule function. All fields are evaluated even when one fails,
     * returning a complete per-field report.
     *
     * **Guard:** `AssertPlainObject(obj, 'obj')` runs first.
     *
     * @template T extends PureObject
     * @param {T} obj - The data object to validate.
     *
     * @returns {ModelResultObj<T>}
     *   - `{ status: true,  error: null,        data: obj }` — all fields pass.
     *   - `{ status: false, error: <error map>,  data: null }` — one or more fail.
     *     Map shape: `{ [key]: { status: false, error: <errorMsg>, value: <value> } }`.
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected plain object for 'obj', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   `"Expected plain object for 'obj', got <type>"`
     * @throws {ValidationError}   code: ERR_VALIDATION
     *   When schema is empty, data object is empty, or unclassified error re-wrapped.
     * @throws {UnknownKeyError}   code: ERR_UNKNOWN_KEY
     *   `"Unknown key '<key>' not found in schema restriction"`
     *
     * @example
     * // ✅ All valid
     * const model = new CustomClassicModel({
     *   name: { rule: (v: string) => typeof v === 'string', errorMsg: 'Must be string' }
     * })
     * model.validate({ name: 'Alice' })
     * // => { status: true, error: null, data: { name: 'Alice' } }
     *
     * @example
     * // ❌ Multiple failures — all reported at once
     * const model2 = new CustomClassicModel({
     *   name: { rule: (v: unknown) => typeof v === 'string', errorMsg: 'Must be string' },
     *   age:  { rule: (v: unknown) => typeof v === 'number', errorMsg: 'Must be number' }
     * })
     * model2.validate({ name: null, age: '30' })
     * // => {
     * //   status: false,
     * //   error: {
     * //     name: { status: false, error: 'Must be string', value: null },
     * //     age:  { status: false, error: 'Must be number', value: '30' }
     * //   },
     * //   data: null
     * // }
     *
     * @example
     * // 🛡️ Guard — null data
     * model.validate(null as any)
     * // throws NullValueError:
     * // { code: 'ERR_NULL_VALUE', message: "Expected plain object for 'obj', got null or undefined" }
     */
    validate<T extends PureObject>(obj: T): ModelResultObj<T> {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertPlainObject(obj, 'obj')
        // ─────────────────────────────────────────────────────────────────
        this.error = {}

        try {
            if (Object.keys(this.schema_restr_model).length === 0) {
                throw new ValidationError({
                    error_code: 'ERR_VALIDATION',
                    error_description: 'cannot find your schema restriction model'
                })
            }

            if (Object.keys(obj).length === 0) {
                throw new ValidationError({
                    error_code: 'ERR_VALIDATION',
                    error_description: 'Data object to be validated cannot be empty'
                })
            }

            for (const [key, value] of Object.entries(obj)) {
                if (!this.schema_restr_model[key]) {
                    throw new UnknownKeyError({
                        error_code: 'ERR_UNKNOWN_KEY',
                        error_description: `Unknown key '${key}' not found in schema restriction`
                    })
                }

                if (CheckForRuleAndError(this.schema_restr_model[key]).status) {
                    const { status, error } = validateEntry({
                        entry: value,
                        RuleAndError: Array.isArray(this.schema_restr_model[key])
                            ? this.schema_restr_model[key]
                            : [this.schema_restr_model[key]] as RuleAndError_t[]
                    })

                    if (!status) {
                        this.error[key] = { status, error, value }
                    }
                }
            }

            if (Object.keys(this.error).length > 0) {
                return { error: this.error, status: false, data: null }
            }

            return { status: true, error: null, data: obj }
        } catch (error: any) {
            if (error.code !== 'ERR_VALIDATION') throw error
            else {
                throw new ValidationError({
                    error_code: 'ERR_VALIDATION',
                    error_description: error.message
                })
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // extend
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Merges new fields into `this.schema_restr_model` at runtime.
     *
     * Every key in `ext_restr` must be absent from the current schema —
     * duplicates throw `DuplicateKeyError` immediately.
     *
     * **Guard:** `AssertPlainObject(ext_restr, 'ext_restr')` runs first —
     * replaces the previous manual null/undefined check and additionally
     * rejects arrays, class instances, and other non-plain-objects.
     *
     * @param {SchemaRestriction} ext_restr - New fields to merge into the schema.
     *
     * @returns {void}
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected plain object for 'ext_restr', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   `"Expected plain object for 'ext_restr', got <type>"`
     * @throws {DuplicateKeyError} code: ERR_DUPLICATE_KEY
     *   `"Duplicate key '<key>' already exists in schema"`
     *
     * @example
     * // ✅ Valid extend
     * const model = new CustomClassicModel({
     *   name: { rule: (v: string) => typeof v === 'string', errorMsg: 'Must be string' }
     * })
     * model.extend({ bio: { rule: /[\S]{1,100}/, errorMsg: 'Bio max 100 chars' } })
     * model.validate({ name: 'Alice', bio: 'Developer' })
     * // => { status: true, error: null, data: { ... } }
     *
     * @example
     * // ❌ Duplicate key
     * model.extend({ name: { rule: () => true, errorMsg: '' } })
     * // throws DuplicateKeyError:
     * // { code: 'ERR_DUPLICATE_KEY', message: "Duplicate key 'name' already exists in schema" }
     *
     * @example
     * // 🛡️ Guard — null passed
     * model.extend(null as any)
     * // throws NullValueError:
     * // { code: 'ERR_NULL_VALUE', message: "Expected plain object for 'ext_restr', got null or undefined" }
     */
    extend(ext_restr: SchemaRestriction): void {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertPlainObject(ext_restr, 'ext_restr')
        // ─────────────────────────────────────────────────────────────────

        try {
            for (const [key, value] of Object.entries(ext_restr)) {
                const all_restr_keys = Object.keys(this.schema_restr_model)
                if (!all_restr_keys.includes(key)) {
                    this.schema_restr_model[key] = value
                } else {
                    throw new DuplicateKeyError({
                        error_code: 'ERR_DUPLICATE_KEY',
                        error_description: `Duplicate key '${key}' already exists in schema`
                    })
                }
            }
        } catch (error: any) {
            if (
                error.code === 'ERR_DUPLICATE_KEY' ||
                error.code === 'ERR_INVALID_ARGTYPE' ||
                error.code === 'ERR_NULL_VALUE'
            ) {
                throw error
            } else {
                throw new ValidationError({
                    error_code: 'ERR_VALIDATION',
                    error_description: error.message
                })
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // remove
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Removes a single field from `this.schema_restr_model` at runtime.
     *
     * After removal, any data object that still carries that field name
     * will cause `validate()` or `nestvalidate()` to throw `UnknownKeyError`.
     *
     * **Guard:** `AssertNonEmptyString(Key, 'Key')` runs first — replaces the
     * previous null/undefined check and additionally rejects non-strings and
     * empty/whitespace strings before any schema mutation occurs.
     *
     * @param {string} Key - The name of the field to drop from the schema.
     *
     * @returns {void}
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected string for 'Key', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   - `"Expected string for 'Key', got <type>"`
     *   - `"Expected non-empty string for 'Key', got empty string"`
     * @throws {MissingKeyError}   code: ERR_MISSING_KEY
     *   `"key name '<Key>' not found"` — when the field doesn't exist in the schema.
     *
     * @example
     * // ✅ Valid remove
     * const model = new CustomClassicModel({
     *   name: { rule: (v: string) => typeof v === 'string', errorMsg: 'Must be string' },
     *   bio:  { rule: /[\S]{1,100}/, errorMsg: 'Max 100 chars' }
     * })
     * model.remove('bio')
     * model.validate({ name: 'Alice', bio: 'Dev' })
     * // throws UnknownKeyError — 'bio' was removed
     *
     * @example
     * // 🛡️ Guard — number passed
     * model.remove(42 as any)
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected string for 'Key', got number" }
     *
     * @example
     * // 🛡️ Guard — empty string
     * model.remove('')
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected non-empty string for 'Key', got empty string" }
     */
    remove(Key: string): void {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertNonEmptyString(Key, 'Key')
        // ─────────────────────────────────────────────────────────────────

        const keys = Object.keys(this.schema_restr_model)
        const keyPresent = keys.find(k => Key === k)

        if (keyPresent === undefined) {
            throw new MissingKeyError({
                error_code: 'ERR_MISSING_KEY',
                error_description: `key name '${Key}' not found`
            })
        }

        delete this.schema_restr_model[Key]
    }

    // ─────────────────────────────────────────────────────────────────────
    // swap
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Replaces `this.schema_restr_model` entirely with a new schema.
     *
     * After a swap, the previous schema is discarded. Any data field valid
     * under the old schema but absent from `new_restr` will throw
     * `UnknownKeyError` on the next `validate()` or `nestvalidate()` call.
     *
     * **Guard:** `AssertPlainObject(new_restr, 'new_restr')` runs first —
     * replaces the previous null/undefined check and additionally rejects
     * arrays, class instances, and other non-plain-objects.
     *
     * @param {SchemaRestriction} new_restr - Replacement schema.
     *
     * @returns {void}
     *
     * @throws {NullValueError}    code: ERR_NULL_VALUE
     *   `"Expected plain object for 'new_restr', got null or undefined"`
     * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
     *   `"Expected plain object for 'new_restr', got <type>"`
     *
     * @example
     * // ✅ Valid swap
     * const model = new CustomClassicModel({
     *   name: { rule: (v: string) => typeof v === 'string', errorMsg: 'Must be string' }
     * })
     * model.swap({
     *   email: { rule: (v: string) => /@/.test(v), errorMsg: 'Invalid email' }
     * })
     * model.validate({ email: 'a@b.com' }) // ✅ passes
     * model.validate({ name: 'Alice' })     // ❌ throws UnknownKeyError
     *
     * @example
     * // 🛡️ Guard — array passed
     * model.swap([{ email: {} }] as any)
     * // throws ArgumentTypeError:
     * // { code: 'ERR_INVALID_ARGTYPE', message: "Expected plain object for 'new_restr', got array" }
     */
    swap(new_restr: SchemaRestriction): void {
        // ── Guard ─────────────────────────────────────────────────────────
        AssertPlainObject(new_restr, 'new_restr')
        // ─────────────────────────────────────────────────────────────────
        this.schema_restr_model = new_restr
    }

}


// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export {
    validateEntry,
    isUsernameValid,
    isEmailValid,
    isPhoneNumberValid,
    isPasswordValid,
    isRequired,
    Normalizer,
    validateMany,
    CustomClassicModel,
    URL,
    ArgumentTypeError,
    MissingKeyError,
    UnknownKeyError,
    NullValueError,
    DuplicateKeyError,
    ValidationError,
    None
}

