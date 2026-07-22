
## 🧮 6. `Normalizer`

```typescript
import { Normalizer } from 'drea'

Normalizer.trim('  hello  ')     // 'hello'
Normalizer.lowercase('HELLO')    // 'hello'
Normalizer.uppercase('hello')    // 'HELLO'
Normalizer.toNumber('42')        // 42
Normalizer.toString(42)          // '42'
Normalizer.removeSpaces('h e l') // 'hel'

Normalizer.URL('www.example.com')          // => { status: true, url: 'https://example.com' }
Normalizer.URL('www.example.com', 'http')  // => { status: true, url: 'http://example.com' }
```

---

