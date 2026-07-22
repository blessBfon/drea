import { Err } from './types.js';
/**
 * Base validation error. Used as a fallback for unclassified errors caught
 * inside validation loops.
 *
 * @class ValidationError
 * @extends {Error}
 *
 * @property {string} code   Machine-readable error code — always `"ERR_VALIDATION"`.
 * @property {string} name   Always `"ValidationError"`.
 * @property {string} message Human-readable description (from `err.error_description`).
 *
 * @example
 * throw new ValidationError({
 *   error_code: 'ERR_VALIDATION',
 *   error_description: 'cannot find your schema restriction model'
 * })
 */
export declare class ValidationError extends Error {
    code: string;
    constructor(err: Err);
}
/**
 * Thrown when a key appears more than once where uniqueness is required,
 * specifically when calling `CustomClassicModel.extend()` with a key that
 * already exists in `schema_restr_model`.
 *
 * @class DuplicateKeyError
 * @extends {Error}
 *
 * @property {string} code   `"ERR_DUPLICATE_KEY"`
 *
 * @example
 * throw new DuplicateKeyError({
 *   error_code: 'ERR_DUPLICATE_KEY',
 *   error_description: "Duplicate key 'name' already exists in schema"
 * })
 */
export declare class DuplicateKeyError extends Error {
    code: string;
    constructor(err: Err);
}
/**
 * Thrown when a value does not match the expected argument type.
 *
 * Every `ArgumentTypeError` thrown by a drea guard follows the description
 * pattern:
 *
 *   `"Expected <type> for '<paramName>', got <receivedType>"`
 *
 * @class ArgumentTypeError
 * @extends {Error}
 *
 * @property {string} code   `"ERR_INVALID_ARGTYPE"`
 *
 * @example
 * throw new ArgumentTypeError({
 *   error_code: 'ERR_INVALID_ARGTYPE',
 *   error_description: "Expected plain object for 'schema_restr_model', got array"
 * })
 */
export declare class ArgumentTypeError extends Error {
    code: string;
    constructor(err: Err);
}
/**
 * Thrown when a required key is absent from an input object.
 *
 * @class MissingKeyError
 * @extends {Error}
 *
 * @property {string} code   `"ERR_MISSING_KEY"`
 *
 * @example
 * throw new MissingKeyError({
 *   error_code: 'ERR_MISSING_KEY',
 *   error_description: "key name 'bio' not found"
 * })
 */
export declare class MissingKeyError extends Error {
    code: string;
    constructor(err: Err);
}
/**
 * Thrown when a data object contains a key that has no matching entry in
 * `schema_restr_model`. This is a hard stop — validation does not continue
 * and no partial error object is returned.
 *
 * @class UnknownKeyError
 * @extends {Error}
 *
 * @property {string} code   `"ERR_UNKNOWN_KEY"`
 *
 * @example
 * throw new UnknownKeyError({
 *   error_code: 'ERR_UNKNOWN_KEY',
 *   error_description: "key 'message' not found in schema restriction"
 * })
 */
export declare class UnknownKeyError extends Error {
    code: string;
    constructor(err: Err);
}
/**
 * Thrown when a value is `null` or `undefined` but a concrete value is required.
 *
 * Every `NullValueError` thrown by a drea guard follows the description pattern:
 *
 *   `"Expected <type> for '<paramName>', got null or undefined"`
 *
 * @class NullValueError
 * @extends {Error}
 *
 * @property {string} code   `"ERR_NULL_VALUE"`
 *
 * @example
 * throw new NullValueError({
 *   error_code: 'ERR_NULL_VALUE',
 *   error_description: "Expected string for 'email', got null or undefined"
 * })
 */
export declare class NullValueError extends Error {
    code: string;
    constructor(err: Err);
}
//# sourceMappingURL=errors.d.ts.map