# Adversarial first-read review 7 — PASS

**Reviewed:** 2026-08-29 UTC

**Target:** <https://self-study-proofbook.sociobot.in>

**Code:** `0c0027f79a02d3d513532b6ea746bea9f739051b`

## Verdict

**PASS.** The fresh mobile and desktop first screens explain the job, audience,
and first action. The one-click demo is populated and isolated. All 18 listed
claim commands pass independently from a clean clone. The complete suite,
build, live route checks, accessibility scans, link crawl, offline reload, and
history review also pass. There are zero findings and no untested claim.

## Findings

None.

## Cold first read

Fresh Chromium contexts with no prior storage opened the live home at 390 × 844
and 1440 × 900. Before scrolling, my answers were:

- It records the math or CS problems I can solve as private evidence, including
  sources, time, and revisions.
- It is for serious math and CS learners who need evidence beyond course
  badges.
- I should click **“Try it with sample data.”** The adjacent text says
  **“Opens a separate sample ledger.”**

The exact first-screen text that supplies those answers is **“Record problems
you can solve”**, **“For serious math and CS learners who need evidence beyond
course badges.”**, and **“Try it with sample data.”** Both viewports also show
the three required facts: browser-local entries, offline use after the first
visit, and **“Free in this release; no checkout.”** Both had one H1, no
horizontal overflow, no console or page errors, and only same-origin requests.

## Copy audit

Counts are whitespace-delimited; hyphenated forms and version numbers count as
one word. Navigation labels, URLs, commands, and sample table values are labels
or data rather than sentences. Headings and actions are included. No item is
over 22 words, uses a banned marketing adjective, contains unexplained
reader-facing jargon, uses an inconsistent core term, or relies on a mood or
metaphor heading. Every action names its result.

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
| Free in this release; no checkout | 6 | Pass — price and `archive-tools-included` |
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
| Private records for math and CS self-study. | 7 | Pass — useful footer description |
| Version 1.0.3 | 2 | Pass — matches the manifest and live 404 |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Self-Study Proofbook | 2 | Pass — product title |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 17 | Pass — registered claims |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass — audience statement |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| What it does | 3 | Pass — direct heading |
| Groups problem attempts by topic and study goal. | 8 | Pass — `topics-and-goals` |
| Records a source citation, problem reference, and optional source link. | 10 | Pass — `cited-attempt`, `source-link` |
| Times an attempt and preserves each changed solution as a revision. | 11 | Pass — `attempt-timer`, `revision-history` |
| Adds a learner-set status and confidence score. | 7 | Pass — `evidence-status` |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — `json-revisions`, `csv-export` |
| Creates a printable mastery index with sources, time, status, and revisions. | 11 | Pass — `print-index` |
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
| The demo uses a separate database and never copies sample records into the real ledger. | 15 | Pass — `demo-isolation` |
| JSON is the complete archive and keeps every revision. | 9 | Pass — `json-complete-archive` |
| CSV is useful for a spreadsheet. | 6 | Pass — format explanation |
| Backups are encrypted in your browser using your password. | 9 | Pass — `encrypted-backup` |
| The password is never stored. | 5 | Pass — `encrypted-backup` |
| Read the in-app privacy page and terms. | 7 | Pass — links checked |
| Run and test | 3 | Pass — direct heading |
| Requires Node.js 20 or newer. | 5 | Pass — contributor requirement |
| `npm run build` is the deployment command. | 7 | Pass — verified repository fact |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass — verified repository fact |
| Tests use Playwright 1.58.2 and Chromium. | 6 | Pass — exact package pin verified |
| They cover every claim in `.factory/claims.json`, including offline reload, isolated demo storage, revision history, downloads, and the print route. | 19 | Pass — all 18 entries ran independently |
| Technical notes for contributors | 4 | Pass — technical audience is explicit |
| Proofbook rejects invalid saved data and keeps the original file available for recovery. | 13 | Pass — `saved-data-recovery` |
| Proofbook rejects a malformed import before it replaces your current ledger. | 11 | Pass — `safe-import-validation` |
| `src/db.ts` owns the separate IndexedDB namespaces for real and demo data. | 11 | Pass — source verified |
| `src/crypto.ts` implements password-encrypted archives with Web Crypto. | 7 | Pass — contributor note verified |
| `vite.config.ts` generates the service worker and static route documents. | 9 | Pass — contributor note verified |
| `.factory/design.md` records the product-specific visual system and art provenance. | 9 | Pass — file verified |
| `.factory/demo.md` documents the clean demo sandbox. | 6 | Pass — file verified |
| The generated hero art is original to this product. | 9 | Pass — provenance and source asset verified |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass — file verified |
| Application code is available under the MIT License. | 8 | Pass — `LICENSE` verified |

