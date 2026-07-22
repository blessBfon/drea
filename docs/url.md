
## 🧮 5. `URL`

Structural URL/URI pattern validator.

⚠️ **Pattern validation only** — not DNS, reachability, or safety.

```typescript
import { URL } from 'drea'

// Pattern only
new URL('http://example.com').verifyPattern() // true

// With constraints (recommended)
new URL('https://api.example.com:443').verifyPattern({
  allowed_protocols: ['https'],
  allowed_ports:     ['443', '80'],
  allowed_domains:   ['api.example.com'],
  contain_query:     false,
  contain_fragment:  false
}) // true | false
```

| Constraint | Type | Effect |
|---|---|---|
| `allowed_protocols` | `string[]` | URL scheme must be in this list |
| `allowed_ports` | `string[]` | URL must carry a port from this list |
| `allowed_domains` | `string[]` | Domain whitelisted (case-insensitive) |
| `contain_fragment` | `boolean` | `true` = require `#hash`; `false` = forbid it |
| `contain_query` | `boolean` | `true` = require `?query`; `false` = forbid it |
| `contain_path` | `boolean` | `true` = require path segments; `false` = forbid them |
| `between` | `number[]` | `[min]` or `[min, max]` character length |

---

