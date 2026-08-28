# Independent verification — FAIL

**Candidate:** `9597fb5468af62927e87238fa079ed226db2bfa8`  
**Live URL:** <https://self-study-proofbook.sociobot.in>  
**Verified:** 2026-08-28  
**Verdict:** **FAIL — do not release**

## Release blockers

### Critical — paid purchase is broken in production

The live **Buy archive tools** link is
`https://api.sociobot.in/api/v1/products/self-study-proofbook/checkout`. It
returns **HTTP 404** with `{"error":"enabled factory product","status":404}`.
The landing page and README advertise a `$19 one-time purchase` for archive
tools and unlimited attempts, but the buyer cannot reach checkout. This fails
the end-to-end paid path. The invalid-license endpoint itself returns `200` with
`{"valid":false,"reason":"invalid"}` and allows the deployed origin by CORS,
but it cannot make a purchase possible.

### Critical — claims are not all listed and tested

The eight listed claims pass, but visitor-facing claims in the landing copy and
README have no corresponding entry and observable sandbox test in
`.factory/claims.json`. Examples:

- “The free ledger includes **25 attempts**, JSON and CSV exports, and printing.”
- “The purchase adds **unlimited attempts** and password-encrypted backups.”
- “**JSON keeps every revision**.”
- README: a backup uses **AES-GCM** and the password is **never stored**.

The acceptance contract makes any unlisted claim-like sentence a failing
finding. Existing CSV/revision/encryption tests do not assert the free or paid
limits, JSON archive contents, cipher construction, or password non-storage.

## Other defects

- **Medium:** `GET /assets/index-9NY91Iir.js` has `Cache-Control: public,
  must-revalidate, max-age=30`, not long-lived immutable caching for a hashed
  asset.
- **Low:** `GET /not-a-proofbook-route` returns HTTP 200 and landing HTML. The
  SPA subsequently shows its styled not-found view, but direct non-JS/crawler
  requests do not receive HTTP 404.

## Required claims and first read

`claims.json` exists. From a fresh detached clone at the candidate, after
`npm ci`, every declared command was run through the demo entry point. All pass:

| Claim | Result |
| --- | --- |
| `privacy-local` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `revision-history` | PASS |
| `print-index` | PASS |
| `encrypted-backup` | PASS |
| `demo-isolation` | PASS |
| `paid-price` | PASS — asserts price/copy/link only; it does not open checkout |

Fresh full-suite confirmation: `npm test` **11/11 Playwright tests passed**.

Cold live-page first read passes: the headline says it records “problems you can
solve,” names serious math and CS learners, and gives **Try it with sample data**
as the first action. It opens `/demo`, whose persistent banner says sample data
is not saved and provides Reset demo and Start for real.

## Build and end-to-end evidence

- `npm ci` completed; `npm audit --audit-level=high` found zero vulnerabilities.
- `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/`.
- Output: JS 36.05 KB (11.78 KB gzip), CSS 17.65 KB (4.75 KB gzip), font 22.50
  KB, mobile hero 18.80 KB — within static bundle budgets.
- Manual real-ledger flow passed: empty ledger → topic → cited attempt →
  Markdown/status save → reload persistence. Native required/URL validation
  retained invalid input; malformed JSON import gave a recovery toast; there
  were no console/page errors.
- Live demo privacy check: saving a revision requested only same-origin HTML,
  JS, CSS, and local font; no study data left the device.
- Live PWA check: a fresh context registered `/sw.js`, controlled `/`, cached
  `/index.html` in `proofbook-153160f67d4d`, then reloaded `/demo` offline with
  its H1 and all three sample attempts. The worker has versioned cache,
  `skipWaiting`, `clients.claim`, and update-notice code; no update was available
  during this run to trigger the UI.

## Deployment, accessibility, security, and API evidence

- Fresh-build/live SHA-256 matched byte-for-byte for `index.html`, JS, CSS,
  `sw.js`, and `manifest.webmanifest`; the live deployment matches the candidate.
- `verify-url.sh` passed on local production preview and live home: title,
  `lang=en`, one H1, main landmark, image alt text, labelled buttons, and zero
  console errors.
- Live 390×844 reduced-motion test: zero horizontal overflow, no animations,
  skip link moved focus to main, and Axe had **zero serious/critical** findings.
- Headers include HSTS, self-restricted CSP, `nosniff`, strict referrer policy,
  and restrictive permissions policy. No sign-in/authentication exists.
- Crawled links: internal routes, print routes, and `sociobot.in` returned 200;
  checkout is the only failed HTTP link.
- Rate-limit check: 100 invalid-license GETs at concurrency 20 received the first
  429 on request 31 (about 30 accepted in the burst; one later request completed
  after a window advanced). 429 responses had `Retry-After: 1`–`4` and
  `X-RateLimit-After`.

## Measurement note

Lighthouse 12.5.1 could not complete in this container: it either could not
locate Chrome or its tab crashed with bundled Chromium. This report does not
substitute the successful bundle, browser-load, and Axe checks for a Lighthouse
release measurement.

## Required remediation

1. Register/enable the Sociobot billing product and verify a real hosted
   checkout at the advertised $19 one-time price.
2. Add one demo-entry-point test/claim for every remaining reliance claim, or
   remove/narrow the copy, especially tier limits, JSON preservation, and
   encryption/password-storage promises.
3. Send immutable long-lived cache headers for hashed assets.
4. Return the designed 404 document with HTTP 404 for unknown direct routes.
