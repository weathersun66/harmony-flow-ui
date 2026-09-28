import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';

const targets = process.argv.slice(2);
if (!targets.length) throw new Error('请提供至少一个 CSS 文件');

function topLevelBlocks(css) {
  const blocks = [];
  let start = 0;
  let depth = 0;
  let quote = '';
  let comment = false;
  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    const next = css[index + 1];
    if (comment) {
      if (char === '*' && next === '/') { comment = false; index += 1; }
      continue;
    }
    if (!quote && char === '/' && next === '*') { comment = true; index += 1; continue; }
    if (quote) {
      if (char === '\\') index += 1;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '{') depth += 1;
    else if (char === '}') depth -= 1;
    if (depth === 0 && (char === '}' || char === ';')) {
      const block = css.slice(start, index + 1).trim();
      if (block) blocks.push(block);
      start = index + 1;
    }
  }
  const tail = css.slice(start).trim();
  if (tail) blocks.push(tail);
  return blocks;
}

for (const target of targets) {
  const source = await readFile(target, 'utf8');
  const formatted = (await transform(source, { loader: 'css', minify: false })).code.trim();
  const blocks = topLevelBlocks(formatted);
  const chunks = [];
  let current = [];
  let lines = 0;
  for (const block of blocks) {
    const blockLines = block.split(/\r?\n/).length + 1;
    if (current.length && lines + blockLines > 350) { chunks.push(current.join('\n\n')); current = []; lines = 0; }
    current.push(block);
    lines += blockLines;
  }
  if (current.length) chunks.push(current.join('\n\n'));
  if (chunks.some((chunk) => chunk.split(/\r?\n/).length > 580)) throw new Error(`${target} 包含无法安全拆分的超大顶层规则`);

  const parsed = path.parse(target);
  const partsDir = path.join(parsed.dir, `${parsed.name}.parts`);
  await rm(partsDir, { recursive: true, force: true });
  await mkdir(partsDir, { recursive: true });
  const imports = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const filename = `part-${String(index + 1).padStart(2, '0')}.css`;
    await writeFile(path.join(partsDir, filename), `${chunks[index]}\n`);
    imports.push(`@import './${parsed.name}.parts/${filename}';`);
  }
  await writeFile(target, `${imports.join('\n')}\n`);
  console.log(`${target}: ${blocks.length} blocks -> ${chunks.length} modules`);
}