The implementation, provenance, toolchain, and licensing lines are directly
verifiable repository facts rather than unlisted product-behavior promises.
Core terminology is consistent:

| Concept | Term |
| --- | --- |
| One problem-solving record | attempt |
| Group of attempts | topic |
| Earlier saved solution | revision |
| Printable summary | mastery index |
| Complete exported data | archive |
| Password-protected downloaded file | encrypted backup |
| Learner judgement | evidence status |
| Isolated sample workspace | demo |

## Demo and sandbox behavior

- One click from the cold home opened `/?demo=1`. The resulting first screen
  showed **“3 attempts across 3 topics”**, the selected Dijkstra proof attempt,
  its real source link, timer, evidence state, solution, reflection, and
  revision history.
- The persistent banner read **“Demo — sample data, nothing is saved to your
  proofbook.”** and provided **Reset demo** and **Start for real**.
- After a saved solution edit, **Reset demo** restored the exact original.
- A separate control created **“Review seven real marker”** in the real ledger,
  edited and reset the demo, and then chose **Start for real**. The real marker
  remained, no Dijkstra sample record appeared there, and only `proofbook-v1`
  remained open. A fresh demo used only `proofbook-demo-v1`.
- Every request observed during the live home, demo, edit, reset, and offline
  flows stayed on `https://self-study-proofbook.sociobot.in`.
- After service-worker control, a disconnected live `/demo` reload retained
  the demo banner, task H1, and three-attempt summary.

## Claims and clean-clone results

A detached clean clone at `/tmp/self-study-proofbook-review-7.Pi3kLZ/repo`
checked the requested base. `npm ci` completed with zero vulnerabilities. Each
exact command from `.factory/claims.json` ran separately:

| Claim ID | Result |
| --- | --- |
| `privacy-local` | Pass |
| `offline-reload` | Pass |
| `csv-export` | Pass |
| `revision-history` | Pass |
| `print-index` | Pass |
| `encrypted-backup` | Pass |
| `json-revisions` | Pass |
| `demo-isolation` | Pass |
| `archive-tools-included` | Pass |
| `cited-attempt` | Pass |
| `source-link` | Pass |
| `topics-and-goals` | Pass |
| `attempt-timer` | Pass |
| `evidence-status` | Pass |
| `json-complete-archive` | Pass |
| `no-credential-service` | Pass |
| `saved-data-recovery` | Pass |
| `safe-import-validation` | Pass |

The same clone passed `npm test` (**37/37**), `npm run build`, and
`npm audit --audit-level=high`. The build produced `dist/`; application
JavaScript is 43.62 kB raw / 13.54 kB gzip and CSS is 19.10 kB raw / 4.94 kB
gzip. The built JavaScript and CSS SHA-256 values match the live assets exactly.
No live landing or README reliance sentence is absent from the claim inventory.

## Earlier finding verification

