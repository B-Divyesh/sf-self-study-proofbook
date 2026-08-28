import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT ?? 4173);
const types = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

function withinRoot(file) {
  const path = relative(root, file);
  return path && !path.startsWith('..') && !path.includes('/../');
}

async function existing(file) {
  try { return (await stat(file)).isFile() ? file : null; } catch { return null; }
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', `http://${request.headers.host}`).pathname);
  const clean = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const direct = resolve(root, clean);
  let file = withinRoot(direct) ? await existing(direct) : null;
  if (!file && !extname(clean)) file = await existing(resolve(root, `${clean}.html`)) ?? await existing(resolve(root, clean, 'index.html'));
  const status = file ? 200 : 404;
  file ??= resolve(root, '404.html');
  const headers = { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' };
  if (pathname.startsWith('/assets/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  response.writeHead(status, headers);
  response.end(await readFile(file));
}).listen(port, '127.0.0.1', () => console.log(`Proofbook test server listening on ${port}`));
