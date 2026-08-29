import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const origin = 'https://self-study-proofbook.sociobot.in';
const browser = await chromium.launch({ headless: true });
const report = { demo: {}, offline: {}, routes: {}, routing: {}, links: {}, generatedAt: new Date().toISOString() };

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForLoadState('networkidle');
  const initialSolution = await page.getByLabel('Solution notes Markdown').inputValue();
  const seeded = {
    url: page.url(),
    title: await page.title(),
    h1: await page.locator('h1').allTextContents(),
    banner: await page.locator('.demo-banner').innerText(),
    summary: await page.locator('.workspace-head p').last().innerText(),
    topics: await page.locator('[data-topic]').allTextContents(),
    attempts: await page.locator('[data-attempt]').allTextContents(),
  };
  await page.getByLabel('Solution notes Markdown').fill('Review six demo-only change.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.waitForFunction((expected) => document.querySelector('#solution')?.value === expected, initialSolution);
  const resetSolution = await page.getByLabel('Solution notes Markdown').inputValue();
  await page.screenshot({ path: '.factory/review-6-assets/live-demo-mobile.png', fullPage: true });
  await Promise.all([
    page.waitForURL(`${origin}/app`),
    page.getByRole('button', { name: 'Start for real' }).click(),
  ]);
  report.demo = {
    seeded,
    resetRestoredSample: resetSolution === initialSolution,
    realAfterFreshDemo: await page.locator('body').innerText(),
    requests,
    onlySameOriginRequests: requests.every((url) => new URL(url).origin === origin),
    consoleErrors,
    pageErrors,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  const controller = await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  report.offline = {
    controller,
    h1: await page.locator('h1').innerText(),
    summary: await page.locator('.workspace-head p').last().innerText(),
    onlySameOriginRequests: requests.every((url) => new URL(url).origin === origin),
    requests,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}/app`);
  await page.getByRole('button', { name: 'Add topic' }).click();
  await page.getByLabel('Topic name').fill('Review six control');
  await page.getByLabel('Study goal').fill('Confirm real data remains separate.');
  await page.getByRole('button', { name: 'Add topic' }).last().click();
  await page.goto(`${origin}/?demo=1`);
  await page.getByLabel('Solution notes Markdown').fill('Temporary demo mutation.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.waitForFunction(() => document.querySelector('#solution')?.value !== 'Temporary demo mutation.');
  await Promise.all([
    page.waitForURL(`${origin}/app`),
    page.getByRole('button', { name: 'Start for real' }).click(),
  ]);
  report.demo.realControlPreserved = await page.getByRole('button', { name: /Review six control/ }).isVisible();
  report.demo.realControlSummary = await page.locator('.workspace-head p').last().innerText();
  await context.close();
}

const routes = ['/', '/?demo=1', '/app', '/print?demo=1', '/privacy', '/terms'];
const hrefs = new Set();
for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  for (const href of await page.locator('a').evaluateAll((anchors) => anchors.map((a) => a.href))) hrefs.add(href);
  const axe = await new AxeBuilder({ page }).analyze();
  report.routes[route] = {
    status: response?.status(),
    title: await page.title(),
    h1: await page.locator('h1').allTextContents(),
    lang: await page.locator('html').getAttribute('lang'),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
    ogTitle: await page.locator('meta[property="og:title"]').getAttribute('content'),
    ogImage: await page.locator('meta[property="og:image"]').getAttribute('content'),
    twitterCard: await page.locator('meta[name="twitter:card"]').getAttribute('content'),
    favicons: await page.locator('link[rel~="icon"], link[rel="apple-touch-icon"]').count(),
    header: await page.locator('header').count(),
    main: await page.locator('main').count(),
    footer: await page.locator('footer').count(),
    privacyLinks: await page.locator('a[href="/privacy"]').count(),
    termsLinks: await page.locator('a[href="/terms"]').count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    axeViolations: axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length })),
    consoleErrors,
    pageErrors,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const response = await page.goto(`${origin}/review-six-missing-route`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  report.routes['/review-six-missing-route'] = {
    status: response?.status(), title: await page.title(), h1: await page.locator('h1').allTextContents(),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
    header: await page.locator('header').count(), main: await page.locator('main').count(), footer: await page.locator('footer').count(),
    privacyLinks: await page.locator('a[href="/privacy"]').count(), termsLinks: await page.locator('a[href="/terms"]').count(),
    axeViolations: axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length })),
  };
  for (const href of await page.locator('a').evaluateAll((anchors) => anchors.map((a) => a.href))) hrefs.add(href);
  await page.screenshot({ path: '.factory/review-6-assets/live-404-mobile.png', fullPage: true });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${origin}/`);
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  const privacyFocus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  await page.goBack();
  await page.waitForURL(`${origin}/`);
  const homeFocus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  report.routing = { privacyFocus, homeFocus, reducedMotion: await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches) };
  await context.close();
}

for (const href of [...hrefs].sort()) {
  if (href.startsWith('mailto:')) { report.links[href] = { allowedScheme: true }; continue; }
  try {
    const response = await fetch(href, { redirect: 'follow' });
    report.links[href] = { status: response.status, finalUrl: response.url };
  } catch (error) {
    report.links[href] = { error: error instanceof Error ? error.message : String(error) };
  }
}

await writeFile('.factory/review-6-assets/live-audit.json', JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
