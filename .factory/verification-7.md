# Independent verification 7 — PASS

- **Candidate:** `952f2f4c0d45ebe926d8a124804a1bba22a710dc`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2, bundled Chromium

**Verdict: PASS — release accepted.**

Fresh evidence confirms that the deployed local-first PWA matches the candidate,
fulfills the researched smallest useful product, passes every mandatory claim,
and clears the accessibility, privacy, offline, security, caching, and
performance gates. The unnamed-dialog blocker from verification 6 is fixed.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Mandatory first gates

`.factory/claims.json` exists with 15 entries. Every exact command was run
separately after `npm ci` inside a fresh detached clone at the candidate SHA.
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

Evidence: [`claims.log`](verification-assets-7/claims.log).

The live landing page and README were cross-checked against the manifest. The
user-facing privacy, offline, citation, timing, revision, export, encryption,
demo-isolation, free-release, and non-credential promises are represented by
the claims above. Recovery implementation notes are additionally exercised by
the full regression suite.

### Cold first-read test

The first screen passes on desktop and 390×844 mobile:

- What it does: **Record problems you can solve.**
- For whom: **For serious math and CS learners who need evidence beyond course
  badges.**
- What to click first: **Try it with sample data**, beside **Opens a separate
  sample ledger.**

The primary action is visible at mobile y=369.6–417.6. One click opens `/demo`
with three realistic attempts across analysis, graph algorithms, and algebra,
plus the persistent **Demo — sample data, nothing is saved to your proofbook**
banner, **Reset demo**, and **Start for real**.

Evidence: [`live-cold-desktop.png`](verification-assets-7/live-cold-desktop.png),
[`live-cold-mobile-390.png`](verification-assets-7/live-cold-mobile-390.png), and
[`live-demo-mobile-390.png`](verification-assets-7/live-demo-mobile-390.png).

## Clean-checkout gates

- Exact candidate SHA confirmed; the detached clone was clean before testing.
- `npm ci`: PASS; 24 packages installed, 0 vulnerabilities.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- All 15 claim commands: PASS.
- `npm test`: PASS, **33/33** Playwright tests in 1.1 minutes.
- `npm run build`: PASS. This runs `tsc --noEmit && vite build` and produces
  `dist/`. No separate lint script or lint configuration exists.
- JS: 43,414 bytes / 13.49 kB gzip.
- CSS: 18,693 bytes / 4.88 kB gzip.
- Font: 22,496 bytes. Mobile hero: 18,802 bytes.

Evidence: [`npm-audit.log`](verification-assets-7/npm-audit.log),
[`full-test.log`](verification-assets-7/full-test.log), and
[`build.log`](verification-assets-7/build.log).

The suite independently covers exact accepted maxima for topic, goal, title,
source, reference, source URL, solution, and reflection; over-limit rejection;
whitespace-only required fields; damaged saved-state salvage; and recovery-copy
download and restore.

## Live product exercise

A fresh real ledger was exercised end to end on the deployed URL:

- Rejected a whitespace-only topic with `aria-invalid=true` and a useful error.
- Rejected a `javascript:` source URL at the validated persistence boundary and
  retained the valid topic.
- Created **Discrete probability** and a cited **Bound a coupon collector tail**
  attempt. A one-second timer survived pause and reload.
- Saved and revised Markdown solution notes. The earlier solution remained in
  revision history. **Revised** and confidence **3/4** survived reload.
- A literal `<script>` string remained text and did not execute.
- JSON contained one topic, one attempt, and one earlier revision. CSV contained
  one header and one attempt row.
- The encrypted backup began with `PROOFBOOK1` and was 1,162 bytes. A wrong
  password preserved the current ledger. A separate correct-password flow
  restored all three demo attempts into an explicitly confirmed empty ledger.
- Malformed structured JSON was rejected before replacement confirmation and
  did not alter the ledger.
- The print index contained the source, reference, timer, status, confidence,
  revision count, and non-credential notice.
- Cancelling deletion retained the named attempt.

Evidence: [`live-flow.json`](verification-assets-7/live-flow.json),
[`live-encrypted-restore.json`](verification-assets-7/live-encrypted-restore.json),
and [`live-valid-recovery-desktop.png`](verification-assets-7/live-valid-recovery-desktop.png).

## Accessibility, keyboard, and mobile

