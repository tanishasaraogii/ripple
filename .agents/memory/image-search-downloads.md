---
name: imageSearch downloads
description: How to reliably download images returned by the imageSearch skill
---

When downloading images from `imageSearch` results, prefer `result.thumbnail.src` over `result.properties.url`.

**Why:** `thumbnail.src` is a Brave-hosted proxy URL (`imgs.search.brave.com/...`) that reliably serves the bytes with a proper `image/*` content-type. `properties.url` points at the original source host, which frequently blocks hotlinking (403, HTML error page, or non-image content-type), so direct downloads fail.

**How to apply:** loop results, try `thumbnail.src` first then fall back to `properties.url`; validate `content-type` starts with `image/` and byte length is reasonable (>5KB) before saving. For an artifact, save into its `public/<dir>/` and reference via `import.meta.env.BASE_URL` so files serve through the proxy. (Also note the sandbox `AbortSignal.timeout` quirk — see code-execution-sandbox.md.)
