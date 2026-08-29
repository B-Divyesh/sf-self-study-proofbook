# Polish 4 — cumulative review repair map

Repair source: release candidate `952f2f4c0d45ebe926d8a124804a1bba22a710dc`
and cumulative reviews `.factory/review-1.md` through
`.factory/review-4.md`. Product repair commit:
`7366b9c8542532ed0583f572be3cc43ce012d9d6`.

The repair keeps the pixel-proof-terminal visual system, offline PWA class,
local-first data model, and original generated art.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept JSON, CSV, print, and encrypted backup available without checkout; the first screen now states the release is free. | `@claim:archive-tools-included makes every archive tool usable without checkout`; [live demo](evidence/polish-4-live-demo/screenshot-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/?demo=1). |
| F-1-2 | Kept source and problem-reference persistence in records and the mastery index. | `@claim:cited-attempt persists source and reference in the editor and index`; [live demo](evidence/polish-4-live-demo/screenshot-desktop.png); live [mastery index](https://self-study-proofbook.sociobot.in/print?demo=1). |
| F-1-3 | Kept topic and study-goal assignment and reload persistence. | `@claim:topics-and-goals persists a topic, its goal, and an assigned attempt`; [live demo](evidence/polish-4-live-demo/cold-flow-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/?demo=1). |
| F-1-4 | Kept deterministic timer persistence in the editor, CSV, and print index. | `@claim:attempt-timer persists deterministic elapsed time to exports and print`; [live demo](evidence/polish-4-live-demo/screenshot-mobile.png); live [demo](https://self-study-proofbook.sociobot.in/demo). |
| F-1-5 | Kept learner-set status and confidence through reload and print. | `@claim:evidence-status persists learner-set evidence and confidence`; [live demo](evidence/polish-4-live-demo/screenshot-mobile.png); live [mastery index](https://self-study-proofbook.sociobot.in/print?demo=1). |
| F-1-6 | Kept complete JSON export/import coverage for topics, attempts, citations, timers, status, confidence, and revisions. | `@claim:json-complete-archive restores all local proofbook data`; [live demo](evidence/polish-4-live-demo/screenshot-desktop.png); live [demo](https://self-study-proofbook.sociobot.in/demo). |
| F-1-7 | Kept the narrow non-credential statement and printed disclaimer. | `@claim:no-credential-service marks the printed record as a non-credential`; [live demo](evidence/polish-4-live-demo/screenshot-desktop.png); live [mastery index](https://self-study-proofbook.sociobot.in/print?demo=1). |
| F-1-8 | Kept the direct preview heading “Review your cited attempts.” | `route names and landing sections use direct, useful wording`; [live home](evidence/polish-4-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/). |
| F-1-9 | Kept the shared static 404 shell, metadata, icons, legal links, and return action. | `static delivery makes hashed assets immutable and unknown routes real 404s`; [live 404](evidence/polish-4-live-404/screenshot-mobile.png); live [unknown route](https://self-study-proofbook.sociobot.in/not-a-proofbook-route) returns 404. |
| F-2-1 | Kept the topic selector as `nav[aria-label="Topics"]`; all routes now remain at zero Axe violations. | `all public routes have no Axe violations`; [live demo](evidence/polish-4-live-demo/cold-flow-mobile.png); live [audit](evidence/polish-4-live-audit.json) on `/demo` and `/app`. |
| F-3-1 | Kept direct H1s for privacy, terms, and 404, with route-specific metadata before JavaScript. | `built deep links carry their own metadata before JavaScript runs`; [live 404](evidence/polish-4-live-404/screenshot-mobile.png); live [privacy](https://self-study-proofbook.sociobot.in/privacy), [terms](https://self-study-proofbook.sociobot.in/terms), and 404 checked. |
| F-3-2 | Kept decorative counters and ornaments removed, with a direct footer description and version label. | `route names and landing sections use direct, useful wording`; [live home](evidence/polish-4-live-home/screenshot-desktop.png); live [home](https://self-study-proofbook.sociobot.in/). |
| F-4-1 | Narrowed the README promise and registered `saved-data-recovery`. The test corrupts saved data, uses the retained valid record, downloads the byte-equivalent original JSON, and restores its valid records. | `@claim:saved-data-recovery keeps valid records usable and the original available`; [live recovery](evidence/polish-4-live-recovery.png); live `/app` result in [audit JSON](evidence/polish-4-live-audit.json). |
| F-4-2 | Narrowed the README promise and registered `safe-import-validation`. The test rejects malformed topics, attempts, revisions, numeric values, and cross-record references before confirmation or replacement. | `@claim:safe-import-validation rejects malformed imports before replacing a real ledger`; [live rejection](evidence/polish-4-live-invalid-import.png); live `/app` result in [audit JSON](evidence/polish-4-live-audit.json). |
| F-4-3 | Replaced the first-screen inclusion phrase with “Free in this release; no checkout” and aligned the archive claim. | `@claim:archive-tools-included makes every archive tool usable without checkout`; [live first screen](evidence/polish-4-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/). |
| F-4-4 | Replaced the app/demo brand phrase with the task H1 “Record and review problem attempts.” | `route names and landing sections use direct, useful wording`; [live demo](evidence/polish-4-live-demo/cold-flow-mobile.png); live [query demo](https://self-study-proofbook.sociobot.in/?demo=1) and [app](https://self-study-proofbook.sociobot.in/app). |
| F-4-5 | Replaced the internal purchase-model section with three current user-facing sentences under “Price.” | `README states the current price plainly and labels contributor-only technical notes`; [live price fact](evidence/polish-4-live-home/screenshot-mobile.png); live [home](https://self-study-proofbook.sociobot.in/). |
| F-4-6 | Rewrote reader-facing storage and backup copy in plain words and renamed the implementation section “Technical notes for contributors.” | `README states the current price plainly and labels contributor-only technical notes`; [live home](evidence/polish-4-live-home/screenshot-desktop.png); live [privacy page](https://self-study-proofbook.sociobot.in/privacy). |

## Verification

- Clean clone `/tmp/self-study-proofbook-polish-4-clean-sgAlzS` checked commit
  `7366b9c8542532ed0583f572be3cc43ce012d9d6`: `npm ci` and `npm audit`
  found zero vulnerabilities; all 17 exact claim commands passed individually;
  `npm test` passed 33/33; `npm run build` passed.
- The build is 13.49 KB gzip JavaScript and 4.88 KB gzip CSS. Live JavaScript
  SHA-256 `19e9453a013b8d3ed534db88d895a16fee3667187200598a53320ca0b089b012`
  exactly matches `dist/`.
- Local URL verification passed `/` and `/?demo=1` with no console errors.
  Local Lighthouse mobile scored 99 performance and 100 accessibility, best
  practices, and SEO; LCP was 1.8 s and CLS 0.046.
- Deployment `ebcc9478-6b68-4896-a3ed-268504b6f931` completed. Fresh live URL
  verification passed `/` and `/?demo=1`. The live mobile audit found no
  horizontal overflow, no console errors, only same-origin requests, a working
  offline reload, correct focus/back behavior, and zero Axe violations on all
  public routes and the 404.
- Live Lighthouse mobile scored 100 in all four categories; LCP was 1.4 s and
  CLS 0.046.

No finding from reviews 1–4 remains open.