Every earlier review, polish report, and handoff was read. Each finding was
rechecked in current code and on the live deployment rather than accepted from
its repair note.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | JSON, CSV, printing, and encrypted backup remain free without checkout; `archive-tools-included` passes. |
| F-1-2 | Cited attempts retain source/reference and earlier revisions; `cited-attempt` and `revision-history` pass. |
| F-1-3 | Topics, goals, and assigned attempts persist; `topics-and-goals` passes. |
| F-1-4 | Deterministic elapsed time persists to the editor, CSV, and print; `attempt-timer` passes. |
| F-1-5 | Learner-set status and confidence persist and print; `evidence-status` passes. |
| F-1-6 | JSON round-trip retains all tested proofbook state; `json-complete-archive` passes. |
| F-1-7 | Copy remains limited to the non-credential promise; `no-credential-service` passes. |
| F-1-8 | The live preview heading remains **“Review your cited attempts.”** |
| F-1-9 | An unknown URL returns HTTP 404 with the shared shell, complete metadata, icons, legal links, and return action. |
| F-2-1 | The live topic selector remains `nav[aria-label="Topics"]`; route Axe scans have zero violations. |
| F-3-1 | Privacy, terms, and 404 retain the direct H1s **“Privacy and data storage,” “Terms of use,”** and **“Page not found.”** |
| F-3-2 | The landing counters and archive ornament remain absent; footer copy is direct and shows **“Version 1.0.3.”** |
| F-4-1 | The narrowed recovery promise is registered; `saved-data-recovery` keeps valid records usable, downloads the original, and restores valid records. |
| F-4-2 | The narrowed malformed-import promise is registered; `safe-import-validation` rejects malformed data before replacement. |
| F-4-3 | The mobile and desktop first screens state **“Free in this release; no checkout.”** |
| F-4-4 | Demo and app retain the task H1 **“Record and review problem attempts.”** |
| F-4-5 | README pricing uses current user-facing language and contains no internal billing-process text. |
| F-4-6 | Reader-facing storage and backup copy is plain; implementation terms remain under **“Technical notes for contributors.”** |
| F-5-1 | The unsupported completeness heading remains replaced by **“Export a password-encrypted backup.”** |
| F-5-2 | `print-index` checks all six headings, named row values, revision count, print styling, and the browser print action. |
| F-6-1 | `source-link` creates, reloads, exports, imports, and safely renders the exact URL; the live demo visibly includes that source link. |
| F-6-2 | `package.json`, the live shared footer, and the built 404 all show version 1.0.3 from the same build-time source. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms` return 200;
  an unknown route returns a designed 404. Every route has `lang="en"`, one
  task/page H1, one main, a consistent header/footer, its own title and plain
  description, canonical URL, Open Graph/Twitter metadata, favicon, and legal
  links.
- Titles are **“Self-Study Proofbook — Record problems you can solve,” “Demo —
  Self-Study Proofbook,” “Your proofbook — Self-Study Proofbook,” “Mastery
  index — Self-Study Proofbook,” “Privacy and data storage — Self-Study
  Proofbook,” “Terms of use — Self-Study Proofbook,”** and **“Page not found —
  Self-Study Proofbook.”** Each is route-specific and at most 60 characters.
- Every discovered navigational HTTP link, excluding same-document skip
  fragments, returned 200, including the visible Dijkstra source and Param
  Factory link. Explicit `mailto:` links and skip fragments were valid
  status-crawl exceptions.
- Client navigation focuses and announces the new H1. Browser Back restores
  and focuses the home H1.
- Fresh 390 px Axe scans found zero violations on every public route and the
  404. The URL verifier passed live home and demo with no console errors,
  missing alt text, or unlabeled buttons. The sole 404 console message is the
  browser's expected failed-document status, not an application error.
- `robots.txt`, `sitemap.xml`, the manifest, icons, self-only CSP, response
  header `frame-ancestors`, and immutable hashed-asset caching are present.
- The asymmetric pixel-proof-terminal composition, original desk art,
  phosphor/cyan/amber palette, graph-paper field, locally hosted bitmap type,
  and clipped controls match `.factory/design.md`. It is visually distinct and
  not a generic SaaS template.

## Missed leverage

No missing obvious feature was found. The brief calls for a private,
Markdown-first, offline problem ledger. The product provides the implied
high-value extensions: JSON import/export, CSV export, a printable index,
password-encrypted backup, source links, timers, and revision history. Sync
would change the local-only privacy model. An AI step is not implied by this
job and would be decorative. No model endpoint, embedded provider key,
analytics script, or third-party runtime asset was found.

## What would make this perfect

Nothing concrete remains to change. The current release has zero findings and
no untested claim after the complete fresh review.
