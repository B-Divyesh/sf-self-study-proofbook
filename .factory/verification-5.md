# Independent verification 5 — FAIL

- **Candidate:** `5c80e38a321df817d6334599f79891d11ea13a46`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2, bundled Chromium

**Verdict: FAIL — do not release.**

The mandatory claims and first-read gates pass, and the live deployment matches
the candidate byte-for-byte. The release is blocked because normal form input
can make an existing real ledger disappear from the app. Mobile footer links
also miss the contract's minimum touch-target size. The researched one-time
purchase model is not implemented or documented as a deliberate deviation.

## Defects by severity

### High — V-5-1: whitespace-only required input makes the current ledger disappear

Reproduced twice on the live `/app` route in fresh Chromium contexts.

Topic path:

1. Add a valid topic and a valid cited attempt. The header reads **1 attempt
   across 1 topic.**
2. Choose **Add topic**, enter three spaces as the required topic name, and
   choose **Add topic**.
3. The browser reports the field as valid (`checkValidity() === true`).
4. The app immediately changes to **0 attempts across 0 topics** and shows the
   misleading success toast **added.**
5. Reloading leaves the proofbook empty with no recovery notice or in-app way
   to restore the prior ledger.

Attempt path:

1. Add a valid topic.
2. Start an attempt with three spaces as the required problem title and valid
   source/reference values.
3. The field again reports valid. The app changes to **0 attempts across 0
   topics** while showing **Attempt started. The timer is running.**

The cause is the mismatch between write and read validation. Native validity is
checked before required strings are trimmed in `src/main.ts:334-358`. The empty
normalized value is saved. The next internal navigation reads it through the
archive validator, whose required fields reject empty strings at
`src/schema.ts:56-103`. `loadState` then places the rejected value under an
unexposed `recovery-*` IndexedDB key and replaces the active real ledger with a
new empty state at `src/db.ts:44-55`. The later success toast overwrites the
recovery toast.

The same validation mismatch also exists for the source and reference fields.
Solution/reflection inputs have no UI limit while the read validator rejects
values above 100,000 characters; source links have no UI limit while the
validator rejects values above 2,048 characters. These paths can create other
states that the app rejects immediately after saving.

Required repair: validate normalized user input and the complete next state
before any write. Keep the existing ledger on failure, bind a plain error to
the offending control, and add real-ledger regression tests for whitespace-only
required fields and every UI/schema boundary. Expose a safe export/restore path
for any `recovery-*` records already created.

### Medium — V-5-2: mobile footer links are below 44×44 CSS pixels

At a 390×844 touch viewport, the live `/demo` footer targets measure:

| Link | Measured box |
| --- | ---: |
| Privacy | 56×20.1 px |
| Terms | 40×20.1 px |
| Built by Param Factory | 176×20.1 px |

The header and demo controls now meet the threshold, but `src/style.css:193-195`
does not give footer links a minimum target. This fails the attached
accessibility and design-principles requirement that every touch target be at
least 44×44 CSS pixels. Axe does not detect target-size failures, so its clean
result does not clear this defect.

### Medium — V-5-3: the brief's one-time purchase model is absent

The researched brief specifies one-time monetization. The candidate has no
price, buy link, license restore/verify flow, Sociobot billing call, or paid
tier. All archive tools are explicitly included without checkout. Repository
search found no checkout, license, price, billing URL, or runtime `fetch` call,
and the live end-to-end request log contains only the product origin.

If the free release is intentional, the brief and handoff must record that
scope decision. Otherwise implement the one-time license through the Sociobot
billing API and apply the attached paid-unlock contract.

## Mandatory first gates

`.factory/claims.json` exists and contains 15 claims. The clean clone initially
had no installed packages; after the locked `npm ci`, every exact listed command
was run separately against the configured demo entry point. All passed:

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

The landing page and README reliance statements were cross-checked against the
claim list. No additional material behavior claim was found without a
corresponding claim test.

### Cold first-read test

The cold first screen passes on desktop and 390 px mobile:

- What it does: **Record problems you can solve.**
- For whom: **For serious math and CS learners who need evidence beyond course
  badges.**
- What to click: **Try it with sample data**, next to **Opens a separate sample
  ledger.**

That one click opens `/demo` with three realistic attempts and the persistent
**Demo — sample data, nothing is saved to your proofbook** banner, plus **Reset
demo** and **Start for real**.

## Clean-checkout gates

- `git rev-parse HEAD`: exact candidate SHA above.
- `npm ci`: pass; 24 packages installed, 0 vulnerabilities.
- `npm audit --audit-level=high`: pass; 0 vulnerabilities.
- `npm test`: pass, **25/25** Playwright tests.
- `npm run build`: pass. This runs `tsc --noEmit && vite build` and creates
  `dist/`. There is no separate lint script.
