# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-29 UTC

**Target:** <https://self-study-proofbook.sociobot.in>

**Code:** `0b963410c0ee426c2dab53f35d48e7837eb1753a`

## Verdict

**FAIL.** The live product is clear, usable, isolated in demo mode, accessible,
and visually distinct. All 15 declared claim tests pass independently from a
clean clone. It still has two unlisted README safety claims and four
plain-language defects. The required result is zero findings and no untested
claim.

## Findings

### Blocking

#### F-4-1 — Write validation and recovery are unlisted claims

**Exact quote/location:** `README.md`, Project notes: “`src/db.ts` owns the two
IndexedDB namespaces, validates every write, and keeps visible recovery copies
of damaged legacy data.”

**Why this fails:** “Validates every write” and “keeps visible recovery copies”
are safety promises a learner can rely on. Neither appears in
`.factory/claims.json`. Related untagged tests do not satisfy the required claim
inventory, and “every write” is broader than the finite cases tested.

**Concrete fix:** narrow this to **“Proofbook rejects invalid saved data and
keeps the original file available for recovery.”** Add one
`saved-data-recovery` claim and one tagged test that corrupts stored data,
confirms valid records remain usable, downloads the untouched original, and
restores the valid records. Otherwise remove the promise.

#### F-4-2 — Exhaustive import validation is an unlisted claim

**Exact quote/location:** `README.md`, Project notes: “`src/schema.ts` validates
every imported topic, attempt, revision, value, and reference before the current
ledger can be replaced.”

**Why this fails:** This is an absolute data-loss-prevention claim. No
`.factory/claims.json` entry names it, and no exact `@claim:` test owns it. The
untagged malformed-import and field-limit tests do not inventory the promise.

**Concrete fix:** replace it with **“Proofbook rejects a malformed import before
it replaces your current ledger.”** Add a `safe-import-validation` claim and one
tagged test that begins with a real record, attempts malformed imports across
the accepted schema, and confirms the record is unchanged. Otherwise remove
the sentence.

### Minor

#### F-4-3 — The first screen does not state the current price

**Exact quote/location:** landing first-screen fact: **“Exports and backups
included.”**

**Why this fails:** The mandatory first-screen facts are privacy, offline use,
and price. “Included” does not say whether the product or those tools cost
money. The README later says this release has no paid tier, but a phone visitor
does not see that in the first screen.

**Concrete fix:** replace it with **“Free in this release; no checkout.”** Keep
the `archive-tools-included` test and update its claim/location text to cover
this exact statement.

#### F-4-4 — The demo and app H1 is a brand phrase, not the page task

**Exact quote/location:** `/demo` and `/app` H1: **“Build proof you can
revisit.”**

**Why this fails:** “Proof” can mean a mathematical proof, evidence of practice,
or the product name. Heard alone in a heading list, it does not name the screen's
actual task: recording and reviewing attempts.

**Concrete fix:** use **“Record and review problem attempts.”** Keep the current
route titles.

#### F-4-5 — The README purchase section exposes internal factory language

**Exact quote/location:** `README.md`, Purchase model: “The researched business
model is a one-time purchase. This release deliberately offers no paid tier
because its Sociobot billing product is not enabled. JSON, CSV, printing, and
password-encrypted backups remain included, with no checkout or license flow. A
paid release must register and verify the hosted checkout before adding a
price.”

**Why this fails:** “Researched business model,” “Sociobot billing product,” and
“register and verify the hosted checkout” are internal process terms. They make
the current price harder to find and give visitors future implementation detail
they cannot use.

**Concrete fix:** replace the section with **“This release is free. It has no
checkout or license requirement. JSON, CSV, printing, and password-encrypted
backups are included.”** Keep future billing instructions in the brief or
maintainer handoff.

#### F-4-6 — The README uses unexplained storage and cryptography jargon

**Exact quote/location:** “Creates a password-encrypted backup with
AES-256-GCM.”; “IndexedDB stores the ledger.”; “Backups use AES-256-GCM
encryption with a key derived from the learner's password.”; and the Project
notes terms “IndexedDB namespaces,” “Web Crypto,” and “static route documents.”

