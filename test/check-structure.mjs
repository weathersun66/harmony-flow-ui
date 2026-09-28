import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const roots = ['src', 'demo', 'scripts'];
const productionExtensions = new Set(['.ts', '.tsx', '.css', '.mjs']);
const results = [];
async function walk(directory) {
  for (const name of await readdir(directory)) {
    const path = join(directory, name);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else if (productionExtensions.has(extname(path))) {
      const contentLines = (await readFile(path, 'utf8')).split(/\r?\n/);
      const lines = contentLines.length;
      const maxLineLength = Math.max(...contentLines.map((line) => line.length));
      const forbidden = lines > 600 || (extname(path) === '.css' && maxLineLength > 1000);
      results.push({ path, lines, maxLineLength, status: forbidden ? '禁止' : lines > 400 ? '预警' : '通过' });
    }
  }
}
for (const root of roots) await walk(root);
const failed = results.some((item) => item.status === '禁止');
console.log(JSON.stringify({ status: failed ? 'failed' : 'ok', files: results }, null, 2));
if (failed) process.exitCode = 1;
