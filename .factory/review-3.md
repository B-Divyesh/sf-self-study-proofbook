# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-29  
**Target:** <https://self-study-proofbook.sociobot.in>  
**Code reviewed:** `4fedf6057d8bfe613ff4fd147089f1d2de46e93a`

## Verdict

**FAIL.** The product is usable, tryable, private by default, and its declared
claims pass. Two minor copy findings remain. The acceptance condition is zero
findings, so this is not a PASS.

## Cold first read

Fresh no-storage Chromium contexts at **390 × 844** and **1440 × 900** loaded
the live home before scrolling. Both had one H1, one main landmark, no page or
application console errors, and no mobile horizontal overflow.

In my own words before scrolling:

- This is a private record of the math or CS problems I can solve, including
  their sources, time spent, and revisions.
- It is for serious self-learners who need evidence of practice beyond a course
  badge.
- I should click **“Try it with sample data”** first. The adjacent
  **“Opens a separate sample ledger.”** states the result.

All three required answers are available on the first screen. This check
passes.

## Findings

### Minor — F-3-1: Three route H1s are slogans or metaphors, not page names

**Exact locations and quotes:**

- `/privacy`: **“Your work stays yours”**
- `/terms`: **“Use Proofbook honestly”**
- direct 404: **“This page is outside the ledger”**

**Why this fails:** Heard in a heading list, none names the page. The privacy
and terms headings require the visitor to infer their topic, while “outside the
ledger” is a product metaphor for a missing address. The route titles already
use the direct words, so the H1 wording is needlessly less clear.

**Concrete fix:** change the H1s to **“Privacy and data storage”**,
**“Terms of use”**, and **“Page not found”**. Keep the current explanatory
copy below each heading.

### Minor — F-3-2: Landing contains decorative section counters and a footer slogan

**Exact locations and quotes:** landing section labels **“PRIVATE PRACTICE
LEDGER / 01”**, **“LIVE PREVIEW / 02”**, **“METHOD / 03”**,
**“BOUNDARIES / 04”**, **“FULL ARCHIVE / 05”**; archive ornament
**“∞ your local archive”**; footer **“V1.0.1 · ORIGINAL GENERATED ART”**;
and footer slogan **“Evidence of practice, kept by the learner.”**

**Why this fails:** The counters and ornament do not help a first-time visitor
identify a task or act. The footer slogan restates the page without saying what
the product does. This conflicts with the plain-words requirement to remove
decorative labels and slogans that carry no usable information.

**Concrete fix:** remove the section-counter text and archive ornament while
retaining the existing explicit H2s. Replace the footer slogan with
**“Private records for math and CS self-study.”** or remove it; reduce the
version line to **“Version 1.0.1”**. Art provenance remains documented in
`.factory/design.md`, where it is useful.

## Copy audit

