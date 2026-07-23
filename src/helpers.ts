
import {
    AssertDreaFile,
    AssertMayDreaFile,
    AssertPlainObject,
    AssertRuleAndError,
    AssertRuleAndErrorArray
} from './guard.js'

import { DreaAtomWrapper, DreaFileWrapper, MayDreaFileWrapper, PureObject, RuleAndError_t } from './types.js'

/**
 * Wraps a `File` instance so that `nestvalidate` treats it as a single
 * atomic value rather than recursing into its object properties.
 *
 * ---
 *
 * **Why this is needed.**
 *
 * TypeScript's `typeof (new File(...))` resolves to `'object'`, and drea's
 * `nestvalidate` detects any plain object as a nested structure to recurse
 * into. `__File` prevents this by branding the value with an internal marker
 * that `hasNest` checks first. Your rule functions still receive the original
 * `File` instance, so `v instanceof File`, `v.type`, `v.size`, `v.name`, and
 * every other `File` property work exactly as expected.
 *
 * **When to use it.**
 *
 * Use `__File` when passing file data inside a `nestvalidate` data object.
 * `validate()` does **not** recurse into nested objects and therefore does
 * **not** require this wrapper — you can pass a raw `File` directly.
 *
 * **Guard:** `AssertDreaFile(v, 'v')` runs first — rejects anything that is
 * not a `File` instance before the wrapper is created.
 *
 * @param v - The `File` instance to wrap.
 *
 * @returns {DreaFileWrapper}
 *   A zero-argument function that returns `v` when called, branded with
 *   `__isMarkedDREAFile`. Treat the return value as opaque.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected File instance for 'v', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected File instance for 'v', got <type>"`
 *
 * @example
 * // ── Basic usage ──────────────────────────────────────────────────────────
 * import { __File, CustomClassicModel } from 'drea'
 *
 * const schema = {
 *   avatar: [
 *     {
 *       rule: (v) => v instanceof File || v === null,
 *       errorMsg: 'Must be a File or null'
 *     },
 *     {
 *       rule: (v) =>
 *         v === null || ['image/jpeg', 'image/png', 'image/webp'].includes(v.type),
 *       errorMsg: 'Only JPG, PNG, or WebP images are accepted'
 *     },
 *     {
 *       rule: (v) =>
 *         v === null || Math.floor(v.size / (1024 * 1024)) < 7,
 *       errorMsg: 'Max file size is 6 MB'
 *     }
 *   ]
 * }
 *
 * const model = new CustomClassicModel(schema)
 *
 * // fileFromInput is a File from <input type="file">
 * const result = model.nestvalidate({ avatar: __File(fileFromInput) })
 *
 * @example
 * // ── Guard — non-File passed ───────────────────────────────────────────────
 * __File('path/to/file.png' as unknown as File)
 * // throws ArgumentTypeError:
 * // { code: 'ERR_INVALID_ARGTYPE',
 * //   message: "Expected File instance for 'v', got string" }
 *
 * @example
 * // ── Guard — null passed ───────────────────────────────────────────────────
 * __File(null as unknown as File)
 * // throws NullValueError:
 * // { code: 'ERR_NULL_VALUE',
 * //   message: "Expected File instance for 'v', got null or undefined" }
 */
export const __File = (v:RuleAndError_t | RuleAndError_t[]) =>{
    // GUARD //
   if (Array.isArray(v)){
        AssertRuleAndErrorArray(v)
   }
   else{
        AssertRuleAndError(v)
   }

    const fn =(() =>Array.isArray(v)?v:[v]) as DreaFileWrapper // Unwrap 

    Object.defineProperty(fn,'__isDreaFile',{
        value:true,
        writable:false,
        enumerable:false,
        configurable:false
    })

    return Object.freeze(fn)
}


