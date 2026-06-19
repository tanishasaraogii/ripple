---
name: code_execution sandbox quirks
description: Runtime gotchas when running JS in the code_execution notebook sandbox
---

- `AbortSignal.timeout(ms)` is **not defined** in the code_execution sandbox. Using it inside `fetch({ signal: AbortSignal.timeout(...) })` throws `ReferenceError: AbortSignal is not defined`, which silently fails any try/catch download loop (everything returns "failed" with no obvious cause).

**Why:** the sandbox's global scope lacks the `AbortSignal` static helper.

**How to apply:** use plain `await fetch(url, { headers })` with no timeout signal. If you need a timeout, construct an `AbortController` manually with `setTimeout`, but plain fetch is usually fine. When a batch of downloads all "fail," check for this before assuming the URLs are bad.
