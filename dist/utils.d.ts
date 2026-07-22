import { DreaFileWrapper, ExtraConstraints, MayDreaFileWrapper } from './types.js';
/**
 *
 * @param {*} v - The email addr to test
 * @returns {boolean} Returns true if email matches the regex
 */
declare const StrictEmail: (v: any) => boolean;
declare const CheckWithConstraints: (url: string, xtra_constr: ExtraConstraints) => boolean;
export declare const checkPath: (url: string, ifPaths: boolean) => boolean;
declare const CheckForDuplicates: (arr: string[]) => {
    state: boolean;
    duplicate: string | null;
};
declare const removeK: (obj: {
    [key: string]: any;
}, key: string) => void;
declare const CheckForRuleAndError: (restr_model: any) => {
    status: boolean;
    error: null | string;
};
/**
 * Returns `true` when `value` is a plain nested object that `nestvalidate`
 * should recurse into, and `false` when it should be treated as an atomic leaf.
 *
 * Values that are treated as leaves (return `false`):
 * - `null` or `undefined`
 * - Arrays
 * - Primitives (`string`, `number`, `boolean`)
 * - drea-branded file wrappers (`DreaFileWrapper`) created by {@link __File}
 *
 * Values that are treated as nested objects (return `true`):
 * - Plain objects `{}`
 * - Class instances (guard at the schema level if atomic validation is needed)
 *
 * **`__File` exemption.**
 *
 * Because `typeof (new File(...)) === 'object'`, a raw `File` would be
 * classified as a nested object and `nestvalidate` would try to recurse
 * into its DOM properties (`name`, `size`, `type`, `lastModified`, …).
 * Wrapping the file with `__File(file)` produces a `DreaFileWrapper`, and
 * this method detects that brand first — before any object/array check —
 * and returns `false`. The file is then validated as a single atomic value
 * by the rule functions in the schema.
 *
 * @private
 * @template T
 * @param {T} value - The data field value to inspect.
 * @returns {boolean}
 *   `true` → recurse into `value` as a nested object.
 *   `false` → validate `value` as a leaf entry.
 *
 * @example
 * // Plain object → recurse
 * this.hasNest({ name: 'Alice' })                         // true
 *
 * @example
 * // Branded file wrapper → leaf (File validated atomically)
 * this.hasNest(__File(new File([''], 'photo.png')))        // false ✅
 *
 * @example
 * // Raw File (not wrapped) → recurse — use __File to prevent this
 * this.hasNest(new File([''], 'photo.png'))                // true ⚠️
 *
 * @example
 * // null → leaf
 * this.hasNest(null)                                       // false
 *
 * @example
 * // Array → leaf
 * this.hasNest([1, 2, 3])                                  // false
 */
declare function hasNest<T>(value: T): boolean;
declare const isDreaFile: (v: unknown) => v is DreaFileWrapper;
declare const isDreaMayFile: (v: unknown) => v is MayDreaFileWrapper;
export { CheckWithConstraints, CheckForDuplicates, removeK, CheckForRuleAndError, StrictEmail, isDreaFile, hasNest, isDreaMayFile };
//# sourceMappingURL=utils.d.ts.map