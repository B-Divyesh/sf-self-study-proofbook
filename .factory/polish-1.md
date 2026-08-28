# Polish 1 — cumulative review repair map

Target repaired from `5bd77baab547f411ce8f619710f036a438472ce2`; review source:
`8789041635fd1ce7edf10203347ea28360e8ff60` / `.factory/review-1.md`.

| Finding | Repair | Evidence |
| --- | --- | --- |
| F-1-1 | Registered `archive-tools-included`; JSON, CSV, print, and encrypted backup now have an end-to-end demo test without checkout. | `@claim:archive-tools-included`; `.factory/evidence/polish-1-local-demo/screenshot-desktop.png`; live `/demo` check recorded after deployment. |
| F-1-2 | Registered `cited-attempt`; the test creates a cited record and verifies source/reference after reload and in the print index. | `@claim:cited-attempt`; local demo screenshot above; live `/demo` and `/print?demo=1` check recorded after deployment. |
| F-1-3 | Registered `topics-and-goals`; topic goals are now visibly retained beneath each topic name, and the test assigns and reloads an attempt. | `@claim:topics-and-goals`; local demo screenshot above; live `/demo` check recorded after deployment. |
| F-1-4 | Registered `attempt-timer`; a deterministic-clock test starts, pauses, reloads, exports, and prints elapsed time. | `@claim:attempt-timer`; `npm test`; live `/demo` and `/print?demo=1` check recorded after deployment. |
| F-1-5 | Registered `evidence-status`; keyboard selection of confidence and status persists through reload and print. | `@claim:evidence-status`; `npm test`; live `/demo` check recorded after deployment. |
| F-1-6 | Registered `json-complete-archive`; archive import now preserves imported content rather than rewriting archive metadata, and a re-export compares the complete state. | `@claim:json-complete-archive`; `npm test`; live `/demo` check recorded after deployment. |
| F-1-7 | Narrowed the limit statement to the observable non-credential promise and registered `no-credential-service`; the printable index carries the learner-maintained notice. | `@claim:no-credential-service`; local demo screenshot above; live `/print?demo=1` check recorded after deployment. |
| F-1-8 | Replaced the isolated heading with “Review your cited attempts.” | `npm test`; `.factory/evidence/polish-1-local-home/screenshot-desktop.png`; live `/` check recorded after deployment. |
| F-1-9 | Rebuilt static `404.html` with the shared header/footer, skip link, legal links, favicon, canonical, description, Open Graph, and Twitter metadata. | `static delivery makes hashed assets immutable and unknown routes real 404s`; `.factory/evidence/polish-1-local-404/index.html`; live `/not-a-proofbook-route` check recorded after deployment. |

## Local evidence before deployment

- `npm ci`, `npm run build`, and `npm test`: pass (20 Playwright tests).
- Every one of the 15 exact commands in `.factory/claims.json`: pass.
- `/opt/fleet/lib/verify-url.sh` passes on local `/` and `/demo`; captures are in
  `.factory/evidence/polish-1-local-home/` and
  `.factory/evidence/polish-1-local-demo/`.
- Axe integration scans `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`,
  `/terms`, and direct 404 with zero serious or critical findings.
- The local direct 404 is HTTP 404 and its captured document is
  `.factory/evidence/polish-1-local-404/index.html`.

## Live evidence

Complete after the static deployment is live; the final handoff records the
deployed commit, cold-browser checks, and screenshot locations.
