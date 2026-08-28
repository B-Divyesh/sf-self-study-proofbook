# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28
**Target:** <https://self-study-proofbook.sociobot.in>
**Base:** `240d7682aea8137416d93253b5de3419c66b3380`

## Verdict

**FAIL.** The cold first read, demo, eight declared claims, accessibility, and
most structure checks pass. The result cannot pass because several reliance
claims in the landing copy and README have no `.factory/claims.json` entry and
tagged observable test. The direct HTTP 404 also omits the shared site shell and
route metadata.

## Cold first read

Fresh no-storage Chromium contexts at 390 × 844 and 1440 × 900 answered all
three questions before scroll:

- It is a private ledger to record math/CS problems the learner can solve.
- It is for serious math and CS self-learners who need evidence beyond badges.
- Click **“Try it with sample data”** first; adjacent copy says **“Opens a
  separate sample ledger.”**

This passes the first-screen requirement. Both loads had no console/page errors;
the 390px page had no horizontal overflow.

## Findings

### Blocking — unlisted claims

The eight registered claims cover local privacy, offline reload, CSV, saved
revisions, print index, encrypted backup, JSON revisions, and demo isolation.
They do not cover the following distinct promises. Each row is an individual
finding; the contract requires an entry and exactly one `@claim:` test per
visitor claim.

| Id | Exact quote and location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-1-1 | “Exports and backups included” — landing fact; “JSON, CSV, printing, and password-encrypted backups are included in the local ledger.” — README | This promises access, not just separate CSV/encryption functions. The availability test is untagged and no claim entry exists. | Add `archive-tools-included` with a demo test proving JSON, CSV, print, and encrypted backup are usable without checkout; or remove the inclusion promise. |
| F-1-2 | “Each attempt becomes one cited, revisable record.” — landing; “Record cited math and CS problems…” and “Records a source citation, problem reference, and optional source link.” — README | `revision-history` proves prior solution text survives; it does not prove a recorded attempt requires/persists a citation/reference. | Add `cited-attempt`: create an attempt through the UI, reload, and check source/reference in the editor and print index. |
| F-1-3 | “Groups problem attempts by topic and study goal.” — README | No listed claim proves topic/goal creation, assignment, and persistence. | Add `topics-and-goals`: add a topic and goal, create an attempt under it, reload, and assert both. |
| F-1-4 | “Times an attempt …” — README; “Time and revise your solution” — landing | No listed claim proves timer start, pause, persisted elapsed time, or output in print/export. Revisions are covered, time is not. | Split the copy and add `attempt-timer` with a deterministic-clock test. |
| F-1-5 | “Adds a learner-set status and confidence score.” — README | Visible controls are not an observable claim test for persistence or index output. | Add `evidence-status`: change both fields, reload, and assert editor and print output. |
| F-1-6 | “JSON is the open, complete archive …” — README | `json-revisions` proves sample attempt/revision counts, not the broader complete-archive promise (topics, timer, status, confidence, sources, links). | Replace with the proven “JSON keeps every revision,” or add `json-complete-archive` that exports, imports into an empty ledger, and compares complete state. |
| F-1-7 | “Proofbook does not grade, proctor, certify, or generate answers.” — landing; “It records practice; it does not grade work or issue credentials.” — README | These are reliance promises about product limits; no claim tests their stated scope. | Add a narrowly scoped `no-credential-service` interception/bundle test and limit the copy to that scope, or remove the list. |

### Minor — vague isolated heading

**F-1-8 — “See the work, not a badge”** (landing `LIVE PREVIEW / 02`) does not
say what the heading-list user will encounter. “Work” and “badge” need nearby
context. Replace it with **“Review your cited attempts.”**

### Minor — direct 404 lacks shared structure and metadata

**F-1-9 — `GET /not-a-proofbook-route`** correctly returns 404 and displays
**“This page is outside the ledger,”** but the static document has no header,
skip link, footer, Privacy/Terms links, meta description, canonical, OG/Twitter
metadata, or favicon. Live inspection returned `header: 0` and `footer: 0`; all
normal routes have one header, main, and footer. Build the static 404 from the
shared shell (or duplicate an accessible minimal header/footer) and include the
missing `Page not found — Self-Study Proofbook` metadata and icons.