Whitespace-delimited words are counted; hyphenated forms count as one word.
Headings, actions, and visible labels are included. Sample record values and
table column labels are data, not landing sentences. No audited item is over
22 words. Core terms remain consistent: **attempt**, **topic**, **revision**,
**mastery index**, **archive**, and **demo**.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| PRIVATE PRACTICE LEDGER / 01 | 5 | F-3-2 — remove decorative counter |
| Record problems you can solve | 5 | Pass — plain job headline |
| For serious math and CS learners who need evidence beyond course badges. | 12 | Pass — audience and change |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens a separate sample ledger. | 5 | Pass — result stated |
| Start your proofbook | 3 | Pass — result-naming action |
| Entries stay in this browser | 5 | Pass — `privacy-local` |
| Works offline after your first visit | 6 | Pass — `offline-reload` |
| Exports and backups included | 4 | Pass — `archive-tools-included` |
| Each attempt becomes one cited, revisable record. | 7 | Pass — `cited-attempt`, `revision-history` |
| LIVE PREVIEW / 02 | 4 | F-3-2 — remove decorative counter |
| Review your cited attempts | 4 | Pass — clear section heading |
| A mastery index points back to sources, time spent, and revision history. | 12 | Pass — `print-index` |
| METHOD / 03 | 3 | F-3-2 — remove decorative counter |
| Build evidence in three steps | 5 | Pass — clear section heading |
| Cite the problem | 3 | Pass — clear step heading |
| Name the book, paper, exam, or page. | 7 | Pass — usable guidance |
| Do not copy restricted problem text. | 6 | Pass — usable guidance |
| Time and revise your solution | 5 | Pass — clear step heading |
| Keep each saved version. | 4 | Pass — `revision-history` |
| Add a short note about what changed. | 7 | Pass — usable guidance |
| Print your mastery index | 4 | Pass — result-naming action |
| Review a compact list with sources, effort, status, and revision counts. | 11 | Pass — `print-index` |
| BOUNDARIES / 04 | 3 | F-3-2 — remove decorative counter |
| A record, not a credential | 5 | Pass — clear limit heading |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| Your entries stay in this browser unless you export them. | 9 | Pass — `privacy-local` |
| Use source citations. | 3 | Pass — usable guidance |
| Do not store copyrighted problem text you cannot redistribute. | 9 | Pass — usable guidance |
| ∞ your local archive | 4 | F-3-2 — remove decorative ornament |
| FULL ARCHIVE / 05 | 4 | F-3-2 — remove decorative counter |
| Keep a complete encrypted archive | 5 | Pass — clear section heading |
| Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup. | 13 | Pass — declared export claims |
| Start your proofbook | 3 | Pass — result-naming action |
| Your archive stays in this browser until you choose to download it. | 12 | Pass — `privacy-local` |
| Evidence of practice, kept by the learner. | 7 | F-3-2 — replace or remove slogan |
| Privacy | 1 | Pass — clear link |
| Terms | 1 | Pass — clear link |
| Built by Param Factory (external site) | 6 | Pass — destination stated |
| V1.0.1 · ORIGINAL GENERATED ART | 4 | F-3-2 — reduce to useful version label |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Self-Study Proofbook | 3 | Pass — product title |
| Record cited math and CS problems, timed attempts, revisions, and mastery evidence in a private offline ledger. | 17 | Pass — declared cited/timer/revision/offline claims |
| Self-Study Proofbook is for serious self-learners who need evidence of what they can solve. | 14 | Pass — audience statement |
| Proofbook records practice; it does not issue credentials. | 8 | Pass — `no-credential-service` |
| What it does | 3 | Pass — clear heading |
| Groups problem attempts by topic and study goal. | 8 | Pass — `topics-and-goals` |
| Records a source citation, problem reference, and optional source link. | 10 | Pass — `cited-attempt` |
| Times an attempt and preserves each changed solution as a revision. | 11 | Pass — `attempt-timer`, `revision-history` |
| Adds a learner-set status and confidence score. | 8 | Pass — `evidence-status` |
| Exports JSON with every revision and one CSV row per attempt. | 11 | Pass — `json-revisions`, `csv-export` |
| Creates a printable mastery index with sources, time, status, and revisions. | 10 | Pass — `print-index` |
| Creates a password-encrypted backup with AES-256-GCM. | 6 | Pass — `encrypted-backup` |
| The password is not saved. | 5 | Pass — `encrypted-backup` |
| Works offline after the first visit. | 6 | Pass — `offline-reload` |
| JSON, CSV, printing, and password-encrypted backups are included in the local ledger. | 12 | Pass — `archive-tools-included` |
| Privacy and ownership | 3 | Pass — clear heading |
| Study entries stay in the browser unless the learner exports them. | 10 | Pass — `privacy-local` |
| IndexedDB stores the ledger. | 4 | Pass — implementation fact verified in `src/db.ts` |
| The demo uses a separate database and never copies sample records into the real ledger. | 15 | Pass — `demo-isolation` |
| JSON is the complete archive and keeps every revision. | 9 | Pass — `json-complete-archive` |
| CSV is useful for a spreadsheet. | 6 | Pass — plain explanation |
| Backups use AES-256-GCM encryption with a key derived from the learner's password. | 11 | Pass — `encrypted-backup` |
| The password is never stored. | 5 | Pass — `encrypted-backup` |
| Read the in-app privacy page and terms. | 7 | Pass — links checked |
| Run and test | 3 | Pass — clear heading |
| Requires Node.js 20 or newer. | 5 | Pass — verified environment requirement |
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
| The generated hero art is original to this product. | 9 | Pass — provenance recorded in design document |
| Departure Mono is bundled under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. | 9 | Pass — file present |
| Application code is available under the MIT License. | 8 | Pass — `LICENSE` present |

No landing or README reliance claim lacks an entry in `.factory/claims.json`.
The README implementation and licensing statements are directly verifiable
repository facts, not product-behaviour promises.

