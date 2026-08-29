# Independent verification 6 — FAIL

- **Candidate:** `4a4d7f46956626cba4e65d615c88ab090543b0a2`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2, bundled Chromium

**Verdict: FAIL — do not release.**

All 15 claim tests, the first-read gate, the complete 32-test suite, TypeScript,
the production build, the live product workflow, offline reload, service-worker
update behavior, privacy checks, deployment identity, bundle budgets, and
Lighthouse budgets pass. The candidate still fails the non-negotiable screen
reader baseline because every modal dialog has an empty accessible name.

## Defects by severity

### Medium, release-blocking — V-6-1: all modal dialogs are unnamed to assistive technology

Reproduced on the live `/demo` route in a fresh Chromium context. Opening each
of these controls produces the same accessibility-tree result:

| Opener | AX role | AX name | Modal state | Initial focus |
| --- | --- | --- | --- | --- |
| Add topic | `dialog` | empty | `true` | Close dialog button |
| Record attempt | `dialog` | empty | `true` | Close dialog button |
| Export encrypted backup | `dialog` | empty | `true` | Close dialog button |

The three native `<dialog>` elements have neither `aria-label` nor
`aria-labelledby`. Their visible headings do not become dialog names
automatically. Chromium's full accessibility tree reports `name: ""` for all
three. Focus is contained, Escape closes each dialog, and focus returns to the
opener, but a screen reader cannot identify which dialog opened.

This violates the attached accessibility requirement to verify dialog
name/role/state. Axe 4.10.2 reports no violations, so its clean scan does not
clear this manual screen-reader failure.

Required repair: give each dialog heading a unique ID and reference it with
`aria-labelledby` on its dialog. Add a regression assertion for a non-empty,
purpose-specific accessible name on all three dialogs.

Evidence: [`dialog-accessibility.json`](verification-assets/dialog-accessibility.json)
and [`live-unnamed-dialog-mobile.png`](verification-assets/live-unnamed-dialog-mobile.png).

## Mandatory first gates

`.factory/claims.json` exists and contains 15 claims. The clean checkout had no
installed packages, so the pre-install invocation could not resolve
`@playwright/test`; after the required locked `npm ci`, every exact listed
command was run independently against the configured demo entry point and
passed:

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

The landing page and README were cross-checked against the claim list. No
additional material behavior claim was found without a claim test.

### Cold first-read test

The first screen passes on desktop and at 390×844:

- What it does: **Record problems you can solve.**
- For whom: **For serious math and CS learners who need evidence beyond course
  badges.**
- What to click first: **Try it with sample data**, beside **Opens a separate
  sample ledger.**

At 390 px the primary action occupies y=369.6–417.6 within the 844 px viewport.
One click opens `/demo`, immediately shows three realistic attempts across
three topics, and displays **Demo — sample data, nothing is saved to your
proofbook**, **Reset demo**, and **Start for real**.

Evidence: [`live-cold-desktop.png`](verification-assets/live-cold-desktop.png),
[`live-cold-mobile-390.png`](verification-assets/live-cold-mobile-390.png), and
[`live-demo-one-click.png`](verification-assets/live-demo-one-click.png).

## Clean-checkout gates

- `git rev-parse HEAD`: exact candidate SHA above.
- `npm ci`: pass; 24 packages installed, 0 vulnerabilities.
- `npm audit --audit-level=high`: pass; 0 vulnerabilities.
- All 15 exact claim commands: pass.
- `npm test`: pass, **32/32** Playwright tests in 1.1 minutes.
- `npm run build`: pass. It runs `tsc --noEmit && vite build` and creates
  `dist/`. There is no separate lint script.
- Output: JS 43,221 bytes / 13.46 kB gzip; CSS 18,693 bytes / 4.88 kB gzip;
  font 22,496 bytes; mobile hero 18,802 bytes. All static-PWA budgets pass.

## Independent live product exercise

The following behavior passed in fresh browser profiles:

- Created a real **Discrete probability** topic and a cited **Bound a coupon
  collector tail** attempt. A one-second timer value survived pause and reload.
- Saved and revised Markdown solution notes. The prior solution remained in
  revision history. Status **Revised** and confidence **3/4** survived reload.
- A literal `<script>` string remained visible text; it did not execute.
- JSON contained one attempt and its earlier revision. CSV contained one header
  and one attempt row. The print route contained one complete source-cited row
  and the non-credential notice.
- The encrypted file began with `PROOFBOOK1` and was 1,084 bytes. A wrong
  password showed **The password did not open this archive** without changing
  the ledger. The correct password and explicit replacement confirmation
  restored it.
- Cancelling deletion retained the named attempt.
- The prior high-severity whitespace reproduction now stays in its dialog with
  `aria-invalid=true` and **Topic name cannot be blank.** The existing attempt
  remains visible immediately and after reload.
