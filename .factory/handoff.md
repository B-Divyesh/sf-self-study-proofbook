# Self-Study Proofbook — repair 9 handoff

## Result

**PASS — verifier finding V12-M1 is repaired, tested, pushed, and deployed.**

The implementation is commit `0336d9f90ac98693b12349067b29dcb541812991`
on `main`. Version `1.0.3` is live at
<https://self-study-proofbook.sociobot.in> through the existing static app
`sf-self-study-proofbook` in Central US.

## Finding and repair

V12-M1 reproduced at 390 × 844 CSS px. The unstyled inline email links measured
`150.046875 × 20` px on `/privacy` and `150.078125 × 20` px on `/terms`.
The footer's 44 px link rule did not apply to either legal-body link.

Both email links now use the shared `.contact-link` treatment: inline flex,
44 px minimum width and height, centered content, safe wrapping, and middle
alignment. The resulting live targets measure `162.046875 × 44` px and
`162.078125 × 44` px with 0 px horizontal overflow.

The new Playwright regression, **legal contact links are at least 44px on mobile
without horizontal overflow**, opens both legal routes at 390 × 844, locates
the exact `mailto:` link on each route, requires visibility, measures both
dimensions, and checks page overflow. It fails on candidate `0a886e3` and
passes on this repair. The complete live route and target census is in
[repair-9-live-audit.json](evidence/repair-9-live-audit.json).

## Verification

- A dependency-free checkout received `npm ci`: 24 packages installed and 0
  vulnerabilities. `npm audit --audit-level=high` also reports 0
  vulnerabilities.
- `npm test` passes **37/37** Playwright tests. All 18 commands in
  `.factory/claims.json` also pass independently, and every declared claim ID
  occurs in exactly one tagged test.
- `npm run build` passes TypeScript (`tsc --noEmit`) and Vite. It produces
  `dist/index.html`. Initial JavaScript is 43.62 kB raw / 13.54 kB gzip; CSS is
  19.10 kB raw / 4.94 kB gzip. There is no separate lint script or package
  consumer surface.
- The prescribed URL verifier passes local and live `/` and `/demo` with the
  correct title, `lang=en`, one H1, one main landmark, alt text, named buttons,
  and no console errors. Evidence: [local home](evidence/repair-9-local-home/),
  [local demo](evidence/repair-9-local-demo/),
  [live home](evidence/repair-9-live-home/), and
  [live demo](evidence/repair-9-live-demo/).
- Desktop and 390 px browser checks pass on `/`, `/demo`, `/app`,
  `/print?demo=1`, `/privacy`, and `/terms`. Every route has 0 px overflow.
  Every visible interactive target on every live mobile route is at least
  44 × 44 px. The repaired legal screenshots are under
  [live legal evidence](evidence/repair-9-live-legal/).
- Playwright Axe reports 0 violations on all six valid routes and the designed
  404. The 404 returns HTTP 404; its expected failed-document console entry is
  the only recorded console error. Keyboard checks confirm the skip link is
  first, Enter moves focus to main, the Add topic dialog has its specific name,
  Escape closes it, and focus returns to the opener.
- At 200% page scale, the H1 and main remain visible with no document-width
  increase. Reduced-motion mode reports 0-second animations and transitions
  and automatic scrolling.
- Live demo request logging observed 11 requests, all to the product origin.
  The service worker controls `/demo`, and an offline reload retains all three
  sample attempts. A two-version test displayed “An update is ready. Reload to
  use it.”, removed the old cache, and retained the demo after reload; see
  [update evidence](evidence/repair-9-local-sw-update.json).
- Live response policy provides a self-only CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict referrer policy, restricted permissions, 30-second
  revalidation for HTML/manifest/worker, one-year immutable caching for hashed
  assets, the correct manifest MIME type, and a real HTML 404. All 12 unique
  non-self-fragment links resolve; the two `mailto:` links use the allowed
  scheme.
- All **30/30** deployable `dist/` files match live bytes. The live JavaScript
  SHA-256 is
  `4869b04307c1b6a0cf90eaae46028e19433b84e0d51a257a781a6960690afd93`.
  See [delivery identity](evidence/repair-9-live-delivery.json).
- Mobile Lighthouse scores are local **99 performance / 100 accessibility /
  100 best practices / 100 SEO** and live **100 / 100 / 100 / 100**. Live FCP
  is 1.0 s, LCP 1.4 s, TBT 10 ms, CLS 0.045, and transfer 87 KiB. Evidence:
  [local Lighthouse](evidence/repair-9-lighthouse-local.json) and
  [live Lighthouse](evidence/repair-9-lighthouse-live.json).

## Applicability and known gaps

No release-blocking gaps remain. The researched static, browser-only,
local-first PWA and its free release scope are unchanged. It has no backend,
AI call, sign-in, billing endpoint, package, CLI, or external consumer-install
surface to exercise. No infrastructure, DNS, or billing configuration changed.
