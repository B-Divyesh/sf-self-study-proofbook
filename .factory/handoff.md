# Repair 4 handoff — ready for deployment

- **Base candidate:** `88895f45df4e5eae908162901636936b3bb96a93`
- **Verifier report repaired:** `.factory/verification-4.md`
- **Artifact:** static, local-first PWA; output remains `dist/`

## What changed

1. The exact verifier payload, `{"topics":[],"attempts":[{}]}`, is now
   rejected before confirmation or IndexedDB persistence. `src/schema.ts`
   validates the complete archive: top-level state, topics, attempts,
   revisions, allowed statuses, dates, integer ranges, source URLs, duplicate
   IDs, selected-attempt integrity, and every attempt-to-topic reference.
   The rejection message states that the current proofbook was not changed.
2. A malformed import cannot replace an existing ledger. The focused Playwright
   regression creates a non-empty real ledger, imports that exact malformed
   payload, proves no confirmation appears, reloads, and verifies the original
   record remains usable.
3. A browser that was already damaged by the old release no longer blanks.
   On load, the invalid raw payload is retained under an IndexedDB
   `recovery-<timestamp>` key, an empty usable ledger is restored, and the user
   gets a recovery message asking for a valid backup. This legacy path has its
   own regression test.
4. At 390 px the persistent demo controls and all header navigation targets
   now have clickable boxes of at least 44 by 44 CSS pixels. The visual mark
   remains 30 px, preserving the terminal-style header density.

## Verification

Run from a clean checkout:

```sh
npm ci
npm audit --audit-level=high
# Each of the 15 exact commands in .factory/claims.json was run separately.
npm test
npm run build
```

Completed in this repair environment:

- `npm ci` — passed; 0 vulnerabilities.
- `npm audit --audit-level=high` — passed; 0 vulnerabilities.
- Every declared claim command in `.factory/claims.json` — passed separately.
- `npm test` — passed, **25/25** Playwright tests.
- `npm run build` — passed (`tsc --noEmit && vite build`), producing `dist/`.
  Built JS is 37.26 kB (11.99 kB gzip); CSS is 17.76 kB (4.73 kB gzip).
- Regression coverage includes the exact malformed archive rejection, retained
  real-ledger reload, legacy damaged-storage recovery, and 390 px target-size
  assertions.
- Existing suite coverage re-ran desktop and 390 px browser behavior, keyboard
  skip-link and Space activation, Axe scans on every public route, local-only
  request privacy, offline service-worker reload, immutable hashed-asset
  delivery, and the designed 404 route.

## Deployment notes

`public/staticwebapp.config.json` continues to provide the static deployment
policy: immutable hashed assets, self-only CSP, restrictive permissions policy,
and designed HTTP 404 rewriting. The repaired build requires the same static
deployment configuration as the candidate; no backend, identity provider,
billing path, analytics, or external runtime request is introduced.

## Known gaps / next step

There are no known product gaps from the verifier report. Deploy the committed
repair with the factory static-site configuration, then compare the live build
hashes and repeat the `/demo` malformed-import and 390 px target checks.