## Demo, sandbox, claims, and privacy

- A fresh click from the live home opens `/demo` and immediately displays three
  realistic cited attempts in analysis, graph algorithms, and abstract algebra.
  The persistent banner says **“Demo — sample data, nothing is saved to your
  proofbook.”** and includes **Reset demo** and **Start for real**.
- I changed a demo solution, saved it, then used **Reset demo**. The original
  solution returned exactly. `indexedDB.databases()` then exposed only
  `proofbook-demo-v1`.
- I used **Start for real** in that same fresh context. It opened `/app` with
  **“0 attempts across 0 topics.”** and only `proofbook-v1` remained. No demo
  record was copied into real storage.
- During a live demo load, edit, and offline reload, Playwright recorded only
  the `https://self-study-proofbook.sociobot.in` origin. After service-worker
  control and `context.setOffline(true)`, `/demo` reloaded with its H1 and all
  three attempts visible.
- In a detached clean clone at `/tmp/self-study-proofbook-review-3-aVFG7m`,
  `npm ci` reported zero vulnerabilities. Every exact command from
  `.factory/claims.json` passed individually: `privacy-local`, `offline-reload`,
  `csv-export`, `revision-history`, `print-index`, `encrypted-backup`,
  `json-revisions`, `demo-isolation`, `archive-tools-included`, `cited-attempt`,
  `topics-and-goals`, `attempt-timer`, `evidence-status`,
  `json-complete-archive`, and `no-credential-service`.
- The same clean checkout passed `npm test` (**20/20**) and `npm run build`.
  Build output was 10.95 KB gzip JavaScript and 4.78 KB gzip CSS. SHA-256 of
  both built JS/CSS files exactly matches the live assets.

## History check

I read every earlier `.factory/review-*.md`, `.factory/polish-*.md`, prior
handoff, and verification report. Each earlier finding was confirmed in the
current live site and code rather than accepted from its repair note.

| Earlier finding | Current confirmation |
| --- | --- |
| Verification: broken paid checkout | No paid tier or checkout request remains; local archive tools work in demo without checkout. |
| Verification: unlisted claims | All 15 reliance claims are in `claims.json` and their exact clean-clone tests passed. |
| Verification: non-immutable assets | Live hashed JS is `Cache-Control: public, max-age=31536000, immutable`. |
| Verification: unknown route returned 200 | Direct unknown route returns HTTP 404 with shared header, footer, metadata, and return link. |
| F-1-1 through F-1-7 | Archive tools, citations, topics/goals, timer, status, complete JSON restore, and non-credential limit each have passing observable claim coverage. |
| F-1-8 | Live landing heading is **“Review your cited attempts.”** |
| F-1-9 | Direct 404 has skip link, header/footer, Privacy/Terms, favicon, canonical, description, and OG/Twitter metadata. |
| F-2-1 | The topic rail is `nav[aria-label="Topics"]`, not an `aside`; the clean suite's all-routes Axe test has zero violations. |

## Structure, routing, and visual review

- `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, and `/terms` returned 200;
  the intentional missing route returned 404. Each route has one H1, one main,
  header, footer, route title, description, canonical, OG image, favicon, and
  no application errors. The 404 produces the browser's expected HTTP-404
  resource message only.
- Client navigation to Privacy focused and announced its H1; browser Back
  returned focus and the live announcement to the home H1. All discovered
  internal links and the Param Factory link returned 200. `mailto:` links were
  explicit; the 404 page's skip link intentionally resolves within its 404
  document.
- `robots.txt`, `sitemap.xml`, manifest, apple touch icon, security headers,
  and a self-only CSP are present. The live request log confirms the CSP permits
  the traffic actually used.
- The pixel-proof terminal visual system matches `.factory/design.md`: original
  product art, graph-paper rules, a phosphor/cyan/amber palette, local type,
  clipped controls, and an asymmetric landing composition. It is not a generic
  SaaS template.
- The brief does not imply an AI step; an AI feature would be decorative here.
  The expected leverage—offline use, demo isolation, JSON/CSV import-export,
  printable index, and encrypted local backup—is present.

## What would make this perfect

Use direct page-name H1s on Privacy, Terms, and the 404 page. Remove the
nonfunctional landing counters, ornament, and footer slogan (or replace the
slogan with direct product information). Then rerun the clean-clone claims,
full test suite, build, and fresh mobile/desktop audit. No other product gap was
found in this round.
