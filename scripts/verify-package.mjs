import { access, cp, mkdir, mkdtemp, readFile, rename, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { basename, join, resolve } from 'node:path';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const publicApi = JSON.parse(await readFile('test/public-api-contract.json', 'utf8'));
const expectedExports = publicApi.length;
const requiredFiles = ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'dist/index.d.cts', 'dist/index.css', 'dist/monaco.js', 'dist/monaco.cjs', 'dist/monaco.d.ts', 'dist/monaco.d.cts', 'dist/monaco.css', ...['runtime.js', 'runtime.css', 'editor.worker.js', 'typescript.worker.js', 'json.worker.js', 'LICENSE.monaco.txt', 'ThirdPartyNotices.txt'].map(name => `dist/monaco-assets/${name}`)];
const npmExecPath = process.env.npm_execpath;

function runNpm(args, cwd = process.cwd()) {
  const command = npmExecPath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const commandArgs = npmExecPath ? [npmExecPath, ...args] : args;
  const result = spawnSync(command, commandArgs, { cwd, encoding: 'utf8', windowsHide: true, timeout: 120_000, shell: !npmExecPath && process.platform === 'win32' });
  if (result.error || result.status !== 0) throw new Error(`npm ${args.join(' ')} 失败：${result.error?.message ?? result.stderr ?? result.stdout}`);
  return result.stdout;
}

function runNode(args, cwd) {
  const result = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', windowsHide: true, timeout: 120_000 });
  if (result.error || result.status !== 0) throw new Error(`Node 消费验证失败：${result.error?.message ?? result.stderr ?? result.stdout}`);
}

if (packageJson.private) throw new Error('package.json 仍标记为 private');
if (packageJson.publishConfig?.access !== 'public') throw new Error('公开 scope 包必须设置 publishConfig.access=public');
if (packageJson.dependencies && Object.keys(packageJson.dependencies).length) throw new Error('组件包包含未审核的运行时 dependencies');
for (const file of requiredFiles) await access(file);

await mkdir(resolve('test/tmp'), { recursive: true });
const consumer = await mkdtemp(resolve('test/tmp/harmony-flow-consumer-'));
let summary;

try {
  const report = JSON.parse(runNpm(['pack', '--json', '--ignore-scripts', '--pack-destination', consumer]))[0];
  const tarball = join(consumer, report.filename);
  const files = new Set(report.files.map((entry) => entry.path.replaceAll('\\', '/')));
  for (const file of ['package.json', 'README.md', 'README.en.md', 'LICENSE', ...requiredFiles]) if (!files.has(file)) throw new Error(`发布包缺少 ${file}`);
  const unexpected = [...files].filter((file) => !['package.json', 'README.md', 'README.en.md', 'LICENSE'].includes(file) && !file.startsWith('dist/'));
  if (unexpected.length) throw new Error(`发布包包含非预期文件：${unexpected.join(', ')}`);

  await writeFile(join(consumer, 'package.json'), '{"name":"harmony-flow-package-test","private":true}\n');
  runNpm(['install', tarball, '--legacy-peer-deps', '--ignore-scripts', '--offline', '--no-audit', '--no-fund'], consumer);
  for (const peer of ['react', 'react-dom', 'scheduler']) await cp(resolve('node_modules', peer), join(consumer, 'node_modules', peer), { recursive: true });
  for (const typePackage of ['@types/react', '@types/react-dom', 'csstype']) await cp(resolve('node_modules', typePackage), join(consumer, 'node_modules', typePackage), { recursive: true });
  const assertion = `const expected=${JSON.stringify(publicApi)};if(Object.keys(p).length!==${expectedExports}||expected.some(name=>!(name in p)))throw Error('公开导出不符合契约');`;
  runNode(['--input-type=module', '-e', `const p=await import('@hxdhxd/harmony-flow-ui');${assertion}`], consumer);
  runNode(['-e', `const p=require('@hxdhxd/harmony-flow-ui');${assertion}require.resolve('@hxdhxd/harmony-flow-ui/style.css')`], consumer);
  runNode(['--input-type=module', '-e', `const p=await import('@hxdhxd/harmony-flow-ui/monaco');if(typeof p.MonacoCodeEditor!=='function')throw Error('Monaco ESM 入口无效');`], consumer);
  runNode(['-e', `const p=require('@hxdhxd/harmony-flow-ui/monaco');if(typeof p.MonacoCodeEditor!=='function')throw Error('Monaco CJS 入口无效');require.resolve('@hxdhxd/harmony-flow-ui/monaco/style.css');require.resolve('@hxdhxd/harmony-flow-ui/monaco-assets/runtime.js');`], consumer);
  await writeFile(join(consumer, 'consumer.tsx'), "import { Button, ThemeProvider } from '@hxdhxd/harmony-flow-ui';\nimport { MonacoCodeEditor } from '@hxdhxd/harmony-flow-ui/monaco';\nconst enhanced = <MonacoCodeEditor value='const x = 1;' onChange={() => {}} path='main.ts' assetsUrl='/monaco/' />;\nvoid enhanced;\nconst view = <ThemeProvider><Button>OK</Button></ThemeProvider>;\nvoid view;\n");
  await writeFile(join(consumer, 'tsconfig.json'), '{"compilerOptions":{"module":"NodeNext","moduleResolution":"NodeNext","jsx":"react-jsx","strict":true,"skipLibCheck":false,"noEmit":true},"include":["consumer.tsx"]}\n');
  runNode([resolve('node_modules/typescript/bin/tsc'), '--project', 'tsconfig.json'], consumer);
  summary = { status: 'ok', name: report.name, version: report.version, files: report.entryCount, unpackedSize: report.unpackedSize, packedSize: report.size, monacoEntry: true, esmExports: expectedExports, cjsExports: expectedExports, cssResolved: true, typesChecked: true, consumerInstall: true };
} finally {
  const archive = resolve('laji/package-tests');
  await mkdir(archive, { recursive: true });
  await rename(consumer, join(archive, basename(consumer)));
}

console.log(JSON.stringify(summary));