## Copy audit

Whitespace-delimited counts are used; hyphenated terms and code paths count as
one word. Headings and actions are included because they are also reviewed for
plain language. Sample ledger data, nav labels, and route names are labels, not
sentences. No item exceeds 22 words or uses a banned marketing word. F-1-8 is
the only clarity/jargon heading flag. Result-naming actions pass.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Record problems you can solve | 5 | Pass |
| For serious math and CS learners who need evidence beyond course badges. | 12 | Pass |
| Try it with sample data | 5 | Pass — action |
| Opens a separate sample ledger. | 5 | Pass |
| Start your proofbook | 3 | Pass — action |
| Entries stay in this browser | 5 | Pass — `privacy-local` |
| Works offline after your first visit | 6 | Pass — `offline-reload` |
| Exports and backups included | 4 | F-1-1 |
| Each attempt becomes one cited, revisable record. | 7 | F-1-2 |
| See the work, not a badge | 6 | F-1-8 |
| A mastery index points back to sources, time spent, and revision history. | 12 | Pass — `print-index` |
| Build evidence in three steps | 5 | Pass |
| Cite the problem | 3 | Pass |
| Name the book, paper, exam, or page. | 8 | Pass |
| Do not copy restricted problem text. | 6 | Pass |
| Time and revise your solution | 5 | F-1-4 for time |
| Keep each saved version. | 4 | Pass — `revision-history` |
| Add a short note about what changed. | 8 | Pass |
| Print your mastery index | 4 | Pass — `print-index` |
| Review a compact list with sources, effort, status, and revision counts. | 11 | Pass — `print-index` |
| A record, not a credential | 5 | Pass |
| Proofbook does not grade, proctor, certify, or generate answers. | 9 | F-1-7 |
| Your entries stay in this browser unless you export them. | 9 | Pass — `privacy-local` |
| Use source citations. | 3 | Pass as guidance; F-1-2 covers persistence |
| Do not store copyrighted problem text you cannot redistribute. | 9 | Pass as guidance |
| Keep a complete encrypted archive | 5 | Pass — `encrypted-backup` |
| Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup. | 11 | Pass; inclusion is F-1-1 |
| Start your proofbook | 3 | Pass — action |
| Your archive stays in this browser until you choose to download it. | 12 | Pass — `privacy-local` |
| Evidence of practice, kept by the learner. | 7 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Self-Study Proofbook | 3 | Product heading; pass |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 14 | F-1-2, F-1-4 |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass |
| It records practice; it does not grade work or issue credentials. | 11 | F-1-7; split when fixed |
| What it does | 3 | Pass |
| Groups problem attempts by topic and study goal. | 8 | F-1-3 |
| Records a source citation, problem reference, and optional source link. | 10 | F-1-2 |
| Times an attempt and preserves each changed solution as a revision. | 11 | F-1-4; revision is covered |
| Adds a learner-set status and confidence score. | 8 | F-1-5 |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — JSON/CSV claims |
| Creates a printable mastery index with sources, time, status, and revisions. | 10 | Pass — `print-index` |
| Creates a password-encrypted backup with AES-256-GCM. | 6 | Pass — `encrypted-backup` |
| The password is not saved. | 5 | Pass — `encrypted-backup` |
| Works offline after the first visit. | 6 | Pass — `offline-reload` |
| JSON, CSV, printing, and password-encrypted backups are included in the local ledger. | 11 | F-1-1 |
| Privacy and ownership | 3 | Pass |
| Study entries stay in the browser unless the learner exports them. | 10 | Pass — `privacy-local` |
| IndexedDB stores the ledger. | 4 | Implementation detail; pass |
| The demo uses a separate database and never copies sample records into the real ledger. | 14 | Pass — `demo-isolation` |
| JSON is the open, complete archive and keeps every revision. | 10 | F-1-6; revision portion is covered |
| CSV is useful for a spreadsheet. | 6 | Pass — explanation |
| Backups use AES-256-GCM encryption with a key derived from the learner's password. | 11 | Pass — encryption/decryption test |
| The password is never stored. | 5 | Pass — `encrypted-backup` |
| Read the in-app privacy page and terms. | 7 | Pass |
| Run and test | 3 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| `npm run build` is the deployment command. | 6 | Pass |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 11 | Pass |
| Tests use Playwright 1.58.2 and Chromium. | 6 | Pass |
| They cover every claim in `.factory/claims.json`, including offline reload, isolated demo storage, revision history, downloads, and the print route. | 18 | Pass |
| Project notes | 2 | Pass |
| `src/db.ts` owns the two IndexedDB namespaces. | 6 | Pass |
| `src/crypto.ts` implements password-encrypted archives with Web Crypto. | 7 | Pass |
| `vite.config.ts` generates the service worker and static route documents. | 9 | Pass |
| `.factory/design.md` records the product-specific visual system and art provenance. | 8 | Pass |
| `.factory/demo.md` documents the clean demo sandbox. | 6 | Pass |
| The generated hero art is original to this product. | 9 | Pass |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass |
| Application code is available under the MIT License. | 8 | Pass |

