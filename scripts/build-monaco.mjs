import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

export async function buildMonacoAssets(outdir) {
  await mkdir(outdir, { recursive: true });
  const runtime = await build({
    entryPoints: { runtime: 'src/monaco/runtime-entry.ts' }, outdir, bundle: true,
    format: 'esm', splitting: true, minify: true, metafile: true,
    chunkNames: 'chunks/[name]-[hash]', assetNames: 'fonts/[name]-[hash]', loader: { '.ttf': 'file' },
  });
  const workers = await build({
    entryPoints: {
      'editor.worker': 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
      'typescript.worker': 'node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
      'json.worker': 'node_modules/monaco-editor/esm/vs/language/json/json.worker.js',
    }, outdir, bundle: true, format: 'esm', minify: true, metafile: true,
  });
  const outputs = { ...runtime.metafile.outputs, ...workers.metafile.outputs };
  for (const name of Object.keys(outputs)) {
    if (/\.(js|css)$/.test(name)) await writeFile(`${name}.gz`, gzipSync(await readFile(name)));
  }
  await cp('node_modules/monaco-editor/LICENSE', `${outdir}/LICENSE.monaco.txt`);
  await cp('node_modules/monaco-editor/ThirdPartyNotices.txt', `${outdir}/ThirdPartyNotices.txt`);
  const bytes = Object.values(outputs).reduce((sum, output) => sum + output.bytes, 0);
  await writeFile(`${outdir}/manifest.json`, JSON.stringify({ version: '0.56.0', bytes, files: Object.keys(outputs).length }, null, 2));
  return { bytes, files: Object.keys(outputs).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(JSON.stringify(await buildMonacoAssets(process.argv[2] ?? 'dist/monaco-assets')));
}
