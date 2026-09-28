import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const contract = JSON.parse(await readFile(new URL('./public-api-contract.json', import.meta.url), 'utf8'));
const esm = await import(new URL('../dist/index.js', import.meta.url));
const cjs = require(resolve('dist/index.cjs'));
const expected = [...contract].sort();
// 2026-09-11：十三批累计追加29个组件；原版及逐批兼容检查见 verify-douyin*-api.mjs。
// 2026-09-28：已逐行核对声明差异，仅 ShrinkNav 新增可选 target 参数。
const expectedTypesHash = '51dfabbe1944778f32dad2d4cf39a47de3357ea7189a7430984ab7efce89f6c4';

function compare(label, actual) {
  const names = Object.keys(actual).sort();
  const missing = expected.filter((name) => !names.includes(name));
  const unexpected = names.filter((name) => !expected.includes(name));
  if (missing.length || unexpected.length) {
    throw new Error(`${label} 公开 API 不兼容：缺失=${missing.join(',') || '无'}；新增=${unexpected.join(',') || '无'}`);
  }
  return names.length;
}

const esmCount = compare('ESM', esm);
const cjsCount = compare('CJS', cjs);
const artifacts = ['dist/index.d.ts', 'dist/index.css'];
for (const artifact of artifacts) {
  const info = await stat(artifact);
  if (!info.isFile() || info.size === 0) throw new Error(`构建产物无效：${artifact}`);
}
const typesHash = createHash('sha256').update(await readFile('dist/index.d.ts')).digest('hex');
if (typesHash !== expectedTypesHash) {
  throw new Error(`类型声明契约已变化：expected=${expectedTypesHash} actual=${typesHash}`);
}

console.log(JSON.stringify({ status: 'ok', esmCount, cjsCount, typesHash, artifacts }, null, 2));
