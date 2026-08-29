# Adversarial first-read review 5 — FAIL

**Reviewed:** 2026-08-29 UTC  
**Target:** <https://self-study-proofbook.sociobot.in>  
**Code:** `49bdd6ab132641a528a8ca1c5d487b7d10788252`

## Verdict

**FAIL.** The cold first screen, one-click demo, sandbox isolation, offline
behavior, routing, accessibility, visual identity, and all 17 declared test
commands pass. Two claim-coverage findings remain. One landing claim is absent
from `.factory/claims.json`, and one listed test does not assert the result its
claim promises. This review requires zero findings and no untested claim.

## Findings

### Blocking

#### F-5-1 — Encrypted-backup completeness is an unlisted claim

**Exact quote/location:** landing archive-section H2: **“Keep a complete
encrypted archive.”**

**Why this fails:** “Complete” promises that the password-encrypted download
contains the entire proofbook. No claim entry says that. `encrypted-backup`
proves encryption, decryption, and password non-retention, but checks only that
one sample title survives. `json-complete-archive` proves complete round-trip
behavior only for the plain JSON export. Combining those tests does not prove
that a decrypted backup preserves every topic, attempt, source, timer, status,
confidence value, and revision. A learner could rely on “complete” before
using the backup as their sole recovery file.

**Concrete fix:** either rewrite the heading to **“Export a
password-encrypted backup”**, which matches the current `encrypted-backup`
claim, or add an `encrypted-complete-archive` claim and one tagged test that
decrypts the backup, imports it into an empty ledger, re-exports it, and compares
all archive fields and revisions.

#### F-5-2 — The print-index test does not prove the listed output

**Exact quotes/locations:** landing: **“A mastery index points back to sources,
time spent, and revision history.”** and **“Review a compact list with sources,
effort, status, and revision counts.”** README: **“Creates a printable mastery
index with sources, time, status, and revisions.”** The matching
`print-index` entry makes the same promise.

**Why this fails:** `npm test -- --grep @claim:print-index` exits successfully,
but its tagged test asserts only the route, H1, three `<tr>` elements, and the
non-credential notice. It does not assert a source, elapsed time, status,
revision count, column heading, print stylesheet, or that **Print index** calls
the browser print action. Other claim tests happen to inspect some individual
print values, but the required one-test-per-claim contract says the claim's own
tagged test must assert its observable result. Revision count and the print
action are not asserted anywhere.

**Concrete fix:** strengthen `@claim:print-index` to inspect the six headings
and every promised value in a known sample row, create a revision and verify
the printed count changes, then stub `window.print` and verify **Print index**
invokes it. Keep the sandbox description and test assertions aligned.

## Cold first read

Fresh, no-storage Chromium contexts at **390 × 844** and **1440 × 900** opened
the live home without scrolling. Both had one H1, no console/page errors, no
horizontal overflow, and only same-origin requests.

In my own words, from the first screen:

- It records cited math or CS problems I can solve, with private evidence of
  the work.
- It is for serious math and CS self-learners who want evidence beyond course
  badges.
- I should click **“Try it with sample data.”** The adjacent sentence says
  **“Opens a separate sample ledger.”**

All three answers are present before scrolling on both viewports. The first
screen also states browser-local storage, offline behavior, and the current
free/no-checkout price. Evidence: [mobile screenshot](review-5-assets/live-cold-mobile.png),
[desktop screenshot](review-5-assets/live-cold-desktop.png), and
[live audit](review-5-assets/live-audit.json).

## Copy audit

