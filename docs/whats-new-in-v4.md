
## 🆕 What's New in v4

v4 adds TypeScript support directly into the existing `drea` package. There is no separate edition to install — TypeScript users get types automatically on `npm install drea@4`.

| Area | Before v4 | v4 |
|---|---|---|
| **TypeScript types** | Not included | Bundled — `import { ... } from 'drea'` just works |
| **Type-narrowing guards** | Not available | `asserts value is T` on every guard |
| **Generic models** | Not available | `validate<T>` / `nestvalidate<T>` — result type inferred from input |
| **File validation** | Not available | `__File()` wrapper — prevents nestvalidate recursing into File objects |
| **Guard system** | Manual null/type checks per function | Dedicated named guard on every public surface |
| **Error descriptions** | Inconsistent | Always `"Expected X for 'paramName', got Y"` |
