# Adversarial first-read review 6 — FAIL

**Reviewed:** 2026-08-29 UTC

**Target:** <https://self-study-proofbook.sociobot.in>

**Code:** `b0b5a65746a5fd3b966f5ef1e31850337096ac67`

## Verdict

**FAIL.** The cold first screen, realistic one-click demo, sandbox isolation,
offline behavior, all 17 registered claim commands, full test suite, routing,
accessibility, and visual identity pass. One functional sentence in the README
has no matching observable claim coverage, and the public footer version
conflicts with the repository version. This review requires zero findings and
no untested claim.

## Findings

### Blocking

#### F-6-1 — Optional source-link support is an unlisted, untested claim

**Exact quote/location:** `README.md`, **What it does**: “Records a source
citation, problem reference, and optional source link.”

**Why this fails:** `cited-attempt` is the nearest entry in
`.factory/claims.json`, but its claim mentions only a cited, revisable record.
Its tagged test fills and checks **Source** and **Problem reference**; it never
fills **Source link**, reloads it, or verifies that the source becomes the
expected safe external link. An untagged input-limit test happens to enter a
URL but does not assert the saved link or its rendered result. The three demo
records also leave `sourceUrl` empty, so the clean sandbox does not expose this
promised capability. A reader cannot verify the README's distinct feature
claim through its registered test.

**Concrete fix:** either remove **“and optional source link”** from the README,
or add a `source-link` claim with exactly one `@claim:source-link` test. The test
must create an attempt with a known HTTPS URL from `/demo`, reload, verify the
source is a link with the exact `href` and safe external-link attributes, and
confirm the URL survives JSON export/import. Seed one demo attempt with a safe
sample source link so the feature is visible without setup.

### Minor

#### F-6-2 — The public version label conflicts with the repository version

**Exact quote/location:** every live footer and `src/main.ts`/`public/404.html`
show **“Version 1.0.1”**; `package.json` declares **`"version": "1.0.0"`**.

**Why this fails:** the site-structure contract requires a version or build ID
in the shared footer. Two different version values make that identifier
unreliable for a visitor or support report. The label is repeated on every
route, including the designed 404.

**Concrete fix:** choose one release version and use it in `package.json` and
the footer, preferably injecting it at build time. Alternatively show the
generated 12-character build ID already used by the service-worker cache so
the footer identifies the deployed build without a second manual version.

## Cold first read

Fresh, no-storage Chromium contexts at **390 × 844** and **1440 × 900** opened
the live home before scrolling. Both had one H1, no console or page errors, no
horizontal overflow, and only same-origin requests.

In my own words, before scrolling:

- It records the math or CS problems I can solve as private evidence of my
  attempts.
- It is for serious math and CS learners who want evidence beyond course
  badges.
- I should click **“Try it with sample data.”** The adjacent sentence says it
  opens a separate sample ledger.

All three answers are visible on both viewports. The first screen also states
browser-local storage, offline behavior, and the current free/no-checkout
price. Evidence: [mobile screenshot](review-6-assets/live-cold-mobile.png),
[desktop screenshot](review-6-assets/live-cold-desktop.png), and
[cold-read data](review-6-assets/cold-first-read.json).

## Copy audit

