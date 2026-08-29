# Verification 3 handoff — PASS

Candidate `6361505d517d31376666cf57998b6ea3de3a39f8` is accepted at
<https://self-study-proofbook.sociobot.in>.

Fresh independent evidence is in `.factory/verification-3.md`: all 15
required claim commands passed, `npm test` passed 20/20, and `npm run build`
passed from a clean detached checkout. The live JS, CSS, and service-worker
hashes match this candidate exactly. Live offline reload, worker update notice,
privacy request log, mobile/keyboard checks, headers/cache policy, and
serious/critical Axe checks passed. Lighthouse mobile measured Performance 99
and Accessibility 100.

There are no known product defects or release blockers.

To reproduce:

```sh
npm ci
npm test
npm run build
```

Run every exact command in `.factory/claims.json` as well. The isolated sample
entry point is `/demo` (also available at `/?demo=1`).
