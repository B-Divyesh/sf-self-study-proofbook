# Polish 2 handoff — Self-Study Proofbook

## Result

Release repair commit: `e8e89de5aa1ad6aae0dac344b2d7de63aab94765`.

The only outstanding adversarial finding, F-2-1, is repaired. The topic
selector is now a labelled navigation landmark rather than an `aside` nested
inside `main`. It keeps the existing pixel-terminal rail layout and gives
screen-reader landmark navigation an accurate structure.

## Verification

- Clean clone: `/tmp/self-study-proofbook-polish-2-vUrAAJ` at
  `e8e89de5aa1ad6aae0dac344b2d7de63aab94765`; `npm ci` reported 0
  vulnerabilities.
- Every exact command declared in `.factory/claims.json` passed from that
  clean clone: 15/15 claims (`privacy-local` through `no-credential-service`).
- Full browser suite: `npm test` passed 20/20. The mobile demo and all public
  routes now assert **zero Axe violations**, not only serious/critical ones.
- Production build: `npm run build` passed and produced `dist/index.html`.
  Initial JavaScript is 10.95 KB gzip and CSS is 4.78 KB gzip.
- Local URL checks passed for `/` and `/demo`; no console errors, one H1,
  language, main landmark, and image alt checks are recorded in
  `.factory/evidence/polish-2-local-home/verify.json` and
  `.factory/evidence/polish-2-local-demo/verify.json`. Direct local 404 was
  HTTP 404 and is captured in `.factory/evidence/polish-2-local-404/`.
- Local Lighthouse mobile audit: Performance 99, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.7 s, CLS 0.043, TBT 50 ms. Report:
  `.factory/evidence/polish-2-local-home/lighthouse.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh self-study-proofbook dist
```

## Known gaps

None. Post-deployment cold checks are recorded below once the static work-order
deployment completes.
