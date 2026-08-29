# Independent verification 11 — FAIL

- **Candidate:** `e8a5dc24ac8b172fa7e0dd516e0f5f6883b379d5`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2 bundled Chromium

## Verdict

**FAIL — do not release this candidate.** The product, claims, deployment,
privacy behavior, offline behavior, and quality gates work, but one visible
mobile link misses the required 44 px touch-target height. The accessibility
contract is part of the definition of done.

## Defects by severity

- Critical: none.
- High: none.
- **Medium — V11-M1:** At a 390 × 844 CSS px viewport on `/demo`, the visible
  “Open source link for Dijkstra’s algorithm reference in a new tab” anchor is
  **209 × 17 px**. It is the only undersized visible control found by the
  all-control mobile census, but it violates the attached accessibility and
  design contracts requiring touch targets of at least 44 × 44 CSS px. Axe
  does not detect target-size failures, so its zero-violation result does not
  clear this finding. Increase the link's clickable block/padding to at least
  44 px high without creating horizontal overflow, then add a mobile test for
  every visible source link.
- Low: none.

## Mandatory first gates

`.factory/claims.json` exists with 18 entries. The supplied workspace initially
had no installed dependencies, so a literal pre-install invocation could not
load `@playwright/test`. I therefore created a detached clean worktree at the
exact candidate SHA, ran the required `npm ci`, and made the 18 claim commands
the first test executions in that clean checkout. Every command ran separately
against the product's demo entry point and passed:

| Claim | Result |
| --- | --- |
| privacy-local | PASS |
| offline-reload | PASS |
| csv-export | PASS |
| revision-history | PASS |
| print-index | PASS |
| encrypted-backup | PASS |
| json-revisions | PASS |
| demo-isolation | PASS |
| archive-tools-included | PASS |
| cited-attempt | PASS |
| source-link | PASS |
| topics-and-goals | PASS |
| attempt-timer | PASS |
| evidence-status | PASS |
| json-complete-archive | PASS |
| no-credential-service | PASS |
| saved-data-recovery | PASS |
| safe-import-validation | PASS |

Each claim ID has exactly one tagged test. The landing page, README, privacy
page, terms, and app copy were cross-checked against the registry; no unlisted
reliance claim was found.

Cold first-read, before scrolling or interacting:

- **What it does:** “Record problems you can solve.”
- **For whom:** “For serious math and CS learners who need evidence beyond
  course badges.”
- **What to click first:** “Try it with sample data,” followed by “Opens a
  separate sample ledger.”

This passes on desktop and 390 px mobile. One click opens three realistic
attempts and the persistent “Demo — sample data, nothing is saved to your
proofbook” banner with **Reset demo** and **Start for real**. The same first
screen shows the three required plain facts about browser storage, offline use,
and price.

## Clean checkout quality gates

The authoritative clean worktree was
`/tmp/self-study-proofbook-verify-11.dT8vHk` at the candidate SHA.

- `npm ci`: **PASS**, 24 packages installed, 0 vulnerabilities.
- All 18 exact claim commands: **PASS, 18/18**.
- `npm test`: **PASS, 35/35** Playwright tests in 1.4 minutes.
- `npm run build`: **PASS**. This runs `tsc --noEmit && vite build` and creates
  `dist/`. No separate lint script exists.
- `npm audit --audit-level=high`: **PASS**, 0 vulnerabilities.
- Initial JavaScript: **43,557 B raw / 13.54 kB gzip** (budget 200 kB).
- CSS: **18,747 B raw / 4.89 kB gzip** (budget 50 kB).
- Self-hosted font: **22,496 B** (budget 120 kB).
- Mobile hero: **18,802 B** (budget 300 kB).
- The detached checkout remained clean after test and build.

## End-to-end product exercise

From a fresh live demo, I added a “Type systems” topic and a cited preservation
attempt. A malformed source URL was rejected with the browser message “Please
enter a URL,” the dialog stayed open, and replacing it with an HTTPS URL
recovered immediately. I paused the timer, saved a solution, revised it, set
Mastered / confidence 4, saved again, and reloaded.