**Why this fails:** These terms are precise for contributors but unexplained in
reader-facing feature and privacy copy. A normal first-time visitor cannot use
“IndexedDB” or “AES-256-GCM” to decide what happens to their data.

**Concrete fix:** use **“Creates a backup protected by your password.”**, **“Your
browser stores the ledger on this device.”**, and **“Backups are encrypted in
your browser using your password.”** Rename “Project notes” to **“Technical
notes for contributors”** so implementation terms have an explicit audience.

## Cold first read

Fresh no-storage Chromium contexts at 390 × 844 and 1440 × 900 loaded the live
home before scrolling. Both had one H1 and main landmark, no horizontal
overflow, no console or page errors, and only same-origin requests.

In my own words before scrolling:

- It records cited math or CS problems I can solve, including revisions and
  evidence of practice.
- It is for serious math and CS self-learners who want evidence beyond course
  badges.
- I should click **“Try it with sample data.”** The adjacent text says it opens
  a separate sample ledger.

All three required answers are available, so this check is not blocking.
F-4-3 separately records the missing explicit price fact. Evidence:
[mobile](review-4-assets/live-cold-mobile.png),
[desktop](review-4-assets/live-cold-desktop.png), and
[`cold-first-read.json`](review-4-assets/cold-first-read.json).

## Copy audit