- A malformed structured JSON import never opened replacement confirmation and
  preserved the current ledger.
- Exact maxima were accepted and persisted: topic 60, goal 140, title 100,
  source 120, reference 100, and source URL 2,048 characters. A DOM-tampered
  100,001-character solution was rejected and the last valid ledger survived
  reload.

Evidence: [`live-valid-recovery-desktop.png`](verification-assets/live-valid-recovery-desktop.png).

## Privacy, security, and delivery

The entire independent create/edit/export/encrypt/import/print flow made 12
requests. Every request used
`https://self-study-proofbook.sociobot.in`; there were no console or page
errors. No runtime `fetch`, API, analytics, tracker, CDN, auth, AI, billing, or
license surface exists in the candidate. Demo mode opened only
`proofbook-demo-v1`; after **Start for real**, only `proofbook-v1` remained and
the real ledger was empty.

HTML, manifest, and worker responses use
`public, must-revalidate, max-age=30`. Hashed JS/CSS use
`public, max-age=31536000, immutable`. Responses include HSTS, `nosniff`, a
self-only CSP with `frame-ancestors 'none'`, strict referrer policy, and a
camera/microphone/geolocation-denying permissions policy. Normal routes emit no
CSP, console, or page errors.

Every discovered normal internal link, all six sitemap URLs, the external
Sociobot link, `robots.txt`, the manifest, icons, and worker return 200. The
designed unknown route correctly returns HTTP 404. Route-specific titles are
under 60 characters, descriptions under 155, and canonical metadata is correct.

This is a static browser-only PWA with no server endpoint, product-unlock call,
or sign-in. Backend concurrency, health/build endpoint, API request allowance
and 429/`Retry-After`, and Microsoft Entra authority checks are not applicable.
The researched one-time model is deliberately deferred in the brief and README;
the release exposes no price or broken checkout and keeps archive tools free.

## Deployment identity

The local production output and live deployment match byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `be8d0c4854e287dca6c8fd39fa80426d0e351bd04294fddf6b8b764c13dded74` |
| `index-btKUzp9U.js` | `e20737674f2ed9099d1aacca8cb00075f0c3900df0440ee8a36c01d407d6fa39` |
| `index-CTvWy7GA.css` | `cdb831f466decb9a12d86f2df496fdc168c657838b56bc7c3a74e3a3adfa5b3d` |
| `sw.js` | `24bcecfa686045274ba0b5cc874d1783c991f545a595e9e55267f564598659d9` |
| `manifest.webmanifest` | `81b757553e42c82ae0275d421ab5ea1bc0ebe6b072d8a0e7d55c7e570c06678f` |

## PWA, accessibility, and performance

- Live worker control uses cache `proofbook-d964b2bf6383`; `/index.html` is
  cached. With browser networking disabled, `/demo` reloads with its banner and
  all three attempts.
- The manifest is `standalone`, starts at `/app?v=d964b2bf6383`, and supplies
  192 px plus 512 px maskable icons.
- In a controlled two-version production-build server, updating the worker
  changed the cache from `proofbook-update-a` to `proofbook-update-b`, removed
  the old cache, displayed **An update is ready. Reload to use it.**, and
  reloaded the complete demo.
- The supplied `verify-url.sh` passes `/` and `/demo`: HTTPS 200, title,
  `lang=en`, one H1, main landmark, alt text, labelled buttons, and no console
  or page errors. Evidence:
  [`verify-home/verify.json`](verification-assets/verify-home/verify.json) and
  [`verify-demo/verify.json`](verification-assets/verify-demo/verify.json).
- Axe 4.10.2 reports zero violations, including zero serious/critical findings,
  on `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the 404
  route at 390 px. Manual AX inspection nevertheless finds V-6-1.
- At 390 px, every route has zero horizontal overflow and all 32 visible demo
  targets measure at least 44×44 CSS pixels. Browser 200% zoom leaves layout
  overflow at zero.
- The first Tab focuses the 236×48.8 px skip link with a 3 px phosphor outline;
  Enter focuses `main`. Keyboard Enter opens the first main action. Escape from
  a modal returns focus to its opener. Reduced motion produces zero active
  transitions/animations and automatic scrolling.
- Lighthouse 13.0.1 mobile live: Performance **98**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 1.1 s, LCP 1.4 s, TBT 150 ms, CLS
  0.046, Speed Index 1.1 s, total transfer 89 KiB. Lighthouse does not produce
  lab INP; observed controls responded immediately. Evidence:
  [`lighthouse-live-home.json`](verification-assets/lighthouse-live-home.json).

The visual thesis, original asset provenance, single dark treatment, local
font, privacy/terms pages, MIT license, README, demo documentation, sitemap,
and designed 404 are present. AI would conflict with the brief's learner-written
evidence focus and explicit answer-generation non-goal, so no missed AI leverage
finding is raised.