/**
 * Wraps a `File` instance if not null so that `nestvalidate` treats it as a single
 * atomic value rather than recursing into its object properties.
 *
 * ---
 *
 * **Why this is needed.**
 *
 * TypeScript's `typeof (new File(...))` resolves to `'object'`, and drea's
 * `nestvalidate` detects any plain object as a nested structure to recurse
 * into and in some cases the file might not exist yet (hence null).
 *  `__mayFile` prevents this by branding the value with an internal marker
 * that `hasNest` checks first. Your rule functions still receive the original
 * `File` instanceor null File doesn't yet exist, 
 * so `v instanceof File`, `v.type`, `v.size`, `v.name`, and
 * every other `File` property work exactly as expected (If file exist).
 *
 * **When to use it.**
 *
 * Use `__mayFile` when passing field that could either be File instance or null inside a `nestvalidate` data object.
 * `validate()` does **not** recurse into nested objects and therefore does
 * **not** require this wrapper — you can pass a raw `File` directly.
 *
 * **Guard:** `AssertMayDreaFile(v, 'v')` runs first — rejects anything that is
 * not a `File` instance or null before the wrapper is created.
 *
 * @param v - The `File` instance to wrap or null value when File is not present.
 *
 * @returns {DreaFileWrapper}
 *   A zero-argument function that returns `v` when called, branded with
 *   `__isDreaMayFile`. Treat the return value as opaque.
 *
 * @throws {NullValueError}    code: ERR_NULL_VALUE
 *   `"Expected File instance for 'v', got null or undefined"`
 * @throws {ArgumentTypeError} code: ERR_INVALID_ARGTYPE
 *   `"Expected File instance for 'v', got <type>"`
 *
 * @example
 * // ── Basic usage ──────────────────────────────────────────────────────────
 * import { __mayFile, CustomClassicModel } from 'drea'
 *
 * const schema = {
 *   avatar: [
 *     {
 *       rule: (v) => v instanceof File || v === null,
 *       errorMsg: 'Must be a File or null'
 *     },
 *     {
 *       rule: (v) =>
 *         v === null || ['image/jpeg', 'image/png', 'image/webp'].includes(v.type),
 *       errorMsg: 'Only JPG, PNG, or WebP images are accepted'
 *     },
 *     {
 *       rule: (v) =>
 *         v === null || Math.floor(v.size / (1024 * 1024)) < 7,
 *       errorMsg: 'Max file size is 6 MB'
 *     }
 *   ]
 * }
 *
 * const model = new CustomClassicModel(schema)
 *
 * // fileFromInput is a File from <input type="file">
 * const result = model.nestvalidate({ avatar: __mayFile(fileFromInput) })
 *
 * @example
 * // ── Guard — non-File passed ───────────────────────────────────────────────
 * __File('path/to/file.png' as unknown as File)
 * // throws ArgumentTypeError:
 * // { error_code: 'ERR_INVALID_ARGTYPE',
 * // error_description: `Expected File instance or null for '${paramName}', got ${typeLabel(v)}`}
 *
 */
export const __mayFile = (v:RuleAndError_t | RuleAndError_t[]) =>{
    // GUARD //
   if (Array.isArray(v)){
        AssertRuleAndErrorArray(v)
   }
   else{
        AssertRuleAndError(v)
   }

    const fn = (() => Array.isArray(v)?v:[v]) 
    Object.defineProperty(fn,'__isDreaMayFile',{
        value:true,
        writable:false,
        enumerable:false,
        configurable:false
    })
    
    return Object.freeze(fn as MayDreaFileWrapper) 
}



//Treat as a single entity so it wont be considered as nested object when used during nestvaliate
export function __Atomic(v:PureObject): DreaAtomWrapper{

    // GUARD //
    AssertPlainObject(v)

    const fn = (() => v ) as DreaAtomWrapper//Unwrap
    Object.defineProperty(fn,'__isDreaAtom',{
        value:true,
        writable:false,
        enumerable:false,
        configurable:false
    })
    return Object.freeze(fn)
}




