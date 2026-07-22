## 🚨 Error Reference

| Error class | `.code` | When thrown |
|---|---|---|
| `ValidationError` | `ERR_VALIDATION` | Base fallback — empty schema, unclassified errors |
| `NullValueError` | `ERR_NULL_VALUE` | A required value is `null` or `undefined` |
| `ArgumentTypeError` | `ERR_INVALID_ARGTYPE` | Wrong type received |
| `MissingKeyError` | `ERR_MISSING_KEY` | Required key absent from input or schema |
| `UnknownKeyError` | `ERR_UNKNOWN_KEY` | Data has a key the schema doesn't recognise |
| `DuplicateKeyError` | `ERR_DUPLICATE_KEY` | Key already exists where uniqueness is required |

---

## 🛣️ Changelog

See **[CHANGELOG.md](./CHANGELOG.md)** for the full version history.

📖 **Full docs, interactive sandbox, and guides → [dreav4.dev](https://dreav4.dev)**

👤 **Author:** Bless B. · **License:** MIT