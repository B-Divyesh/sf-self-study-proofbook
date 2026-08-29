# Polish 6 — complete cumulative review repair map

**Repair source:** candidate `9ddd07c2774213ba5d561b77a102fe8ee6b95fc8` and
the cumulative reviews [review-1.md](review-1.md) through
[review-6.md](review-6.md), including review-report commit
`7676c41c27742e8701d49102acf062dbc760ac84`.

**Product repair commit:** `60f49b2266c4133d44eee44a91c3d36b9401a243`.
**Live:** <https://self-study-proofbook.sociobot.in>.

The repair keeps the local-first PWA and the pixel-proof-terminal visual
system. It adds proof for the last missing feature rather than removing it.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | JSON, CSV, printing, and encrypted backup remain free with no checkout. | `@claim:archive-tools-included`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/?demo=1) 200. |
| F-1-2 | Cited attempts retain their source and problem reference after reload and in the index. | `@claim:cited-attempt`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [index](https://self-study-proofbook.sociobot.in/print?demo=1) 200. |
| F-1-3 | Topics, study goals, and assigned attempts persist. | `@claim:topics-and-goals`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/?demo=1) 200. |
| F-1-4 | Timers persist and appear in CSV and the index. | `@claim:attempt-timer`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [index](https://self-study-proofbook.sociobot.in/print?demo=1) 200. |
| F-1-5 | Evidence status and confidence survive reload and print. | `@claim:evidence-status`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [index](https://self-study-proofbook.sociobot.in/print?demo=1) 200. |
| F-1-6 | JSON export/import retains topics, attempts, citations, timers, status, confidence, and revisions. | `@claim:json-complete-archive`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/?demo=1) 200. |
| F-1-7 | The limit copy stays narrow and the printable index says it is not an accredited credential. | `@claim:no-credential-service`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [index](https://self-study-proofbook.sociobot.in/print?demo=1) 200. |
| F-1-8 | The preview heading remains “Review your cited attempts.” | `route names and landing sections use direct, useful wording`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/) 200. |
| F-1-9 | The direct static 404 retains the shell, metadata, legal links, favicon, and return action. | `static delivery makes hashed assets immutable and unknown routes real 404s`; [404 mobile](evidence/polish-6-live-404/screenshot-mobile.png); live [unknown URL](https://self-study-proofbook.sociobot.in/not-a-proofbook-route) 404. |
| F-2-1 | The topic selector remains `nav[aria-label="Topics"]`, not a nested complementary landmark. | `all public routes have no Axe violations`; [live route audit](evidence/polish-6-live-audit.json); live [demo](https://self-study-proofbook.sociobot.in/?demo=1) 200. |
| F-3-1 | Privacy, terms, and 404 retain direct page H1s and route metadata. | `built deep links carry their own metadata before JavaScript runs`; [live route audit](evidence/polish-6-live-audit.json); live [privacy](https://self-study-proofbook.sociobot.in/privacy), [terms](https://self-study-proofbook.sociobot.in/terms), and 404 checked. |
| F-3-2 | Decorative labels stay removed; the shared footer uses direct copy and a reliable build version. | `route names and landing sections use direct, useful wording`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/) 200. |
| F-4-1 | Invalid saved data is recovered only into usable records while the untouched original remains downloadable. | `@claim:saved-data-recovery`; [live route audit](evidence/polish-6-live-audit.json); live [app](https://self-study-proofbook.sociobot.in/app) 200. |
| F-4-2 | Malformed imports are rejected before a real ledger is replaced. | `@claim:safe-import-validation`; [live route audit](evidence/polish-6-live-audit.json); live [app](https://self-study-proofbook.sociobot.in/app) 200. |
| F-4-3 | The first screen keeps the explicit price fact “Free in this release; no checkout.” | `@claim:archive-tools-included`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/) 200. |
| F-4-4 | Demo and app H1s remain “Record and review problem attempts.” | `route names and landing sections use direct, useful wording`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/?demo=1) and [app](https://self-study-proofbook.sociobot.in/app) 200. |
| F-4-5 | README pricing uses current plain language with no internal billing process. | `README states the current price plainly and labels contributor-only technical notes`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/) 200. |
| F-4-6 | Reader-facing README storage and backup text remains plain; implementation terms are labeled for contributors. | `README states the current price plainly and labels contributor-only technical notes`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [privacy](https://self-study-proofbook.sociobot.in/privacy) 200. |
| F-5-1 | The landing backup heading no longer claims unsupported encrypted completeness. | `@claim:encrypted-backup`; [cold home](evidence/polish-6-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/) 200. |
| F-5-2 | The print test continues to assert all six columns, named row values, revision count, print style, and the print action. | `@claim:print-index`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); live [index](https://self-study-proofbook.sociobot.in/print?demo=1) 200. |
| F-6-1 | Registered `source-link`, seeded the selected demo attempt with a visible HTTPS link, and render saved links in a new tab with `external noopener noreferrer`. The one tagged test creates a link, reloads it, exports JSON, imports it into an empty real ledger, and checks the exact href and attributes after each step. | `@claim:source-link`; [cold demo](evidence/polish-6-live-demo/cold-demo-mobile.png); [live route audit](evidence/polish-6-live-audit.json) records the exact link; live [demo](https://self-study-proofbook.sociobot.in/?demo=1) 200 and its source URL returned 200. |
| F-6-2 | Bumped the manifest and lockfile to `1.0.1`; Vite now reads that one manifest version for the app footer and substitutes it into the static 404 at build time. | `route names and landing sections use direct, useful wording` and `static delivery makes hashed assets immutable and unknown routes real 404s`; [home](evidence/polish-6-live-home/screenshot-mobile.png) and [404](evidence/polish-6-live-404/screenshot-mobile.png); live home and 404 both show `Version 1.0.1`. |

## Verification and delivery

- A detached clean clone at `/tmp/self-study-proofbook-polish-6.494PTF` checked
  commit `60f49b2266c4133d44eee44a91c3d36b9401a243`. It was clean before and
  after testing. `npm ci` and `npm audit --audit-level=high` found zero
  vulnerabilities.
- All 18 exact commands from `.factory/claims.json` passed independently:
  `privacy-local`, `offline-reload`, `csv-export`, `revision-history`,
  `print-index`, `encrypted-backup`, `json-revisions`, `demo-isolation`,
  `archive-tools-included`, `cited-attempt`, `source-link`,
  `topics-and-goals`, `attempt-timer`, `evidence-status`,
  `json-complete-archive`, `no-credential-service`,
  `saved-data-recovery`, and `safe-import-validation`.
- The same clone passed `npm test` (**35/35**) and `npm run build`; `dist/`
  contains its root `index.html`. Application JS is 43.56 KB raw / 13.54 KB
  gzip, and CSS is 18.75 KB raw / 4.89 KB gzip.
- Static deployment `61120da4-d27a-4c45-8248-a7c202075dd6` completed. The
  deployed bundle SHA-256 matches the build:
  `d1e672bd2051af254afc878ff9b4c380048ff4dc9a95e176b3bed8b1bbad0b02`.
- Cold live verification used `/opt/fleet/lib/verify-url.sh` on `/` and
  `/?demo=1`; both reports show no console errors, one H1, `lang="en"`, main,
  complete image alt text, and labeled controls. See the home and demo evidence
  directories above.
- Live mobile Axe scans on `/`, `/?demo=1`, `/demo`, `/app`,
  `/print?demo=1`, `/privacy`, `/terms`, and the direct 404 have zero
  violations. The audit also confirms zero horizontal overflow, same-origin
  demo requests, focusable routed screens, source-link attributes, and an
  offline service-worker reload. The browser's expected network-console note
  for the HTTP 404 document is explicitly separated from app errors.
- Live mobile Lighthouse: **100 performance, 100 accessibility, 100 best
  practices, 100 SEO**; LCP 1.4 s and CLS 0.045. See
  [mobile report](evidence/polish-6-lighthouse-live-mobile.json).
