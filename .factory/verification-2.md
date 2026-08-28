# Independent verification 2 — PASS

**Candidate:** `5bd77baab547f411ce8f619710f036a438472ce2`  
**Live URL:** <https://self-study-proofbook.sociobot.in>  
**Verified:** 2026-08-28  
**Verdict:** **PASS — release candidate accepted**

The previous report exists as `.factory/verification.md`; this is a fresh,
independent verification of the stated candidate and live deployment.

## First read and demo

Fresh Chromium opened the live home with no prior storage. The first screen says
**“Record problems you can solve”**: it is a private ledger for serious math and
CS learners who need evidence beyond course badges. The first action is **“Try
it with sample data”**, explained beside the control as opening a separate
sample ledger. It goes to `/demo`, immediately shows three cited attempts, and
has the persistent “Demo — sample data, nothing is saved to your proofbook”
banner with **Reset demo** and **Start for real**. This meets the plain-words
and one-click demo requirements.

## Required claim checks

A fresh detached clone of the public repository was checked out at the
candidate, then `npm ci` completed with zero audit vulnerabilities. The required
`.factory/claims.json` is present and contains eight entries. Each exact command
was run separately against the configured production demo entry point; all
passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `revision-history` | `npm test -- --grep @claim:revision-history` | PASS |
| `print-index` | `npm test -- --grep @claim:print-index` | PASS |
| `encrypted-backup` | `npm test -- --grep @claim:encrypted-backup` | PASS |
| `json-revisions` | `npm test -- --grep @claim:json-revisions` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |

The landing page and README claims were cross-checked against these entries:
local-only study records, offline reload, CSV export, revisions, printable
index, encrypted backup, JSON revisions, and demo isolation all have observable
demo tests. No unlisted reliance claim or paid-tier promise was found.

## Local build and functional QA

- `npm test`: **13/13 Playwright tests passed**.
- `npm run build`: passed (`tsc --noEmit && vite build`) and produced `dist/`.
  There is no separate lint script; the production build performs the available
  TypeScript check.
- Built application JS is 33,120 bytes (10.94 KB gzip), CSS is 17,650 bytes
  (4.75 KB gzip), the bundled font is 22.5 KB, and the mobile hero is 18.8 KB.
  All are inside the static/PWA budgets.
- `/opt/fleet/lib/verify-url.sh` passed against both the local production preview
  and the live home: HTTP 200, title, `lang=en`, one H1, main landmark, image
  alt text, labelled buttons, and no console/page errors.
- Independent real-ledger exercise passed: empty ledger → required-topic
  validation → topic → cited attempt → invalid source URL validation → timer
  start → Markdown/status save → reload persistence. A malformed JSON import
  displayed its parse error and the existing record remained usable. Deletion
  was confirmed before removal; dismissing the confirmation retained the record.
  A demo JSON download imported into a clean real ledger only after explicit
  confirmation and restored all three attempts.
- The encrypted-backup claim test independently decrypted the produced archive
  with PBKDF2-derived AES-256-GCM and confirmed the password was absent from
  download bytes, IndexedDB, storage, and the reset form field.

## Live deployment, privacy, PWA, accessibility, and policies

- SHA-256 values matched exactly between the fresh build and live delivery:
  `index.html` `a83d641428056b94fb938b7b82f214c30b1069c405f908db89dd2bfc5f4724ed`,
  JS `8b69cc354323ac142aabc3326faa22af8da7e63b710d19919e5fe9b698a5691a`,
  CSS `2a15306a69bbee9985d7ebb2ada03981e0b9d7b45d85839bdeac737b15ae4b1b`,
  service worker `0fbd24c2c3683206104abd92b6358a27f808ec3402537722409aaba6c6822e6f`,
  and manifest `8411e16db6cf106445f03bb7825f82bc9607523ba7ae98010c3e941e2005b7ca`.
- A fresh live `/demo` context made requests only to
  `https://self-study-proofbook.sociobot.in` throughout the study flow. No
  analytics, trackers, sign-in, product-unlock, or other server-side product
  endpoint is present. Rate limiting and Entra tenant checks are therefore not
  applicable.
- The live worker controls `/demo`, uses cache `proofbook-59ce91385db9`, and
  reloaded `/demo` offline with all three sample attempts visible. Calling its
  update check left the current worker active with no waiting worker; the
  deployed worker source includes versioned caches, `skipWaiting`,
  `clients.claim`, and the in-app update-notice path.
- At 390×844 with reduced motion, horizontal overflow was 0 px, the button
  transition duration was `0s`, the first Tab reached the visible skip link,
  and Enter moved focus to `main`. Axe Playwright scans found **zero
  serious/critical violations** on `/`, `/demo`, `/app`, `/print?demo=1`,
  `/privacy`, and `/terms`; those routes each had one H1, one main landmark, and
  no console/page errors.
- All discovered internal links returned 200 (including real deep links), the
  external Param Factory link returned 200, and mail links were explicit.
  `/not-a-proofbook-route` returns 404. Hashed JS is served as
  `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and
  worker use short revalidation. Live responses include HSTS, `nosniff`, strict
  referrer policy, restrictive permissions policy, and a self-only CSP matching
  observed requests.
- Lighthouse 13.4.1 wrote a valid local mobile `/demo` report: Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT
  100 ms, CLS 0. The launcher reported a browser-tab crash while closing after
  writing the report; the report itself and all independent browser checks
  completed successfully.

## Defects

No release-blocking, critical, high, medium, or low product defects found.

## Reproduce

From a clean checkout of the candidate: `npm ci`, run every command in
`.factory/claims.json`, then run `npm test` and `npm run build`. Start
`npm run preview` and run `/opt/fleet/lib/verify-url.sh` against the preview
and the live URL. The documented sandbox entry point is `/demo`.