The final solution, status, confidence, and earlier revision persisted. CSV had
one header plus four attempt rows. JSON had all four attempts and the new
revision. The print index showed the new source, `Mastered · 4/4`, revision
count, and non-credential notice. **Start for real** then opened an empty real
ledger, confirming demo isolation.

The clean suite additionally verifies whitespace-only input, exact field
maxima, one-character-over-limit notes and URLs, five malformed archive shapes,
corrupted IndexedDB recovery, encrypted backup decryption, and safe JSON
round-trip behavior.

## Accessibility, keyboard, and responsive behavior

- Fresh Axe scans found **0 violations**, including 0 serious/critical, on
  `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the designed
  404.
- Every route has `lang=en`, one H1, one main landmark, a route-specific title,
  and no image missing alt text.
- At 390 px, home and demo have **0 px horizontal overflow**.
- The first keyboard stop is the visible 236 × 49 px skip link with a 3 px
  phosphor outline. Enter moves focus to `main`.
- Keyboard navigation reaches **Add topic**. Enter opens its named dialog,
  Escape closes it, and focus returns to the opener.
- At 200% page scale, the H1 and main content remain visible with no layout
  overflow.
- With reduced motion, all animation and transition durations are 0 and scroll
  behavior is `auto`.
- **Failure:** the demo source link is 209 × 17 px at 390 px; see V11-M1.

The prescribed `verify-url.sh` passes both `/` and `/?demo=1` with HTTP 200,
correct title/lang/main/alt checks, and no console errors. A deliberate 404
navigation produces the browser's expected failed-resource console line for
the 404 document itself; valid routes produce no console or page errors.

## Privacy, PWA, delivery, and deployment identity

- The complete live add/edit/export/print/leave-demo flow made 8 requests, all
  to the product origin. There were no analytics, trackers, CDNs, AI, auth,
  billing, or credential-service requests.
- Live `/demo` is controlled by `/sw.js`; cache
  `proofbook-4e1f775d5ae5` contains `/index.html`. Going offline and reloading
  returned HTTP 200 with the app and all three samples intact.
- A two-version in-memory run of the candidate build displayed “An update is
  ready. Reload to use it.” Reload retained the demo and removed the old cache,
  leaving only `proofbook-update-v2`.
- HTML, the manifest, and the worker revalidate after 30 seconds. Hashed JS/CSS
  assets cache for one year as immutable. The manifest MIME type is correct.
- CSP is self-only and sends `frame-ancestors 'none'` as a response header.
  HSTS, `nosniff`, strict referrer policy, and restrictive permissions policy
  are present.
- A crawl found 10 unique HTTP links and 5 fragment links; all resolve and all
  fragment targets exist. An unknown route returns the designed page with HTTP
  404.
- All **30/30 deployable files** from the clean candidate `dist/` match live
  bytes exactly, including the generated worker, route documents, source map,
  fonts, art, and icons. Deployment-only `staticwebapp.config.json` is
  correctly excluded.

## Lighthouse

Fresh Lighthouse 13.0.1 mobile results after using the container's bundled
Chromium path:

- Performance: **100**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **100**
- FCP: **1.1 s**; LCP: **1.3 s**; TBT: **10 ms**; CLS: **0.045**
- Transfer: **89 KiB**; run warnings: none

Two prior Lighthouse launch attempts failed because the executable path was not
set and then because the tab crashed without container-safe flags; neither
loaded the product. The reported run completed without warnings.

## Applicability and next step

This is a static browser-only PWA using IndexedDB. It has no server endpoint,
product-unlock call, sign-in, package/CLI surface, or backend. Rate-limit
429/`Retry-After`, Entra authority, backend concurrency/health, and clean
consumer-package checks do not apply. This release is explicitly free and has
no checkout. AI answer generation would conflict with the brief's non-goal;
the expected import/export path exists.

Fix V11-M1 and rerun the mobile all-control target census, Axe, claim suite,
full suite, build, offline update/reload, and live byte comparison. Until then,
the release result remains **FAIL**.
