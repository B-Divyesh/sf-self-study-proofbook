# Independent verification 9 — FAIL

- **Candidate:** `026e5dd90e26adbdd90d86337b4e1a147afbd90b`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2 bundled Chromium

## Verdict

**FAIL — do not release this candidate.** The product and every declared claim
work, and the live deployment is byte-identical to the candidate. One mobile
accessibility defect violates the non-negotiable 44 px touch-target contract.

## Defects by severity

- Critical: none.
- High: none.
- **Medium, release-blocking — V9-M1: undersized first-screen mobile action.**
  At a 390 × 844 CSS px viewport, the first-screen **Start your proofbook** link
  measures **160 × 20.1 px**. Its height is less than half the required 44 px.
  This is the real-data entry action beside the sample-data path, so it is not
  decorative. The link is emitted at `src/main.ts:118`; `.text-link` at
  `src/style.css:65` supplies no minimum height or padded hit area. The same
  scan found no other undersized visible target on `/demo`. Evidence:
  [mobile measurements](qa-artifacts/live-accessibility.json) and
  [390 px screenshot](qa-artifacts/live-home-mobile-390.png).
- Low: none.

The repair should give this link a hit area of at least 44 × 44 CSS px without
changing its visible wording, then add an automated 390 px assertion covering
every visible first-screen action. Axe does not flag target size, which is why
the existing accessibility test remained green.

## Mandatory first gates

`.factory/claims.json` exists with 17 entries. In a new clone at
`/tmp/proofbook-verify9-yGYtqR`, checked out at the candidate SHA with an empty
`git status`, `npm ci` completed with 0 vulnerabilities. Every exact command
listed in the file then ran separately and passed:

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

Each claim ID occurs in exactly one test. The live landing page and README were
cross-checked against the registry; no unlisted product claim was found.
Per-claim output is in [the claim results](qa-artifacts/claims/results.tsv).

Cold first-read, before scrolling or interacting:

- **What it does:** “Record problems you can solve.”
- **For whom:** “For serious math and CS learners who need evidence beyond
  course badges.”
- **What to click first:** “Try it with sample data” — “Opens a separate sample
  ledger.”

This gate passes on desktop and 390 px mobile. One click opens three realistic
attempts and the persistent “Demo — sample data, nothing is saved to your
proofbook” banner. Evidence: [desktop capture](qa-artifacts/live-first-read-desktop.png),
[cold-page record](qa-artifacts/live-first-read.json), and
[mobile capture](qa-artifacts/live-home-mobile-390.png).

## Clean quality gates and build budgets

- Clean-clone `npm test`: **PASS, 33/33** in 1.3 minutes.
- Clean-clone `npm run build`: **PASS**. It runs `tsc --noEmit && vite build`
  and produced `dist/`. No separate lint script exists.
- Initial JavaScript: **43,431 B raw / 13,392 B gzip** (budget 200 KB).
- CSS: **18,693 B raw / 4,878 B gzip** (budget 50 KB).
- Self-hosted font: **22,496 B** (budget 120 KB).
- Mobile hero: **18,802 B** (budget 300 KB).
- The clean clone remained unmodified after install, claims, full suite, and
  build.

## Live end-to-end exercise

A fresh demo started with three attempts. I added an Automata theory topic and
a cited Sipser problem, ran and paused its timer, saved a Markdown solution,
changed it, set Mastered / confidence 4, saved again, and reloaded. The current
solution and earlier revision persisted. CSV contained one header plus four
attempts. The print index contained four rows, the source, Mastered · 4/4, and
the non-credential notice. Evidence: [live flow](qa-artifacts/live-e2e.json).

Input and recovery checks also passed:

- Whitespace-only required input was marked `aria-invalid`, explained in plain
  words, and did not change the ledger.
- Exact limits of 60/140/100/120/100/2048 characters and 100,000-character
  notes were accepted. A 100,001-character solution was rejected and the
  last valid value survived reload. Evidence: [boundaries](qa-artifacts/live-boundaries.json).
- A malformed status import was rejected before confirmation and the exported
  ledger remained identical. Evidence: [invalid import](qa-artifacts/live-invalid-import.json).
- After direct IndexedDB corruption, the valid attempt remained usable and the
  untouched damaged archive downloaded exactly. Evidence: [recovery](qa-artifacts/live-recovery.json).

## Accessibility and responsive behavior

- Axe reported **zero violations**, including zero serious/critical, on `/`,
  `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the designed 404.
- Each route has `lang=en`, one H1, one main landmark, and a route-specific title.
- At 390 px, home and demo have no horizontal overflow. Demo controls meet the
  44 px target requirement; the landing secondary action does not (V9-M1).
- Keyboard-only use reaches the skip link first, moves focus to `main`, and can
  create a topic through the dialog. Focus is a visible 3 px
  `rgb(185, 242, 39)` outline.
- With reduced motion, transition and animation durations compute to 0 s and
  scroll behavior is `auto`.

Full evidence: [live accessibility audit](qa-artifacts/live-accessibility.json).

## Privacy, PWA, headers, and performance

- The complete live demo flow made only same-origin requests. There were no
  analytics, tracking, CDN, AI, auth, billing, or credential-service calls and
  no console/page errors.
- The live demo is controlled by `/sw.js`; cache
  `proofbook-2f24ab8b08a0` reloaded the app and three samples offline. A fresh
  two-version local simulation showed “An update is ready. Reload to use it.”
  and removed the old cache. Evidence: [offline](qa-artifacts/live-pwa-offline.json)
  and [update](qa-artifacts/local-sw-update.json).
- HTML and the worker revalidate after 30 seconds; hashed JavaScript is cached
  for one year as immutable. The manifest has the right MIME type. CSP is
  self-only and carries `frame-ancestors 'none'` as a response header. HSTS,
  `nosniff`, strict referrer policy, and device-permission restrictions are
  present. The unknown route returns a designed HTTP 404. Evidence:
  [delivery](qa-artifacts/live-delivery.json).
- Lighthouse 13.0.1 mobile: **Performance 100, Accessibility 100, Best
  Practices 100, SEO 100**; FCP 1.053 s, LCP 1.353 s, TBT 77 ms, CLS 0.0016,
  total transfer 91,106 B, no run warnings. Evidence:
  [Lighthouse report](qa-artifacts/lighthouse-live-home.json).

## Deployment identity and applicability

All **30/30** public files from the fresh production build match the live bytes,
including route documents, hashed JS/CSS, worker, manifest, source map, fonts,
images, icons, robots, and sitemap. The only excluded output is
`staticwebapp.config.json`, which is deployment configuration rather than a
public asset. Evidence: [identity summary](qa-artifacts/deployment-identity.json).

This is a browser-only static PWA with IndexedDB. It has no server API, product
unlock endpoint, sign-in, package/CLI interface, or backend persistence/health
surface. Rate-limit/429/`Retry-After`, Entra authority, concurrency, health
identity, and consumer-package checks are therefore not applicable. The
current brief explicitly scopes this release as free; no checkout is advertised
or contacted. AI would conflict with the non-goal of answer generation, while
the expected import/export path is present.

## Release decision

**FAIL until V9-M1 is repaired and reverified.** No other defect was found.
