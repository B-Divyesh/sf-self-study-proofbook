# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28  
**Target:** <https://self-study-proofbook.sociobot.in>  
**Reviewed commit:** `79cedbc6dbf28de7d55b8896860e43f963848e06`

## Verdict

**FAIL.** The product is clear on a cold first read, the realistic one-click
demo is isolated, all 15 declared claim tests pass from a clean clone, and the
prior review's nine findings are actually fixed. One current accessibility
finding remains. The requested standard permits PASS only with zero findings.

## Cold first read

Fresh, no-storage Chromium contexts at **390 × 844** and **1440 × 900** loaded
the live home before any scrolling. Both showed one H1, no page/application
console errors, and no mobile horizontal overflow.

In my own words, before scrolling:

- This is a private record for the math or CS problems I work through and can
  solve, including time, source, and revisions.
- It is for serious self-learners who need their own evidence of practice,
  rather than a course badge.
- I should click **“Try it with sample data”** first. The adjacent
  **“Opens a separate sample ledger.”** says what will happen.

That answers what it does, who it is for, and what to click from the first
screen. The first-screen headline is five words and the audience sentence is
12 words.

## Findings

### Minor — F-2-1: Topic rail is an invalid nested complementary landmark

**Exact location:** live `/demo` and `/app`, `<aside class="topic-rail">`
inside `<main>` / `.workspace`.

**Evidence:** a fresh live 390px Axe 4.10 scan reports
`landmark-complementary-is-top-level` with **moderate** impact on
`.topic-rail`: “Aside should not be contained in another landmark.” The same
violation occurs on both application routes. It has no serious/critical Axe
violations, but it is still a semantic accessibility defect.

**Why this matters:** a screen-reader user navigating landmarks gets a
complementary landmark nested in the main content even though this is the
application's topic selector, not supplementary page content. That makes the
landmark outline misleading.

**Concrete fix:** replace this element with
`<nav class="topic-rail" aria-label="Topics">` (or a non-landmark `div`),
then add a route-level Axe assertion with no violations, not only no
serious/critical violations.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms and paths count as one
word. The landing page's sample-record values, table column labels, route URLs,
and code commands are labels/data rather than sentences. Headings and actions
are included because they must also be understandable out of context.

No audited landing or README item exceeds 22 words. No banned marketing
adjective, inconsistent core term, unclear heading, or non-result-naming action
was found. `attempt`, `topic`, `revision`, `mastery index`, `archive`, and
`demo` keep the same meaning throughout.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Record problems you can solve | 5 | Pass — plain job headline |
| For serious math and CS learners who need evidence beyond course badges. | 12 | Pass — audience and change |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a separate sample ledger. | 5 | Pass — next step stated |
| Start your proofbook | 3 | Pass — real-data action |
| Entries stay in this browser | 5 | Pass — `privacy-local` |
| Works offline after your first visit | 6 | Pass — `offline-reload` |
| Exports and backups included | 4 | Pass — `archive-tools-included` |
| Each attempt becomes one cited, revisable record. | 7 | Pass — `cited-attempt` / `revision-history` |
| Review your cited attempts | 5 | Pass — clear isolated heading |
| A mastery index points back to sources, time spent, and revision history. | 12 | Pass — `print-index` |
| Build evidence in three steps | 5 | Pass — clear heading |
| Cite the problem | 3 | Pass — clear step heading |
| Name the book, paper, exam, or page. | 7 | Pass |
| Do not copy restricted problem text. | 6 | Pass — guidance, not a product promise |
| Time and revise your solution | 5 | Pass — clear step heading |
| Keep each saved version. | 4 | Pass — `revision-history` |
| Add a short note about what changed. | 7 | Pass |
| Print your mastery index | 4 | Pass — result-naming action, `print-index` |
| Review a compact list with sources, effort, status, and revision counts. | 11 | Pass — `print-index` |
| A record, not a credential | 5 | Pass — clear limit heading |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| Your entries stay in this browser unless you export them. | 9 | Pass — `privacy-local` |
| Use source citations. | 3 | Pass — guidance |
| Do not store copyrighted problem text you cannot redistribute. | 9 | Pass — guidance |
| Keep a complete encrypted archive | 5 | Pass — clear archive heading |
| Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup. | 13 | Pass — declared export claims |
| Start your proofbook | 3 | Pass — result-naming action |
| Your archive stays in this browser until you choose to download it. | 12 | Pass — `privacy-local` |
| Evidence of practice, kept by the learner. | 7 | Pass — footer one-liner |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Self-Study Proofbook | 3 | Pass — document title |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 17 | Pass — cited/timer/revision/offline claims registered |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass — audience statement |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| What it does | 3 | Pass — clear heading |
| Groups problem attempts by topic and study goal. | 8 | Pass — `topics-and-goals` |
| Records a source citation, problem reference, and optional source link. | 10 | Pass — `cited-attempt` |
| Times an attempt and preserves each changed solution as a revision. | 11 | Pass — `attempt-timer` / `revision-history` |
| Adds a learner-set status and confidence score. | 8 | Pass — `evidence-status` |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — `json-revisions` / `csv-export` |
| Creates a printable mastery index with sources, time, status, and revisions. | 10 | Pass — `print-index` |
| Creates a password-encrypted backup with AES-256-GCM. | 6 | Pass — `encrypted-backup` |
| The password is not saved. | 5 | Pass — `encrypted-backup` |
| Works offline after the first visit. | 6 | Pass — `offline-reload` |
| JSON, CSV, printing, and password-encrypted backups are included in the local ledger. | 12 | Pass — `archive-tools-included` |
| Privacy and ownership | 3 | Pass — clear heading |
| Study entries stay in the browser unless the learner exports them. | 10 | Pass — `privacy-local` |
| IndexedDB stores the ledger. | 4 | Pass — implementation detail confirmed in `src/db.ts` |
| The demo uses a separate database and never copies sample records into the real ledger. | 15 | Pass — `demo-isolation` |
| JSON is the complete archive and keeps every revision. | 9 | Pass — `json-complete-archive` |
| CSV is useful for a spreadsheet. | 6 | Pass — plain explanation |
| Backups use AES-256-GCM encryption with a key derived from the learner's password. | 11 | Pass — `encrypted-backup` |
| The password is never stored. | 5 | Pass — `encrypted-backup` |
| Read the in-app privacy page and terms. | 7 | Pass — links return 200 |
| Run and test | 3 | Pass — clear heading |
| Requires Node.js 20 or newer. | 5 | Pass — local environment requirement |
| `npm run build` is the deployment command. | 7 | Pass — verified |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass — verified |
| Tests use Playwright 1.58.2 and Chromium. | 6 | Pass — verified |
| They cover every claim in `.factory/claims.json`, including offline reload, isolated demo storage, revision history, downloads, and the print route. | 19 | Pass — verified |
| Project notes | 2 | Pass — clear heading |
| `src/db.ts` owns the two IndexedDB namespaces. | 6 | Pass — verified |
| `src/crypto.ts` implements password-encrypted archives with Web Crypto. | 7 | Pass — verified |
| `vite.config.ts` generates the service worker and static route documents. | 9 | Pass — verified |
| `.factory/design.md` records the product-specific visual system and art provenance. | 8 | Pass — verified |
| `.factory/demo.md` documents the clean demo sandbox. | 6 | Pass — verified |
| The generated hero art is original to this product. | 9 | Pass — provenance is in `.factory/design.md` |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass — file present |
| Application code is available under the MIT License. | 8 | Pass — `LICENSE` present |

