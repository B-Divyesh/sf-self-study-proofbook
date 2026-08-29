# Independent verification 10 — PASS

- **Candidate:** `9ddd07c2774213ba5d561b77a102fe8ee6b95fc8`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2 bundled Chromium

## Verdict

**PASS — release this candidate.** The smallest useful product works end to
end, the live deployment matches the candidate, every declared claim passes,
and the release has no known defects.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

The previous verifier's V9-M1 finding is fixed. At 390 × 844 CSS px, the
landing actions now measure **222 × 48 px** and **180 × 44 px**. Both meet the
44 px requirement.

## Mandatory first gates

`.factory/claims.json` exists with 17 entries. In a detached clean worktree at
the exact candidate SHA, `npm ci` installed from the lockfile with zero audit
vulnerabilities. Every listed command then ran separately against the demo
entry point and passed:

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
| topics-and-goals | PASS |
| attempt-timer | PASS |
| evidence-status | PASS |
| json-complete-archive | PASS |
| no-credential-service | PASS |
| saved-data-recovery | PASS |
| safe-import-validation | PASS |

Each claim ID appears in exactly one tagged test. I cross-checked the landing
page, README, privacy page, and terms against the registry and found no
unlisted reliance claim. Evidence: [claim results](verification-assets-10/claim-results.tsv)
and [full suite log](verification-assets-10/full-test.log).

Cold first-read, before scrolling or interacting:

- **What it does:** “Record problems you can solve.”
- **For whom:** “For serious math and CS learners who need evidence beyond
  course badges.”
- **What to click first:** “Try it with sample data” — “Opens a separate sample
  ledger.”

This passes on desktop and 390 px mobile. One click opened three realistic
attempts and the persistent “Demo — sample data, nothing is saved to your
proofbook” banner with Reset demo and Start for real. Evidence:
[cold desktop](verification-assets-10/verify-live/screenshot-desktop.png),
[cold mobile](verification-assets-10/live-cold-mobile-390.png), and
[browser record](verification-assets-10/live-browser-qa.json).

## Clean quality gates and budgets

- `npm test`: **PASS, 34/34** Playwright tests in 1.3 minutes.
- `npm audit --audit-level=high`: **PASS, 0 vulnerabilities**.
- `npm run build`: **PASS**. This runs `tsc --noEmit && vite build` and creates
  `dist/`. No separate lint script exists.
- Initial JavaScript: **43,431 B raw / 13,486 B gzip** (budget 200 KB).
- CSS: **18,747 B raw / 4,887 B gzip** (budget 50 KB).
- Self-hosted font: **22,496 B** (budget 120 KB).
- Mobile hero: **18,802 B** (budget 300 KB).
- The detached worktree remained clean after the final build.

Evidence: [build log](verification-assets-10/build.log),
[audit log](verification-assets-10/npm-audit.log), and
[bundle sizes](verification-assets-10/bundle-sizes.json).

## End-to-end and recovery exercise

From a fresh live demo, I added a Type systems topic and a cited TAPL attempt,
ran and paused its timer, saved Markdown notes, changed the solution, set
Mastered / confidence 4, saved again, and reloaded. The current solution and
earlier revision persisted. CSV had one header plus four attempt rows; JSON had
all four attempts and the revision; the print index showed the new source,
status, and non-credential notice.

Whitespace-only topic input and an invalid source URL were rejected without
creating an attempt, and valid replacements recovered immediately. The clean
suite additionally passed exact field maxima, a one-character-over-limit
rejection, malformed topic/attempt/revision/value/reference imports that leave
the ledger unchanged, and corrupted IndexedDB recovery with the untouched
original available to download. Evidence:
[live flow record](verification-assets-10/live-browser-qa.json) and
[desktop result](verification-assets-10/live-flow-desktop.png).

## Accessibility and responsive behavior

- Fresh Axe scans found **zero violations**, including zero serious/critical,
  on `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the 404.
- Every route has `lang=en`, one H1, one main landmark, a route-specific title,
  and no image missing alt text.
- At 390 px, home and demo have zero horizontal overflow. The repaired action
  is 180 × 44 px.
- Keyboard-only use reaches the skip link first, moves focus to main, and
  activates Save revision with Space. Focus is a visible 3 px phosphor outline.
- The Add topic dialog has a purpose-specific name, keeps initial focus inside,
  and returns focus to its opener on Escape.
- At 200% page scale, the visual viewport reports scale 2 and the H1/main
  content remains present. With reduced motion, animation and transition
  durations are 0 s and scroll behavior is `auto`.
- The visual thesis intentionally specifies one dark theme; Axe's contrast
  checks pass that treatment.

Evidence: [browser audit](verification-assets-10/live-browser-qa.json) and
[dialog/zoom record](verification-assets-10/dialog-zoom.json).

## Privacy, PWA, delivery, and deployment identity

- The complete live edit/export/print flow made nine requests, all to the
  product origin. There were no analytics, trackers, CDNs, AI, auth, billing,
  credential-service calls, console errors, or page errors.
- Live `/demo` is controlled by `/sw.js`; cache `proofbook-121a70783e7f`
  reloaded the app and three samples offline.
- A fresh two-version local simulation displayed “An update is ready. Reload
  to use it.”, activated the new versioned cache, and removed the old cache.
- HTML and the worker revalidate after 30 seconds; hashed assets cache for one
  year as immutable; the manifest has the correct MIME type.
- CSP is self-only and sends `frame-ancestors 'none'` as a response header.
  HSTS, `nosniff`, strict referrer policy, and restrictive permissions policy
  are present.
- Every HTTP link returned 200; every fragment target exists. An unknown URL
  returns the designed page with HTTP 404.
- All **30/30 public files** from the clean `dist/` match live bytes exactly,
  including route documents, hashed JS/CSS, worker, manifest, source map,
  fonts, images, icons, robots, and sitemap. Deployment-only
  `staticwebapp.config.json` is correctly excluded.
- The prescribed `verify-url.sh` passed on both local production and live with
  no console errors.

Evidence: [PWA record](verification-assets-10/live-browser-qa.json),
[update simulation](verification-assets-10/local-sw-update.json),
[delivery and identity](verification-assets-10/deployment-delivery.json), and
[live smoke test](verification-assets-10/verify-live/verify.json).

## Lighthouse

Fresh Lighthouse 13.0.1 mobile results:

- Performance: **99**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **100**
- FCP: **0.94 s**; LCP: **1.22 s**; TBT: **118 ms**; CLS: **0.0446**
- Transfer: **91,089 B**; run warnings: none

Evidence: [Lighthouse JSON](verification-assets-10/lighthouse-live-home.json).

## Applicability

This is a static, browser-only PWA using IndexedDB. It has no server endpoint,
product-unlock call, sign-in, package/CLI interface, or backend health,
concurrency, or persistence boundary. Rate-limit/429/`Retry-After`, Entra
authority, and clean consumer-package checks do not apply. This release is
explicitly free and exposes no checkout. AI would conflict with the brief's
answer-generation non-goal; the expected import/export path is present.

## Release decision

**PASS.** Fresh evidence resolves the earlier deployment-only concern: the
site is deployed, healthy, and byte-identical to candidate
`9ddd07c2774213ba5d561b77a102fe8ee6b95fc8`.