Counts are whitespace-delimited; hyphenated terms, paths, and version numbers
count as one word. Headings and primary actions are included. Navigation labels,
URLs, shell commands, and sample table data are labels or data rather than
sentences. No item exceeds 22 words. No banned marketing adjective,
inconsistent core term, meaningless mood heading, or non-result-naming primary
action was found. The two flags below are claim-coverage defects, not length
defects.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Record problems you can solve | 5 | Pass — job headline |
| For serious math and CS learners who need evidence beyond course badges. | 12 | Pass — audience and change |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a separate sample ledger. | 5 | Pass — result stated |
| Start your proofbook | 3 | Pass — result-naming action |
| Entries stay in this browser | 5 | Pass — `privacy-local` |
| Works offline after your first visit | 6 | Pass — `offline-reload` |
| Free in this release; no checkout | 6 | Pass — `archive-tools-included` |
| Each attempt becomes one cited, revisable record. | 7 | Pass — `cited-attempt`, `revision-history` |
| Review your cited attempts | 4 | Pass — direct heading |
| A mastery index points back to sources, time spent, and revision history. | 12 | F-5-2 — tagged test omits the named output |
| Build evidence in three steps | 5 | Pass — direct section heading |
| Cite the problem | 3 | Pass — direct step heading |
| Name the book, paper, exam, or page. | 7 | Pass — usable guidance |
| Do not copy restricted problem text. | 6 | Pass — usable guidance |
| Time and revise your solution | 5 | Pass — direct step heading |
| Keep each saved version. | 4 | Pass — `revision-history` |
| Add a short note about what changed. | 7 | Pass — usable guidance |
| Print your mastery index | 4 | F-5-2 — print action is not asserted |
| Review a compact list with sources, effort, status, and revision counts. | 11 | F-5-2 — tagged test omits the named output |
| A record, not a credential | 5 | Pass — direct limit heading |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| Your entries stay in this browser unless you export them. | 10 | Pass — `privacy-local` |
| Use source citations. | 3 | Pass — usable guidance |
| Do not store copyrighted problem text you cannot redistribute. | 9 | Pass — usable guidance |
| Keep a complete encrypted archive | 5 | F-5-1 — unlisted completeness claim |
| Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup. | 13 | Pass — declared export claims |
| Start your proofbook | 3 | Pass — result-naming action |
| Your archive stays in this browser until you choose to download it. | 12 | Pass — `privacy-local` |
| Private records for math and CS self-study. | 7 | Pass — direct footer description |
| Version 1.0.1 | 2 | Pass — useful build label |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Self-Study Proofbook | 2 | Pass — document title |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 17 | Pass — declared claims |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass — audience statement |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| What it does | 3 | Pass — direct heading |
| Groups problem attempts by topic and study goal. | 8 | Pass — `topics-and-goals` |
| Records a source citation, problem reference, and optional source link. | 10 | Pass — `cited-attempt` |
| Times an attempt and preserves each changed solution as a revision. | 11 | Pass — `attempt-timer`, `revision-history` |
| Adds a learner-set status and confidence score. | 7 | Pass — `evidence-status` |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — `json-revisions`, `csv-export` |
| Creates a printable mastery index with sources, time, status, and revisions. | 11 | F-5-2 — tagged test omits the named output |
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
| CSV is useful for a spreadsheet. | 6 | Pass — plain format explanation |
| Backups are encrypted in your browser using your password. | 9 | Pass — `encrypted-backup` |
| The password is never stored. | 5 | Pass — `encrypted-backup` |
| Read the in-app privacy page and terms. | 7 | Pass — links checked |
| Run and test | 3 | Pass — direct heading |
| Requires Node.js 20 or newer. | 5 | Pass — contributor requirement |
| `npm run build` is the deployment command. | 7 | Pass — verified repository fact |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass — verified repository fact |
| Tests use Playwright 1.58.2 and Chromium. | 6 | Pass — package pin verified |
| They cover every claim in `.factory/claims.json`, including offline reload, isolated demo storage, revision history, downloads, and the print route. | 19 | F-5-2 — the print claim is present but under-asserted |
| Technical notes for contributors | 4 | Pass — technical audience is explicit |
| Proofbook rejects invalid saved data and keeps the original file available for recovery. | 13 | Pass — `saved-data-recovery` |
| Proofbook rejects a malformed import before it replaces your current ledger. | 11 | Pass — `safe-import-validation` |
| `src/db.ts` owns the separate IndexedDB namespaces for real and demo data. | 11 | Pass — verified contributor note |
| `src/crypto.ts` implements password-encrypted archives with Web Crypto. | 7 | Pass — verified contributor note |
| `vite.config.ts` generates the service worker and static route documents. | 9 | Pass — verified contributor note |
| `.factory/design.md` records the product-specific visual system and art provenance. | 9 | Pass — verified repository fact |
| `.factory/demo.md` documents the clean demo sandbox. | 6 | Pass — verified repository fact |
| The generated hero art is original to this product. | 9 | Pass — provenance is recorded in the design source |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass — file verified |
| Application code is available under the MIT License. | 8 | Pass — `LICENSE` verified |

