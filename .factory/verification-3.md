# Independent verification 3 — PASS

**Candidate:** `6361505d517d31376666cf57998b6ea3de3a39f8`  
**Live URL:** <https://self-study-proofbook.sociobot.in>  
**Verified:** 2026-08-29  
**Verdict:** **PASS — candidate accepted**

This is a fresh verification from a detached, clean clone at the stated
candidate. The worktree used for this report was not used to build or test the
product.

## Required first checks

`.factory/claims.json` exists and declares 15 claims. After `npm ci` (0 audit
vulnerabilities), every `test` command was run separately before broader QA.
All passed against the configured demo entry point:

| Claim | Result |
| --- | --- |
| `privacy-local` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `revision-history` | PASS |
| `print-index` | PASS |
| `encrypted-backup` | PASS |
| `json-revisions` | PASS |
| `demo-isolation` | PASS |
| `archive-tools-included` | PASS |
| `cited-attempt` | PASS |
| `topics-and-goals` | PASS |
| `attempt-timer` | PASS |
| `evidence-status` | PASS |
| `json-complete-archive` | PASS |
| `no-credential-service` | PASS |

Cold-reading the live home with a fresh browser: it says **“Record problems you
can solve”**, identifies its audience as serious math and CS learners who need
evidence beyond course badges, and the first clear action is **“Try it with
sample data”**. Adjacent copy says it opens a separate sample ledger. One click
opens `/demo`, immediately shows three realistic attempts, and displays the
persistent demo banner with Reset demo and Start for real. This meets the
plain-words and sandbox requirements.

## Clean-checkout verification

- `npm test`: **20/20 Playwright tests passed**.
- `npm run build`: passed (`tsc --noEmit && vite build`) and produced `dist/`.
  There is no separate lint command; the available type check is in the build.
- The functional tests cover empty state, topics/goals, cited attempts, timer
  persistence, status/confidence boundary selection, revision history,
  JSON/CSV/print/encrypted archive export, archive import, demo isolation,
  malformed encrypted-backup recovery, and password-required validation.
  The encrypted-backup claim independently decrypts the result with
  PBKDF2-derived AES-256-GCM and confirms that its password is absent from the
  file and browser storage.
- Playwright Axe checks found zero violations on all public local routes;
  keyboard coverage confirms the skip link is first, Enter moves focus to
  `main`, and Space operates Save revision.
- Production output: JS 33,279 bytes / **10,907 bytes gzip**, CSS 17,837
  bytes / **4,771 bytes gzip**, font 22,496 bytes, and mobile hero 18,802
  bytes. These are within the applicable budgets.

## Live deployment verification

- Candidate match is exact: SHA-256 for built and live JS is
  `014e07609adc0e7a32d3b5187b4a1848041c9df73dbed0b2795c8a2a044b582c`;
  CSS is
  `351195855441fc4d19ac7e7a4ae85c65d1dd0bb34210a3d37935fd5167e9b161`;
  and service worker is
  `0375df863dde7880cbb9a886a13ec5f702f120e1dd8545cfbdf1728001ce7f7f`.
- Fresh live `/demo` exercise (edit, save, print) sent only same-origin
  requests: document, JS, CSS, and self-hosted font. There were no console or
  page errors, no analytics/tracker calls, no sign-in, no unlock call, and no
  product server endpoint. Rate-limit and Entra-tenant checks are not
  applicable.
- Direct live `/demo` reload remained usable after service-worker activation
  and browser offline mode, retaining the three sample attempts. A controlled
  two-version local production-worker check produced the in-app **“An update
  is ready. Reload to use it.”** notice; the deployed worker has versioned
  caches, `skipWaiting`, and `clients.claim`.
- Live `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms` return
  200. An unknown path returns a styled 404. Hashed assets have
  `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and
  worker use short revalidation. Responses include HSTS, `nosniff`, strict
  referrer policy, restrictive permissions policy, and a self-only CSP that
  matches the observed traffic.
- At 390×844, horizontal page overflow was 0 px. The first Tab focused the
  visible skip link (a 3px lime focus outline), and Enter moved to main.
  Live Axe scans found **0 serious/critical** findings on desktop and mobile.
  Cold load, app flow, and print route had no console/page errors.
- Lighthouse 13.4.1 mobile, run against the live home: **Performance 99**,
  **Accessibility 100**, LCP 1.3 s, CLS 0.043, TBT 80 ms.

## Defects by severity

None found: critical 0, high 0, medium 0, low 0.

## Reproduce

From a clean candidate checkout: run `npm ci`; run each command in
`.factory/claims.json`; then run `npm test` and `npm run build`. The demo
entry point is `/demo` (or `/?demo=1`).
