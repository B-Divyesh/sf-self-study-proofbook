# Polish 2 handoff — Self-Study Proofbook

## Result

Release repair commit: `e8e89de5aa1ad6aae0dac344b2d7de63aab94765`.

Static deployment `61bf2c55-9612-4ec3-abc3-9ce0511f742d` completed to
<https://self-study-proofbook.sociobot.in>.

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
  `.factory/evidence/polish-2-local-home/lighthouse-retry.json`.
- Cold live audit: `/`, `/?demo=1`, `/demo`, `/app`, `/print?demo=1`,
  `/privacy`, and `/terms` returned 200; a deliberate unknown address returned
  404. Every route had one H1/main/header/footer, no application console error,
  and zero Axe violations. `/demo`, `/app`, and `/?demo=1` each expose the
  repaired `NAV` topic rail. Evidence:
  `.factory/evidence/polish-2-live-audit.json`.
- Live home and demo URL checks have no console errors and are captured in
  `.factory/evidence/polish-2-live-home/` and
  `.factory/evidence/polish-2-live-demo/`. The cold direct-demo screenshot is
  `.factory/evidence/polish-2-live-demo/query-demo-mobile.png`; the styled
  404 is `.factory/evidence/polish-2-live-404/screenshot-mobile.png`.
- Live Privacy navigation moves focus to its H1, and browser Back restores
  focus to the home H1; see `.factory/evidence/polish-2-live-focus.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh self-study-proofbook dist
```

## Known gaps

None.