- Output: JS 37,262 bytes / 11,922 gzip; CSS 17,759 / 4,739 gzip; font 22,496;
  mobile hero 18,802. All stated budgets pass.

## Functional and recovery checks

Live normal/boundary behavior that passed:

- Demo starts with three attempts across three topics and stays isolated from
  the real ledger.
- Exact field maxima (60-character topic, 140-character goal, 100-character
  title/reference, 120-character source) create a record.
- Empty required fields and malformed source URLs remain in their dialogs with
  native actionable validation.
- Timer start/pause advances and persists; learner-set status and confidence
  persist.
- Markdown preview escapes a literal `<script>` instead of executing it.
- Changed solutions preserve revisions. JSON, CSV, print, and encrypted backup
  flows work.
- A 3,571-byte encrypted backup rejects a wrong password with **The password
  did not open this archive**, then restores with the correct password and a
  replacement confirmation.
- Malformed JSON syntax and `{"topics":[],"attempts":[{}]}` are rejected
  without confirmation, preserve all three demo attempts, and remain usable
  after reload.
- Delete cancellation retains the named attempt. Confirmation removes it, and
  **Reset demo** restores the sample.

The whitespace paths in V-5-1 are the release-blocking invalid-input exception.

## Deployment identity, privacy, and delivery

Candidate and live SHA-256 values match exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `ba13078874370ec50c9c77d82a5193999d54a30d543bb1c5006b6d8fd934f773` |
| JavaScript | `c190a6698b590686b0d1f843fce80e975fdda9a7781a3625e94f9d20e0cad2fe` |
| CSS | `1b4d9f1282efecaa11ab73e393d49f74ac4ac1387dc88097c73465486743f384` |
| Service worker | `f7e3c9fb666367ab64c18de14af17cdd493bf094d426be6ef59f31291fe059b8` |
| Manifest | `c8b0d9e9d18b16669612a47185c7fa871eb78f685eca41aa31abccebe884dafe` |

A live save/revision, encrypted export, wrong-password recovery, and successful
restore issued only four requests: document, hashed JS, hashed CSS, and the
self-hosted font. Every request used
`https://self-study-proofbook.sociobot.in`; there were no console or page
errors. No analytics, trackers, CDN assets, auth, AI, billing, or product API
calls were observed.

HTML, manifest, and worker responses use 30-second revalidation. Hashed JS/CSS
use `public, max-age=31536000, immutable`. Responses include HSTS, `nosniff`, a
self-only CSP with `frame-ancestors 'none'`, strict referrer policy, and a
restrictive camera/microphone/geolocation permissions policy. All discovered
internal links and the external Param Factory link return 200; the designed
unknown route returns HTTP 404.

This is a static PWA with no server endpoint, sign-in, or unlock call. Backend
concurrency, persistence, health/build endpoint, request-allowance/429, and
Entra authority checks are therefore not applicable to the current artifact.

## PWA, accessibility, and performance

- Live worker control uses cache `proofbook-5808632a82d7`. After browser offline
  mode, `/demo` reloads with its banner and all three sample attempts.
- A controlled two-version worker test installed a new cache, displayed **An
  update is ready. Reload to use it.**, and reloaded the complete demo offline.
  The live worker's `registration.update()` also completed normally.
- The supplied `verify-url.sh` passes `/` and `/demo`: HTTPS 200, title,
  `lang=en`, one H1, main landmark, image alt text, labelled buttons, and no
  console/page errors.
- Independent Playwright Axe scans report zero violations on `/`, `/demo`,
  `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the 404 route at 390 px.
- There is no horizontal page overflow at 390 px. Reduced motion yields zero
  active transitions/animations and automatic scrolling.
- The first Tab exposes a 236×48.8 px skip link with a 3 px lime outline; Enter
  focuses `main`. Dialog focus starts inside the modal and returns to its opener
  on Escape. SPA forward/back navigation updates the title, returns scroll to
  the top, and focuses the route H1.
- Lighthouse 13.0.1 mobile on the live home: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.29 s, LCP
  1.35 s, TBT 31 ms, CLS 0.046, Speed Index 1.36 s, total transfer 88,522
  bytes. Synthetic Lighthouse does not report INP.

The product-specific pixel proof terminal design, original asset provenance,
single dark treatment, local font, metadata, manifest/icons, privacy/terms,
license, README, sitemap, and designed 404 are present. No AI feature is needed
for the brief's learner-authored evidence job.