Terminology is otherwise consistent: **attempt**, **topic**, **revision**,
**mastery index**, **archive**, and **demo** keep one meaning. Normal action
controls use verbs (`Try`, `Start`, `Export`, `Record`, `Save`, `Print`).

## Demo, sandbox, and claims evidence

- One fresh click to `/demo` immediately showed three realistic cited attempts
  in analysis, graph algorithms, and algebra. Its persistent banner read
  **“Demo — sample data, nothing is saved to your proofbook.”** and exposed
  **Reset demo** and **Start for real**.
- Changing a demo solution then resetting restored its original sample text.
  A real topic/attempt created before demo remained present after leaving demo.
  `src/db.ts` uses `proofbook-demo-v1` only in demo mode and `proofbook-v1` for
  real data; `clearDemo()` deletes only the demo database.
- Captured live requests during demo/edit/offline exercise were all
  `https://self-study-proofbook.sociobot.in`. After worker control, offline
  `/demo` reload showed the expected H1 and all three attempts.
- A detached clean clone at `/tmp/proofbook-review-ytrKkH` ran `npm ci` with
  zero audit vulnerabilities. Every exact claims command passed:
  `privacy-local`, `offline-reload`, `csv-export`, `revision-history`,
  `print-index`, `encrypted-backup`, `json-revisions`, and `demo-isolation`.
  The full local suite passed **13/13**; `npm run build` passed and produced
  `dist/` (application JavaScript 10.94 KB gzip).

## Structure, accessibility, and history

- Home, demo, app, print, privacy, and terms each had appropriate title,
  description, canonical, one H1, one main, favicon, OG image, header/footer,
  and no console errors. The 404 exception is F-1-9.
- Every internal link and the Param Factory link returned 200; `mailto:` links
  were explicit. Unknown routes returned HTTP 404. Client navigation moved
  focus to the H1; browser Back returned to the home H1.
- Live Axe scans at 390px found zero serious/critical violations on `/`,
  `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms`.
- The pixel-proof-terminal direction, asymmetric hero, original art,
  graph-paper rules, and phosphor palette are distinct from a generic SaaS
  template. No AI feature is implied by this private local ledger; no provider
  key or decorative AI was found.
- No earlier `review-*.md` or `polish-*.md` exists. The earlier
  `.factory/verification.md` findings were confirmed fixed in live site and
  code: the broken purchase path was removed, its old JSON/password gaps now
  have dedicated tests, hashed assets are immutable, and unknown routes return
  404. F-1-1 through F-1-9 are new findings, not a recurrence of an old ID.

## What would make this perfect

Register and test the remaining visitor promises, or narrow copy to the eight
already provable claims. Give the direct 404 the shared shell and full metadata,
then replace the vague preview heading. Rerun every listed claim command, the
full suite, and this fresh-browser review.
