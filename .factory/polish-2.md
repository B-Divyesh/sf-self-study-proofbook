# Polish 2 — cumulative review repair map

Repaired release candidate `79cedbc6dbf28de7d55b8896860e43f963848e06`
from the full review history in `.factory/review-1.md` and
`.factory/review-2.md`. Repair commit: `e8e89de5aa1ad6aae0dac344b2d7de63aab94765`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the free local JSON, CSV, print, and encrypted-backup tools; no checkout path exists. | `@claim:archive-tools-included` passed in the clean clone; `.factory/evidence/polish-2-live-demo/screenshot-desktop.png`; live <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-2 | Kept cited attempt creation, reload persistence, and print-index citation/reference output. | `@claim:cited-attempt` passed in the clean clone; `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; live <https://self-study-proofbook.sociobot.in/print?demo=1> 200. |
| F-1-3 | Kept topic and study-goal assignment and persistence. | `@claim:topics-and-goals` passed in the clean clone; `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; live <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-4 | Kept deterministic timer persistence to editor, CSV, and print index. | `@claim:attempt-timer` passed in the clean clone; `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; live <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-5 | Kept saved status and confidence controls and print output. | `@claim:evidence-status` passed in the clean clone; `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; live <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-6 | Kept complete JSON archive import/export without rewriting archive contents. | `@claim:json-complete-archive` passed in the clean clone; `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; live <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-7 | Kept the narrowed, observable non-credential statement and printed learner-maintained notice. | `@claim:no-credential-service` passed in the clean clone; `.factory/evidence/polish-2-live-audit.json`; live <https://self-study-proofbook.sociobot.in/print?demo=1> 200. |
| F-1-8 | Kept the clear isolated preview heading, “Review your cited attempts.” | `npm test` passed 20/20; `.factory/evidence/polish-2-live-home/screenshot-desktop.png`; live <https://self-study-proofbook.sociobot.in/> 200. |
| F-1-9 | Kept the full static 404 shell, metadata, legal links, and favicon. | `static delivery makes hashed assets immutable and unknown routes real 404s` passed; `.factory/evidence/polish-2-live-404/screenshot-mobile.png`; live <https://self-study-proofbook.sociobot.in/not-a-proofbook-route> 404. |
| F-2-1 | Replaced the nested `<aside class="topic-rail">` with `<nav class="topic-rail" aria-label="Topics">`; visual layout is unchanged. Strengthened mobile and route-level Axe tests to require zero violations. | `demo supports keyboard-sized mobile use and has no Axe violations` and `all public routes have no Axe violations` passed in `npm test` (20/20); `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; live <https://self-study-proofbook.sociobot.in/demo> and <https://self-study-proofbook.sociobot.in/app> are `NAV` with zero Axe violations in `.factory/evidence/polish-2-live-audit.json`. |

## Clean-clone and local evidence

At `/tmp/self-study-proofbook-polish-2-vUrAAJ`, `npm ci` completed with zero
audit vulnerabilities. All 15 exact claim commands from `.factory/claims.json`
passed individually, followed by `npm test` (20/20) and `npm run build`.
Local browser checks are in `.factory/evidence/polish-2-local-home/`,
`.factory/evidence/polish-2-local-demo/`, and
`.factory/evidence/polish-2-local-404/`. Lighthouse results are 99/100/100/100
(performance/accessibility/best-practices/SEO).

## Post-deployment evidence

Static deployment `61bf2c55-9612-4ec3-abc3-9ce0511f742d` completed. A cold
390px live audit verified every public route, the direct `?demo=1` sandbox,
the repaired topic navigation, and the direct 404. All eight scanned documents
had zero Axe violations; screenshots and the route report are in
`.factory/evidence/polish-2-live-*`.
