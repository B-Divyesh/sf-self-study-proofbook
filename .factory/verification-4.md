# Independent verification 4 — FAIL

- **Candidate:** `88895f45df4e5eae908162901636936b3bb96a93`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29

**Verdict:** **FAIL — do not release**

The hard claim and first-read gates pass, and the live deployment exactly
matches the candidate build. The candidate still fails the acceptance contract
because a parseable archive with invalid record structure is saved over the
current ledger and leaves the app blank on every reload. Several persistent
mobile controls also miss the required 44×44 px target.

## Defects by severity

### High — V-4-1: structurally invalid import replaces and bricks the ledger

Reproduced on the live `/demo` route in a fresh Chromium context:

1. Open `/demo`; the three sample attempts render.
2. Choose **Import archive** and select a JSON file containing
   `{"topics":[],"attempts":[{}]}`.
3. Accept **Replace this ledger with 1 imported attempts?**
4. The old screen remains with the raw toast **Cannot read properties of
   undefined (reading 'replace')**.
5. Reload. The document body is blank, there is no H1 or recovery action, and
   Playwright receives `TypeError: Cannot read properties of undefined
   (reading 'replace')`.

The import code at `src/main.ts:443-450` checks only that `topics` and
`attempts` are arrays. It saves the invalid state before proving it can render.
The same path is used by `/app`, so a malformed export from another version or
hand-edited archive can overwrite a learner's real records. Clearing site data
recovers the shell but discards the ledger.

Evidence: [blank app after reload](qa-evidence/live-invalid-structured-import.png).

Required repair: validate the complete archive schema, values, and references
before confirmation or persistence. Reject invalid files with a plain recovery
message and retain the prior state. Add a regression test that imports malformed
record shapes into a non-empty real ledger, reloads, and proves the old records
remain usable.

### Medium — V-4-2: persistent mobile targets are smaller than 44×44 px

At 390×844, computed rectangles on live `/demo` are:

| Control | Measured target |
| --- | ---: |
| Reset demo | 84×32 px |
| Start for real | 116×32 px |
| Proofbook home mark | 30×30 px |
| Demo navigation link | 28×44 px |

The 32 px banner buttons are explicit in `src/style.css:42`; the mobile wordmark
collapses to its 30 px mark at `src/style.css:45,209`. These controls are always
visible and important for leaving or resetting the sandbox. They fail the
attached accessibility and design-principles 44×44 px requirement. Increase
the clickable boxes without reducing the visual density, then add a 390 px
target-size assertion.

Evidence: [390 px demo capture](qa-evidence/live-demo-mobile-390.png).

## Mandatory first checks

`.factory/claims.json` exists with 15 entries. After `npm ci`, every exact
listed command was run separately against the configured `/demo` entry point.
All passed:

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

Individual outputs are in `qa-evidence/claim-tests-installed/`.

The cold first read passes on desktop and 390 px mobile. The first screen says
**Record problems you can solve**, names serious math and CS learners who need
evidence beyond course badges, and presents **Try it with sample data** with the
adjacent result **Opens a separate sample ledger.** One click opens three
realistic attempts and the persistent demo banner with **Reset demo** and
**Start for real**. Evidence:
[desktop](qa-evidence/live-cold-desktop.png) and
[mobile](qa-evidence/live-cold-mobile-390.png).

The landing page and README reliance statements were cross-checked against the
15 claims. No unlisted behavior claim was found.

## Clean-checkout and end-to-end results

- `npm ci`: pass; 24 packages installed and 0 vulnerabilities.
- `npm audit --audit-level=high`: pass; 0 vulnerabilities.
- `npm test`: **22/22 Playwright tests passed**.
- `npm run build`: pass. It runs `tsc --noEmit && vite build` and produces
  `dist/`. There is no separate lint script.
- Normal live flow passes: sample ledger, 60-character topic and 140-character
  goal limits, cited attempt, timer pause, Markdown preview, status/confidence,
  save, reload persistence, delete cancellation, exports, and print index.
- Required empty topic and malformed source URL stay in their dialogs with
  native actionable validation. Malformed JSON syntax shows a parse message
  and retains the current attempt. Script-like Markdown is escaped. The
  malformed *record structure* case is the high-severity exception above.
- Deleting an attempt requires a confirmation naming the record and revision
  count; cancel retains it.

## Live deployment, privacy, and delivery

Candidate/live SHA-256 values match byte-for-byte:

| Asset | SHA-256 |
| --- | --- |
| `index.html` | `0c2a7eaf901a409355aa27c6fdf214580891f4ec2a188e6d086ab7d02a55bab1` |
| JavaScript | `b3f128d785329f940bc8065dbf05fcd9716cd531bc0d04ae75ee1aa1aaa85e6b` |
| CSS | `fc1ceea7435fc44961f90f9ce8a2857ec20d6042c841c6b0824ed38ccb5c7221` |
| service worker | `768a138886f8b0b0b90e08b670bb37be2a0fb46d7c021d6685060ad1d99e1d77` |
| manifest | `4ae7b803ac08e3060ad999be74e4ab465ec230e528421f021c1e2d5a86dde011` |

A fresh valid demo workflow requested only the deployed origin: document, JS,
CSS, and self-hosted font. No analytics, tracker, sign-in, unlock, or product
server endpoint exists. Consequently API allowance/429 and Entra-tenant checks
are not applicable.

HTML, manifest, and worker use 30-second revalidation. Hashed JS/CSS use
`public, max-age=31536000, immutable`. Responses include HSTS, `nosniff`, a
self-only CSP with `frame-ancestors 'none'`, strict referrer policy, and a
restrictive permissions policy. All discovered internal links and the Param
Factory link return 200; the designed unknown route returns HTTP 404.

## PWA, accessibility, and performance

- A fresh worker controlled `/demo` with cache `proofbook-100a3811b14e`.
  Browser offline mode then reloaded the route with its banner and all three
  attempts.
- A controlled two-version production-worker check triggered **An update is
  ready. Reload to use it.** and changed the controlling worker. The deployed
  worker also completed `registration.update()` with no waiting update.
- Playwright Axe found zero violations (not only zero serious/critical) on `/`,
  `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the 404 route.
- At 390 px there is no horizontal page overflow. Reduced motion reports zero
  transition/animation duration and automatic scrolling. The first Tab shows
  the skip link with a 3 px lime outline; Enter moves focus to `main`. Native
  dialog focus starts inside the dialog and returns to its opener on Escape.
- The supplied `verify-url.sh` passes both home and demo: title, `lang=en`, one
  H1, `main`, image alt text, labelled buttons, and no console/page errors.
- Built JS is 33,263 bytes / 10,807 bytes gzip; CSS is 17,633 / 4,722 bytes
  gzip; font is 22,496 bytes; mobile hero is 18,802 bytes.
- Lighthouse 13.4.1 mobile on the live home: Performance **96**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.1 s,
  LCP 1.4 s, TBT 230 ms, CLS 0.046, total transfer 86 KiB. INP is not measured
  on a synthetic cold navigation. Report:
  [lighthouse-live-home.json](qa-evidence/lighthouse-live-home.json).

## Scope notes

This is a static local-first PWA, not a library, CLI, or backend. Consumer
package, concurrency, server persistence, health/build identity, API rate-limit,
and sign-in-provider tests therefore do not apply. No AI feature is implied by
the core job; adding one would weaken the private, learner-authored record.