Terminology remains consistent: **attempt** is a problem-solving session;
**revision** is a saved solution version; **topic** groups attempts; **mastery
index** is the printable summary; **archive** is exported proofbook data; and
**demo** is the isolated sample ledger.

## Demo and sandbox behavior

- One click from the cold home opened `/?demo=1`. The first resulting screen
  already showed the detailed Dijkstra attempt plus three realistic topic
  groups covering real analysis, graph algorithms, and abstract algebra.
- The persistent banner read **“Demo — sample data, nothing is saved to your
  proofbook.”** and included **Reset demo** and **Start for real**.
- After a saved edit, **Reset demo** restored the original solution.
- A real topic named **“Real ledger marker”** was created before entering demo.
  During demo, IndexedDB contained `proofbook-v1` and `proofbook-demo-v1`.
  **Start for real** deleted only the demo database, retained the real topic,
  and copied no sample attempt into real storage.
- After service-worker control, a live offline `/demo` reload retained the
  banner, H1, and three-attempt summary. The complete live flow request log
  contained only `https://self-study-proofbook.sociobot.in`.

Evidence is in [live-audit.json](review-5-assets/live-audit.json) and the
[mobile demo screenshot](review-5-assets/live-demo-mobile.png).

## Claims and build results

A detached clone at `/tmp/self-study-proofbook-review-5-U4vZEX` checked commit
`49bdd6ab132641a528a8ca1c5d487b7d10788252`. `npm ci` completed with zero
vulnerabilities. Every exact command in `.factory/claims.json` ran separately:

| Claim ID | Command result | Coverage result |
| --- | --- | --- |
| `privacy-local` | Pass | Pass |
| `offline-reload` | Pass | Pass |
| `csv-export` | Pass | Pass |
| `revision-history` | Pass | Pass |
| `print-index` | Pass | **F-5-2 — assertions do not prove the stated output** |
| `encrypted-backup` | Pass | Pass for encryption/password; does not cover F-5-1 completeness |
| `json-revisions` | Pass | Pass |
| `demo-isolation` | Pass | Pass |
| `archive-tools-included` | Pass | Pass |
| `cited-attempt` | Pass | Pass |
| `topics-and-goals` | Pass | Pass |
| `attempt-timer` | Pass | Pass |
| `evidence-status` | Pass | Pass |
| `json-complete-archive` | Pass | Pass for JSON; does not cover F-5-1 encrypted backup |
| `no-credential-service` | Pass | Pass |
| `saved-data-recovery` | Pass | Pass |
| `safe-import-validation` | Pass | Pass |

The same clone passed `npm test` (**33/33**) and `npm run build`; `dist/` was
produced with 43.43 KB raw / 13.49 KB gzip JavaScript. The built JavaScript and
CSS SHA-256 values match the deployed assets exactly. The passing exits do not
remove F-5-1 or F-5-2 because those promises remain absent or under-asserted.