Counts are whitespace-delimited; hyphenated terms, paths, and version numbers
count as one word. Headings and actions are included. Navigation labels, URLs,
shell commands, and sample table values are labels or data rather than
sentences. No audited item exceeds 22 words or uses a banned marketing word.
Core terminology is consistent, and result-naming actions pass. The only copy
flags are F-6-1 and F-6-2.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Record problems you can solve | 5 | Pass — job headline |
| For serious math and CS learners who need evidence beyond course badges. | 12 | Pass — audience and change |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a separate sample ledger. | 5 | Pass — next result stated |
| Start your proofbook | 3 | Pass — result-naming action |
| Entries stay in this browser | 5 | Pass — `privacy-local` |
| Works offline after your first visit | 6 | Pass — `offline-reload` |
| Free in this release; no checkout | 6 | Pass — `archive-tools-included` |
| Each attempt becomes one cited, revisable record. | 7 | Pass — `cited-attempt`, `revision-history` |
| Review your cited attempts | 4 | Pass — direct section heading |
| A mastery index points back to sources, time spent, and revision history. | 12 | Pass — `print-index` |
| Build evidence in three steps | 5 | Pass — direct section heading |
| Cite the problem | 3 | Pass — direct step heading |
| Name the book, paper, exam, or page. | 7 | Pass — usable guidance |
| Do not copy restricted problem text. | 6 | Pass — usable guidance |
| Time and revise your solution | 5 | Pass — direct step heading |
| Keep each saved version. | 4 | Pass — `revision-history` |
| Add a short note about what changed. | 7 | Pass — usable guidance |
| Print your mastery index | 4 | Pass — result-naming action, `print-index` |
| Review a compact list with sources, effort, status, and revision counts. | 11 | Pass — `print-index` |
| A record, not a credential | 5 | Pass — direct limit heading |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| Your entries stay in this browser unless you export them. | 10 | Pass — `privacy-local` |
| Use source citations. | 3 | Pass — usable guidance |
| Do not store copyrighted problem text you cannot redistribute. | 9 | Pass — usable guidance |
| Export a password-encrypted backup | 4 | Pass — direct heading, `encrypted-backup` |
| Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup. | 13 | Pass — registered archive claims |
| Start your proofbook | 3 | Pass — result-naming action |
| Your archive stays in this browser until you choose to download it. | 12 | Pass — `privacy-local` |
| Private records for math and CS self-study. | 7 | Pass — direct footer description |
| Version 1.0.1 | 2 | **F-6-2 — conflicts with package version 1.0.0** |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Self-Study Proofbook | 2 | Pass — document title |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 17 | Pass — registered claims |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass — audience statement |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| What it does | 3 | Pass — direct heading |
| Groups problem attempts by topic and study goal. | 8 | Pass — `topics-and-goals` |
| Records a source citation, problem reference, and optional source link. | 10 | **F-6-1 — source-link result is not registered or asserted** |
| Times an attempt and preserves each changed solution as a revision. | 11 | Pass — `attempt-timer`, `revision-history` |
| Adds a learner-set status and confidence score. | 7 | Pass — `evidence-status` |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — `json-revisions`, `csv-export` |
| Creates a printable mastery index with sources, time, status, and revisions. | 11 | Pass — `print-index` now asserts each named field |
| Creates a backup protected by your password. | 7 | Pass — `encrypted-backup` |
| The password is not saved. | 5 | Pass — `encrypted-backup` |
| Works offline after the first visit. | 6 | Pass — `offline-reload` |
| JSON, CSV, printing, and password-encrypted backups are included in the local ledger. | 12 | Pass — `archive-tools-included` |
| Price | 1 | Pass — direct heading |
| This release is free. | 4 | Pass — `archive-tools-included` |
| It has no checkout or license requirement. | 7 | Pass — `archive-tools-included` |
| JSON, CSV, printing, and password-encrypted backups are included. | 8 | Pass — `archive-tools-included` |
| Privacy and ownership | 3 | Pass — direct heading |
| Study entries stay in the browser unless the learner exports them. | 11 | Pass — `privacy-local` |
| Your browser stores the ledger on this device. | 8 | Pass — concrete storage explanation |
| The demo uses a separate database and never copies sample records into the real ledger. | 15 | Pass — `demo-isolation`; live real-data control also passed |
| JSON is the complete archive and keeps every revision. | 9 | Pass — `json-complete-archive` |
| CSV is useful for a spreadsheet. | 6 | Pass — format explanation |
| Backups are encrypted in your browser using your password. | 9 | Pass — `encrypted-backup` |
| The password is never stored. | 5 | Pass — `encrypted-backup` |
| Read the in-app privacy page and terms. | 7 | Pass — links checked |
| Run and test | 3 | Pass — direct heading |
| Requires Node.js 20 or newer. | 5 | Pass — verified contributor requirement |
| `npm run build` is the deployment command. | 7 | Pass — verified repository fact |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass — verified repository fact |
| Tests use Playwright 1.58.2 and Chromium. | 6 | Pass — exact package pin verified |
| They cover every claim in `.factory/claims.json`, including offline reload, isolated demo storage, revision history, downloads, and the print route. | 19 | Pass for the 17 registered entries; F-6-1 is outside the inventory |
| Technical notes for contributors | 4 | Pass — technical audience is explicit |
| Proofbook rejects invalid saved data and keeps the original file available for recovery. | 13 | Pass — `saved-data-recovery` |
| Proofbook rejects a malformed import before it replaces your current ledger. | 11 | Pass — `safe-import-validation` |
| `src/db.ts` owns the separate IndexedDB namespaces for real and demo data. | 11 | Pass — source verified |
| `src/crypto.ts` implements password-encrypted archives with Web Crypto. | 7 | Pass — contributor note verified |
| `vite.config.ts` generates the service worker and static route documents. | 9 | Pass — contributor note verified |
| `.factory/design.md` records the product-specific visual system and art provenance. | 9 | Pass — file verified |
| `.factory/demo.md` documents the clean demo sandbox. | 6 | Pass — file verified |
| The generated hero art is original to this product. | 9 | Pass — provenance recorded with prompt and source asset |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass — file verified |
| Application code is available under the MIT License. | 8 | Pass — `LICENSE` verified |

