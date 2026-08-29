# Polish 3 — cumulative review repair map

Repair source: release candidate `6361505d517d31376666cf57998b6ea3de3a39f8`
and cumulative reviews `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md`. Product repair commit:
`61d38e880bc185f86c73d970e9ba65f9d9801d51`.

The repair preserves the pixel-proof-terminal visual system. It removes only
non-informative copy and strengthens real route metadata; it does not replace
the product with a generic marketing layout.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained free JSON, CSV, print, and encrypted-backup tools without a checkout path. | `@claim:archive-tools-included`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-desktop.png); <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-2 | Retained cited-attempt creation and persisted source/reference output in the editor and mastery index. | `@claim:cited-attempt`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/print?demo=1> 200. |
| F-1-3 | Retained topic and study-goal assignment with reload persistence. | `@claim:topics-and-goals`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-4 | Retained the deterministic persisted timer in the editor, CSV, and printable index. | `@claim:attempt-timer`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-5 | Retained persisted evidence status and confidence in the editor and printed index. | `@claim:evidence-status`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/print?demo=1> 200. |
| F-1-6 | Retained complete JSON archive import/export without rewriting archive contents. | `@claim:json-complete-archive`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-desktop.png); <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-1-7 | Retained the narrowed non-credential statement and the printed learner-maintained notice. | `@claim:no-credential-service`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-desktop.png); <https://self-study-proofbook.sociobot.in/print?demo=1> 200. |
| F-1-8 | Kept the clear preview heading, “Review your cited attempts.” | `route names and landing sections use direct, useful wording`; [live home screenshot](evidence/polish-3-live-home/screenshot-desktop.png); <https://self-study-proofbook.sociobot.in/> 200. |
| F-1-9 | Kept the shared static 404 shell and updated its direct H1/footer wording; it retains legal links, canonical, description, OG/Twitter metadata, and favicon. | `static delivery makes hashed assets immutable and unknown routes real 404s`; [live 404 screenshot](evidence/polish-3-live-404/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/not-a-proofbook-route> 404. |
| F-2-1 | Kept the topic selector as `nav[aria-label="Topics"]`, not a nested complementary landmark. | `all public routes have no Axe violations`; [live demo screenshot](evidence/polish-3-live-demo/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/demo> 200. |
| F-3-1 | Replaced slogan/metaphor H1s with “Privacy and data storage”, “Terms of use”, and “Page not found”. Route titles, descriptions, canonical URLs, Open Graph, and Twitter metadata now also ship in each generated deep-link HTML response. | `route names and landing sections use direct, useful wording`; `built deep links carry their own metadata before JavaScript runs`; [live 404 screenshot](evidence/polish-3-live-404/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/privacy>, <https://self-study-proofbook.sociobot.in/terms>, and the 404 URL checked live. |
| F-3-2 | Removed all landing section counters and the archive ornament, replaced the footer slogan with “Private records for math and CS self-study.”, and reduced the build label to “Version 1.0.1”. Removed similar non-informative app/offline labels. | `route names and landing sections use direct, useful wording`; [live home screenshot](evidence/polish-3-live-home/screenshot-mobile.png); <https://self-study-proofbook.sociobot.in/> 200. |

## Verification

- Fresh clean clone `/tmp/self-study-proofbook-polish-3-strict` ran `npm ci`
  with zero vulnerabilities, all 15 exact commands in `.factory/claims.json`,
  `npm test` (**22/22**), and `npm run build` with `set -e`.
- Local production checks: `/opt/fleet/lib/verify-url.sh` passed on `/` and
  `/demo`; direct local 404 returned 404. Artifacts are in
  `.factory/evidence/polish-3-local-*`.
- Axe Playwright scans found zero violations across `/`, `/demo`, `/app`,
  `/print?demo=1`, `/privacy`, `/terms`, and the direct 404. The fresh live
  mobile audit repeated those scans with zero violations and zero horizontal
  overflow; the direct 404's expected HTTP-404 resource message was the only
  browser console entry.
- Live `/demo` cold check showed the persistent sample-data banner, Reset demo,
  Start for real, three seeded attempts, `nav[aria-label="Topics"]`, same-origin
  requests only, and a successful service-worker offline reload.
- Local Lighthouse mobile: 99 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.7 s, CLS 0.046. Live Lighthouse mobile: 100/100/
  100/100; LCP 1.4 s, CLS 0.046.
- Static deployment `2779c30e-78d2-4be7-a6da-d8ae9096653a` completed. The live
  JavaScript SHA-256 matches the built file:
  `b3f128d785329f940bc8065dbf05fcd9716cd531bc0d04ae75ee1aa1aaa85e6b`.
