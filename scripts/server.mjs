import { createReadStream, existsSync, statSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, relative, isAbsolute, join } from 'node:path';

// .env 不覆盖调用方显式环境；这里只接受简单 KEY=value 配置。
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}
const defaultRoot = existsSync('public') ? 'public' : 'demo-dist';
const root = resolve(process.env.HF_DEMO_ROOT ?? defaultRoot);
const port = Number(process.env.HF_DEMO_PORT ?? process.env.PORT ?? 6633);
const host = process.env.HF_DEMO_HOST ?? process.env.HOST ?? '0.0.0.0';
const types = { '.svg': 'image/svg+xml', '.ico': 'image/vnd.microsoft.icon', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.zip': 'application/zip', '.map': 'application/json; charset=utf-8' };
const server = createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('无效路径'); return; }
  let file = resolve(root, '.' + pathname);
  const local = relative(root, file);
  if (local.startsWith('..') || isAbsolute(local)) { response.writeHead(403); response.end('禁止访问'); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) || !statSync(file).isFile()) {
    if (request.headers.accept?.includes('text/html') && !extname(pathname)) file = join(root, 'index.html');
    else { response.writeHead(404); response.end('未找到资源'); return; }
  }
  const extension = extname(file);
  const compressed = /\bgzip\b/.test(request.headers['accept-encoding'] ?? '') && existsSync(file + '.gz');
  const representation = compressed ? file + '.gz' : file;
  const info = statSync(representation);
  const etag = `W/"${info.size.toString(16)}-${info.mtimeMs.toString(16)}-${compressed ? 'gzip' : 'identity'}"`;
  const hashed = /^chunks\/[\w-]+-[A-Z0-9]{8}\.(js|css)$/.test(relative(root, file).replaceAll('\\', '/'));
  const headers = {
    'Content-Type': types[extension] ?? 'application/octet-stream',
    'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
    'Vary': 'Accept-Encoding', 'ETag': etag,
    ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
  };
  const readRequest = request.method === 'GET' || request.method === 'HEAD';
  const matches = request.headers['if-none-match']?.split(',').some(value => {
    const tag = value.trim();
    return tag === '*' || tag.replace(/^W\//, '') === etag.replace(/^W\//, '');
  });
  if (readRequest && matches) { response.writeHead(304, headers); response.end(); return; }
  if (request.method === 'HEAD') { response.writeHead(200, headers); response.end(); return; }
  const stream = createReadStream(representation);
  stream.on('error', error => {
    console.error(JSON.stringify({ step: 'static-read', errorType: error.code, path: pathname }));
    if (!response.headersSent) response.writeHead(500);
    response.end('资源读取失败');
  });
  response.writeHead(200, headers);
  stream.pipe(response);
});
server.listen(port, host, () => console.log(JSON.stringify({ status: 'ready', url: 'http://' + host + ':' + server.address().port })));