Terminology remains consistent: **attempt** is a problem-solving record;
**topic** groups attempts; **revision** is an earlier saved solution; **mastery
index** is the printable summary; **archive** is the complete JSON data;
**encrypted backup** is the password-protected download; and **demo** is the
isolated sample ledger.

## Demo, sandbox, offline, and privacy

- One click from the cold home opened `/?demo=1`. The resulting first screen
  already showed a detailed Dijkstra attempt and three realistic topics in
  analysis, graph algorithms, and algebra.
- The persistent banner read **“Demo — sample data, nothing is saved to your
  proofbook.”** and provided **Reset demo** and **Start for real**.
- Saving a changed solution and choosing **Reset demo** restored the initial
  sample solution.
- Leaving a fresh demo produced an empty real ledger. In a separate control, a
  real topic was created before demo use; demo editing and reset did not alter
  it, and **Start for real** returned to the retained topic with no sample
  attempts.
- `src/db.ts` opens `proofbook-demo-v1` for demo data and `proofbook-v1` for
  real data. `resetDemo()` writes only the demo namespace, and `clearDemo()`
  deletes only the demo namespace.
- Every observed request in the live demo and offline flows stayed on
  `https://self-study-proofbook.sociobot.in`. After service-worker control, a
  disconnected reload retained the demo H1 and **“3 attempts across 3
  topics.”**

Evidence: [live audit](review-6-assets/live-audit.json) and
[demo screenshot](review-6-assets/live-demo-mobile.png).

## Claims and clean-build results

A detached clean clone at `/tmp/self-study-proofbook-review-6-4pcZsS` checked
the specified base commit. `npm ci` completed with zero vulnerabilities. Every
exact command from `.factory/claims.json` ran independently:

| Claim ID | Command | Result |
| --- | --- | --- |
| `privacy-local` | `npm test -- --grep @claim:privacy-local` | Pass |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass |
| `csv-export` | `npm test -- --grep @claim:csv-export` | Pass |
| `revision-history` | `npm test -- --grep @claim:revision-history` | Pass |
| `print-index` | `npm test -- --grep @claim:print-index` | Pass |
| `encrypted-backup` | `npm test -- --grep @claim:encrypted-backup` | Pass |
| `json-revisions` | `npm test -- --grep @claim:json-revisions` | Pass |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass |
| `archive-tools-included` | `npm test -- --grep @claim:archive-tools-included` | Pass |
| `cited-attempt` | `npm test -- --grep @claim:cited-attempt` | Pass, but does not cover F-6-1 |
| `topics-and-goals` | `npm test -- --grep @claim:topics-and-goals` | Pass |
| `attempt-timer` | `npm test -- --grep @claim:attempt-timer` | Pass |
| `evidence-status` | `npm test -- --grep @claim:evidence-status` | Pass |
| `json-complete-archive` | `npm test -- --grep @claim:json-complete-archive` | Pass |
| `no-credential-service` | `npm test -- --grep @claim:no-credential-service` | Pass |
| `saved-data-recovery` | `npm test -- --grep @claim:saved-data-recovery` | Pass |
| `safe-import-validation` | `npm test -- --grep @claim:safe-import-validation` | Pass |

The same clone passed `npm test` (**34/34**) and `npm run build`. `dist/` was
produced with 43.43 KB raw / 13.49 KB gzip application JavaScript. The live
JavaScript SHA-256 exactly matches the clean build:
`9c1f0cb2f8efce437f22fde27bb23af4ae82e7762f75ff9928134aac8332d694`.
Passing all registered entries does not remove F-6-1 because that promise is
outside the inventory and its observable result is not asserted.