## Demo, claims, privacy, and sandbox checks

- Fresh live `/demo` immediately loaded three realistic cited attempts from
  real analysis, graph algorithms, and abstract algebra. It showed the
  persistent **“Demo — sample data, nothing is saved to your proofbook.”**
  banner, **Reset demo**, and **Start for real**.
- After changing a sample solution, **Reset demo** restored the exact original
  text. After **Start for real**, `/app` showed **“0 attempts across 0
  topics.”** and no demo banner. The code confirms separate names:
  `proofbook-demo-v1` and `proofbook-v1`; demo mode passes only `true` to the
  database functions, and leaving demo deletes only the demo database.
- Live request logs during demo editing, reset, real-data exit, and an offline
  reload contained only `https://self-study-proofbook.sociobot.in`. After the
  worker controlled the page, a fresh `/demo` reload while offline still showed
  **“Build proof you can revisit”** and **“3 attempts across 3 topics.”**
- A fresh detached clone at
  `/tmp/self-study-proofbook-review-ioxZOp` ran `npm ci` with zero audit
  vulnerabilities. Every exact command in `.factory/claims.json` passed:

| Claim test | Result |
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
| `topics-and-goals` | Pass |
| `attempt-timer` | Pass |
| `evidence-status` | Pass |
| `json-complete-archive` | Pass |
| `no-credential-service` | Pass |

No landing or README reliance claim lacks a matching claims entry and tagged
test. `npm test` then passed **20/20**, and `npm run build` passed and produced
`dist/`. The reviewed build's home HTML and hashed JavaScript matched the live
responses byte-for-byte.

## History, structure, and visual review

Read in full: `.factory/review-1.md`, `.factory/polish-1.md`,
`.factory/verification.md`, `.factory/verification-2.md`, and the prior
handoff. Each prior finding was rechecked in both live behavior and code:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | `archive-tools-included` exists and its clean-clone test uses JSON, CSV, print, and encrypted backup without checkout. |
| F-1-2 | `cited-attempt` exists and creates/reloads a cited record in the editor and index. |
| F-1-3 | `topics-and-goals` creates, assigns, reloads, and displays both values. |
| F-1-4 | `attempt-timer` uses deterministic time and checks reload, CSV, and print. |
| F-1-5 | `evidence-status` checks persisted status/confidence and print output. |
| F-1-6 | `json-complete-archive` imports and compares the complete archive. |
| F-1-7 | Copy is narrowed to no credentials; `no-credential-service` confirms the print disclaimer and no external request. |
| F-1-8 | Live heading is now **“Review your cited attempts.”** |
| F-1-9 | Direct unknown route is HTTP 404 with header, footer, skip link, legal links, favicon, canonical, description, and OG/Twitter metadata. |

Fresh live checks found `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and
`/terms` return 200; the deliberate unknown route returns 404. Every route has
one H1, one main landmark, header/footer, favicon, canonical, description, OG
metadata, and route-appropriate title. Client navigation to Privacy focuses
its H1; browser Back returns focus to the home H1. Crawled internal and Param
Factory links return 200; mail links are explicit. The 404's `#main` skip link
correctly remains an in-page link on its intentional 404 document.

The dark pixel-proof-terminal identity matches `.factory/design.md`: original
desk-terminal art, graph-paper field, phosphor/cyan/amber palette, locally
hosted Departure Mono, clipped controls, and a non-generic asymmetric hero. It
does not resemble a generic SaaS hero. No AI capability is implied by the
brief; an AI feature would be decorative here. The supplied product already
includes the expected leverage beyond the core ledger: CSV/JSON import-export,
printable index, encrypted backups, offline use, and an isolated demo.

## What would make this perfect

Repair F-2-1, make the Axe route scan require zero violations, then repeat the
clean-clone claim commands, full suite, and fresh live mobile/desktop review.
At that point no further product gap was found in this round.