## Earlier finding verification

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the prior
handoff was read. Each earlier finding was checked in current code and on the
live deployment.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | JSON, CSV, print-route access, and encrypted backup remain available without checkout; `archive-tools-included` passes. |
| F-1-2 | A cited attempt persists source/reference in editor and index; `cited-attempt` passes. |
| F-1-3 | Topic, goal, and assigned attempt persist; `topics-and-goals` passes. |
| F-1-4 | Deterministic elapsed time persists to editor, CSV, and print; `attempt-timer` passes. |
| F-1-5 | Status and confidence persist and print; `evidence-status` passes. |
| F-1-6 | JSON round-trip compares all tested state; `json-complete-archive` passes. |
| F-1-7 | Copy remains limited to the non-credential promise; the print notice and same-origin flow pass. |
| F-1-8 | Live heading remains **“Review your cited attempts.”** |
| F-1-9 | Direct unknown route returns HTTP 404 with shared shell, metadata, favicon, legal links, and return action. |
| F-2-1 | Topic selector remains `nav[aria-label="Topics"]`; fresh live Axe scans report zero violations. |
| F-3-1 | Privacy, terms, and 404 H1s remain **“Privacy and data storage,” “Terms of use,”** and **“Page not found.”** |
| F-3-2 | Landing counters/ornament remain absent; footer uses direct product copy and **“Version 1.0.1.”** |
| F-4-1 | Narrow recovery claim is registered; the clean tagged test keeps valid data usable, downloads the untouched original, and restores valid records. |
| F-4-2 | Narrow import claim is registered; the clean tagged test rejects five malformed-data classes before replacement. |
| F-4-3 | First-screen price fact remains **“Free in this release; no checkout.”** |
| F-4-4 | Demo/app H1 remains **“Record and review problem attempts.”** |
| F-4-5 | README uses the current **Price** section and contains no internal billing-process language. |
| F-4-6 | Reader-facing storage and backup copy stays plain; implementation terms remain under **“Technical notes for contributors.”** |

No earlier finding is unfixed, half-fixed, or regressed. F-5-1 and F-5-2 are
new claim-audit findings.

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms` return 200;
  the unknown route returns 404. Each document has `lang="en"`, one H1, one
  main landmark, header/footer, route-specific title and description,
  canonical, Open Graph/Twitter metadata, favicon, and legal links.
- Every crawled HTTP link returns 200. The explicit `mailto:` links were
  excluded from HTTP status checks. Privacy navigation focuses and announces
  its H1; browser Back restores and focuses the home H1.
- Fresh 390px Axe scans report zero violations on every route and the 404.
  `/opt/fleet/lib/verify-url.sh` passes live `/` and `/?demo=1` with no console
  errors, missing alt text, or unlabeled buttons. Reduced-motion, focus-ring,
  print, and touch-target rules are present; the clean interaction suite passes.
- Live response headers include the self-only CSP, `frame-ancestors 'none'`,
  `nosniff`, referrer policy, permissions policy, and immutable caching for
  hashed assets. `robots.txt`, sitemap, manifest, icons, and the designed 404
  are present.
- The asymmetric pixel-proof-terminal layout, original desk illustration,
  phosphor/cyan/amber palette, graph-paper field, local bitmap type, and clipped
  controls match `.factory/design.md`. This is not a generic SaaS template.

## Missed leverage

No missing obvious feature was found. The brief calls for a private,
Markdown-first, offline problem ledger; the product includes JSON import/export,
CSV export, print, encrypted backup, revision history, and offline use. Sync
would change the local-only privacy model. An AI step is not implied by the job
and would be decorative here. No provider key, model endpoint, analytics
script, or third-party runtime asset was found.

## What would make this perfect

Remove “complete” from the encrypted-backup heading or prove complete encrypted
round-trip recovery with a dedicated claim. Then make `@claim:print-index`
assert every named field, revision count, print styling/action, and sample-row
content. Re-run all 17 exact commands, the full suite, build, and the fresh live
mobile/desktop audit. No other gap was found in this round.
