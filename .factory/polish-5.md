# Polish 5 — complete cumulative review repair map

**Repair commit:** `90a16ea59f811b6ce350f1a5aa85c9609c54490f`  
**Live:** <https://self-study-proofbook.sociobot.in>  
**Verdict:** all cumulative findings repaired and rechecked.

| Finding | Change now present | Evidence |
| --- | --- | --- |
| F-1-1 | JSON, CSV, printable index, and encrypted backup remain free with no checkout. | `@claim:archive-tools-included`; live `/?demo=1`; `evidence/polish-5-live-demo/screenshot-mobile.png`. |
| F-1-2 | Cited attempts retain source and reference after reload and in the index. | `@claim:cited-attempt`; live `/print?demo=1`; `evidence/polish-5-live-print/verify.json`. |
| F-1-3 | Topics, study goals, and assigned attempts persist. | `@claim:topics-and-goals`; live `/?demo=1`. |
| F-1-4 | Timers persist and feed CSV and the index. | `@claim:attempt-timer`; live `/print?demo=1`. |
| F-1-5 | Evidence status and confidence persist and print. | `@claim:evidence-status`; live `/print?demo=1`. |
| F-1-6 | JSON exports/imports the complete tested archive and revisions. | `@claim:json-complete-archive`; live `/?demo=1`. |
| F-1-7 | Limit copy is the narrow non-credential statement and the index shows its notice. | `@claim:no-credential-service`; live `/print?demo=1`. |
| F-1-8 | The isolated preview heading remains **Review your cited attempts**. | Full suite `route names and landing sections use direct, useful wording`; live `/`; `evidence/polish-5-live-home/screenshot-mobile.png`. |
| F-1-9 | Direct unknown URLs return the designed, metadata-complete shared 404 shell. | Full suite `static delivery makes hashed assets immutable and unknown routes real 404s`; live `/not-a-proofbook-route` → 404; `evidence/polish-5-live-404/index.html`. |
| F-2-1 | The topic rail is `nav[aria-label="Topics"]`, not a nested complementary landmark. | Full suite `all public routes have no Axe violations`; live `/?demo=1`; `evidence/polish-5-live-audit.json`. |
| F-3-1 | Privacy, terms, and 404 keep direct task/page H1s and route metadata. | Full suite `built deep links carry their own metadata before JavaScript runs`; live `/privacy`, `/terms`, and `/not-a-proofbook-route`. |
| F-3-2 | Decorative counters and archive ornament remain removed; footer copy is direct. | Full suite `route names and landing sections use direct, useful wording`; live `/`; `evidence/polish-5-live-home/screenshot-desktop.png`. |
| F-4-1 | The narrow recovery promise is registered and recovery keeps valid records usable. | `@claim:saved-data-recovery`; full suite `recovers a legacy malformed persisted archive into a usable ledger`; live `/app`. |
| F-4-2 | Malformed imports are rejected before replacement. | `@claim:safe-import-validation`; live `/app`. |
| F-4-3 | The first screen states **Free in this release; no checkout**. | `@claim:archive-tools-included`; live `/`; `evidence/polish-5-live-home/screenshot-mobile.png`. |
| F-4-4 | Demo and app H1 remains **Record and review problem attempts.** | Full suite `route names and landing sections use direct, useful wording`; live `/?demo=1` and `/app`; `evidence/polish-5-live-audit.json`. |
| F-4-5 | README's Price section uses current user-facing free/no-checkout language. | Full suite `README states the current price plainly and labels contributor-only technical notes`; `README.md`. |
| F-4-6 | Reader-facing storage and backup copy stays plain; implementation details are labelled for contributors. | Full suite `README states the current price plainly and labels contributor-only technical notes`; `README.md`. |
| F-5-1 | Replaced **Keep a complete encrypted archive** with **Export a password-encrypted backup**, removing the unsupported completeness promise. | `@claim:encrypted-backup`; live `/`; `evidence/polish-5-live-home/screenshot-mobile.png`. |
| F-5-2 | Strengthened the sole `@claim:print-index` test to assert six headings, named sample source/reference/time/status, changed revision count, print media styling, and `window.print`. | `npm test -- --grep @claim:print-index`; live `/print?demo=1`; `evidence/polish-5-live-print/screenshot-mobile.png`; `evidence/polish-5-live-audit.json`. |

## Verification summary

From a detached clean clone of `90a16ea`, all 17 exact claim commands passed,
then `npm test` passed 33/33 and `npm run build` produced `dist/`. The current
catalog description is the verb-first, 76-character sentence in
`catalog-description.txt`. A cold live audit rechecked the first screen,
isolated `?demo=1` path, reset behavior, routes, titles, focus-covered SPA
routing, legal links, responsive layout, 404, privacy, offline claim test, and
the product's pixel-proof-terminal visual system. No new finding appeared.