Counts are whitespace-delimited; hyphenated forms, paths, and version numbers
count as one word. Headings and actions are included. Navigation labels, sample
data, table columns, URLs, and shell commands are labels or data rather than
sentences. No sentence exceeds 22 words. No banned marketing adjective or
inconsistent core term appears. Buttons use result-naming verbs.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Record problems you can solve | 5 | Pass — job headline |
| For serious math and CS learners who need evidence beyond course badges. | 12 | Pass — audience and change |
| Try it with sample data | 5 | Pass — action |
| Opens a separate sample ledger. | 5 | Pass — result stated |
| Start your proofbook | 3 | Pass — action |
| Entries stay in this browser | 5 | Pass — `privacy-local` |
| Works offline after your first visit | 6 | Pass — `offline-reload` |
| Exports and backups included | 4 | F-4-3 — no price |
| Each attempt becomes one cited, revisable record. | 7 | Pass — declared claims |
| Review your cited attempts | 4 | Pass — heading |
| A mastery index points back to sources, time spent, and revision history. | 12 | Pass — `print-index` |
| Build evidence in three steps | 5 | Pass — heading |
| Cite the problem | 3 | Pass — step heading |
| Name the book, paper, exam, or page. | 7 | Pass — guidance |
| Do not copy restricted problem text. | 6 | Pass — guidance |
| Time and revise your solution | 5 | Pass — step heading |
| Keep each saved version. | 4 | Pass — `revision-history` |
| Add a short note about what changed. | 7 | Pass — guidance |
| Print your mastery index | 4 | Pass — action and claim |
| Review a compact list with sources, effort, status, and revision counts. | 11 | Pass — `print-index` |
| A record, not a credential | 5 | Pass — limit heading |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| Your entries stay in this browser unless you export them. | 10 | Pass — `privacy-local` |
| Use source citations. | 3 | Pass — guidance |
| Do not store copyrighted problem text you cannot redistribute. | 9 | Pass — guidance |
| Keep a complete encrypted archive | 5 | Pass — heading and claim |
| Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup. | 13 | Pass — declared claims |
| Start your proofbook | 3 | Pass — action |
| Your archive stays in this browser until you choose to download it. | 12 | Pass — `privacy-local` |
| Private records for math and CS self-study. | 7 | Pass — footer description |
| Version 1.0.1 | 2 | Pass — version label |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Self-Study Proofbook | 2 | Pass — title |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 17 | Pass — declared claims |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass — audience |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — declared claim |
| What it does | 3 | Pass — heading |
| Groups problem attempts by topic and study goal. | 8 | Pass — declared claim |
| Records a source citation, problem reference, and optional source link. | 10 | Pass — declared claim |
| Times an attempt and preserves each changed solution as a revision. | 11 | Pass — declared claims |
| Adds a learner-set status and confidence score. | 7 | Pass — declared claim |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — declared claims |
| Creates a printable mastery index with sources, time, status, and revisions. | 11 | Pass — declared claim |
| Creates a password-encrypted backup with AES-256-GCM. | 6 | F-4-6 — jargon |
| The password is not saved. | 5 | Pass — declared claim |
| Works offline after the first visit. | 6 | Pass — declared claim |
| JSON, CSV, printing, and password-encrypted backups are included in the local ledger. | 12 | Pass — declared claim |
| Purchase model | 2 | Pass — heading |
| The researched business model is a one-time purchase. | 8 | F-4-5 — internal planning copy |
| This release deliberately offers no paid tier because its Sociobot billing product is not enabled. | 15 | F-4-5 — internal jargon |
| JSON, CSV, printing, and password-encrypted backups remain included, with no checkout or license flow. | 14 | Pass, but include in the shorter F-4-5 rewrite |
| A paid release must register and verify the hosted checkout before adding a price. | 14 | F-4-5 — future maintainer instruction |
| Privacy and ownership | 3 | Pass — heading |
| Study entries stay in the browser unless the learner exports them. | 11 | Pass — declared claim |
| IndexedDB stores the ledger. | 4 | F-4-6 — jargon |
| The demo uses a separate database and never copies sample records into the real ledger. | 15 | Pass — declared claim |
| JSON is the complete archive and keeps every revision. | 9 | Pass — declared claim |
| CSV is useful for a spreadsheet. | 6 | Pass — explanation |
| Backups use AES-256-GCM encryption with a key derived from the learner's password. | 12 | F-4-6 — jargon |
| The password is never stored. | 5 | Pass — declared claim |
| Read the in-app privacy page and terms. | 7 | Pass — links checked |
| Run and test | 3 | Pass — heading |
| Requires Node.js 20 or newer. | 5 | Pass — setup requirement |
| `npm run build` is the deployment command. | 7 | Pass — verified |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass — verified |
| Tests use Playwright 1.58.2 and Chromium. | 6 | Pass — verified |
| They cover every claim in `.factory/claims.json`, including offline reload, isolated demo storage, revision history, downloads, and the print route. | 19 | Pass — verified |
| Project notes | 2 | F-4-6 — name the technical audience |
| `src/db.ts` owns the two IndexedDB namespaces, validates every write, and keeps visible recovery copies of damaged legacy data. | 18 | F-4-1 and F-4-6 |
| `src/schema.ts` validates every imported topic, attempt, revision, value, and reference before the current ledger can be replaced. | 17 | F-4-2 |
| `src/crypto.ts` implements password-encrypted archives with Web Crypto. | 7 | F-4-6 — contributor jargon |
| `vite.config.ts` generates the service worker and static route documents. | 9 | F-4-6 — contributor jargon |
| `.factory/design.md` records the product-specific visual system and art provenance. | 9 | Pass — contributor note |
| `.factory/demo.md` documents the clean demo sandbox. | 6 | Pass — contributor note |
| The generated hero art is original to this product. | 9 | Pass — provenance recorded |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass — file present |
| Application code is available under the MIT License. | 8 | Pass — file present |

Terminology is otherwise consistent. **Attempt** is a problem-solving session;
**revision** is a saved solution version; **topic** groups attempts; **mastery
index** is the printable summary; **archive** is exported data; and **demo** is
the isolated sample ledger.

## Demo, sandbox, and privacy

- One click from the cold home reached `/demo` and displayed the usable ledger
  in about 170 ms. It showed three cited attempts across real analysis, graph
  algorithms, and abstract algebra.
- The persistent banner read **“Demo — sample data, nothing is saved to your
  proofbook.”** and exposed **Reset demo** and **Start for real**.
