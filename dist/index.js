class _ extends Error {
  code;
  constructor(r) {
    super(r.error_description), this.name = "ValidationError", this.code = r.error_code, Object.setPrototypeOf(this, new.target.prototype), typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, this.constructor);
  }
}
class V extends Error {
  code;
  constructor(r) {
    super(r.error_description), this.name = "DuplicateKeyError", this.code = r.error_code, Object.setPrototypeOf(this, new.target.prototype), typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, this.constructor);
  }
}
class n extends Error {
  code;
  constructor(r) {
    super(r.error_description), this.name = "ArgumentTypeError", this.code = r.error_code, Object.setPrototypeOf(this, new.target.prototype), typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, this.constructor);
  }
}
class a extends Error {
  code;
  constructor(r) {
    super(r.error_description), this.name = "MissingKeyError", this.code = r.error_code, Object.setPrototypeOf(this, new.target.prototype), typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, this.constructor);
  }
}
class h extends Error {
  code;
  constructor(r) {
    super(r.error_description), this.name = "UnknownKeyError", this.code = r.error_code, Object.setPrototypeOf(this, new.target.prototype), typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, this.constructor);
  }
}
class l extends Error {
  code;
  constructor(r) {
    super(r.error_description), this.name = "NullValueError", this.code = r.error_code, Object.setPrototypeOf(this, new.target.prototype), typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, this.constructor);
  }
}
const O = (e) => {
  if (typeof e != "string")
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: "Email must be a string"
    });
  return /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,63})+$/.test(e.trim());
}, $ = [
  "allowed_protocols",
  "allowed_ports",
  "allowed_domains",
  "contain_fragment",
  "contain_path",
  "contain_query",
  "between"
], T = (e, r) => {
  for (const [t, o] of Object.entries(r)) {
    if (!$.includes(t.toLowerCase()))
      throw new h({
        error_code: "ERR_UNKNOWN_KEY",
        error_description: `${t} is not defined as a restriction`
      });
    if (t.toLowerCase() === "allowed_protocols")
      if (Array.isArray(o) && o.every((s) => typeof s == "string")) {
        if (!S(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be an array of strings`
        });
    if (t.toLowerCase() === "contain_fragment")
      if (typeof o == "boolean") {
        if (!G(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be a boolean`
        });
    if (t.toLowerCase() === "contain_query")
      if (typeof o == "boolean") {
        if (!j(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be a boolean`
        });
    if (t.toLowerCase() === "allowed_ports")
      if (Array.isArray(o) && o.every((s) => typeof s == "string")) {
        if (!U(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be an array of strings`
        });
    if (t.toLowerCase() === "between")
      if (Array.isArray(o) && o.every((s) => typeof s == "number") && o.length > 0 && o.length < 3) {
        if (!Y(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be an array of numbers`
        });
    if (t.toLowerCase() === "allowed_domains")
      if (Array.isArray(o) && o.every((s) => typeof s == "string")) {
        if (!k(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be an array of strings`
        });
    if (t.toLowerCase() === "contain_path")
      if (typeof o == "boolean") {
        if (!M(e, o))
          return !1;
      } else
        throw new n({
          error_code: "ERR_INVALID_ARGTYPE",
          error_description: `'${t}' must be a boolean`
        });
  }
  return !0;
}, M = (e, r) => {
  const t = e.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^/?#]+(\/[^?#]*)?/);
  return r ? t === null || t[1] !== void 0 || t[1] !== "/" : t === null || t[1] === void 0 || t[1] === "/";
}, k = (e, r) => {
  if (r.length === 0)
    return !0;
  r = r.map((o) => o.toLowerCase());
  const t = e.match(/\b([a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}|\d{1,3}(?:\.\d{1,3}){3})\b/);
  return !!(t === null || r.includes(t[1]));
}, Y = (e, r) => r[1] === void 0 ? e.length < r[0] : e.length > r[0] && e.length < r[1], U = (e, r) => {
  const t = e.match(/:(\d+)(?=\/|$)/);
  return t === null ? !1 : r.length === 0 ? !0 : !!r.includes(t[1]);
}, j = (e, r) => {
  const t = e.match(/\?([^#\s]+)/);
  return r ? t != null : t === null;
}, G = (e, r) => {
  const t = e.match(/#([^\s?#]+)/);
  return r ? t != null : t === null;
}, S = (e, r) => {
  const t = e.split(":")[0];
  return r = r.map((o) => o.toLowerCase()), !!r.includes(t);
}, A = (e) => {
  try {
    if (e instanceof Object)
      if (Array.isArray(e))
        if (Array.isArray(e)) {
          if (e.length <= 0)
            throw new l({
              error_code: "ERR_NULL_VALUE",
              error_description: "RuleAndError[] cannot be empty"
            });
          for (const r of e)
            if (typeof r == "object" && r instanceof Object && !Array.isArray(r)) {
              const { status: t, error: o } = I(r);
            } else
              throw new n({
                error_code: "ERR_INVALID_ARGTYPE",
                error_description: "RuleAndError[] can either be an array of {rule,errorMsg} or a single {rule,errorMsg}"
              });
          return {
            status: !0,
            error: null
          };
        } else
          throw new n({
            error_code: "ERR_INVALID_ARGTYPE",
            error_description: "RuleAndError[] can either be an array of {rule,errorMsg} or a single {rule,errorMsg}"
          });
      else {
        const { status: r, error: t } = I(e);
        return {
          status: r,
          error: t
        };
      }
    else
      throw new n({
        error_code: "ERR_INVALID_ARGTYPE",
        error_description: "RuleAndError[] can either be an array of {rule,errorMsg} or a single {rule,errorMsg}"
      });
  } catch (r) {
    throw r;
  }
}, I = (e) => {
  let r = Object.keys(e);
  if (!r.includes("rule"))
    throw new a({
      error_code: "ERR_MISSING_KEY",
      error_description: "rule key missing"
    });
  if (!r.includes("errorMsg"))
    throw new a({
      error_code: "ERR_MISSING_KEY",
      error_description: "errorMsg key missing"
    });
  if (r = r.filter((t) => t !== "rule" && t !== "errorMsg"), r.length === 1)
    throw new h({
      error_code: "ERR_UNKNOWN_KEY",
      error_description: `'${r}' is an unknown RuleAndError[]  key`
    });
  if (r.length > 1)
    throw new h({
      error_code: "ERR_UNKNOWN_KEY",
      error_description: `[${r}] are unknown RuleAndError[] keys `
    });
  return {
    status: !0,
    error: null
  };
};
function x(e) {
  return typeof e == "function" && (e.__asDreaFile === !0 || e.__asDreaAtom === !0 || e.__asDreaMayFile === !0) ? !1 : e != null && typeof e == "object" && !Array.isArray(e);
}
const w = (e) => typeof e == "function" ? Array.isArray(e()) && e.__isDreaFile === !0 : !1, E = (e) => typeof e == "function" ? Array.isArray(e()) && e.__isDreaMayFile === !0 : !1, y = { __type: "none" };
function u(e) {
  return e === null ? "null" : Array.isArray(e) ? "array" : e instanceof Date ? "Date" : e instanceof Set ? "Set" : e instanceof Map ? "Map" : typeof e == "function" ? "function" : typeof e == "object" && Object.getPrototypeOf(e) !== Object.prototype ? "class instance" : typeof e;
}
function d(e, r = "value") {
  if (e == null)
    throw new l({
      error_code: "ERR_NULL_VALUE",
      error_description: `Expected plain object for '${r}', got null or undefined`
    });
  if (Array.isArray(e))
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got array`
    });
  if (e instanceof Date)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got Date`
    });
  if (e instanceof Set)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got Set`
    });
  if (e instanceof Map)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got Map`
    });
  if (typeof e == "function")
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got function`
    });
  if (typeof e != "object")
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got ${typeof e}`
    });
  if (Object.getPrototypeOf(e) !== Object.prototype)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected plain object for '${r}', got class instance or custom prototype`
    });
}
function K(e, r = "value") {
  e !== void 0 && d(e, r);
}
function f(e, r = "value") {
  if (e == null)
    throw new l({
      error_code: "ERR_NULL_VALUE",
      error_description: `Expected string for '${r}', got null or undefined`
    });
  if (typeof e != "string")
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected string for '${r}', got ${u(e)}`
    });
}
function g(e, r = "value") {
  if (f(e, r), e.trim().length === 0)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected non-empty string for '${r}', got empty string`
    });
}
function L(e, r = "value") {
  if (e == null)
    throw new l({
      error_code: "ERR_NULL_VALUE",
      error_description: `Expected array for '${r}', got null or undefined`
    });
  if (!Array.isArray(e))
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected array for '${r}', got ${u(e)}`
    });
}
function C(e, r) {
  if (e !== y) {
    if (e == null)
      throw new l({
        error_code: "ERR_NULL_VALUE",
        error_description: `Expected function, RegExp, or None at RuleAndError[${r}].rule, got null or undefined`
      });
    if (typeof e != "function" && !(e instanceof RegExp))
      throw new n({
        error_code: "ERR_INVALID_ARGTYPE",
        error_description: `Expected function, RegExp, or None at RuleAndError[${r}].rule, got ${u(e)}`
      });
  }
}
function m(e) {
  L(e, "RuleAndError");
  const r = e;
  if (r.length === 0)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: "Expected non-empty array for 'RuleAndError', got empty array"
    });
  r.forEach((t, o) => {
    if (t == null)
      throw new l({
        error_code: "ERR_NULL_VALUE",
        error_description: `Expected plain object at RuleAndError[${o}], got ${t === null ? "null" : "undefined"}`
      });
    if (Array.isArray(t) || typeof t != "object")
      throw new n({
        error_code: "ERR_INVALID_ARGTYPE",
        error_description: `Expected plain object at RuleAndError[${o}], got ${u(t)}`
      });
    const s = t;
    if (!("rule" in s))
      throw new a({
        error_code: "ERR_MISSING_KEY",
        error_description: `Missing 'rule' property at RuleAndError[${o}]`
      });
    if (!("errorMsg" in s))
      throw new a({
        error_code: "ERR_MISSING_KEY",
        error_description: `Missing 'errorMsg' property at RuleAndError[${o}]`
      });
    if (Object.keys(t).length > 2)
      throw new n({
        error_code: "ERR_INVALID_ARGTYPE",
        error_description: `Expected 2 arguments <rule> and <errorMsg> at RuleAndError[${o}], got ${Object.keys(t).length}}`
      });
    C(s.rule, o);
  });
}
function b(e) {
  if (e == null)
    throw new l({
      error_code: "ERR_NULL_VALUE",
      error_description: `Expected a RuleAndError object, got ${e === null ? "null" : "undefined"}`
    });
  if (Array.isArray(e) || typeof e != "object")
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected a RuleAndError object, got ${u(e)}`
    });
  if (!("rule" in e))
    throw new a({
      error_code: "ERR_MISSING_KEY",
      error_description: "Missing 'rule' property in RuleAndError object"
    });
  if (!("errorMsg" in e))
    throw new a({
      error_code: "ERR_MISSING_KEY",
      error_description: "Missing 'errorMsg' property in RuleAndError object"
    });
  if (Object.keys(e).length > 2)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected 2 arguments <rule> and <errorMsg> in RuleAndError object, got ${Object.keys(e).length}}`
    });
}
const F = (e) => {
  if (e === y)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: "Expected any type for 'entry', got None"
    });
};
function N(e) {
  if (d(e, "validateEntry input"), !("entry" in e))
    throw new a({
      error_code: "ERR_MISSING_KEY",
      error_description: "Missing 'entry' property in validateEntry input object"
    });
  if (!("RuleAndError" in e))
    throw new a({
      error_code: "ERR_MISSING_KEY",
      error_description: "Missing 'RuleAndError' property in validateEntry input object"
    });
  if (Object.keys(e).length > 2)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected 2 arguments <entry> and <RuleAndError>, got ${Object.keys(e).length}`
    });
  F(e.entry), m(typeof e.RuleAndError == "function" ? e.RuleAndError() : e.RuleAndError);
}
function z(e) {
  L(e, "validateMany input");
  const r = e;
  if (r.length === 0)
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: "Expected non-empty array for 'validateMany input', got empty array"
    });
  r.forEach((t, o) => {
    try {
      N(t);
    } catch (s) {
      throw new s.constructor({
        error_code: s.code,
        error_description: `At validateMany[${o}]: ${s.message}`
      });
    }
  });
}
function v(e, r = "value") {
  if (e == null)
    throw new l({
      error_code: "ERR_NULL_VALUE",
      error_description: `Expected File instance for '${r}', got null or undefined`
    });
  if (!(e instanceof File))
    throw new n({
      error_code: "ERR_INVALID_ARGTYPE",
      error_description: `Expected File instance for '${r}', got ${u(e)}`
    });
}
class R {
  url;
  /** @private Base regex — matches any structurally valid URI / URL */
  major_url_regex = /\b(?:[a-zA-Z][a-zA-Z0-9+.-]*):\/{2}?(?:[^\s\$.?#].[^\s]*)\b/;
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
  constructor(r) {
    g(r, "url"), this.url = r.toLowerCase().trim();
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
  verifyPattern(r) {
    if (K(r, "extra_constraints"), r == null)
      return this.major_url_regex.test(this.url);
    if (Object.keys(r).length < 1)
      return this.major_url_regex.test(this.url);
    if (this.major_url_regex.test(this.url))
      try {
        return T(this.url, r);
      } catch (t) {
        throw t;
      }
    return !1;
  }
}
const c = ({ entry: e, RuleAndError: r = [] }) => {
  N({ entry: e, RuleAndError: r });
  try {
    if (e === y)
      throw new n({
        error_code: "ERR_INVALID_ARGTYPE",
        error_description: "entry cannot be of None type."
      });
    if (typeof e == "function" && (e = e()), typeof r == "function")
      if (r.__isDreaMayFile)
        r = r();
      else if (r.__isDreaFile)
        r = r(), v(e);
      else
        throw new _({
          error_code: "ERR_VALIDATION",
          error_description: `Unexpected function wrapped around RuleAndError: ${r}`
        });
    for (const { rule: t, errorMsg: o } of r) {
      let s = !1;
      if (t instanceof RegExp)
        if (typeof e == "string")
          s = t.test(e);
        else
          throw new n({
            error_code: "ERR_INVALID_ARGTYPE",
            error_description: "Entry must be a string when using a RegExp rule."
          });
      else if (typeof t == "function")
        if (typeof t(e) == "boolean")
          s = t(e);
        else
          throw new n({
            error_code: "ERR_INVALID_ARGTYPE",
            error_description: `Rule '${t}' function must return a boolean value.`
          });
      else t === y ? s = !0 : s = !1;
      if (s === !1)
        return { status: !1, error: o };
    }
    return { status: !0, error: null };
  } catch (t) {
    throw t;
  }
}, Z = (e) => (f(e, "username"), c({ entry: e, RuleAndError: [
  { rule: /^[A-Za-z\s-]+$/, errorMsg: "Username must contain only letters" },
  { rule: /^.{5,}$/, errorMsg: "Username is too small" },
  { rule: /^.{5,35}$/, errorMsg: "Username is too long" }
] })), W = (e) => (f(e, "email"), c({ entry: e, RuleAndError: [
  { rule: O, errorMsg: "Invalid Email address" }
] })), q = (e) => (f(e, "phonenumber"), c({ entry: e, RuleAndError: [
  { rule: /^[0-9]+$/, errorMsg: "Phone number must contain only digits" },
  { rule: /^.{3,}$/, errorMsg: "Phone number is too small" },
  { rule: /^.{3,12}$/, errorMsg: "Phone number is too long" }
] })), Q = (e) => (f(e, "password"), c({ entry: e, RuleAndError: [
  { rule: /^.{8,}$/, errorMsg: "Password must be atleast 8 characters long" },
  { rule: /[A-Z]/, errorMsg: "Password must contain atleast an uppercase letter" },
  { rule: /[a-z]/, errorMsg: "Password must contain atleast a lowercase letter" },
  { rule: /[0-9]/, errorMsg: "Password must contain atleast a number" },
  { rule: /[?@!#$%&*\s]/, errorMsg: "Password must contain atleast a symbol" }
] })), B = (e) => (f(e, "isRequired entry"), c({ entry: e, RuleAndError: [
  {
    rule: (t) => t != null && String(t).trim() !== "",
    errorMsg: "This field is required"
  }
] })), H = (e) => {
  z(e);
  const r = [];
  try {
    for (const { entry: t, RuleAndError: o = [] } of e) {
      const { status: s, error: i } = c({ entry: t, RuleAndError: o });
      s || r.push({ value: t, status: s, error: i });
    }
    return r;
  } catch (t) {
    throw t.code === "ERR_UNKNOWN_KEY" || t.code === "ERR_INVALID_ARGTYPE" || t.code === "ERR_NULL_VALUE" ? t : new _({
      error_code: "ERR_VALIDATION",
      error_description: t.message
    });
  }
};
class J {
  constructor() {
  }
  /** Trims leading/trailing whitespace. No-op for non-strings. */
  static trim(r) {
    return typeof r == "string" ? r.trim() : r;
  }
  /** Converts to lowercase. No-op for non-strings. */
  static lowercase(r) {
    return typeof r == "string" ? r.toLowerCase() : r;
  }
  /** Converts to uppercase. No-op for non-strings. */
  static uppercase(r) {
    return typeof r == "string" ? r.toUpperCase() : r;
  }
  /** Coerces value to number via `Number()`. */
  static toNumber(r) {
    return Number(r);
  }
  /** Coerces value to string via `String()`. */
  static toString(r) {
    return String(r);
  }
  /** Removes all whitespace characters from a string. No-op for non-strings. */
  static removeSpaces(r) {
    return typeof r == "string" ? r.replace(/\s+/g, "") : r;
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
  static URL(r, t) {
    g(r, "url"), t !== void 0 && f(t, "protocol"), r = r.toLowerCase().trim(), t = t?.toLowerCase().trim();
    let o = r.split(":");
    if (o.length === 3 || o.length === 2) {
      r = o.length === 3 ? o[0] + ":" + o[1] : o[0];
      let s = null;
      o.length === 3 ? (s = o[2].indexOf("/"), r = r + o[2].slice(s)) : (s = o[1].indexOf("/"), r = r + o[1].slice(s)), o = r.split(":");
    }
    return o.length === 2 ? r.startsWith(o[0] + "://www.", 0) ? (r = r.replace(`${o[0]}://www.`, `${o[0]}://`), new R(r).verifyPattern() ? { status: !0, url: r } : { status: !1, url: "Url pattern not valid" }) : r.startsWith(o[0] + "://", 0) ? new R(r).verifyPattern() ? { status: !0, url: r } : { status: !1, url: "Url pattern not valid" } : { status: !1, error: "Url pattern not valid" } : o.length === 1 ? r.startsWith("www.", 0) ? (r = r.replace("www.", t ? `${t}://` : "https://"), new R(r).verifyPattern() ? { status: !0, url: r } : { status: !1, url: "Url pattern not valid" }) : (r = t ? `${t}://` + r : "https://" + r, new R(r).verifyPattern() ? { status: !0, url: r } : { status: !1, url: "Url pattern not valid" }) : { status: !1, error: "Url pattern not valid" };
  }
}
class D {
  error = {};
  schema_restr_model = {};
  constructor(r) {
    d(r, "schema_restr_model"), this.schema_restr_model = r;
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
  nestvalidate(r, t = 1) {
    d(r, "obj"), this.error = {};
    try {
      if (Object.keys(this.schema_restr_model).length === 0)
        throw new _({
          error_code: "ERR_VALIDATION",
          error_description: "Missing schema restriction model"
        });
      for (const [o, s] of Object.entries(r)) {
        if (this.schema_restr_model[o] === void 0 || this.schema_restr_model[o] === null || !this.schema_restr_model[o])
          throw new h({
            error_code: "ERR_UNKNOWN_KEY",
            error_description: `key '${o}' not found in schema restriction`
          });
        if (x(s)) {
          if (w(this.schema_restr_model[o]) || E(this.schema_restr_model[o])) {
            if (A(this.schema_restr_model[o]()).status) {
              const { status: p, error: P } = c({
                entry: s,
                RuleAndError: this.schema_restr_model[o]
              });
              p || (this.error[o] = { status: p, error: P, value: s });
            }
            continue;
          }
          const i = new D(this.schema_restr_model[o]).nestvalidate(s);
          i.error && (this.error[o] = i.error);
        } else {
          if (w(this.schema_restr_model[o]) || E(this.schema_restr_model[o]))
            if (E(this.schema_restr_model[o]))
              this.schema_restr_model[o] = this.schema_restr_model[o]();
            else
              throw new l({
                error_code: "ERR_NULL_VALUE",
                error_description: "Used __File wrapper expected File instance as value, got null or undefined"
              });
          if (A(this.schema_restr_model[o]).status) {
            const { status: i, error: p } = c({
              entry: s,
              RuleAndError: Array.isArray(this.schema_restr_model[o]) ? this.schema_restr_model[o] : [this.schema_restr_model[o]]
            });
            i || (this.error[o] = { status: i, error: p, value: s });
          }
        }
      }
      return Object.keys(this.error).length > 0 ? { error: this.error, status: !1, data: null } : { status: !0, error: null, data: r };
    } catch (o) {
      throw o.code !== "ERR_VALIDATION" ? o : new _({
        error_code: "ERR_VALIDATION",
        error_description: o.message
      });
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
  validate(r) {
    d(r, "obj"), this.error = {};
    try {
      if (Object.keys(this.schema_restr_model).length === 0)
        throw new _({
          error_code: "ERR_VALIDATION",
          error_description: "cannot find your schema restriction model"
        });
      if (Object.keys(r).length === 0)
        throw new _({
          error_code: "ERR_VALIDATION",
          error_description: "Data object to be validated cannot be empty"
        });
      for (const [t, o] of Object.entries(r)) {
        if (!this.schema_restr_model[t])
          throw new h({
            error_code: "ERR_UNKNOWN_KEY",
            error_description: `Unknown key '${t}' not found in schema restriction`
          });
        if (w(this.schema_restr_model[t]) || E(this.schema_restr_model[t]))
          throw new n({
            error_code: "ERR_INVALID_ARGTYPE",
            error_description: "drea file wrappers should not be used when using validate()"
          });
        if (A(this.schema_restr_model[t]).status) {
          const { status: s, error: i } = c({
            entry: o,
            RuleAndError: Array.isArray(this.schema_restr_model[t]) ? this.schema_restr_model[t] : [this.schema_restr_model[t]]
          });
          s || (this.error[t] = { status: s, error: i, value: o });
        }
      }
      return Object.keys(this.error).length > 0 ? { error: this.error, status: !1, data: null } : { status: !0, error: null, data: r };
    } catch (t) {
      throw t.code !== "ERR_VALIDATION" ? t : new _({
        error_code: "ERR_VALIDATION",
        error_description: t.message
      });
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
  extend(r) {
    d(r, "ext_restr");
    try {
      for (const [t, o] of Object.entries(r))
        if (!Object.keys(this.schema_restr_model).includes(t))
          this.schema_restr_model[t] = o;
        else
          throw new V({
            error_code: "ERR_DUPLICATE_KEY",
            error_description: `Duplicate key '${t}' already exists in schema`
          });
    } catch (t) {
      throw t.code === "ERR_DUPLICATE_KEY" || t.code === "ERR_INVALID_ARGTYPE" || t.code === "ERR_NULL_VALUE" ? t : new _({
        error_code: "ERR_VALIDATION",
        error_description: t.message
      });
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
  remove(r) {
    if (g(r, "Key"), Object.keys(this.schema_restr_model).find((s) => r === s) === void 0)
      throw new a({
        error_code: "ERR_MISSING_KEY",
        error_description: `key name '${r}' not found`
      });
    delete this.schema_restr_model[r];
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
  swap(r) {
    d(r, "new_restr"), this.schema_restr_model = r;
  }
}
const X = (e) => {
  Array.isArray(e) ? m(e) : b(e);
  const r = (() => Array.isArray(e) ? e : [e]);
  return Object.defineProperty(r, "__isDreaFile", {
    value: !0,
    writable: !1,
    enumerable: !1,
    configurable: !1
  }), Object.freeze(r);
}, rr = (e) => {
  Array.isArray(e) ? m(e) : b(e);
  const r = (() => Array.isArray(e) ? e : [e]);
  return Object.defineProperty(r, "__isDreaMayFile", {
    value: !0,
    writable: !1,
    enumerable: !1,
    configurable: !1
  }), Object.freeze(r);
};
function er(e) {
  d(e);
  const r = (() => e);
  return Object.defineProperty(r, "__isDreaAtom", {
    value: !0,
    writable: !1,
    enumerable: !1,
    configurable: !1
  }), Object.freeze(r);
}
export {
  D as CustomClassicModel,
  y as None,
  J as Normalizer,
  R as URL,
  er as __Atomic,
  X as __File,
  rr as __mayFile,
  W as isEmailValid,
  Q as isPasswordValid,
  q as isPhoneNumberValid,
  B as isRequired,
  Z as isUsernameValid,
  c as validateEntry,
  H as validateMany
};