- Axe 4.10.2 found **zero violations**, including zero serious or critical
  findings, on `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and
  the designed 404 at 390 px.
- Every route has `lang=en`, one H1, one main landmark, a route-specific title,
  complete image alternatives, and zero horizontal page overflow.
- All 28 rendered interactive targets on mobile are at least 44×44 CSS pixels.
- At an effective 390 CSS px width, 200% zoom has zero horizontal page overflow.
- The first Tab exposes the 236×48.8 px skip link with a 3 px phosphor outline;
  Enter focuses `main`. Space activates **Save revision** and produces feedback.
- All three dialogs expose exact accessible names: **Add a topic**, **Record an
  attempt**, and **Password-protect this backup**. Each opens modal with focus on
  **Close dialog**; Escape closes it and restores focus to its opener.
- Under `prefers-reduced-motion: reduce`, no animation or non-zero transition is
  active and scroll behavior is `auto`.
- The supplied `verify-url.sh` passes both `/` and `/demo` with no console or
  page errors.

Evidence: [`live-accessibility-mobile.json`](verification-assets-7/live-accessibility-mobile.json),
[`live-dialog-accessibility.json`](verification-assets-7/live-dialog-accessibility.json),
[`live-keyboard-action.json`](verification-assets-7/live-keyboard-action.json),
[`verify-home/verify.json`](verification-assets-7/verify-home/verify.json), and
[`verify-demo/verify.json`](verification-assets-7/verify-demo/verify.json).

The expected browser network diagnostic for the deliberately requested 404 is
recorded separately; all normal routes have zero console and page errors.

## Privacy, security, links, and delivery

- The complete live create/edit/export/encrypt/import/print flow made eight
  requests. All used `https://self-study-proofbook.sociobot.in`; no data request,
  tracker, CDN, analytics, auth, AI, billing, or license call occurred.
- Demo testing opened only `proofbook-demo-v1`. **Start for real** deleted it and
  opened an empty `proofbook-v1` database.
- HTML, manifest, and worker responses use 30-second revalidation. Hashed JS,
  CSS, and images use one-year immutable caching. The worker precaches the
  unhashed local font and app shell.
- Responses include HSTS, a self-only CSP with `frame-ancestors 'none'`,
  `nosniff`, strict referrer policy, and a camera/microphone/geolocation-denying
  permissions policy.
- Every discovered link returns 200, except the two intentional `mailto:` links.
  All six sitemap URLs, robots, canonical metadata, the 1200×630 social image,
  manifest, icons, and designed HTTP 404 are present.

Evidence: [`live-flow.json`](verification-assets-7/live-flow.json),
[`live-pwa-privacy.json`](verification-assets-7/live-pwa-privacy.json),
[`deployment-identity-headers.json`](verification-assets-7/deployment-identity-headers.json),
and [`live-links-metadata.json`](verification-assets-7/live-links-metadata.json).

This is a static browser-only PWA. It has no server endpoint, unlock call, sign-in,
package API, or CLI. Backend concurrency, persistence-boundary server tests,
health/build endpoints, API allowance with 429/`Retry-After`, Entra authority,
and clean-consumer package installation are therefore not applicable.

## PWA and performance

- The live worker controls `/demo` with cache `proofbook-1d7ab3f23bd1` and a
  cached `/index.html`. Offline reload preserves the demo banner and all three
  sample attempts.
- The manifest uses `display: standalone`, versioned start URL
  `/app?v=1d7ab3f23bd1`, theme/background tokens, and 192/512 icons with a
  maskable 512 icon.
- A fresh controlled two-version test changed the active cache from
  `proofbook-qa-update-a` to `proofbook-qa-update-b`, deleted the old cache,
  displayed **An update is ready. Reload to use it.**, and reloaded the full demo
  offline.
- Lighthouse 13.0.1 mobile live: Performance **99**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.1 s, LCP 1.4 s, TBT 90 ms, CLS 0.046,
  Speed Index 1.1 s, transfer 89 KiB.
- Lighthouse has no lab INP. Five live click-to-editor updates measured 8.9–52.2
  ms, below the 200 ms interaction budget.

Evidence: [`live-pwa-privacy.json`](verification-assets-7/live-pwa-privacy.json),
[`local-sw-update.json`](verification-assets-7/local-sw-update.json),
[`lighthouse-live-home.json`](verification-assets-7/lighthouse-live-home.json),
and [`live-interaction-timing.json`](verification-assets-7/live-interaction-timing.json).

## Deployment identity

All 29 deployable files other than the deployment-only SWA configuration and
source map match the clean candidate build byte-for-byte. Critical hashes:

| File | SHA-256 |
| --- | --- |
| `index.html` | `3fd66cd51ac8414e4dbd8462ac7769175ee2c2eb0e2f0baa11383b21b051fee4` |
| `index-B-LXHcfq.js` | `5278868f49822cf0b2387967656f06ca02ac529ba87318b9a8af9c8345bc331a` |
| `index-CTvWy7GA.css` | `cdb831f466decb9a12d86f2df496fdc168c657838b56bc7c3a74e3a3adfa5b3d` |
| `sw.js` | `ba840b486fa4b36d09229c2d583d12dfeec4fead08e3dd5eff4c0fe94f253058` |
| `manifest.webmanifest` | `3b2dbb51155a2d2730f40e0f33270f4e67fb260154b408fb5221c9b8230dc45f` |

The product-specific visual thesis, original asset prompt and provenance, local
font and license, MIT license, README, demo documentation, privacy and terms
routes, sitemap, and designed 404 are present. AI would conflict with the
brief's learner-written evidence focus and answer-generation non-goal, so no
missed-leverage finding is raised.