- After a saved edit, **Reset demo** restored the original Dijkstra solution.
- I first created a real topic and attempt, then entered the demo. During the
  demo, IndexedDB contained separate `proofbook-v1` and `proofbook-demo-v1`
  databases. **Start for real** removed only the demo database and returned to
  the unchanged real attempt. No sample attempt appeared in real storage.
- All requests during the live real/demo/reset/offline/exit flow stayed on the
  product origin. After service-worker control, `/demo` reloaded offline with
  its banner and three-attempt summary.
- Evidence: [demo screenshot](review-4-assets/live-demo-mobile.png) and
  [`live-demo-flow.json`](review-4-assets/live-demo-flow.json).

## Declared claim results

A detached clean clone at `/tmp/self-study-proofbook-review-4-KN67bf` ran
`npm ci` and every exact command in `.factory/claims.json` separately.

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
| `topics-and-goals` | Pass |
| `attempt-timer` | Pass |
| `evidence-status` | Pass |
| `json-complete-archive` | Pass |
| `no-credential-service` | Pass |

The same clone passed `npm test` (**33/33**) and `npm run build`. `dist/` was
produced; JavaScript is 13.49 KB gzip and CSS is 4.88 KB gzip. The clean build
and live JavaScript have the same SHA-256:
`5278868f49822cf0b2387967656f06ca02ac529ba87318b9a8af9c8345bc331a`.
F-4-1 and F-4-2 remain blocking because untagged tests do not inventory those
public promises.

## Earlier finding verification

Every earlier review, polish report, and prior handoff was read. Each finding
was rechecked live and in current code.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | JSON, CSV, print, and encrypted backup work without checkout; the claim passes. |
| F-1-2 | A cited attempt persists and prints its source/reference; the claim passes. |
| F-1-3 | Topic, goal, and assigned attempt persist; the claim passes. |
| F-1-4 | The timer persists and appears in CSV/print; the claim passes. |
| F-1-5 | Status and confidence persist and print; the claim passes. |
| F-1-6 | JSON import/export preserves the complete tested state; the claim passes. |
| F-1-7 | Copy is limited to the non-credential promise; the claim passes. |
| F-1-8 | The live heading is **“Review your cited attempts.”** |
| F-1-9 | The 404 has the shared shell, metadata, legal links, favicon, and return link. |
| F-2-1 | The topic selector is `nav[aria-label="Topics"]`; live Axe has zero violations. |
| F-3-1 | Privacy, terms, and 404 use direct page-name H1s. |
| F-3-2 | Counters and ornament are absent; the footer uses direct copy and a version label. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms` return 200;
  an unknown route returns 404. Each has one H1 and main, `lang="en"`, a
  route-specific title at most 60 characters, description, canonical URL, Open
  Graph image, Twitter card, SVG favicon, and apple-touch icon.
- The social image is 1200 × 630. `robots.txt`, `sitemap.xml`, the manifest,
  service worker, route documents, security headers, and matching self-only CSP
  are present.
- Every discovered internal link and the external Param Factory link returns
  200. Privacy navigation focuses its H1; browser Back restores and focuses the
  home H1.
- Fresh 390 px Axe scans report zero violations on every route and the 404.
  `/opt/fleet/lib/verify-url.sh` passes live `/` and `/demo`. Keyboard, dialogs,
  target sizes, reduced motion, and routing pass in the clean suite.
- The pixel-proof terminal identity matches `.factory/design.md`: original desk
  artwork, graph-paper lines, phosphor/cyan/amber colors, local bitmap type,
  clipped controls, and an asymmetric composition. It is not a generic SaaS
  template.
- The brief does not imply a useful AI action. Expected leverage is present via
  JSON/CSV import-export, printing, encrypted backup, and offline use. No model
  endpoint, provider key, analytics script, or third-party runtime asset exists.

## What would make this perfect

Register and tag the two README safety promises, or remove them. State **“Free
in this release; no checkout”** in the first-screen facts. Rename the app/demo
H1 to the task. Replace the purchase section with current user-facing terms and
move technical implementation language under an explicitly contributor-only
heading. Then rerun every claim command, the full suite, build, and fresh live
mobile/desktop review. Nothing else remains from this round.
