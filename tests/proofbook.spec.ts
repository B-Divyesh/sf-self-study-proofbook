import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test('@claim:privacy-local entries remain in the browser', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', (request) => outgoing.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Solution notes Markdown').fill('A changed proof written in the demo.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.getByText('Revision saved.')).toBeVisible();
  expect(outgoing.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build proof you can revisit');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build proof you can revisit');
  await expect(page.getByText('3 attempts across 3 topics.')).toBeVisible();
});

test('@claim:csv-export exports one row per attempt', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadEvent;
  const csv = await readFile(await download.path(), 'utf8');
  const rows = csv.trim().split('\n');
  expect(rows).toHaveLength(4);
  expect(rows[0]).toContain('topic,problem,source');
  expect(csv).toContain('Dijkstra’s greedy step');
});

test('@claim:revision-history preserves earlier solutions', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.history details')).toHaveCount(1);
  await page.getByLabel('Solution notes Markdown').fill('A revised cut argument with the boundary edge named first.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.locator('.history details')).toHaveCount(2);
  await page.locator('.history details').first().getByText('Revision 2').click();
  await expect(page.getByText('Assume the extracted vertex')).toBeVisible();
});

test('@claim:print-index creates a mastery review sheet', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page).toHaveURL(/\/print\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mastery index');
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await expect(page.getByText('not an accredited credential')).toBeVisible();
});

test('@claim:encrypted-backup downloads an encrypted archive', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /Export encrypted backup/ }).click();
  await page.getByLabel('Password').fill('correct horse proof');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted backup' }).click();
  const download = await downloadEvent;
  const bytes = await readFile(await download.path());
  expect(bytes.subarray(0, 10).toString()).toBe('PROOFBOOK1');
  expect(bytes.length).toBeGreaterThan(100);
});

test('@claim:demo-isolation never copies sample data into the real ledger', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('3 attempts across 3 topics.')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText('0 attempts across 0 topics.')).toBeVisible();
  await expect(page.getByText('Your attempts will appear here')).toBeVisible();
});

test('@claim:paid-price shows the exact one-time price', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('$19', { exact: true })).toBeVisible();
  await expect(page.getByText('one-time purchase')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy archive tools' })).toHaveAttribute('href', /api\.sociobot\.in\/api\/v1\/products\/self-study-proofbook\/checkout/);
});

test('demo supports keyboard-sized mobile use and has no serious accessibility findings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('landing page has one h1, working routes, and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Self-Study Proofbook');
  expect(errors).toEqual([]);
});
