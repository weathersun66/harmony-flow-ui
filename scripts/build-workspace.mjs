import { build } from 'esbuild';
import { buildMonacoAssets } from './build-monaco.mjs';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { generateCatalog } from './workspace-catalog.mjs';
import { packageTemplates } from './workspace-archives.mjs';

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = `build/workspace-${stamp}`;
await mkdir(output, { recursive: true });
await mkdir('test/workspace/artifacts', { recursive: true });
const records = await generateCatalog();
const result = await build({
  entryPoints: { demo: 'demo/main.tsx' }, bundle: true, outdir: output,
  format: 'esm', splitting: true, chunkNames: 'chunks/[name]-[hash]',
  minify: true, metafile: true, sourcemap: false,
});
await buildMonacoAssets(`${output}/monaco`);
await cp('demo/index.html', `${output}/index.html`);
await cp('demo/assets', output, { recursive: true });
await cp('demo/workspace/previews', `${output}/previews`, { recursive: true });
await packageTemplates(output);
await mkdir(`${output}/sources`, { recursive: true });
for (const record of records) await cp(record.source, `${output}/sources/${record.id}.txt`);
await writeFile(`${output}/catalog.json`, JSON.stringify(records));
await writeFile(`${output}/metafile.json`, JSON.stringify(result.metafile));
const version = JSON.parse(await readFile('package.json', 'utf8')).version;
const manifest = { version, status: 'workspace', builtAt: new Date().toISOString(), components: records.length, output };
await writeFile(`${output}/manifest.json`, JSON.stringify(manifest, null, 2));
for (const file of [...Object.keys(result.metafile.outputs), `${output}/catalog.json`]) {
  if (/\.(js|css|json)$/.test(file)) await writeFile(file + '.gz', gzipSync(await readFile(file)));
}
const js = await readFile(`${output}/demo.js`);
const css = await readFile(`${output}/demo.css`);
await writeFile('test/workspace/artifacts/latest-build.txt', output);
console.log(JSON.stringify({ ...manifest, entryGzip: gzipSync(js).length, cssGzip: gzipSync(css).length }));
