import { build } from 'tsup';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { buildMonacoAssets } from './build-monaco.mjs';
import { archiveCompatibilityOutput } from './workspace-output.mjs';

const output = `build/library-${new Date().toISOString().replace(/[:.]/g, '-')}`;
await build({ config: 'tsup.config.ts', outDir: output });
const monaco = await buildMonacoAssets(`${output}/monaco-assets`);
await archiveCompatibilityOutput('dist');
await cp(output, 'dist', { recursive: true });
await mkdir('test/artifacts/monaco', { recursive: true });
await writeFile('test/artifacts/monaco/library-build.txt', output);
console.log(JSON.stringify({ status: 'ok', output, compat: 'dist', monaco }));
