import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const origin = 'https://self-study-proofbook.sociobot.in';
const browser = await chromium.launch({ headless: true });
const report = {
  origin,
  generatedAt: new Date().toISOString(),
  routes: {},
  mobile: {},
  reducedMotion: {},
};

for (const route of ['/', '/demo', '/app', '/print?demo=1', '/privacy', '/terms', '/repair-9-missing']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  const undersized = await page.locator('a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44);
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return {
        name: (element.getAttribute('aria-label') || element.textContent || element.getAttribute('name') || '').trim().slice(0, 100),
        width: box.width,
        height: box.height,
      };
    }));
  const contactBoxes = await page.locator('.contact-link').evaluateAll((links) => links.map((link) => {
    const box = link.getBoundingClientRect();
    return { text: link.textContent?.trim(), width: box.width, height: box.height };
  }));
  report.routes[route] = {
    status: response?.status(),
    title: await page.title(),
    lang: await page.locator('html').getAttribute('lang'),
    h1: await page.locator('h1').count(),
    main: await page.locator('main').count(),
    imgsMissingAlt: await page.locator('img:not([alt])').count(),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    contactBoxes,
    undersized,
    axeViolations: axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length })),
    consoleErrors,
    pageErrors,
  };
  if (route === '/privacy' || route === '/terms') {
    await page.screenshot({ path: `.factory/evidence/repair-9-live-legal/${route.slice(1)}-mobile.png`, fullPage: true });
  }
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.activeElement === document.body);
  await page.keyboard.press('Tab');
  const skipFirst = await page.locator('.skip-link').evaluate((element) => element === document.activeElement);
  await page.keyboard.press('Enter');
  const skipMovedToMain = await page.locator('main').evaluate((element) => element === document.activeElement);
  const opener = page.getByRole('button', { name: 'Add topic', exact: true }).first();
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Add a topic', exact: true });
  const dialogNamed = await dialog.isVisible();
  await page.keyboard.press('Escape');
  const escapeClosed = await dialog.isHidden();
  const focusReturned = await opener.evaluate((element) => element === document.activeElement);
  await page.getByLabel('Solution notes Markdown').fill('Repair nine live privacy check.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const controller = await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  report.mobile = {
    viewport: { width: 390, height: 844 },
    keyboard: { skipFirst, skipMovedToMain, dialogNamed, escapeClosed, focusReturned },
    privacy: {
      requestCount: requests.length,
      origins: [...new Set(requests.map((url) => new URL(url).origin))],
      onlySameOrigin: requests.every((url) => new URL(url).origin === origin),
    },
    offline: {
      controller,
      summary: await page.getByText('3 attempts across 3 topics.').textContent(),
    },
    errors,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${origin}/demo`);
  report.reducedMotion = await page.evaluate(() => {
    const seconds = (value) => value.split(',').map((part) => Number.parseFloat(part) || 0);
    const styles = [...document.querySelectorAll('*')].map((element) => getComputedStyle(element));
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      maxAnimationSeconds: Math.max(0, ...styles.flatMap((style) => seconds(style.animationDuration))),
      maxTransitionSeconds: Math.max(0, ...styles.flatMap((style) => seconds(style.transitionDuration))),
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  await context.close();
}

await writeFile('.factory/evidence/repair-9-live-audit.json', `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(report, null, 2));