## Earlier finding verification

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. Each of the 20
earlier findings was checked in the current source and on the live deployment.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | JSON, CSV, printing, and encrypted backup remain usable without checkout; `archive-tools-included` passes. |
| F-1-2 | A cited attempt retains its source and reference in the editor and index; `cited-attempt` passes. F-6-1 concerns the separately promised URL. |
| F-1-3 | Topic, goal, and assigned attempt persist; `topics-and-goals` passes. |
| F-1-4 | Deterministic elapsed time persists to editor, CSV, and print; `attempt-timer` passes. |
| F-1-5 | Learner-set status and confidence persist and print; `evidence-status` passes. |
| F-1-6 | JSON round-trip compares all tested archive state; `json-complete-archive` passes. |
| F-1-7 | Copy remains limited to the non-credential promise; the print notice and same-origin test pass. |
| F-1-8 | The live preview heading remains **“Review your cited attempts.”** |
| F-1-9 | An unknown URL returns HTTP 404 with the shared shell, complete metadata, favicon, legal links, and return action. |
| F-2-1 | The topic selector remains `nav[aria-label="Topics"]`; live Axe reports no violation. |
| F-3-1 | Privacy, terms, and 404 use **“Privacy and data storage,” “Terms of use,”** and **“Page not found.”** |
| F-3-2 | The old decorative section labels and archive ornament remain absent; footer copy remains direct. F-6-2 is a new version-consistency issue. |
| F-4-1 | The narrowed recovery claim is registered; its tagged test retains valid records, downloads the original, and restores valid records. |
| F-4-2 | The narrowed malformed-import claim is registered; its tagged test rejects five malformed-data classes before replacement. |
| F-4-3 | The first screen states **“Free in this release; no checkout.”** |
| F-4-4 | Demo and app H1 remains **“Record and review problem attempts.”** |
| F-4-5 | README uses the current **Price** section and contains no internal billing-process language. |
| F-4-6 | Reader-facing storage and backup copy remains plain; implementation terms are under **Technical notes for contributors**. |
| F-5-1 | The unsupported completeness heading remains replaced by **“Export a password-encrypted backup.”** |
| F-5-2 | `@claim:print-index` now checks all six headings, named source/reference/time/status, changed revision count, print styles, and the browser print call. |

No earlier finding is unfixed, half-fixed, or regressed. F-6-1 and F-6-2 are
new findings.

## Structure, accessibility, and visual identity

- `/`, `/?demo=1`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms`
  return 200; an unknown route returns 404. Each checked page has `lang="en"`,
  one H1, one main, a header/footer, route-specific title and description,
  canonical URL, Open Graph/Twitter metadata, SVG favicon, apple-touch icon,
  and Privacy/Terms links.
- Every discovered navigational HTTP link returns 200. Explicit `mailto:`
  links are valid exceptions. The intentional unknown document retains its 404
  status when its in-page skip fragment is resolved.
- Privacy navigation focuses and announces its H1. Browser Back restores the
  home route and focuses its H1. Reduced-motion preference is detected.
- Fresh 390 px Axe scans found zero violations on all public routes and the
  designed 404. The worker's URL verifier passed `/` and `/?demo=1` with one
  H1, `lang`, main, complete alt text, labelled buttons, and no console errors.
- Live headers include a self-only CSP, response-header `frame-ancestors
  'none'`, `nosniff`, referrer policy, permissions policy, and HSTS.
  `robots.txt`, `sitemap.xml`, manifest, route documents, and service worker are
  present.
- The asymmetric pixel-proof-terminal composition, original desk art,
  phosphor/cyan/amber palette, graph-paper field, local bitmap type, clipped
  controls, and designed 404 match `.factory/design.md`. The site is not a
  generic SaaS template.

Evidence: [route and Axe audit](review-6-assets/live-audit.json),
[home verifier](review-6-assets/verify-home/verify.json),
[demo verifier](review-6-assets/verify-demo/verify.json), and
[404 screenshot](review-6-assets/live-404-mobile.png).

## Missed leverage

No missing high-value product step was found. The brief calls for a private,
offline, Markdown-first problem ledger. The product already provides JSON
import/export, CSV export, printing, encrypted backup, timers, revisions, and
offline use. Sync would change the local-only privacy model. An AI action is
not implied by the job and would be decorative. No model endpoint, provider
key, analytics script, or third-party runtime asset was found.

## What would make this perfect

Register and observably test the optional source-link promise, or remove that
phrase from the README. Make the shared footer version agree with the declared
package version or inject the generated build ID. Then rerun every registered
claim command, the full suite, production build, and fresh live audit. No other
gap was found in this round.
