import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';

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
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? '')).toMatch(/\/sw\.js$/);
  await expect.poll(() => page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const names = await caches.keys();
    const cache = await caches.open(names.find((name) => name.startsWith('proofbook-')) ?? 'missing');
    return (await cache.match('/index.html'))?.ok ?? false;
  })).toBe(true);
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

test('@claim:json-revisions exports every saved revision', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const archive = JSON.parse(await readFile(await (await downloadEvent).path(), 'utf8')) as { attempts: Array<{ title: string; revisions: unknown[] }> };
  expect(archive.attempts).toHaveLength(3);
  expect(archive.attempts.find((attempt) => attempt.title === 'Uniform limit of continuous functions')?.revisions).toHaveLength(2);
});

test('@claim:print-index creates a mastery review sheet', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page).toHaveURL(/\/print\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mastery index');
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await expect(page.getByText('not an accredited credential')).toBeVisible();
});

test('@claim:encrypted-backup uses AES-256-GCM and does not retain the password', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /Export encrypted backup/ }).click();
  const password = 'correct horse proof';
  await page.getByLabel('Password').fill(password);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted backup' }).click();
  const download = await downloadEvent;
  const bytes = new Uint8Array(await readFile(await download.path()));
  expect(new TextDecoder().decode(bytes.slice(0, 10))).toBe('PROOFBOOK1');
  expect(bytes.length).toBeGreaterThan(100);
  const baseKey = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes.slice(10, 26), iterations: 250_000 }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const plaintext = await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(26, 38) }, key, bytes.slice(38));
  expect(new TextDecoder().decode(plaintext)).toContain('Dijkstra’s greedy step');
  expect(Buffer.from(bytes).toString('utf8')).not.toContain(password);
  await expect(page.getByLabel('Password')).toHaveValue('');
  const savedData = await page.evaluate(async () => new Promise<string>((resolve, reject) => {
    const request = indexedDB.open('proofbook-demo-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('state', 'readonly');
      const entry = transaction.objectStore('state').get('proofbook');
      entry.onerror = () => reject(entry.error);
      entry.onsuccess = () => resolve(JSON.stringify({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), state: entry.result }));
    };
  }));
  expect(savedData).not.toContain(password);
});

test('@claim:demo-isolation never copies sample data into the real ledger', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('3 attempts across 3 topics.')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText('0 attempts across 0 topics.')).toBeVisible();
  await expect(page.getByText('Your attempts will appear here')).toBeVisible();
});

test('archive tools are available without a checkout request', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Exports and backups included')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy archive tools' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Start your proofbook' }).last().click();
  await expect(page.getByRole('button', { name: 'Export encrypted backup' })).toBeVisible();
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

test('demo remains usable with a keyboard', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('button', { name: 'Save revision' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('Revision saved.')).toBeVisible();
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

test('static delivery makes hashed assets immutable and unknown routes real 404s', async ({ page, request }) => {
  await page.goto('/');
  const script = await page.locator('script[type="module"]').getAttribute('src');
  expect(script).toMatch(/^\/assets\/index-[\w-]+\.js$/);
  const asset = await request.get(script!);
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  const missing = await page.goto('/not-a-proofbook-route');
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is outside the ledger');
});
